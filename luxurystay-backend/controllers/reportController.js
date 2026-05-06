const mongoose        = require('mongoose');
const Reservation     = require('../models/Reservation');
const Room            = require('../models/Room');
const Guest           = require('../models/Guest');
const Invoice         = require('../models/Invoice');
const HousekeepingTask= require('../models/HousekeepingTask');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Feedback        = require('../models/Feedback');
const catchAsync      = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const { AppError }    = require('../middleware/errorHandler');

// ─── Shared helpers ───────────────────────────────────────────────────────────

const parseDateRange = (from, to, defaultDays = 30) => {
  const end   = to   ? new Date(to)   : new Date();
  const start = from ? new Date(from) : new Date(end - defaultDays * 24 * 60 * 60 * 1000);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);
  return { start, end };
};

const daysBetween = (a, b) =>
  Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));

// ─── 1. Dashboard Metrics ─────────────────────────────────────────────────────

/**
 * GET /api/reports/dashboard
 * Returns the KPI tiles shown on the FE ops dashboard:
 * Occupancy %, ADR, RevPAR, in-house count, today arrivals/departures,
 * and 14-day daily revenue for the bar chart.
 * Access: admin, manager
 */
exports.getDashboardMetrics = catchAsync(async (req, res) => {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999);

  const [
    totalRooms, occupiedRooms,
    inHouseReservations,
    arrivalsToday, departuresToday,
    revenueData,
    dailyRevenue,
  ] = await Promise.all([
    Room.countDocuments({ isActive: true }),
    Room.countDocuments({ status: 'occupied', isActive: true }),

    Reservation.countDocuments({ status: 'checked-in' }),

    Reservation.countDocuments({
      checkInDate: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
    }),
    Reservation.countDocuments({
      checkOutDate: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ['checked-in', 'checked-out'] },
    }),

    // ADR = total room revenue / total occupied nights (last 30 days)
    Invoice.aggregate([
      { $match: { paymentStatus: { $in: ['open', 'partial', 'paid'] } } },
      { $unwind: '$lineItems' },
      { $match: { 'lineItems.category': 'room' } },
      { $group: { _id: null, totalRoomRevenue: { $sum: '$lineItems.total' }, totalNights: { $sum: '$lineItems.quantity' } } },
    ]),

    // Daily revenue — last 14 days for the FE bar chart
    Invoice.aggregate([
      {
        $match: {
          paymentStatus: { $in: ['open', 'partial', 'paid'] },
          createdAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const occupancyPct = totalRooms > 0 ? +((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;
  const adr          = revenueData[0]?.totalNights > 0
    ? +(revenueData[0].totalRoomRevenue / revenueData[0].totalNights).toFixed(2)
    : 0;
  const revpar       = +((adr * occupancyPct) / 100).toFixed(2);

  sendSuccess(res, 200, 'Dashboard metrics retrieved.', {
    metrics: {
      occupancyPct,
      adr,
      revpar,
      totalRooms,
      occupiedRooms,
      inHouseGuests:    inHouseReservations,
      arrivalsToday,
      departuresToday,
    },
    dailyRevenue14Days: dailyRevenue.map((d) => ({ date: d._id, revenue: +d.revenue.toFixed(2) })),
  });
});

// ─── 2. Occupancy Report ──────────────────────────────────────────────────────

/**
 * GET /api/reports/occupancy?from=&to=
 * Occupancy % for the period, broken down by room type and floor.
 * Access: admin, manager
 */
exports.getOccupancyReport = catchAsync(async (req, res, next) => {
  const { start, end } = parseDateRange(req.query.from, req.query.to);
  const nights         = daysBetween(start, end);

  if (start >= end) return next(new AppError('Start date must be before end date.', 400));

  const [totalRooms, byType, byFloor, byStatus, stayData] = await Promise.all([
    Room.countDocuments({ isActive: true }),

    Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),

    Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$floor', total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),

    Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Occupied room-nights in period
    Reservation.aggregate([
      {
        $match: {
          status: { $in: ['checked-in', 'checked-out'] },
          checkInDate:  { $lt: end },
          checkOutDate: { $gt: start },
        },
      },
      {
        $lookup: { from: 'rooms', localField: 'room', foreignField: '_id', as: 'roomData' },
      },
      { $unwind: '$roomData' },
      {
        $group: {
          _id:   '$roomData.type',
          stays: { $sum: 1 },
          occupiedNights: {
            $sum: {
              $divide: [
                { $subtract: [
                  { $min: ['$checkOutDate', end] },
                  { $max: ['$checkInDate', start] },
                ]},
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const availableRoomNights = totalRooms * nights;
  const totalOccupiedNights = stayData.reduce((s, d) => s + d.occupiedNights, 0);
  const overallOccupancy    = availableRoomNights > 0
    ? +((totalOccupiedNights / availableRoomNights) * 100).toFixed(1)
    : 0;

  // Map occupied nights per type
  const occupiedByType = stayData.reduce((acc, d) => { acc[d._id] = d; return acc; }, {});

  const roomTypeBreakdown = byType.map((t) => {
    const occ  = occupiedByType[t._id];
    const avail = t.total * nights;
    const occPct = avail > 0 ? +((occ?.occupiedNights || 0) / avail * 100).toFixed(1) : 0;
    return { type: t._id, totalRooms: t.total, occupiedNights: +(occ?.occupiedNights || 0).toFixed(0), occupancyPct: occPct };
  });

  sendSuccess(res, 200, 'Occupancy report retrieved.', {
    period:          { from: start, to: end, nights },
    overallOccupancy,
    totalRooms,
    availableRoomNights: +availableRoomNights.toFixed(0),
    occupiedRoomNights:  +totalOccupiedNights.toFixed(0),
    currentStatusBreakdown: byStatus.reduce((a, s) => { a[s._id] = s.count; return a; }, {}),
    byRoomType: roomTypeBreakdown,
    byFloor:    byFloor.map((f) => ({ floor: f._id, totalRooms: f.total })),
  });
});

// ─── 3. Revenue Report ────────────────────────────────────────────────────────

/**
 * GET /api/reports/revenue?from=&to=
 * Total revenue, breakdown by category, ADR, RevPAR.
 * Matches FE analytics "Revenue by category" chart.
 * Access: admin, manager
 */
exports.getRevenueReport = catchAsync(async (req, res, next) => {
  const { start, end } = parseDateRange(req.query.from, req.query.to);
  if (start >= end) return next(new AppError('Start date must be before end date.', 400));

  const [categoryRevenue, paymentSummary, bookingSourceRevenue] = await Promise.all([
    // Revenue by line item category — drives "Revenue by category" FE pie/bar chart
    Invoice.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: { $in: ['open', 'partial', 'paid'] } } },
      { $unwind: '$lineItems' },
      { $group: { _id: '$lineItems.category', total: { $sum: '$lineItems.total' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),

    // Payment status summary
    Invoice.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: {
        _id:           '$paymentStatus',
        total:         { $sum: '$totalAmount' },
        count:         { $sum: 1 },
        amountCollected:{ $sum: '$amountPaid' },
      }},
    ]),

    // Revenue by booking source
    Invoice.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: { $in: ['open', 'partial', 'paid'] } } },
      { $lookup: { from: 'reservations', localField: 'reservation', foreignField: '_id', as: 'res' } },
      { $unwind: '$res' },
      { $group: { _id: '$res.source', revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
    ]),
  ]);

  const totalRevenue      = categoryRevenue.reduce((s, c) => s + c.total, 0);
  const categoryWithShare = categoryRevenue.map((c) => ({
    category:  c._id,
    revenue:   +c.revenue?.toFixed(2) || +c.total.toFixed(2),
    count:     c.count,
    sharePct:  totalRevenue > 0 ? +((c.total / totalRevenue) * 100).toFixed(1) : 0,
  }));

  sendSuccess(res, 200, 'Revenue report retrieved.', {
    period:       { from: start, to: end },
    totalRevenue: +totalRevenue.toFixed(2),
    byCategory:   categoryWithShare,
    byPaymentStatus: paymentSummary.reduce((a, p) => {
      a[p._id] = { total: +p.total.toFixed(2), count: p.count, collected: +p.amountCollected.toFixed(2) };
      return a;
    }, {}),
    byBookingSource: bookingSourceRevenue.map((s) => ({
      source:  s._id,
      revenue: +s.revenue.toFixed(2),
      count:   s.count,
      sharePct:totalRevenue > 0 ? +((s.revenue / totalRevenue) * 100).toFixed(1) : 0,
    })),
  });
});

// ─── 4. Guest Report ──────────────────────────────────────────────────────────

/**
 * GET /api/reports/guests?from=&to=
 * New vs returning guests, nationality breakdown, VIP stats, repeat rate.
 * Matches FE "Guest origin" and "Booking source" charts.
 * Access: admin, manager
 */
exports.getGuestReport = catchAsync(async (req, res, next) => {
  const { start, end } = parseDateRange(req.query.from, req.query.to);
  if (start >= end) return next(new AppError('Start date must be before end date.', 400));

  const [guestStats, nationalityBreakdown, vipCount, newGuestCount, bookingSource] = await Promise.all([
    // Total guests created in period vs returning
    Guest.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: {
        _id:          null,
        total:        { $sum: 1 },
        returning:    { $sum: { $cond: [{ $gt: ['$totalStays', 1] }, 1, 0] } },
        avgStays:     { $avg: '$totalStays' },
      }},
    ]),

    // Top nationalities — matches FE "Guest origin" chart
    Guest.aggregate([
      { $match: { nationality: { $ne: null } } },
      { $group: { _id: '$nationality', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Guest.countDocuments({ isVIP: true }),

    Guest.countDocuments({ createdAt: { $gte: start, $lte: end }, totalStays: { $lte: 1 } }),

    // Booking source breakdown in period — matches FE "Booking source" chart
    Reservation.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const total      = guestStats[0]?.total     || 0;
  const returning  = guestStats[0]?.returning || 0;
  const repeatRate = total > 0 ? +((returning / total) * 100).toFixed(1) : 0;
  const totalGuests = await Guest.countDocuments();

  const nationalityTotal = nationalityBreakdown.reduce((s, n) => s + n.count, 0);

  sendSuccess(res, 200, 'Guest report retrieved.', {
    period:      { from: start, to: end },
    summary: {
      totalGuestsAllTime: totalGuests,
      newInPeriod:        newGuestCount,
      returningInPeriod:  returning,
      repeatRatePct:      repeatRate,
      vipGuests:          vipCount,
      avgStaysPerGuest:   guestStats[0] ? +guestStats[0].avgStays.toFixed(1) : 0,
    },
    topNationalities: nationalityBreakdown.map((n) => ({
      nationality: n._id,
      count:       n.count,
      sharePct:    nationalityTotal > 0 ? +((n.count / nationalityTotal) * 100).toFixed(1) : 0,
    })),
    bookingSourceBreakdown: bookingSource.map((s) => ({ source: s._id, count: s.count })),
  });
});

// ─── 5. Room Performance Report ───────────────────────────────────────────────

/**
 * GET /api/reports/rooms?from=&to=
 * Revenue + occupancy per room type — matches FE "Top room types" analytics card.
 * Access: admin, manager
 */
exports.getRoomPerformanceReport = catchAsync(async (req, res, next) => {
  const { start, end } = parseDateRange(req.query.from, req.query.to);
  if (start >= end) return next(new AppError('Start date must be before end date.', 400));

  const nights = daysBetween(start, end);

  const [roomCounts, revenueByType, staysByType] = await Promise.all([
    Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 }, avgStandardRate: { $avg: '$rates.standard' } } },
    ]),

    // Revenue per room type via invoice line items
    Invoice.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: { $in: ['open', 'partial', 'paid'] } } },
      { $lookup: { from: 'rooms', localField: 'room', foreignField: '_id', as: 'roomData' } },
      { $unwind: '$roomData' },
      { $group: {
        _id:           '$roomData.type',
        totalRevenue:  { $sum: '$totalAmount' },
        invoiceCount:  { $sum: 1 },
      }},
    ]),

    // Stays per room type in period
    Reservation.aggregate([
      {
        $match: {
          status: { $in: ['checked-in', 'checked-out'] },
          checkInDate: { $lt: end }, checkOutDate: { $gt: start },
        },
      },
      { $lookup: { from: 'rooms', localField: 'room', foreignField: '_id', as: 'roomData' } },
      { $unwind: '$roomData' },
      {
        $group: {
          _id:   '$roomData.type',
          stays: { $sum: 1 },
          totalNights: {
            $sum: {
              $divide: [
                { $subtract: [{ $min: ['$checkOutDate', end] }, { $max: ['$checkInDate', start] }] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const revByType   = revenueByType.reduce((a, r) => { a[r._id] = r; return a; }, {});
  const stayByType  = staysByType.reduce((a, s) => { a[s._id] = s; return a; }, {});

  const performance = roomCounts.map((rc) => {
    const rev        = revByType[rc._id]  || {};
    const stay       = stayByType[rc._id] || {};
    const availNights= rc.count * nights;
    const occNights  = +(stay.totalNights || 0).toFixed(0);
    const occPct     = availNights > 0 ? +((occNights / availNights) * 100).toFixed(1) : 0;
    const adr        = occNights > 0 ? +((rev.totalRevenue || 0) / occNights).toFixed(2) : 0;

    return {
      type:            rc._id,
      totalRooms:      rc.count,
      avgStandardRate: +rc.avgStandardRate.toFixed(2),
      stays:           stay.stays        || 0,
      occupiedNights:  occNights,
      occupancyPct:    occPct,
      totalRevenue:    +(rev.totalRevenue || 0).toFixed(2),
      adr,
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);

  sendSuccess(res, 200, 'Room performance report retrieved.', {
    period:      { from: start, to: end, nights },
    performance,
  });
});

// ─── 6. Housekeeping Report ───────────────────────────────────────────────────

/**
 * GET /api/reports/housekeeping?from=&to=
 * Tasks completed, avg completion time by task type, workload by staff.
 * Access: admin, manager
 */
exports.getHousekeepingReport = catchAsync(async (req, res, next) => {
  const { start, end } = parseDateRange(req.query.from, req.query.to, 7);
  if (start >= end) return next(new AppError('Start date must be before end date.', 400));

  const [statusSummary, byType, byPriority, byStaff, avgDuration, issueCount] = await Promise.all([
    HousekeepingTask.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    HousekeepingTask.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$taskType', count: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
    ]),

    HousekeepingTask.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),

    // Tasks per staff member
    HousekeepingTask.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, assignedTo: { $ne: null } } },
      { $group: {
        _id:       '$assignedTo',
        total:     { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staffData' } },
      { $unwind: { path: '$staffData', preserveNullAndEmpty: true } },
      { $project: { staffName: '$staffData.name', total: 1, completed: 1 } },
      { $sort: { completed: -1 } },
      { $limit: 10 },
    ]),

    // Avg completion duration for completed tasks
    HousekeepingTask.aggregate([
      { $match: { status: 'completed', completedAt: { $ne: null }, scheduledFor: { $ne: null }, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, avgDurationMs: { $avg: { $subtract: ['$completedAt', '$scheduledFor'] } } } },
    ]),

    HousekeepingTask.countDocuments({
      createdAt: { $gte: start, $lte: end },
      reportedIssue: { $ne: null },
    }),
  ]);

  const statusMap = statusSummary.reduce((a, s) => { a[s._id] = s.count; return a; }, {});
  const avgMins   = avgDuration[0] ? +(avgDuration[0].avgDurationMs / (1000 * 60)).toFixed(1) : null;

  sendSuccess(res, 200, 'Housekeeping report retrieved.', {
    period:  { from: start, to: end },
    summary: {
      queued:              statusMap.queued      || 0,
      inProgress:          statusMap['in-progress'] || 0,
      completed:           statusMap.completed   || 0,
      avgCompletionMinutes:avgMins,
      issuesReported:      issueCount,
    },
    byTaskType: byType.map((t) => ({ taskType: t._id, total: t.count, completed: t.completed })),
    byPriority: byPriority.reduce((a, p) => { a[p._id] = p.count; return a; }, {}),
    byStaff:    byStaff.map((s) => ({ staffId: s._id, staffName: s.staffName, total: s.total, completed: s.completed })),
  });
});

// ─── 7. Maintenance Report ────────────────────────────────────────────────────

/**
 * GET /api/reports/maintenance?from=&to=
 * Requests by category, resolution time, open vs resolved.
 * Access: admin, manager
 */
exports.getMaintenanceReport = catchAsync(async (req, res, next) => {
  const { start, end } = parseDateRange(req.query.from, req.query.to, 30);
  if (start >= end) return next(new AppError('Start date must be before end date.', 400));

  const [statusSummary, byCategory, byPriority, avgResolution, byStaff] = await Promise.all([
    MaintenanceRequest.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    MaintenanceRequest.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: {
        _id:      '$category',
        count:    { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
      }},
      { $sort: { count: -1 } },
    ]),

    MaintenanceRequest.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),

    // Avg resolution time in hours
    MaintenanceRequest.aggregate([
      { $match: { status: 'resolved', resolvedAt: { $ne: null }, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, avgMs: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } }, count: { $sum: 1 } } },
    ]),

    // Workload per technician
    MaintenanceRequest.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, assignedTo: { $ne: null } } },
      { $group: {
        _id:      '$assignedTo',
        total:    { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staffData' } },
      { $unwind: { path: '$staffData', preserveNullAndEmpty: true } },
      { $project: { staffName: '$staffData.name', total: 1, resolved: 1 } },
      { $sort: { resolved: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const statusMap = statusSummary.reduce((a, s) => { a[s._id] = s.count; return a; }, {});
  const avgHours  = avgResolution[0] ? +((avgResolution[0].avgMs / (1000 * 60 * 60)).toFixed(1)) : null;

  sendSuccess(res, 200, 'Maintenance report retrieved.', {
    period:  { from: start, to: end },
    summary: {
      open:                statusMap.open       || 0,
      assigned:            statusMap.assigned   || 0,
      inProgress:          statusMap['in-progress'] || 0,
      resolved:            statusMap.resolved   || 0,
      avgResolutionHours:  avgHours,
      resolvedCount:       avgResolution[0]?.count || 0,
    },
    byCategory: byCategory.map((c) => ({ category: c._id, total: c.count, resolved: c.resolved })),
    byPriority: byPriority.reduce((a, p) => { a[p._id] = p.count; return a; }, {}),
    byTechnician: byStaff.map((s) => ({ staffId: s._id, staffName: s.staffName, total: s.total, resolved: s.resolved })),
  });
});

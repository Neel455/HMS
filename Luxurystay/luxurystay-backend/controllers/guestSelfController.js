const Guest              = require('../models/Guest');
const Room               = require('../models/Room');
const Reservation        = require('../models/Reservation');
const Feedback           = require('../models/Feedback');
const ServiceRequest     = require('../models/ServiceRequest');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { AppError }    = require('../middleware/errorHandler');
const catchAsync      = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

// Type label → enum value map
const TYPE_LABEL_MAP = {
  'Deluxe Twin':   'deluxe_twin',
  'Deluxe King':   'deluxe_king',
  'Junior Suite':  'junior_suite',
  'Premier Suite': 'premier_suite',
  'Penthouse':     'penthouse',
};

const TYPE_DISPLAY = {
  deluxe_twin:   'Deluxe Twin',
  deluxe_king:   'Deluxe King',
  junior_suite:  'Junior Suite',
  premier_suite: 'Premier Suite',
  penthouse:     'Penthouse',
};

// Resolve the Guest CRM record for the currently logged-in guest User (match by email)
async function resolveGuest(userEmail) {
  return Guest.findOne({ email: userEmail.toLowerCase() });
}

/**
 * GET /api/guest/reservations
 * Returns all reservations for the logged-in guest user, matched by email.
 */
exports.getMyReservations = catchAsync(async (req, res, next) => {
  const guest = await resolveGuest(req.user.email);
  if (!guest) {
    return sendSuccess(res, 200, 'No reservation history found.', { reservations: [] });
  }

  const reservations = await Reservation.find({ guest: guest._id })
    .populate('room', 'number type floor category')
    .sort({ checkInDate: -1 })
    .lean();

  const payload = reservations.map(r => ({
    _id:         r._id,
    bookingId:   r.bookingId,
    room:        r.room,
    checkIn:     r.checkInDate,
    checkOut:    r.checkOutDate,
    nights:      r.nights,
    status:      r.status,
    totalAmount: r.totalAmount,
    createdAt:   r.createdAt,
  }));

  sendSuccess(res, 200, 'Reservations retrieved.', { reservations: payload });
});

/**
 * POST /api/guest/feedback
 * Allows a guest to submit feedback for one of their checked-out reservations.
 * Body: { reservationId, rating (1-5), comment }
 */
exports.submitFeedback = catchAsync(async (req, res, next) => {
  const { reservationId, rating, comment } = req.body;

  if (!reservationId) return next(new AppError('Reservation ID is required.', 400));
  if (!rating || rating < 1 || rating > 5) return next(new AppError('Rating must be between 1 and 5.', 400));
  if (!comment?.trim()) return next(new AppError('Comment is required.', 400));

  const guest = await resolveGuest(req.user.email);
  if (!guest) return next(new AppError('No guest profile found for your account.', 404));

  const reservation = await Reservation.findOne({
    _id: reservationId,
    guest: guest._id,
    status: 'checked-out',
  });
  if (!reservation) {
    return next(new AppError('Reservation not found or not eligible for feedback.', 404));
  }

  const existing = await Feedback.findOne({ reservation: reservation._id });
  if (existing) {
    return next(new AppError('Feedback has already been submitted for this reservation.', 400));
  }

  const feedback = await Feedback.create({
    guest:       guest._id,
    reservation: reservation._id,
    ratings:     { overall: rating },
    comment:     comment.trim(),
  });

  sendSuccess(res, 201, 'Feedback submitted. Thank you!', { feedback: { id: feedback._id } });
});

/**
 * GET /api/guest/rooms
 * Public — no auth required.
 * Returns available room types (grouped) for the given dates.
 * Query: ?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=1
 */
exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  const { checkIn, checkOut, adults } = req.query;

  if (!checkIn || !checkOut) {
    return next(new AppError('checkIn and checkOut dates are required.', 400));
  }

  const checkInDate  = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate) || isNaN(checkOutDate)) {
    return next(new AppError('Invalid date format. Use YYYY-MM-DD.', 400));
  }
  if (checkInDate >= checkOutDate) {
    return next(new AppError('Check-out must be after check-in.', 400));
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  // Find rooms blocked by overlapping reservations
  const blockedIds = await Reservation.find({
    status:       { $in: ['pending', 'confirmed', 'checked-in'] },
    checkInDate:  { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  }).distinct('room');

  const filter = { status: { $in: ['available', 'reserved'] }, isActive: true };
  if (adults) filter.maxGuests = { $gte: Number(adults) };
  if (blockedIds.length) filter._id = { $nin: blockedIds };

  const rooms = await Room.find(filter).sort({ 'rates.standard': 1 });

  // Group by type — one entry per type showing the cheapest available room
  const byType = {};
  rooms.forEach(r => {
    if (!byType[r.type]) {
      byType[r.type] = {
        type:      r.type,
        typeLabel: TYPE_DISPLAY[r.type] || r.type,
        rate:      r.rates.standard,
        total:     r.rates.standard * nights,
        maxGuests: r.maxGuests,
        count:     0,
        roomId:    r._id,
      };
    }
    byType[r.type].count++;
  });

  sendSuccess(res, 200, `${rooms.length} room(s) available.`, {
    checkIn,
    checkOut,
    nights,
    types: Object.values(byType),
  });
});

/**
 * POST /api/guest/book
 * Protected — guest role only.
 * Creates a pending reservation. Upserts the Guest CRM record by email.
 * Body: { checkIn, checkOut, adults, children, roomType, firstName, lastName,
 *         phone, nationality, specialRequests }
 */
exports.createBooking = catchAsync(async (req, res, next) => {
  const {
    checkIn, checkOut, adults = 1, children = 0,
    roomType, firstName, lastName, phone,
    nationality, specialRequests,
  } = req.body;

  // Validate dates
  if (!checkIn || !checkOut) return next(new AppError('Check-in and check-out dates are required.', 400));
  const checkInDate  = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (isNaN(checkInDate) || isNaN(checkOutDate)) return next(new AppError('Invalid date format. Use YYYY-MM-DD.', 400));
  if (checkInDate < new Date().setHours(0,0,0,0)) return next(new AppError('Check-in date cannot be in the past.', 400));
  if (checkInDate >= checkOutDate) return next(new AppError('Check-out must be after check-in.', 400));

  // Validate guest details
  if (!firstName?.trim()) return next(new AppError('First name is required.', 400));
  if (!lastName?.trim())  return next(new AppError('Last name is required.', 400));
  if (!phone?.trim())     return next(new AppError('Phone number is required.', 400));

  const typeEnum = TYPE_LABEL_MAP[roomType] || roomType;
  if (!typeEnum) return next(new AppError('Room type is required.', 400));

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  // Find an available room of the requested type
  const blockedIds = await Reservation.find({
    status:       { $in: ['pending', 'confirmed', 'checked-in'] },
    checkInDate:  { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
  }).distinct('room');

  const roomFilter = {
    type:      typeEnum,
    status:    { $in: ['available', 'reserved'] },
    isActive:  true,
    maxGuests: { $gte: Number(adults) },
  };
  if (blockedIds.length) roomFilter._id = { $nin: blockedIds };

  const room = await Room.findOne(roomFilter).sort({ 'rates.standard': 1 });
  if (!room) {
    return next(new AppError(`No ${TYPE_DISPLAY[typeEnum] || roomType} rooms available for the selected dates.`, 409));
  }

  // Upsert Guest CRM record
  const guest = await Guest.findOneAndUpdate(
    { email: req.user.email.toLowerCase() },
    {
      $setOnInsert: { email: req.user.email.toLowerCase() },
      $set: {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        phone:     phone.trim(),
        ...(nationality && { nationality: nationality.trim() }),
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  // Compute total
  const totalAmount    = room.rates.standard * nights;
  const depositAmount  = +(totalAmount * 0.3).toFixed(2);

  const reservation = await Reservation.create({
    guest:            guest._id,
    room:             room._id,
    checkInDate,
    checkOutDate,
    nights,
    adults:           Number(adults),
    children:         Number(children),
    status:           'pending',
    source:           'online_agent',
    specialRequests:  specialRequests?.trim() || null,
    totalAmount,
    depositAmount,
    depositPaid:      false,
    createdBy:        null,
  });

  // Populate room for response
  await reservation.populate('room', 'roomNumber floor type');

  sendSuccess(res, 201, 'Booking request submitted successfully.', {
    booking: {
      bookingId:    reservation.bookingId,
      reservationId: reservation._id,
      guest: {
        name:  `${guest.firstName} ${guest.lastName}`,
        email: guest.email,
      },
      room: {
        number: reservation.room.roomNumber,
        type:   TYPE_DISPLAY[reservation.room.type] || reservation.room.type,
        floor:  reservation.room.floor,
      },
      checkIn:      checkIn,
      checkOut:     checkOut,
      nights,
      adults:       Number(adults),
      children:     Number(children),
      totalAmount,
      depositAmount,
      status:       'pending',
    },
  });
});

const VALID_SERVICE_TYPES = [
  'room_service', 'wake_up_call', 'laundry', 'spa',
  'transport', 'amenities', 'dining', 'concierge', 'other',
];

/**
 * POST /api/guest/service
 * Submit a service request. Requires an active checked-in reservation.
 * Body: { serviceType, details?, scheduledFor? }
 */
exports.submitServiceRequest = catchAsync(async (req, res, next) => {
  const { serviceType, details, scheduledFor } = req.body;

  if (!serviceType) return next(new AppError('Service type is required.', 400));
  if (!VALID_SERVICE_TYPES.includes(serviceType)) {
    return next(new AppError(`Invalid service type. Must be one of: ${VALID_SERVICE_TYPES.join(', ')}.`, 400));
  }

  const guest = await resolveGuest(req.user.email);
  if (!guest) return next(new AppError('No guest profile found for your account.', 404));

  const reservation = await Reservation.findOne({
    guest: guest._id,
    status: 'checked-in',
  }).sort({ checkInDate: -1 });

  if (!reservation) {
    return next(new AppError('No active checked-in stay found. Service requests require a current reservation.', 409));
  }

  const request = await ServiceRequest.create({
    guest:        guest._id,
    reservation:  reservation._id,
    room:         reservation.room,
    serviceType,
    details:      details?.trim() || null,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
    priority:     'medium',
  });

  sendSuccess(res, 201, 'Service request submitted.', { id: request._id });
});

const VALID_MAINT_CATEGORIES = ['plumbing', 'electrical', 'ac', 'hvac', 'furniture', 'technology', 'structural', 'other'];

/**
 * POST /api/guest/maintenance
 * Submit a maintenance report from a guest.
 * Body: { category, description }
 */
exports.submitMaintenanceReport = catchAsync(async (req, res, next) => {
  const { category, description } = req.body;

  if (!category) return next(new AppError('Category is required.', 400));
  if (!VALID_MAINT_CATEGORIES.includes(category)) {
    return next(new AppError(`Invalid category. Must be one of: ${VALID_MAINT_CATEGORIES.join(', ')}.`, 400));
  }
  if (!description?.trim()) return next(new AppError('Description is required.', 400));

  const guest = await resolveGuest(req.user.email);

  const reservation = guest
    ? await Reservation.findOne({
        guest:  guest._id,
        status: { $in: ['checked-in', 'confirmed'] },
      }).sort({ checkInDate: -1 })
    : null;

  const request = await MaintenanceRequest.create({
    room:        reservation?.room || null,
    location:    reservation ? null : 'Guest portal report',
    reportedBy:  req.user._id,
    category,
    description: description.trim(),
    priority:    'medium',
  });

  sendSuccess(res, 201, 'Maintenance report submitted. We will attend within the hour.', {
    requestId: request.requestId,
  });
});

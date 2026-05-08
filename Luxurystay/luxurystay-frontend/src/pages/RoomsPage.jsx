import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import Icon from '../components/Icon';
import Spinner from '../components/Spinner';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ['available', 'occupied', 'cleaning', 'maintenance', 'reserved'];
const TYPES    = ['deluxe_twin', 'deluxe_king', 'junior_suite', 'premier_suite', 'penthouse'];

const TYPE_LABELS = {
  deluxe_twin:   'Deluxe Twin',
  deluxe_king:   'Deluxe King',
  junior_suite:  'Junior Suite',
  premier_suite: 'Premier Suite',
  penthouse:     'Penthouse',
};

const STATUS_CONFIG = {
  available:   { chip: 'chip-available',   label: 'Available' },
  occupied:    { chip: 'chip-occupied',    label: 'Occupied' },
  cleaning:    { chip: 'chip-cleaning',    label: 'Cleaning' },
  maintenance: { chip: 'chip-maintenance', label: 'Maintenance' },
  reserved:    { chip: 'chip-reserved',    label: 'Reserved' },
};

const FLOOR_NAMES = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth', 6: 'Sixth' };

const ADMIN_MGR  = ['admin', 'manager'];
const STATUS_ROLES = ['admin', 'manager', 'receptionist', 'housekeeping', 'maintenance'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCurrency(val) {
  if (val == null) return '—';
  return `€${Number(val).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusChip({ status }) {
  const { chip, label } = STATUS_CONFIG[status] || { chip: 'chip-reserved', label: status };
  return <span className={`chip ${chip}`}><span className="chip-dot" />{label}</span>;
}

function SectionHead({ title, caption }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 className="display" style={{ fontSize: 28, margin: 0 }}>{title}</h2>
      {caption && <span className="eyebrow">{caption}</span>}
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({ room, canManage, canChangeStatus, onManage }) {
  const statusNote = {
    cleaning:    'Awaiting housekeeping turn-down',
    maintenance: 'Maintenance in progress',
    available:   'Ready for arrival',
    reserved:    'Reservation pending check-in',
  }[room.status];

  return (
    <div className="card" style={{ padding: 20, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="display numeral" style={{ fontSize: 40, lineHeight: 1 }}>{room.roomNumber}</div>
          <div className="label" style={{ marginTop: 4 }}>{TYPE_LABELS[room.type] || room.type}</div>
        </div>
        <StatusChip status={room.status} />
      </div>

      <div style={{ height: 1, background: 'var(--hairline-2)', margin: '16px 0' }} />

      <div style={{ minHeight: 38 }}>
        {room.currentGuest ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{room.currentGuest}</div>
            <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 2 }}>
              {room.status === 'occupied'
                ? `Departs ${room.checkoutDate}`
                : room.status === 'reserved'
                  ? `Arriving · ${room.checkoutDate ? `departs ${room.checkoutDate}` : 'date TBC'}`
                  : room.checkoutDate}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--mute)', fontStyle: 'italic' }}>
            {statusNote || '—'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--hairline-2)' }}>
        <span className="numeral" style={{ fontSize: 16 }}>
          {fmtCurrency(room.rates?.standard)}
          <span style={{ fontSize: 10, color: 'var(--mute)', marginLeft: 4 }}>/ NIGHT</span>
        </span>
        {(canManage || canChangeStatus) && (
          <button className="btn btn-ghost btn-sm" onClick={() => onManage(room)}>
            Manage
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Manage Modal ─────────────────────────────────────────────────────────────

// Status options each role may set manually
function allowedStatuses(role, current) {
  if (['admin', 'manager', 'receptionist'].includes(role)) return STATUSES;
  if (role === 'housekeeping') {
    // Housekeeping can only mark a room clean (available) or flag maintenance
    return ['cleaning', 'available', 'maintenance'].filter(s => s !== current || current === s);
  }
  if (role === 'maintenance') {
    return ['maintenance', 'available'];
  }
  return [current];
}

function ManageModal({ room, canManage, role, onClose, onSaved }) {
  const toast = useToast();
  const [status, setStatus]   = useState(room.status);
  const [note, setNote]       = useState(room.statusNote || '');
  const [saving, setSaving]   = useState(false);

  const statusOptions = allowedStatuses(role, room.status);

  // Edit fields (admin/manager only)
  const [priceStd, setPriceStd]   = useState(room.rates?.standard ?? '');
  const [pricePeak, setPricePeak] = useState(room.rates?.peak ?? '');
  const [maxGuests, setMaxGuests] = useState(room.maxGuests ?? '');

  async function handleSave() {
    setSaving(true);
    try {
      if (status !== room.status || note !== (room.statusNote || '')) {
        await api.patch(`/api/rooms/${room._id}/status`, { status, statusNote: note });
      }
      if (canManage && (priceStd !== room.rates?.standard || pricePeak !== room.rates?.peak || maxGuests !== room.maxGuests)) {
        await api.patch(`/api/rooms/${room._id}`, {
          rates: { ...room.rates, standard: Number(priceStd), peak: Number(pricePeak) },
          maxGuests: Number(maxGuests),
        });
      }
      toast.success(`Room ${room.roomNumber} updated.`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Room {room.roomNumber}</div>
            <h2 className="display" style={{ fontSize: 28, margin: 0 }}>{TYPE_LABELS[room.type] || room.type}</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="close" size={14} /></button>
        </div>

        {/* Status */}
        <div className="field" style={{ marginBottom: 18 }}>
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
            ))}
          </select>
          {statusOptions.length === 1 && (
            <p style={{ fontSize: 11, color: 'var(--mute)', marginTop: 4 }}>
              Contact a manager to change this room's status.
            </p>
          )}
        </div>

        <div className="field" style={{ marginBottom: 18 }}>
          <label>Status note</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. AC repair in progress…" />
        </div>

        {canManage && (
          <>
            <div style={{ height: 1, background: 'var(--hairline)', margin: '20px 0' }} />
            <div className="eyebrow" style={{ marginBottom: 14 }}>Room details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 18 }}>
              <div className="field">
                <label>Standard rate (€)</label>
                <input type="number" value={priceStd} onChange={e => setPriceStd(e.target.value)} />
              </div>
              <div className="field">
                <label>Peak rate (€)</label>
                <input type="number" value={pricePeak} onChange={e => setPricePeak(e.target.value)} />
              </div>
              <div className="field">
                <label>Max guests</label>
                <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Amenities</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(room.amenities || []).map((a, i) => (
                  <span key={i} className="chip chip-reserved">{a}</span>
                ))}
                {!room.amenities?.length && <span style={{ fontSize: 12, color: 'var(--mute)' }}>None listed</span>}
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}>
            {saving
              ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Saving…</>
              : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Room Modal ───────────────────────────────────────────────────────────

function AddRoomModal({ onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState({
    roomNumber: '', floor: '', type: 'deluxe_king', bedType: 'king',
    maxGuests: 2,
    ratesLow: '', ratesStandard: '', ratesHigh: '', ratesPeak: '',
    amenities: '',
  });
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleCreate() {
    setSaving(true);
    try {
      await api.post('/api/rooms', {
        roomNumber: form.roomNumber,
        floor: Number(form.floor),
        type: form.type,
        bedType: form.bedType,
        maxGuests: Number(form.maxGuests),
        rates: {
          low:      Number(form.ratesLow),
          standard: Number(form.ratesStandard),
          high:     Number(form.ratesHigh),
          peak:     Number(form.ratesPeak),
        },
        amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success(`Room ${form.roomNumber} created.`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 className="display" style={{ fontSize: 28, margin: 0 }}>Add room</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="close" size={14} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="field">
            <label>Room number</label>
            <input value={form.roomNumber} onChange={e => set('roomNumber', e.target.value)} placeholder="e.g. 205" />
          </div>
          <div className="field">
            <label>Floor</label>
            <input type="number" value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="2" />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Bed type</label>
            <select value={form.bedType} onChange={e => set('bedType', e.target.value)}>
              {['twin','king','queen','double','king_sofa','twin_sofa'].map(b => (
                <option key={b} value={b}>{b.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Max guests</label>
            <input type="number" value={form.maxGuests} onChange={e => set('maxGuests', e.target.value)} />
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 12 }}>Seasonal rates (€/night)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[['ratesLow','Low'],['ratesStandard','Standard'],['ratesHigh','High'],['ratesPeak','Peak']].map(([k, l]) => (
            <div className="field" key={k}>
              <label>{l}</label>
              <input type="number" value={form[k]} onChange={e => set(k, e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label>Amenities (comma-separated)</label>
          <input value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="wifi, tv, minibar, bathtub" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}>
            {saving
              ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Creating…</>
              : <><Icon name="plus" size={12} />Create room</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoomsPage() {
  const { user }  = useAuth();
  const toast     = useToast();
  const role      = user?.role;

  const canManage      = ADMIN_MGR.includes(role);
  const canChangeStatus = STATUS_ROLES.includes(role);

  const [filter, setFilter]         = useState('all');
  const [managing, setManaging]     = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading } = useApi('/api/rooms?limit=200', { deps: [refreshKey] });
  const rooms = data?.rooms || [];

  function onSaved() {
    setManaging(null);
    setShowAdd(false);
    setRefreshKey(k => k + 1);
  }

  const filtered = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

  // Group by floor
  const floors = [...new Set(filtered.map(r => r.floor))].sort((a, b) => a - b);

  // Status summary counts
  const counts = rooms.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});

  const filterButtons = [
    { id: 'all',         label: `All · ${rooms.length}` },
    { id: 'occupied',    label: `Occupied · ${counts.occupied    || 0}` },
    { id: 'available',   label: `Available · ${counts.available  || 0}` },
    { id: 'cleaning',    label: `Cleaning · ${counts.cleaning    || 0}` },
    { id: 'maintenance', label: `Maint · ${counts.maintenance    || 0}` },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Rooms</div>
          <h1 className="display">A <em>floor-by-floor</em> view.</h1>
          <p className="sub">
            Live status across {rooms.length} rooms. Updates from housekeeping and maintenance flow here in real time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="switch">
            {filterButtons.map(b => (
              <button key={b.id} className={filter === b.id ? 'active' : ''} onClick={() => setFilter(b.id)}>
                {b.label}
              </button>
            ))}
          </div>
          {canManage && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Icon name="plus" size={12} />Add room
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ padding: 80 }}><Spinner page /></div>
      ) : !rooms.length ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--mute)', fontSize: 13 }}>
          No rooms found. {canManage && 'Add your first room to get started.'}
        </div>
      ) : !filtered.length ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--mute)', fontSize: 13 }}>
          No rooms match the selected filter.
        </div>
      ) : (
        floors.map(floor => (
          <div key={floor} style={{ marginBottom: 40 }}>
            <SectionHead
              title={`${FLOOR_NAMES[floor] || `Floor ${floor}`} floor`}
              caption={`${filtered.filter(r => r.floor === floor).length} rooms`}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {filtered.filter(r => r.floor === floor).map(r => (
                <RoomCard
                  key={r._id}
                  room={r}
                  canManage={canManage}
                  canChangeStatus={canChangeStatus}
                  onManage={setManaging}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* ── Modals ── */}
      {managing && (
        <ManageModal
          room={managing}
          canManage={canManage}
          role={role}
          onClose={() => setManaging(null)}
          onSaved={onSaved}
        />
      )}
      {showAdd && (
        <AddRoomModal
          onClose={() => setShowAdd(false)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

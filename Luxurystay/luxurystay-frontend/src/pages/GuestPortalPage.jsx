import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import Icon from '../components/Icon';
import PublicShell from '../layouts/PublicShell';

// ─── History panel ────────────────────────────────────────────────────────────

const EVENT_CONFIG = {
  booking_created:        { icon: 'calendar', color: '#2D7A4F', label: 'Reservation created' },
  checked_in:             { icon: 'key',      color: '#A07830', label: 'Checked in' },
  checked_out:            { icon: 'check',    color: '#6B6459', label: 'Checked out' },
  booking_cancelled:      { icon: 'x',        color: '#B94040', label: 'Reservation cancelled' },
  staff_forced_available: { icon: 'wrench',   color: '#B94040', label: 'Room released by staff' },
};

function HistoryPanel({ onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    api.get('/api/guest/history')
      .then(r => setHistory(r.data?.data?.history ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,24,20,0.35)' }} />
      <div style={{
        position: 'relative', width: 400, background: 'var(--paper)',
        borderLeft: '1px solid var(--hairline)', height: '100%',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>My account</div>
            <h2 className="display" style={{ fontSize: 26, margin: 0 }}>Stay history</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', flexShrink: 0 }}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <div style={{ padding: '24px 28px', flex: 1 }}>
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mute)', fontSize: 13 }}>
              <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
              Loading history…
            </div>
          )}
          {!loading && history.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 13, color: 'var(--mute)' }}>
              No activity recorded yet.
            </div>
          )}
          {!loading && history.length > 0 && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 20, bottom: 20, width: 1, background: 'var(--hairline)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {history.map((entry, i) => {
                  const cfg = EVENT_CONFIG[entry.eventType] || { icon: 'star', color: 'var(--brass)', label: entry.eventType };
                  const date = new Date(entry.createdAt);
                  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={entry._id || i} style={{ display: 'flex', gap: 16, paddingBottom: 24, position: 'relative' }}>
                      <div style={{
                        width: 30, height: 30, flexShrink: 0, borderRadius: '50%',
                        background: 'var(--paper)', border: `2px solid ${cfg.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: cfg.color, zIndex: 1,
                      }}>
                        <Icon name={cfg.icon} size={13} />
                      </div>
                      <div style={{ paddingTop: 4, flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: cfg.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                          {cfg.label}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 6 }}>
                          {entry.description}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--mute)' }}>
                          {dateStr} · {timeStr}
                          {entry.performedBy && entry.performedBy !== 'Guest Portal' && (
                            <span style={{ marginLeft: 6, color: 'var(--ink-3)' }}>— {entry.performedBy}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--hairline)' }}>
          <Link to="/settings" style={{ fontSize: 13, color: 'var(--brass-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="arrow_right" size={12} /> Profile &amp; settings
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function nightsRemaining(checkOutIso) {
  if (!checkOutIso) return 0;
  const diff = new Date(checkOutIso) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const GRAD_MAP = {
  deluxe_twin:   'linear-gradient(140deg, #EFE8DB, #C9AE82)',
  deluxe_king:   'linear-gradient(140deg, #C9AE82, #A08054)',
  junior_suite:  'linear-gradient(140deg, #A08054, #806339)',
  premier_suite: 'linear-gradient(140deg, #806339, #4A443B)',
  penthouse:     'linear-gradient(140deg, #4A443B, #1A1814)',
};

const TYPE_LABEL = {
  deluxe_twin:   'Deluxe Twin',
  deluxe_king:   'Deluxe King',
  junior_suite:  'Junior Suite',
  premier_suite: 'Premier Suite',
  penthouse:     'Penthouse',
};

const STATUS_STYLE = {
  confirmed:   { bg: '#EBF4EE', color: '#2D7A4F',  label: 'Confirmed' },
  'checked-in':{ bg: '#FBF3E8', color: '#A07830',  label: 'Checked In' },
  'checked-out':{ bg: '#F3F0EC', color: '#6B6459', label: 'Checked Out' },
  cancelled:   { bg: '#FBE8E8', color: '#B94040',  label: 'Cancelled' },
  pending:     { bg: '#F3F0EC', color: '#6B6459',  label: 'Pending' },
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function Mini({ label, value }) {
  return (
    <div style={{ background: 'var(--paper)', padding: '20px 24px' }}>
      <div className="label" style={{ marginBottom: 8 }}>{label}</div>
      <div className="display numeral" style={{ fontSize: 36, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function SectionHead({ title, caption }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 className="display" style={{ fontSize: 28, margin: 0 }}>{title}</h2>
      {caption && <span className="eyebrow">{caption}</span>}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13, borderBottom: '1px solid var(--hairline)' }}>
      <span style={{ color: 'var(--mute)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: 'var(--linen)', color: 'var(--ink-3)', label: status };
  return (
    <span style={{
      background: s.bg, color: s.color, padding: '3px 10px',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>{s.label}</span>
  );
}

// ─── Service request modal ────────────────────────────────────────────────────

function ServiceModal({ service, onClose, onSubmit }) {
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit(service.type, notes);
    setLoading(false);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 24,
    }} onClick={onClose}>
      <div
        style={{ background: 'var(--paper)', padding: 36, maxWidth: 440, width: '100%', border: '1px solid var(--hairline)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="eyebrow" style={{ marginBottom: 12 }}>Request</div>
        <h3 className="display" style={{ fontSize: 28, margin: '0 0 8px' }}>{service.label}</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20, lineHeight: 1.6 }}>
          Add any details or instructions below. Our team will attend promptly.
        </p>
        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 20 }}>
            <label>Notes (optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. please bring extra towels, preferred time…"
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <><div className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Sending…</>
                : <>Send request <Icon name="arrow_right" size={12} /></>}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Maintenance modal ────────────────────────────────────────────────────────

const MAINT_CATS = [
  { value: 'plumbing',    label: 'Plumbing' },
  { value: 'electrical',  label: 'Electrical' },
  { value: 'ac',          label: 'Air conditioning' },
  { value: 'hvac',        label: 'Heating / ventilation' },
  { value: 'furniture',   label: 'Furniture' },
  { value: 'technology',  label: 'Technology / AV' },
  { value: 'structural',  label: 'Structural' },
  { value: 'other',       label: 'Other' },
];

function MaintenanceModal({ onClose, onSubmit }) {
  const [form,    setForm]    = useState({ category: 'other', description: '' });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.description.trim()) return;
    setLoading(true);
    await onSubmit(form.category, form.description);
    setLoading(false);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 24,
    }} onClick={onClose}>
      <div
        style={{ background: 'var(--paper)', padding: 36, maxWidth: 460, width: '100%', border: '1px solid var(--hairline)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="eyebrow" style={{ marginBottom: 12 }}>Report a concern</div>
        <h3 className="display" style={{ fontSize: 28, margin: '0 0 8px' }}>Maintenance</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20, lineHeight: 1.6 }}>
          Describe what needs attention. Tomás and the team will attend within the hour.
        </p>
        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {MAINT_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 20 }}>
            <label>Description <span style={{ color: 'var(--terracotta)' }}>*</span></label>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Please describe the issue…"
              style={{ resize: 'vertical' }}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !form.description.trim()}
              style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <><div className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Sending…</>
                : <>Submit report <Icon name="arrow_right" size={12} /></>}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// ─── Service button list ──────────────────────────────────────────────────────

const SERVICES = [
  { label: 'In-room dining',       icon: 'coffee',      type: 'room_service' },
  { label: 'Housekeeping refresh', icon: 'sparkle',     type: 'amenities'   },
  { label: 'Wake-up call',         icon: 'clock',       type: 'wake_up_call' },
  { label: 'Laundry & pressing',   icon: 'leaf',        type: 'laundry'     },
  { label: 'Airport transfer',     icon: 'arrow_right', type: 'transport'   },
  { label: 'Reserve dinner',       icon: 'star',        type: 'dining'      },
  { label: 'Spa appointment',      icon: 'sparkle',     type: 'spa'         },
  { label: 'Concierge note',       icon: 'mail',        type: 'concierge'   },
  { label: 'Late check-out',       icon: 'key',         type: 'other'       },
];

const TODAY_ACTIVITIES = [
  { icon: 'sparkle', title: 'Spa · La Mer ritual',     sub: 'Booked · 14:00 · 90 min' },
  { icon: 'coffee',  title: 'Le Jardin · breakfast',   sub: 'Reserved · 9:00 · table 4' },
  { icon: 'star',    title: 'Cabana · pool deck',      sub: 'Standing · all-day' },
  { icon: 'leaf',    title: 'Sunset garden walk',      sub: 'Suggested · 19:30' },
];

// ─── Reservation detail slide-over ───────────────────────────────────────────

function ReservationDetailPanel({ reservation: r, onClose, onCancel, cancelling }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!r) return null;
  const grad  = GRAD_MAP[r.room?.type]   || 'linear-gradient(140deg, #C9AE82, #A08054)';
  const label = TYPE_LABEL[r.room?.type] || r.room?.type || 'Suite';
  const cancellable = ['pending', 'confirmed'].includes(r.status);
  const statusStyle = STATUS_STYLE[r.status] || { bg: 'var(--linen)', color: 'var(--ink-3)', label: r.status };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(26,24,20,0.35)' }}
      />
      {/* Panel */}
      <div style={{
        position: 'relative', width: 420, background: 'var(--paper)',
        borderLeft: '1px solid var(--hairline)', height: '100%',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Reservation details</div>
              <h2 className="display" style={{ fontSize: 28, margin: 0 }}>{label}</h2>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--ink-3)' }}
            >
              <Icon name="x" size={18} />
            </button>
          </div>
          <span style={{
            display: 'inline-block', background: statusStyle.bg, color: statusStyle.color,
            padding: '3px 10px', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {statusStyle.label}
          </span>
        </div>

        {/* Suite image */}
        <div style={{ aspectRatio: '16/9', background: grad, position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', bottom: 16, left: 20,
            fontFamily: 'var(--serif)', fontSize: 32, fontStyle: 'italic',
            color: 'rgba(247,243,236,0.7)',
          }}>
            {r.room?.number || label?.charAt(0)}
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {[
            { label: 'Room',      value: r.room?.number ? `Room ${r.room.number}` : 'TBA' },
            { label: 'Suite type', value: label },
            { label: 'Check-in',  value: fmtDate(r.checkIn) },
            { label: 'Check-out', value: fmtDate(r.checkOut) },
            { label: 'Nights',    value: r.nights ?? '—' },
            { label: 'Guests',    value: `${r.adults ?? 1} adult${(r.adults ?? 1) !== 1 ? 's' : ''}${r.children > 0 ? ` · ${r.children} child${r.children !== 1 ? 'ren' : ''}` : ''}` },
            { label: 'Total',     value: `€${Number(r.totalAmount || 0).toLocaleString()}` },
            { label: 'Deposit',   value: r.depositAmount ? `€${Number(r.depositAmount).toLocaleString()}${r.depositPaid ? ' · Paid' : ' · Pending'}` : '—' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0', borderBottom: '1px solid var(--hairline-2)', fontSize: 13,
            }}>
              <span style={{ color: 'var(--mute)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.label}</span>
              <span style={{ fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
          {r.specialRequests && (
            <div style={{ marginTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Special requests</div>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>{r.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Footer — cancel */}
        {cancellable && (
          <div style={{ padding: '20px 28px', borderTop: '1px solid var(--hairline)' }}>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14, lineHeight: 1.5 }}>
              Free cancellation is available up to 72 hours before arrival.
            </p>
            <button
              onClick={() => onCancel(r._id)}
              disabled={cancelling}
              className="btn btn-ghost"
              style={{
                width: '100%', justifyContent: 'center',
                color: 'var(--terracotta)', borderColor: 'var(--terracotta)',
                opacity: cancelling ? 0.6 : 1,
              }}
            >
              {cancelling
                ? <><div className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5, borderTopColor: 'var(--terracotta)' }} />Cancelling…</>
                : <><Icon name="x" size={12} />Cancel this reservation</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cancel confirmation modal ────────────────────────────────────────────────

function CancelConfirmModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,24,20,0.55)' }} onClick={onCancel} />
      <div style={{
        position: 'relative', background: 'var(--paper)',
        border: '1px solid var(--hairline)', width: '100%', maxWidth: 420,
        overflow: 'hidden',
      }}>
        {/* Warning banner */}
        <div style={{
          background: 'var(--terracotta-soft, #FBE8E8)',
          borderBottom: '1px solid var(--terracotta)',
          padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, flexShrink: 0, borderRadius: '50%',
            background: 'var(--terracotta)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--ivory)',
          }}>
            <Icon name="alert" size={17} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--terracotta)' }}>Cancel reservation</div>
            <div style={{ fontSize: 11, color: 'var(--terracotta)', opacity: 0.8, marginTop: 1 }}>
              This action cannot be undone
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 20px' }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 12px' }}>
            Are you sure you want to <strong>cancel this reservation?</strong>
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink-3)', margin: 0 }}>
            Once cancelled, you will need to make a new reservation to stay with us.
            Please contact our concierge if you need to modify your booking instead.
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onCancel}>Keep reservation</button>
          <button
            className="btn btn-primary"
            style={{ background: 'var(--terracotta)', borderColor: 'var(--terracotta)' }}
            onClick={onConfirm}
          >
            <Icon name="x" size={13} /> Yes, cancel it
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuestPortalPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const toast      = useToast();

  const queryClient = useQueryClient();
  const [serviceModal,      setServiceModal]      = useState(null);
  const [maintModal,        setMaintModal]        = useState(false);
  const [displayIndex,      setDisplayIndex]      = useState(0);
  const [cancellingId,      setCancellingId]      = useState(null);
  const [cancelTarget,      setCancelTarget]      = useState(null);
  const [detailReservation, setDetailReservation] = useState(null);
  const [showHistory,       setShowHistory]       = useState(false);

  const { data: resData, loading: resLoading } =
    useApi('/api/guest/reservations');

  const reservations = resData?.reservations ?? [];

  // All checked-in stays pinned first (sorted by check-in), then upcoming/pending
  const activeStays = reservations
    .filter(r => r.status === 'checked-in')
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
  const upcomingStays = reservations
    .filter(r => ['confirmed', 'pending'].includes(r.status))
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
  const displayStays = [...activeStays, ...upcomingStays];

  // Keep `activeStay` for places that reference the primary in-progress stay
  const activeStay = activeStays[0] || null;

  const safeIndex   = Math.min(displayIndex, Math.max(displayStays.length - 1, 0));
  const displayStay = displayStays[safeIndex] || null;

  const initials = (user?.name || user?.email || 'G')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // ── Service request submit ─────────────────────────────────────────────────
  const handleServiceSubmit = useCallback(async (serviceType, details) => {
    try {
      await api.post('/api/guest/service', { serviceType, details });
      toast.success('Request sent — our team will attend shortly.');
      setServiceModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send request.');
    }
  }, [toast]);

  // ── Cancel reservation ────────────────────────────────────────────────────
  const handleCancelReservation = useCallback((reservationId) => {
    setCancelTarget(reservationId);
  }, []);

  const doCancel = useCallback(async () => {
    const reservationId = cancelTarget;
    setCancelTarget(null);
    setCancellingId(reservationId);
    try {
      await api.patch(`/api/guest/reservations/${reservationId}/cancel`);
      toast.success('Reservation cancelled.');
      setDetailReservation(null);
      queryClient.invalidateQueries({ queryKey: ['/api/guest/reservations'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  }, [cancelTarget, toast, queryClient]);

  // ── Maintenance submit ─────────────────────────────────────────────────────
  const handleMaintSubmit = useCallback(async (category, description) => {
    try {
      await api.post('/api/guest/maintenance', { category, description });
      toast.success('Report received — we will attend within the hour.');
      setMaintModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit report.');
    }
  }, [toast]);

  const grad  = displayStay ? (GRAD_MAP[displayStay.room?.type] || 'linear-gradient(140deg, #C9AE82, #A08054)') : null;
  const label = displayStay ? (TYPE_LABEL[displayStay.room?.type] || displayStay.room?.type || 'Suite') : null;

  return (
    <PublicShell>
      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {serviceModal && (
        <ServiceModal
          service={serviceModal}
          onClose={() => setServiceModal(null)}
          onSubmit={handleServiceSubmit}
        />
      )}
      {maintModal && (
        <MaintenanceModal
          onClose={() => setMaintModal(false)}
          onSubmit={handleMaintSubmit}
        />
      )}
      {detailReservation && (
        <ReservationDetailPanel
          reservation={detailReservation}
          onClose={() => setDetailReservation(null)}
          onCancel={handleCancelReservation}
          cancelling={cancellingId === detailReservation._id}
        />
      )}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
      {cancelTarget && (
        <CancelConfirmModal
          onConfirm={doCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}

      <section style={{ padding: '60px 64px 80px', maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: 8, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            {displayStay && (
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                My Stay
                {displayStay?.room?.number && ` · Suite ${displayStay.room.number}`}
              </div>
            )}
            {!displayStay && <div className="eyebrow" style={{ marginBottom: 14 }}>My Stay</div>}
            <h1 className="display" style={{ fontSize: 'clamp(42px, 5vw, 64px)', margin: '0 0 8px', lineHeight: 1 }}>
              {greeting()}, <em>{user?.name?.split(' ')[0] || 'dear guest'}.</em>
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 'var(--radius-sm)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--linen)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            title="View stay history"
          >
            <div className="avatar avatar-lg">{initials}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 500 }}>{user?.name || user?.email}</div>
              <div style={{ fontSize: 10, color: 'var(--mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Étoile member · History
              </div>
            </div>
          </button>
        </div>

        <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 540, marginBottom: 36, lineHeight: 1.7 }}>
          {displayStay?.status === 'checked-in'
            ? 'Below, your stay at a glance — should anything be wanting, the concierge stands ready.'
            : displayStay
              ? `Your reservation is confirmed. We look forward to welcoming you on ${fmtShort(displayStay.checkIn)}.`
              : 'Welcome to your LuxuryStay guest portal. Book a stay or browse your reservation history below.'}
        </p>

        {/* ── Stats bar (only when there is a current/upcoming stay) ───── */}
        {displayStay && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1, background: 'var(--hairline)',
              border: '1px solid var(--hairline)',
              marginBottom: displayStays.length > 1 ? 12 : 40,
            }}>
              <Mini label="Check-out"        value={fmtShort(displayStay.checkOut)} />
              <Mini label="Nights remaining"  value={displayStay?.status === 'checked-in' ? nightsRemaining(displayStay.checkOut) : displayStay.nights} />
              <Mini label="Folio · total"    value={`€${Number(displayStay.totalAmount || 0).toLocaleString()}`} />
              <Mini label="Status"           value={STATUS_STYLE[displayStay.status]?.label || displayStay.status} />
            </div>

            {/* Reservation switcher — only shown when there are multiple stays */}
            {displayStays.length > 1 && (
              <div style={{ marginBottom: 40 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  {displayStays.length} reservations · select to view
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${displayStays.length}, 1fr)`, gap: 10 }}>
                  {displayStays.map((stay, i) => {
                    const isSelected = i === safeIndex;
                    const stayLabel  = TYPE_LABEL[stay.room?.type] || stay.room?.type || 'Suite';
                    const stayGrad   = GRAD_MAP[stay.room?.type]   || 'linear-gradient(140deg, #C9AE82, #A08054)';
                    const stayStatus = STATUS_STYLE[stay.status]   || { label: stay.status, color: 'var(--ink-3)' };
                    return (
                      <button
                        key={stay._id || i}
                        onClick={() => setDisplayIndex(i)}
                        style={{
                          display: 'grid', gridTemplateColumns: '56px 1fr', gap: 0,
                          border: isSelected ? '2px solid var(--brass)' : '1px solid var(--hairline)',
                          background: isSelected ? 'var(--paper)' : 'var(--ivory)',
                          cursor: 'pointer', textAlign: 'left', padding: 0, overflow: 'hidden',
                          transition: 'border-color 0.15s, box-shadow 0.15s',
                          boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                        }}
                      >
                        {/* Gradient swatch */}
                        <div style={{ background: stayGrad, position: 'relative', minHeight: 72 }}>
                          {isSelected && (
                            <div style={{
                              position: 'absolute', inset: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Icon name="check" size={14} style={{ color: 'rgba(247,243,236,0.9)' }} />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ padding: '12px 16px', borderLeft: isSelected ? '1px solid var(--brass-soft, #D4B896)' : '1px solid var(--hairline)' }}>
                          <div style={{
                            fontSize: 12, fontWeight: 600, color: 'var(--ink)',
                            marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {stayLabel}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 6 }}>
                            {fmtShort(stay.checkIn)} → {fmtShort(stay.checkOut)}
                          </div>
                          <span style={{
                            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: stayStatus.color || 'var(--ink-3)',
                          }}>
                            {stayStatus.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Main two-column layout ───────────────────────────────────── */}
        {displayStay ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Today's activities (shown when checked-in and viewing active stay) */}
              {activeStay && safeIndex === 0 && (
                <>
                  <SectionHead
                    title="Today at the house"
                    caption={new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
                    {TODAY_ACTIVITIES.map((a, i) => (
                      <div key={i} className="card" style={{ padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 36, height: 36, flexShrink: 0,
                          background: 'var(--linen)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--brass-deep)',
                        }}>
                          <Icon name={a.icon} size={17} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 4 }}>{a.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Service request panel */}
              <SectionHead title="Request a service" />
              {activeStay && safeIndex === 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 8 }}>
                  {SERVICES.map((s, i) => (
                    <button
                      key={i}
                      className="btn btn-ghost"
                      style={{
                        justifyContent: 'space-between', padding: '16px 18px',
                        textTransform: 'none', letterSpacing: 0, fontSize: 13,
                      }}
                      onClick={() => setServiceModal({ type: s.type, label: s.label })}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon name={s.icon} size={14} />{s.label}
                      </span>
                      <Icon name="arrow_right" size={12} />
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--mute)', marginBottom: 8 }}>
                  Service requests are available once your stay begins.
                </p>
              )}

              {/* My Reservations — pushed to bottom so last card aligns with Concierge */}
              <div id="reservations" style={{ marginTop: 'auto', paddingTop: 40 }}>
                <SectionHead title="My Reservations" />
                {resLoading && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mute)', fontSize: 13 }}>
                    <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                    Loading reservations…
                  </div>
                )}
                {!resLoading && reservations.length === 0 && (
                  <div style={{ border: '1px solid var(--hairline)', padding: '36px 24px', textAlign: 'center', background: 'var(--paper)' }}>
                    <Icon name="calendar" size={28} style={{ color: 'var(--mute)', display: 'block', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>No reservations yet</div>
                    <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '0 0 20px' }}>Make your first reservation and it will appear here.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/book')}>
                      Reserve a suite <Icon name="arrow_right" size={12} />
                    </button>
                  </div>
                )}
                {!resLoading && reservations.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {reservations.slice(0, 3).map(r => {
                      const cancellable  = ['pending', 'confirmed'].includes(r.status);
                      const isCancelling = cancellingId === r._id;
                      return (
                        <div key={r._id} style={{ border: '1px solid var(--hairline)', background: 'var(--paper)' }}>
                          <div
                            onClick={() => setDetailReservation(r)}
                            style={{
                              padding: '16px 20px', display: 'grid',
                              gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start',
                              cursor: 'pointer',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <Icon name="bed" size={13} style={{ color: 'var(--brass)' }} />
                                <span style={{ fontWeight: 600, fontSize: 14 }}>
                                  {r.room?.number ? `Room ${r.room.number}` : 'Room TBA'}
                                </span>
                                {r.room?.type && (
                                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                                    · {TYPE_LABEL[r.room.type] || r.room.type}
                                  </span>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                                <span><strong style={{ color: 'var(--ink)' }}>Check-in</strong>&nbsp;{fmtDate(r.checkIn)}</span>
                                <span><strong style={{ color: 'var(--ink)' }}>Check-out</strong>&nbsp;{fmtDate(r.checkOut)}</span>
                                {r.totalAmount != null && (
                                  <span>Total:&nbsp;<strong style={{ color: 'var(--ink)' }}>€{Number(r.totalAmount).toLocaleString()}</strong></span>
                                )}
                              </div>
                            </div>
                            <StatusBadge status={r.status} />
                          </div>
                          {cancellable && (
                            <div style={{ borderTop: '1px solid var(--hairline-2)', padding: '8px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleCancelReservation(r._id)}
                                disabled={isCancelling}
                                style={{
                                  background: 'none', border: 'none', cursor: isCancelling ? 'not-allowed' : 'pointer',
                                  fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                                  color: 'var(--terracotta)', display: 'flex', alignItems: 'center', gap: 6,
                                  opacity: isCancelling ? 0.6 : 1, padding: '4px 0',
                                }}
                              >
                                {isCancelling
                                  ? <><div className="spinner" style={{ width: 11, height: 11, borderWidth: 1.5, borderTopColor: 'var(--terracotta)' }} />Cancelling…</>
                                  : <><Icon name="x" size={11} />Cancel reservation</>}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {reservations.length > 3 && (
                      <button
                        onClick={() => setShowHistory(true)}
                        style={{
                          background: 'none', border: '1px solid var(--hairline)',
                          padding: '10px 16px', cursor: 'pointer', fontSize: 12,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: 'var(--ink-3)', width: '100%', textAlign: 'center',
                        }}
                      >
                        View all {reservations.length} reservations
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Suite card */}
              <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>
                  {displayStay.room?.number ? `Suite ${displayStay.room.number} · ` : ''}{label}
                </div>
                <div style={{
                  aspectRatio: '16/10', background: grad,
                  marginBottom: 18, position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', bottom: 14, left: 16,
                    color: 'rgba(247,243,236,0.8)', fontFamily: 'var(--serif)',
                    fontSize: 28, fontStyle: 'italic',
                  }}>
                    {displayStay.room?.number || label?.charAt(0)}
                  </div>
                </div>
                <SummaryRow label="Check-in"    value={fmtDate(displayStay.checkIn)} />
                <SummaryRow label="Check-out"   value={fmtDate(displayStay.checkOut)} />
                <SummaryRow label="Nights"      value={displayStay.nights} />
                <SummaryRow label="Total"       value={`€${Number(displayStay.totalAmount || 0).toLocaleString()}`} />
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
                  onClick={() => setDetailReservation(displayStay)}
                >
                  View full details
                </button>
              </div>

              {/* Maintenance card */}
              <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Maintenance</div>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                  Notice anything amiss? Report it discreetly and our team will attend within the hour.
                </p>
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setMaintModal(true)}
                >
                  <Icon name="wrench" size={13} /> Report a concern
                </button>
              </div>

              {/* Concierge card */}
              <div className="card" style={{ padding: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Concierge</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <div className="avatar">PS</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Priya Shankar</div>
                    <div style={{ fontSize: 10, color: 'var(--mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      On duty · 06:00–22:00
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href="tel:+33493881424"
                    className="btn btn-ghost"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <Icon name="phone" size={12} /> Call
                  </a>
                  <Link
                    to="/contact"
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <Icon name="mail" size={12} /> Message
                  </Link>
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ── No stay: prompt to book ─────────────────────────────────── */
          <div style={{
            border: '1px solid var(--hairline)', padding: '48px 40px',
            background: 'var(--paper)', maxWidth: 560, marginBottom: 40,
          }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>No active stay</div>
            <h2 className="display" style={{ fontSize: 36, margin: '0 0 12px' }}>
              Ready for your <em>next visit?</em>
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 24 }}>
              Browse our suites and make a reservation in minutes.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => navigate('/book')}>
                Reserve a suite <Icon name="arrow_right" size={12} />
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/suites')}>
                View suites
              </button>
            </div>
          </div>
        )}


      </section>
    </PublicShell>
  );
}

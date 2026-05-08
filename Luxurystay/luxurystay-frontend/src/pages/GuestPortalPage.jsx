import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import Icon from '../components/Icon';
import PublicShell from '../layouts/PublicShell';

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

// ─── Feedback form ────────────────────────────────────────────────────────────

function FeedbackForm({ reservations, onDone }) {
  const toast = useToast();
  const eligible = reservations.filter(r => r.status === 'checked-out');

  const [resId,   setResId]   = useState(eligible[0]?._id || '');
  const [rating,  setRating]  = useState(0);
  const [hover,   setHover]   = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (eligible.length === 0) {
    return (
      <div style={{ border: '1px solid var(--hairline)', padding: '48px 32px', textAlign: 'center', background: 'var(--paper)', maxWidth: 520 }}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No completed stays yet</div>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>Feedback can be submitted after your check-out.</p>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (!resId)   { toast.error('Please select a reservation.'); return; }
    if (!rating)  { toast.error('Please select a star rating.'); return; }
    if (!comment.trim()) { toast.error('Please write a comment.'); return; }
    setLoading(true);
    try {
      await api.post('/api/guest/feedback', { reservationId: resId, rating, comment });
      toast.success('Thank you for your feedback!');
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit feedback.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 520 }}>
      {eligible.length > 1 && (
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Which stay?</label>
          <select value={resId} onChange={e => setResId(e.target.value)}>
            {eligible.map(r => (
              <option key={r._id} value={r._id}>
                {r.room?.number ? `Room ${r.room.number}` : 'Room TBA'} · {fmtDate(r.checkIn)} – {fmtDate(r.checkOut)}
              </option>
            ))}
          </select>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            style={{
              fontSize: 28, lineHeight: 1, padding: 0, border: 'none', background: 'none',
              cursor: 'pointer', color: n <= (hover || rating) ? '#C9A84C' : 'var(--hairline)',
              transition: 'color 0.1s',
            }}
          >★</button>
        ))}
        {rating > 0 && (
          <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 8 }}>
            {['','Poor','Fair','Good','Very good','Excellent'][rating]}
          </span>
        )}
      </div>
      <div className="field" style={{ marginBottom: 16 }}>
        <label>Your comment</label>
        <textarea
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell us about your stay…"
          style={{ resize: 'vertical' }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading
          ? <><div className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Submitting…</>
          : <>Submit feedback <Icon name="arrow_right" size={12} /></>}
      </button>
    </form>
  );
}

// ─── Profile form ─────────────────────────────────────────────────────────────

function ProfileForm({ user }) {
  const toast = useToast();
  const { refreshUser } = useAuth();
  const [name,    setName]    = useState(user.name  || '');
  const [phone,   setPhone]   = useState(user.phone || '');
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/api/auth/me', { name, phone });
      await refreshUser();
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} style={{ maxWidth: 400 }}>
      <div className="field" style={{ marginBottom: 14 }}>
        <label>Full name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="field" style={{ marginBottom: 14 }}>
        <label>Email</label>
        <input value={user.email} disabled style={{ opacity: 0.6 }} />
      </div>
      <div className="field" style={{ marginBottom: 20 }}>
        <label>Phone</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Saving…' : 'Save changes'}
      </button>
    </form>
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuestPortalPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const toast      = useToast();

  const [activeTab,      setActiveTab]      = useState('reservations');
  const [serviceModal,   setServiceModal]   = useState(null);
  const [maintModal,     setMaintModal]     = useState(false);
  const [feedbackDone,   setFeedbackDone]   = useState(false);

  const { data: resData, loading: resLoading } =
    useApi('/api/guest/reservations');

  const reservations = resData?.reservations ?? [];
  const activeStay   = reservations.find(r => r.status === 'checked-in');
  const upcomingStay = !activeStay && reservations.find(r => ['confirmed', 'pending'].includes(r.status));
  const displayStay  = activeStay || upcomingStay;

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
                {activeStay && ` · Suite ${activeStay.room?.number || ''}`}
                {upcomingStay && ` · Arriving ${fmtShort(upcomingStay.checkIn)}`}
              </div>
            )}
            {!displayStay && <div className="eyebrow" style={{ marginBottom: 14 }}>My Stay</div>}
            <h1 className="display" style={{ fontSize: 'clamp(42px, 5vw, 64px)', margin: '0 0 8px', lineHeight: 1 }}>
              {greeting()}, <em>{user?.name?.split(' ')[0] || 'dear guest'}.</em>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar avatar-lg">{initials}</div>
            <div>
              <div style={{ fontWeight: 500 }}>{user?.name || user?.email}</div>
              <div style={{ fontSize: 10, color: 'var(--mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Étoile member
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 540, marginBottom: 36, lineHeight: 1.7 }}>
          {activeStay
            ? 'Below, your stay at a glance — should anything be wanting, the concierge stands ready.'
            : upcomingStay
              ? `Your reservation is confirmed. We look forward to welcoming you on ${fmtShort(upcomingStay.checkIn)}.`
              : 'Welcome to your LuxuryStay guest portal. Book a stay or browse your reservation history below.'}
        </p>

        {/* ── Stats bar (only when there is a current/upcoming stay) ───── */}
        {displayStay && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1, background: 'var(--hairline)',
            border: '1px solid var(--hairline)', marginBottom: 40,
          }}>
            <Mini label="Check-out"       value={fmtShort(displayStay.checkOut)} />
            <Mini label="Nights remaining" value={activeStay ? nightsRemaining(displayStay.checkOut) : displayStay.nights} />
            <Mini label="Folio · total"   value={`€${Number(displayStay.totalAmount || 0).toLocaleString()}`} />
            <Mini label="Status"          value={STATUS_STYLE[displayStay.status]?.label || displayStay.status} />
          </div>
        )}

        {/* ── Main two-column layout ───────────────────────────────────── */}
        {displayStay ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>

            {/* Left column */}
            <div>
              {/* Today's activities (shown when checked-in) */}
              {activeStay && (
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
              {activeStay ? (
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
                  onClick={() => setActiveTab('reservations')}
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

        {/* ── Account section (tabs: reservations, feedback, profile) ─── */}
        <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--hairline)' }}>
          <SectionHead title="Account" />

          {/* Tab nav */}
          <div style={{
            display: 'flex', gap: 0,
            border: '1px solid var(--hairline)', overflow: 'hidden',
            marginBottom: 32, background: 'var(--paper)', width: 'fit-content',
          }}>
            {[
              { id: 'reservations', label: 'My Reservations', icon: 'calendar' },
              { id: 'feedback',     label: 'Leave Feedback',  icon: 'star'     },
              { id: 'profile',      label: 'My Profile',      icon: 'user'     },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '12px 24px', border: 'none', cursor: 'pointer',
                  fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
                  background: activeTab === t.id ? 'var(--ink)' : 'transparent',
                  color: activeTab === t.id ? 'var(--paper)' : 'var(--mute)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <Icon name={t.icon} size={12} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Reservations tab */}
          {activeTab === 'reservations' && (
            <div>
              {resLoading && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mute)', fontSize: 13 }}>
                  <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                  Loading reservations…
                </div>
              )}
              {!resLoading && reservations.length === 0 && (
                <div style={{ border: '1px solid var(--hairline)', padding: '48px 32px', textAlign: 'center', background: 'var(--paper)' }}>
                  <Icon name="calendar" size={32} style={{ color: 'var(--mute)', display: 'block', margin: '0 auto 16px' }} />
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No reservations yet</div>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '0 0 24px' }}>
                    Make your first reservation and it will appear here.
                  </p>
                  <button className="btn btn-primary" onClick={() => navigate('/book')}>
                    Reserve a suite <Icon name="arrow_right" size={12} />
                  </button>
                </div>
              )}
              {!resLoading && reservations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }}>
                  {reservations.map(r => (
                    <div key={r._id} style={{
                      border: '1px solid var(--hairline)', padding: '20px 24px',
                      background: 'var(--paper)', display: 'grid',
                      gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start',
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <Icon name="bed" size={14} style={{ color: 'var(--brass)' }} />
                          <span style={{ fontWeight: 600, fontSize: 15 }}>
                            {r.room?.number ? `Room ${r.room.number}` : 'Room TBA'}
                          </span>
                          {r.room?.type && (
                            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                              · {TYPE_LABEL[r.room.type] || r.room.type}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                          <span><strong style={{ color: 'var(--ink)' }}>Check-in</strong>&nbsp;{fmtDate(r.checkIn)}</span>
                          <span><strong style={{ color: 'var(--ink)' }}>Check-out</strong>&nbsp;{fmtDate(r.checkOut)}</span>
                          {r.totalAmount != null && (
                            <span>Total:&nbsp;<strong style={{ color: 'var(--ink)' }}>€{Number(r.totalAmount).toLocaleString()}</strong></span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback tab */}
          {activeTab === 'feedback' && (
            <div>
              {feedbackDone ? (
                <div style={{ border: '1px solid var(--hairline)', padding: '36px 32px', textAlign: 'center', background: 'var(--paper)', maxWidth: 520 }}>
                  <div style={{ fontSize: 36, marginBottom: 12, color: '#C9A84C' }}>★</div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Thank you!</div>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>Your feedback has been received.</p>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setFeedbackDone(false)}>
                    Leave more feedback
                  </button>
                </div>
              ) : (
                <FeedbackForm reservations={reservations} onDone={() => setFeedbackDone(true)} />
              )}
            </div>
          )}

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <ProfileForm user={user} />
          )}
        </div>

      </section>
    </PublicShell>
  );
}

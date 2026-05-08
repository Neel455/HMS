import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';

const SUBJECTS = [
  { value: 'reservation', label: 'Reservation enquiry' },
  { value: 'event',       label: 'Private event' },
  { value: 'spa',         label: 'Spa & wellness' },
  { value: 'press',       label: 'Press' },
  { value: 'other',       label: 'Other' },
];

function ContactBlock({ icon, label, main, sub }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 40, height: 40, flexShrink: 0,
        background: 'var(--linen)', border: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--brass-deep)',
      }}>
        <Icon name={icon} size={17} />
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{main}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

const EMPTY = { firstName: '', lastName: '', email: '', subject: 'reservation', message: '' };

// ─── Feedback form (inline, for authenticated guests) ────────────────────────

function FeedbackSection({ reservations }) {
  const toast    = useToast();
  const eligible = reservations.filter(r => r.status === 'checked-out');

  const [resId,        setResId]        = useState(eligible[0]?._id || '');
  const [rating,       setRating]       = useState(0);
  const [hover,        setHover]        = useState(0);
  const [comment,      setComment]      = useState('');
  const [loading,      setLoading]      = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  async function submit(e) {
    e.preventDefault();
    if (!resId)          { toast.error('Please select a reservation.'); return; }
    if (!rating)         { toast.error('Please select a star rating.'); return; }
    if (!comment.trim()) { toast.error('Please write a comment.'); return; }
    setLoading(true);
    try {
      await api.post('/api/guest/feedback', { reservationId: resId, rating, comment });
      toast.success('Thank you for your feedback!');
      setFeedbackDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit feedback.');
    } finally {
      setLoading(false);
    }
  }

  if (feedbackDone) {
    return (
      <div style={{ border: '1px solid var(--hairline)', padding: '36px 32px', textAlign: 'center', background: 'var(--paper)', maxWidth: 520 }}>
        <div style={{ fontSize: 36, marginBottom: 12, color: '#C9A84C' }}>★</div>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Thank you!</div>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>Your feedback has been received and means a great deal to us.</p>
        <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { setFeedbackDone(false); setRating(0); setComment(''); }}>
          Leave more feedback
        </button>
      </div>
    );
  }

  if (eligible.length === 0) {
    return (
      <div style={{ border: '1px solid var(--hairline)', padding: '48px 32px', textAlign: 'center', background: 'var(--paper)', maxWidth: 520 }}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No completed stays yet</div>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>
          Feedback can be submitted after your check-out. We look forward to hearing from you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 560 }}>
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
              fontSize: 32, lineHeight: 1, padding: 0, border: 'none', background: 'none',
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
          rows={5}
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const toast   = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isGuest = isAuthenticated && user?.role === 'guest';
  const { data: resData } = useApi(isGuest ? '/api/guest/reservations' : null);
  const reservations = resData?.reservations ?? [];

  const [form,        setForm]        = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading,     setLoading]     = useState(false);
  const [sent,        setSent]        = useState(false);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setFieldErrors(e => ({ ...e, [field]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim())  errors.lastName  = 'Last name is required.';
    if (!form.email.trim())     errors.email     = 'Email is required.';
    if (!form.message.trim())   errors.message   = 'Message is required.';
    else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/contact', {
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim(),
        subject:   SUBJECTS.find(s => s.value === form.subject)?.label || form.subject,
        message:   form.message.trim(),
      });
      setSent(true);
      toast.success('Message sent — we\'ll be in touch shortly.');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.length) {
        const map = {};
        serverErrors.forEach(e => { map[e.field] = e.message; });
        setFieldErrors(map);
      } else {
        toast.error(err.response?.data?.message || 'Could not send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <section style={{
        padding: '80px 64px 100px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        maxWidth: 1280,
        margin: '0 auto',
      }}>

        {/* ── Left: contact info ─────────────────────────────────────── */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>Contact us</div>
          <h1
            className="display"
            style={{ fontSize: 'clamp(48px, 5vw, 84px)', margin: '0 0 24px', lineHeight: 0.95 }}
          >
            A note, <em>before</em><br />you arrive.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: 460, marginBottom: 48 }}>
            Our concierge replies within four hours, in any language, day or night.
            For urgent matters during travel, please use the direct line below.
          </p>

          <div style={{ display: 'grid', gap: 32, maxWidth: 420 }}>
            <ContactBlock
              icon="phone"
              label="Concierge"
              main="+33 4 93 88 14 24"
              sub="24 hours · all languages"
            />
            <ContactBlock
              icon="mail"
              label="Reservations"
              main="reservations@luxurystay.co"
            />
            <ContactBlock
              icon="map"
              label="The house"
              main="14 Promenade des Anglais"
              sub="06000 Nice · France"
            />
            <ContactBlock
              icon="clock"
              label="Check-in / Check-out"
              main="15:00 / 12:00"
              sub="Late check-out subject to availability"
            />
          </div>
        </div>

        {/* ── Right: contact form ────────────────────────────────────── */}
        <div>
          {sent ? (
            /* ── Success state ── */
            <div style={{
              border: '1px solid var(--hairline)',
              padding: '64px 48px',
              textAlign: 'center',
              background: 'var(--paper)',
            }}>
              <div style={{ marginBottom: 20, color: 'var(--brass)' }}>
                <Icon name="check" size={36} />
              </div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Message received</div>
              <h2 className="display" style={{ fontSize: 36, margin: '0 0 16px' }}>
                Thank <em>you.</em>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 32 }}>
                We will respond within four hours. In the meantime, you are welcome
                to explore our suites or make a reservation.
              </p>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12 }}
                onClick={() => { setSent(false); setForm(EMPTY); }}
              >
                Send another message
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <div className="card" style={{ padding: 40 }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Send a message</div>
              <form onSubmit={handleSubmit} noValidate>

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
                  <div className="field" style={{ marginBottom: fieldErrors.firstName ? 4 : 20 }}>
                    <label>First name <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                    <input
                      value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      placeholder="Your name"
                      style={fieldErrors.firstName ? { borderColor: 'var(--terracotta)' } : {}}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: fieldErrors.lastName ? 4 : 20 }}>
                    <label>Last name <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                    <input
                      value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      placeholder="Your name"
                      style={fieldErrors.lastName ? { borderColor: 'var(--terracotta)' } : {}}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {fieldErrors.firstName && (
                    <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon name="alert" size={11} />{fieldErrors.firstName}
                    </p>
                  )}
                  {fieldErrors.lastName && (
                    <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon name="alert" size={11} />{fieldErrors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="field" style={{ marginBottom: fieldErrors.email ? 4 : 20 }}>
                  <label>Email <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="you@example.com"
                    style={fieldErrors.email ? { borderColor: 'var(--terracotta)' } : {}}
                  />
                </div>
                {fieldErrors.email && (
                  <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="alert" size={11} />{fieldErrors.email}
                  </p>
                )}

                {/* Subject */}
                <div className="field" style={{ marginBottom: 20 }}>
                  <label>Subject</label>
                  <select value={form.subject} onChange={e => set('subject', e.target.value)}>
                    {SUBJECTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="field" style={{ marginBottom: fieldErrors.message ? 4 : 24 }}>
                  <label>Message <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="How may we be of service?"
                    style={{ resize: 'vertical', ...(fieldErrors.message ? { borderColor: 'var(--terracotta)' } : {}) }}
                  />
                </div>
                {fieldErrors.message && (
                  <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="alert" size={11} />{fieldErrors.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: loading ? 0.7 : 1 }}
                >
                  {loading
                    ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Sending…</>
                    : <>Send message <Icon name="arrow_right" size={12} /></>
                  }
                </button>

                <p style={{ fontSize: 11, color: 'var(--mute)', marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
                  We reply within 4 hours · All languages welcome
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ── Guest feedback section (authenticated guests only) ────────── */}
      {isGuest && (
        <section style={{
          borderTop: '1px solid var(--hairline)',
          padding: '80px 64px',
          maxWidth: 1280,
          margin: '0 auto',
        }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>Share your experience</div>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 4vw, 56px)', margin: '0 0 16px', lineHeight: 1 }}>
            Share your <em>experience.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
            We read every review. Your words shape the way we welcome guests.
          </p>
          <FeedbackSection reservations={reservations} />
        </section>
      )}
    </PublicShell>
  );
}

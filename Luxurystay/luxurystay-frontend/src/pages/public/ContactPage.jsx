import { useState } from 'react';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

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

export default function ContactPage() {
  const toast = useToast();

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
    </PublicShell>
  );
}

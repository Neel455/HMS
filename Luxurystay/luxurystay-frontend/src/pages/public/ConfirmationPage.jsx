import { useLocation, useNavigate, Link } from 'react-router-dom';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';

function Row({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '12px 0', borderBottom: '1px solid var(--hairline)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{value}</span>
    </div>
  );
}

const GRAD_MAP = {
  'Deluxe Twin':   'linear-gradient(140deg, #EFE8DB, #C9AE82)',
  'Deluxe King':   'linear-gradient(140deg, #C9AE82, #A08054)',
  'Junior Suite':  'linear-gradient(140deg, #A08054, #806339)',
  'Premier Suite': 'linear-gradient(140deg, #806339, #4A443B)',
  'Penthouse':     'linear-gradient(140deg, #4A443B, #1A1814)',
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const booking   = state?.booking;

  if (!booking) {
    return (
      <PublicShell>
        <section style={{ padding: '100px 64px', textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Nothing to show</div>
          <h1 className="display" style={{ fontSize: 48, marginBottom: 24 }}>
            No booking <em>found.</em>
          </h1>
          <p style={{ color: 'var(--ink-3)', marginBottom: 32 }}>
            This page is only accessible right after completing a booking.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/book')}>
            Make a reservation <Icon name="arrow_right" size={12} />
          </button>
        </section>
      </PublicShell>
    );
  }

  const grad = GRAD_MAP[booking.room?.type] || 'linear-gradient(140deg, #C9AE82, #A08054)';

  return (
    <PublicShell>
      <section style={{ padding: '80px 64px 100px', maxWidth: 1280, margin: '0 auto' }}>

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 64, maxWidth: 680 }}>
          <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--brass)' }}>
            Booking confirmed
          </div>
          <h1
            className="display"
            style={{ fontSize: 'clamp(48px, 5vw, 80px)', margin: '0 0 20px', lineHeight: 0.95 }}
          >
            See you <em>soon,</em><br />{booking.guest?.name?.split(' ')[0] || 'dear guest'}.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: 560 }}>
            Your reservation is pending confirmation. Our team reviews all online requests
            within two hours and will send a confirmation email to&nbsp;
            <strong>{booking.guest?.email}</strong>.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'start' }}>

          {/* ── Left: booking summary ──────────────────────────────────── */}
          <div>
            {/* Confirmation number */}
            <div style={{
              background: 'var(--linen)',
              border: '1px solid var(--hairline)',
              padding: '28px 32px',
              marginBottom: 24,
            }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Confirmation number</div>
              <div className="display numeral" style={{ fontSize: 'clamp(28px, 3vw, 42px)', letterSpacing: '0.04em' }}>
                {booking.bookingId}
              </div>
              <p style={{ fontSize: 12, color: 'var(--mute)', marginTop: 8 }}>
                Quote this reference in all correspondence with our team.
              </p>
            </div>

            {/* Detail rows */}
            <div style={{ marginBottom: 32 }}>
              <Row label="Guest"        value={booking.guest?.name} />
              <Row label="Suite"        value={booking.room?.type} />
              <Row label="Room"         value={`Floor ${booking.room?.floor} · #${booking.room?.number}`} />
              <Row label="Arrival"      value={fmt(booking.checkIn)} />
              <Row label="Departure"    value={fmt(booking.checkOut)} />
              <Row
                label="Duration"
                value={`${booking.nights} night${booking.nights !== 1 ? 's' : ''}`}
              />
              <Row
                label="Guests"
                value={`${booking.adults} adult${booking.adults !== 1 ? 's' : ''}${booking.children ? ` · ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}`}
              />
            </div>

            {/* Financial summary */}
            <div style={{
              background: 'var(--paper)',
              border: '1px solid var(--hairline)',
              padding: '24px 28px',
              marginBottom: 32,
            }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Payment summary</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>Total stay</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>
                  €{booking.totalAmount?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--hairline)' }}>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>Deposit due (30%)</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--brass-deep)' }}>
                  €{booking.depositAmount?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--mute)', marginTop: 12, lineHeight: 1.6 }}>
                Deposit collected upon confirmation. Remaining balance due at check-in.
                Free cancellation up to 72 hours before arrival.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => navigate('/guest')}
              >
                <Icon name="calendar" size={13} /> Open My Stay
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => window.print()}
              >
                <Icon name="download" size={13} /> Save PDF
              </button>
            </div>
          </div>

          {/* ── Right: suite visual + info ─────────────────────────────── */}
          <div style={{ position: 'sticky', top: 100 }}>
            {/* Gradient suite card */}
            <div style={{
              background: grad,
              aspectRatio: '4/3',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 32,
            }}>
              <div style={{
                position: 'absolute', top: 24, left: 28,
                fontFamily: 'var(--serif)', fontSize: 80, fontStyle: 'italic',
                color: 'rgba(247,243,236,0.18)', lineHeight: 0.9,
                userSelect: 'none',
              }}>
                {booking.room?.type?.charAt(0) || 'L'}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '28px 28px 24px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
                color: '#fff',
              }}>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Your suite
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 26 }}>
                  {booking.room?.type}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                  Floor {booking.room?.floor} · Room {booking.room?.number}
                </div>
              </div>
            </div>

            {/* What's next card */}
            <div style={{
              border: '1px solid var(--hairline)',
              padding: '28px 28px 24px',
              background: 'var(--paper)',
            }}>
              <div className="eyebrow" style={{ marginBottom: 18 }}>What happens next</div>
              {[
                { icon: 'mail',     text: 'Confirmation email sent to ' + (booking.guest?.email || 'your email') },
                { icon: 'clock',    text: 'Our team reviews within 2 hours and activates your booking' },
                { icon: 'receipt',    text: '30% deposit collected upon confirmation' },
                { icon: 'check',    text: 'Full details sent 48 hours before arrival' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 16 : 0 }}>
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    background: 'var(--linen)', border: '1px solid var(--hairline)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--brass-deep)',
                  }}>
                    <Icon name={step.icon} size={14} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6, margin: 0, paddingTop: 6 }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: 'var(--mute)', marginTop: 20, lineHeight: 1.6, textAlign: 'center' }}>
              Questions? Call <strong>+33 4 93 88 14 24</strong> or email{' '}
              <Link to="/contact" style={{ color: 'var(--brass-deep)' }}>our concierge</Link>.
            </p>
          </div>

        </div>
      </section>
    </PublicShell>
  );
}

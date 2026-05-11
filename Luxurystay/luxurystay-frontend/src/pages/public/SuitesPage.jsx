import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';
import api from '../../lib/api';

// Fallback gradients keyed by slug, used when a suite has no image
const FALLBACK_GRAD = {
  deluxe_twin:   'linear-gradient(140deg, #EFE8DB, #C9AE82)',
  deluxe_king:   'linear-gradient(140deg, #C9AE82, #A08054)',
  junior_suite:  'linear-gradient(140deg, #A08054, #806339)',
  premier_suite: 'linear-gradient(140deg, #806339, #4A443B)',
  penthouse:     'linear-gradient(140deg, #4A443B, #1A1814)',
};

function SuiteVisual({ suite, index }) {
  const hasImage = suite.images?.length > 0;
  const grad     = suite.gradient || FALLBACK_GRAD[suite.slug] || 'linear-gradient(140deg, #C9AE82, #A08054)';
  const num      = String(index + 1).padStart(2, '0');

  return (
    <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
      {hasImage ? (
        <img
          src={suite.images[0]}
          alt={suite.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: grad }}>
          <div style={{
            position: 'absolute', top: 24, left: 24,
            fontFamily: 'var(--serif)', fontSize: 96, fontStyle: 'italic',
            color: 'rgba(247,243,236,0.18)', lineHeight: 0.9,
          }}>
            {num}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuitesPage() {
  const navigate = useNavigate();
  const [suites,  setSuites]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/suites')
      .then(r => setSuites(r.data?.data?.suites ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicShell>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 64px 40px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>The accommodations</div>
        <h1
          className="display"
          style={{ fontSize: 'clamp(52px, 6vw, 84px)', margin: '0 0 24px', lineHeight: 0.95, maxWidth: 900 }}
        >
          Forty-two rooms, <em>each composed</em> by hand.
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: 600, marginBottom: 64 }}>
          Five categories. Walnut joinery, linens from Florence, marble bathrooms
          drawn from the Carrara quarries. No two suites are identical.
        </p>
      </section>

      {/* ── Suite list ───────────────────────────────────────────────── */}
      <section style={{ padding: '0 64px 100px', maxWidth: 1280, margin: '0 auto' }}>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--mute)', padding: '60px 0' }}>
            <div className="spinner" style={{ width: 18, height: 18 }} />
            Loading suites…
          </div>
        )}

        {!loading && suites.length === 0 && (
          <div style={{ padding: '60px 0', color: 'var(--mute)', fontSize: 14 }}>
            Suite details coming soon. Please contact our concierge for availability.
          </div>
        )}

        {!loading && suites.map((suite, i) => {
          const imageLeft = i % 2 !== 0;
          return (
            <div
              key={suite.id}
              style={{
                display: 'grid',
                gridTemplateColumns: imageLeft ? '1fr 1.2fr' : '1.2fr 1fr',
                gap: 60,
                alignItems: 'center',
                padding: '60px 0',
                borderTop: i > 0 ? '1px solid var(--hairline-2)' : 'none',
              }}
            >
              <div style={{ order: imageLeft ? 0 : 1 }}>
                <SuiteVisual suite={suite} index={i} />
              </div>

              <div style={{ order: imageLeft ? 1 : 0 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>
                  Category {String(i + 1).padStart(2, '0')}{suite.sqm ? ` · ${suite.sqm} m²` : ''}
                </div>
                <h2
                  className="display"
                  style={{ fontSize: 'clamp(36px, 4vw, 56px)', margin: '0 0 18px', lineHeight: 1 }}
                >
                  {suite.name}
                </h2>
                {suite.description && (
                  <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
                    {suite.description}
                  </p>
                )}

                {suite.amenities?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
                    {suite.amenities.map((a, j) => (
                      <span
                        key={j}
                        className={a.vip ? 'chip chip-vip' : 'chip chip-reserved'}
                        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <Icon name={a.icon} size={10} />
                        {a.label}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingTop: 24, borderTop: '1px solid var(--hairline)',
                }}>
                  <div>
                    {suite.baseRate != null && (
                      <>
                        <div className="label">From</div>
                        <div className="display numeral" style={{ fontSize: 40, lineHeight: 1, marginTop: 4 }}>
                          €{Number(suite.baseRate).toLocaleString()}
                          <span style={{ fontSize: 14, color: 'var(--mute)', marginLeft: 6 }}>/ night</span>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/book', { state: { suite: suite.name } })}
                  >
                    Reserve <Icon name="arrow_right" size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Bottom CTA band ──────────────────────────────────────────── */}
      <section style={{
        background: 'var(--linen)', border: '1px solid var(--hairline)',
        margin: '0 64px 80px', padding: '48px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40,
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Not sure which suite?</div>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', margin: 0, maxWidth: 480 }}>
            Our concierge is available around the clock to help you find the perfect
            accommodation for your stay.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <button className="btn btn-ghost" style={{ padding: '12px 24px' }} onClick={() => navigate('/contact')}>
            <Icon name="mail" size={13} /> Contact concierge
          </button>
          <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={() => navigate('/book')}>
            Reserve now <Icon name="arrow_right" size={12} />
          </button>
        </div>
      </section>

    </PublicShell>
  );
}

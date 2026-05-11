import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';
import api from '../../lib/api';

const STATS = [
  { label: 'Founded',          value: '1924' },
  { label: 'Suites',           value: '42' },
  { label: 'Michelin stars',   value: '★★' },
  { label: 'Returning guests', value: '62%' },
];

const FALLBACK_GRAD = {
  deluxe_twin:   'linear-gradient(160deg, #EFE8DB, #C9AE82)',
  deluxe_king:   'linear-gradient(160deg, #C9AE82, #A08054)',
  junior_suite:  'linear-gradient(160deg, #A08054, #806339)',
  premier_suite: 'linear-gradient(160deg, #806339, #4A443B)',
  penthouse:     'linear-gradient(160deg, #4A443B, #1A1814)',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    api.get('/api/suites')
      .then(r => setPreview((r.data?.data?.suites ?? []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <PublicShell>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 64px 80px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>EST. MCMXXIV · Côte d'Azur</div>
          <h1
            className="display"
            style={{ fontSize: 'clamp(60px, 6vw, 100px)', margin: '0 0 28px', lineHeight: 0.95 }}
          >
            The art of <em>arriving</em>,<br />
            and never quite<br />
            leaving.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 480, marginBottom: 36 }}>
            A century of hospitality on the Mediterranean coast. Forty-two suites,
            three restaurants, one spa carved from sea-stone. Each stay is composed,
            not booked.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <button className="btn btn-primary" style={{ padding: '14px 28px' }} onClick={() => navigate('/book')}>
              Reserve your stay <Icon name="arrow_right" size={12} />
            </button>
            <button className="btn btn-ghost" style={{ padding: '14px 28px' }} onClick={() => navigate('/suites')}>
              Explore the suites
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div style={{
          aspectRatio: '4/5',
          background: 'linear-gradient(160deg, #2A2620 0%, #4A443B 50%, #806339 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(247,243,236,0.12), transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32, color: 'var(--ivory)' }}>
            <div className="eyebrow" style={{ color: 'var(--brass-soft)', marginBottom: 8 }}>The Penthouse</div>
            <div className="display display-italic" style={{ fontSize: 32 }}>From €2,400 / night</div>
          </div>
          <div style={{ position: 'absolute', top: 32, right: 32, fontFamily: 'var(--serif)', fontSize: 60, fontStyle: 'italic', color: 'rgba(247,243,236,0.15)', lineHeight: 1 }}>★</div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section style={{ padding: '0 64px 80px' }}>
        <div className="rule"><div className="dot" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', marginTop: 48 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'var(--paper)', padding: '32px 28px', textAlign: 'center' }}>
              <div className="display numeral" style={{ fontSize: 52, lineHeight: 1 }}>{s.value}</div>
              <div className="label" style={{ marginTop: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Suite preview ────────────────────────────────────────────── */}
      <section style={{ padding: '60px 64px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <h2 className="display" style={{ fontSize: 56, margin: 0 }}>The <em>suites.</em></h2>
          <a onClick={() => navigate('/suites')} style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', cursor: 'pointer' }}>
            View all →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {preview.map((suite, i) => {
            const hasImage = suite.images?.length > 0;
            const grad = suite.gradient || FALLBACK_GRAD[suite.slug] || 'linear-gradient(160deg, #C9AE82, #A08054)';
            const num  = String(i + 1).padStart(2, '0');
            return (
              <div key={suite.id} onClick={() => navigate('/book')} style={{ cursor: 'pointer' }}>
                <div style={{ aspectRatio: '1', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
                  {hasImage ? (
                    <img src={suite.images[0]} alt={suite.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: grad, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: 'var(--serif)', fontSize: 80, fontStyle: 'italic', color: 'rgba(247,243,236,0.2)', lineHeight: 0.8 }}>
                        {num}
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="display" style={{ fontSize: 28, margin: '0 0 4px' }}>{suite.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                  <span className="label">
                    {suite.baseRate ? `From €${Number(suite.baseRate).toLocaleString()} / night` : ''}
                  </span>
                  <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)' }}>
                    Reserve →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Experience strip ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '80px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--brass-soft)', marginBottom: 20 }}>The house · since 1924</div>
          <h2 className="display display-italic" style={{ fontSize: 'clamp(40px, 4vw, 64px)', margin: '0 0 24px', lineHeight: 1.05 }}>
            "Service is the architecture of memory."
          </h2>
          <p style={{ fontSize: 15, color: 'var(--mute-2)', lineHeight: 1.7, maxWidth: 440 }}>
            Three Michelin-starred dining. A spa drawn from the sea floor.
            Forty-two suites composed for guests who know the difference between a room and a residence.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(247,243,236,0.08)', border: '1px solid rgba(247,243,236,0.08)' }}>
          {[
            { icon: 'spa',    label: 'La Mer Spa',        sub: 'Sea-stone rituals' },
            { icon: 'coffee', label: 'Three restaurants', sub: 'Michelin ★★' },
            { icon: 'pool',   label: 'Infinity pool',     sub: 'Rooftop, heated' },
            { icon: 'leaf',   label: 'Concierge',         sub: '24 h · all languages' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '28px 24px', background: 'rgba(26,24,20,0.6)' }}>
              <Icon name={item.icon} size={22} style={{ color: 'var(--brass)', marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--mute-2)' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

    </PublicShell>
  );
}

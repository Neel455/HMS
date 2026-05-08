import { useNavigate } from 'react-router-dom';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';

const SUITES = [
  {
    num:   '01',
    name:  'Deluxe Twin',
    sqm:   28,
    from:  460,
    grad:  'linear-gradient(140deg, #EFE8DB, #C9AE82)',
    desc:  'Twin beds for travel companions or family. Garden-side aspect, full marble bathroom, walk-in shower.',
    amenities: [
      { icon: 'wifi',   label: 'Fibre Wi-Fi' },
      { icon: 'coffee', label: 'Espresso' },
      { icon: 'spa',    label: 'Bath ritual' },
    ],
  },
  {
    num:   '02',
    name:  'Deluxe King',
    sqm:   32,
    from:  480,
    grad:  'linear-gradient(140deg, #C9AE82, #A08054)',
    desc:  'Our signature category. King bed, sitting nook, French balcony with views over the gardens or Promenade.',
    amenities: [
      { icon: 'wifi',   label: 'Fibre Wi-Fi' },
      { icon: 'coffee', label: 'Espresso' },
      { icon: 'spa',    label: 'Bath ritual' },
    ],
  },
  {
    num:   '03',
    name:  'Junior Suite',
    sqm:   48,
    from:  720,
    grad:  'linear-gradient(140deg, #A08054, #806339)',
    desc:  'Generous proportions, separate sitting area, soaking tub overlooking the sea. Espresso service standard.',
    amenities: [
      { icon: 'wifi',   label: 'Fibre Wi-Fi' },
      { icon: 'coffee', label: 'Espresso' },
      { icon: 'spa',    label: 'Bath ritual' },
      { icon: 'leaf',   label: 'Terrace' },
    ],
  },
  {
    num:   '04',
    name:  'Premier Suite',
    sqm:   76,
    from:  1240,
    grad:  'linear-gradient(140deg, #806339, #4A443B)',
    desc:  'Two-bedroom configuration available. Private terrace, dressing room, dedicated butler service.',
    amenities: [
      { icon: 'wifi',   label: 'Fibre Wi-Fi' },
      { icon: 'coffee', label: 'Espresso' },
      { icon: 'spa',    label: 'Bath ritual' },
      { icon: 'leaf',   label: 'Terrace' },
      { icon: 'crown',  label: 'Butler',  vip: true },
    ],
  },
  {
    num:   '05',
    name:  'Penthouse',
    sqm:   180,
    from:  2400,
    grad:  'linear-gradient(140deg, #4A443B, #1A1814)',
    desc:  'The crown of the house. Wraparound terrace with plunge pool, dining for ten, panoramic Mediterranean views.',
    amenities: [
      { icon: 'wifi',   label: 'Fibre Wi-Fi' },
      { icon: 'coffee', label: 'Espresso' },
      { icon: 'spa',    label: 'Bath ritual' },
      { icon: 'pool',   label: 'Plunge pool' },
      { icon: 'crown',  label: 'Butler',  vip: true },
    ],
  },
];

export default function SuitesPage() {
  const navigate = useNavigate();

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
        {SUITES.map((suite, i) => {
          const imageLeft = i % 2 !== 0;
          return (
            <div
              key={suite.num}
              style={{
                display: 'grid',
                gridTemplateColumns: imageLeft ? '1fr 1.2fr' : '1.2fr 1fr',
                gap: 60,
                alignItems: 'center',
                padding: '60px 0',
                borderTop: i > 0 ? '1px solid var(--hairline-2)' : 'none',
              }}
            >
              {/* Gradient image */}
              <div
                style={{
                  order: imageLeft ? 0 : 1,
                  aspectRatio: '4/3',
                  background: suite.grad,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 24, left: 24,
                  fontFamily: 'var(--serif)', fontSize: 96, fontStyle: 'italic',
                  color: 'rgba(247, 243, 236, 0.18)', lineHeight: 0.9,
                }}>
                  {suite.num}
                </div>
              </div>

              {/* Suite details */}
              <div style={{ order: imageLeft ? 1 : 0 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>
                  Category {suite.num} · {suite.sqm} m²
                </div>
                <h2
                  className="display"
                  style={{ fontSize: 'clamp(36px, 4vw, 56px)', margin: '0 0 18px', lineHeight: 1 }}
                >
                  {suite.name}
                </h2>
                <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
                  {suite.desc}
                </p>

                {/* Amenity chips */}
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

                {/* Price + CTA */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingTop: 24, borderTop: '1px solid var(--hairline)',
                }}>
                  <div>
                    <div className="label">From</div>
                    <div className="display numeral" style={{ fontSize: 40, lineHeight: 1, marginTop: 4 }}>
                      €{suite.from.toLocaleString()}
                      <span style={{ fontSize: 14, color: 'var(--mute)', marginLeft: 6 }}>/ night</span>
                    </div>
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
        background: 'var(--linen)',
        border: '1px solid var(--hairline)',
        margin: '0 64px 80px',
        padding: '48px 56px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 40,
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Not sure which suite?</div>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', margin: 0, maxWidth: 480 }}>
            Our concierge is available around the clock to help you find the perfect
            accommodation for your stay.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '12px 24px' }}
            onClick={() => navigate('/contact')}
          >
            <Icon name="mail" size={13} /> Contact concierge
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
            onClick={() => navigate('/book')}
          >
            Reserve now <Icon name="arrow_right" size={12} />
          </button>
        </div>
      </section>

    </PublicShell>
  );
}

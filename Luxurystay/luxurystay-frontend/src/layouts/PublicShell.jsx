import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

const NAV_ITEMS = [
  { id: 'landing', label: 'The House',  path: '/' },
  { id: 'suites',  label: 'Suites',     path: '/suites' },
  { id: 'book',    label: 'Reserve',    path: '/book' },
  { id: 'stay',    label: 'My Stay',    path: '/guest' },
  { id: 'contact', label: 'Contact',    path: '/contact' },
];

const FOOTER_COLS = [
  { h: 'House', links: ['About', 'Press', 'Careers', 'Sustainability'] },
  { h: 'Stay',  links: ['Suites', 'Dining', 'Spa', 'Events'] },
  { h: 'Guest', links: ['Reservations', 'Concierge', 'Gift cards', 'Sign in'] },
];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}

function PublicFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{
      background: 'var(--ink)', color: 'var(--ivory)',
      padding: '60px 64px 36px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
        <div>
          <div
            onClick={() => navigate('/')}
            style={{ fontFamily: 'var(--serif)', fontSize: 28, cursor: 'pointer' }}
          >
            <em>Luxury</em>STAY
          </div>
          <p style={{ fontSize: 12, color: 'var(--mute-2)', marginTop: 16, maxWidth: 320, lineHeight: 1.6 }}>
            Maison Étoile · 14 Promenade des Anglais, 06000 Nice, France.
            A member of Leading Hotels of the World.
          </p>
        </div>
        {FOOTER_COLS.map(col => (
          <div key={col.h}>
            <div className="eyebrow" style={{ color: 'var(--brass-soft)', marginBottom: 16 }}>{col.h}</div>
            {col.links.map(link => (
              <div key={link} style={{ fontSize: 13, color: 'var(--mute-2)', padding: '4px 0', cursor: 'pointer' }}>
                {link}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        borderTop: '1px solid #4A443B', paddingTop: 24,
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--mute)', display: 'flex', justifyContent: 'space-between',
      }}>
        <span>© MMXXVI LuxuryStay Hospitality</span>
        <span>Privacy · Terms · Press</span>
      </div>
    </footer>
  );
}

export default function PublicShell({ children, dark = false }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const fg     = dark ? 'var(--ivory)' : 'var(--ink)';
  const muted  = dark ? 'var(--mute-2)' : 'var(--mute)';
  const border = dark ? 'rgba(247, 243, 236, 0.12)' : 'var(--hairline-2)';
  const bg     = dark ? 'var(--ink)' : 'var(--ivory)';

  function isActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  async function handleSignOut() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', color: fg }}>

      {/* ── Sticky header ───────────────────────────────────────────── */}
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '26px 64px',
        borderBottom: `1px solid ${border}`,
        position: 'sticky', top: 0,
        background: bg, zIndex: 50,
      }}>

        {/* Brand */}
        <div
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 6 }}
        >
          <span style={{ fontFamily: 'var(--serif)', fontSize: 26, fontStyle: 'italic', color: fg }}>Luxury</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 26, letterSpacing: '0.04em', color: fg }}>STAY</span>
        </div>

        {/* Centre nav */}
        <nav style={{
          display: 'flex', gap: 36,
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          justifyContent: 'center',
        }}>
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                cursor: 'pointer',
                color: isActive(item.path) ? fg : muted,
                borderBottom: isActive(item.path) ? `1px solid ${fg}` : '1px solid transparent',
                paddingBottom: 4,
                transition: 'color 0.15s',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right — guest auth + CTA */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
          {isAuthenticated && user?.role === 'guest' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                className="avatar"
                style={{ width: 30, height: 30, fontSize: 11, background: 'var(--brass)', color: 'var(--paper)', cursor: 'pointer' }}
                onClick={() => navigate('/guest')}
              >
                {getInitials(user.name)}
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.06em', color: fg }}>
                {user.name?.split(' ')[0]}
                <a
                  onClick={handleSignOut}
                  style={{ display: 'block', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, cursor: 'pointer', marginTop: 2 }}
                >
                  Sign out
                </a>
              </div>
            </div>
          ) : (
            <a
              onClick={() => navigate('/login')}
              style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, cursor: 'pointer' }}
            >
              Sign in
            </a>
          )}
          <button
            className={dark ? 'btn btn-sm' : 'btn btn-primary btn-sm'}
            style={dark ? {
              border: '1px solid var(--brass)', color: 'var(--brass)',
              background: 'transparent', padding: '8px 16px',
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            } : { padding: '8px 16px' }}
            onClick={() => navigate('/book')}
          >
            Reserve <Icon name="arrow_right" size={10} />
          </button>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────── */}
      {children}

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <PublicFooter />
    </div>
  );
}

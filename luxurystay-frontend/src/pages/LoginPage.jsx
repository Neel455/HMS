import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';

// Quick-fill demo credentials — remove in production
const DEMO_ACCOUNTS = [
  { label: 'Admin · Margaux',     email: 'm.devereaux@luxurystay.co', pwd: 'Admin@1234!' },
  { label: 'Manager · Henri',     email: 'h.cassel@luxurystay.co',    pwd: 'Manager@1234!' },
  { label: 'Reception · Yuki',    email: 'y.tanaka@luxurystay.co',    pwd: 'Reception@1234!' },
  { label: 'Housekeep · Rosa',    email: 'r.mendoza@luxurystay.co',   pwd: 'House@1234!' },
];

const ROLE_LABELS = {
  admin:        'Admin console',
  manager:      'Manager console',
  receptionist: 'Front desk console',
  housekeeping: 'Housekeeping console',
  maintenance:  'Maintenance console',
};

export default function LoginPage() {
  const [tab, setTab]         = useState('signin');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const { login, isAuthenticated } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Already authenticated — skip login
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  // Derive recognised staff identity from email for the resolver strip
  const staffDomain = email.trim().toLowerCase().endsWith('@luxurystay.co');
  const resolvedRole = staffDomain ? 'staff' : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name?.split(' ')[0] || 'there'}.`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function quickFill(acc) {
    setEmail(acc.email);
    setPassword(acc.pwd);
    setTab('signin');
    setError('');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--ivory)',
    }}>

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #2A2620 0%, #1A1814 100%)',
        color: 'var(--ivory)',
        padding: 64,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Brass radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 70% 20%, rgba(160, 128, 84, 0.18), transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Brand */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic' }}>Luxury</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 28, letterSpacing: '0.04em' }}>STAY</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--brass-soft)', marginTop: 10 }}>
            One door, every guest
          </div>
        </div>

        {/* Quote */}
        <div style={{ position: 'relative' }}>
          <div className="display display-italic" style={{ fontSize: 56, lineHeight: 1.05, maxWidth: 480, color: 'var(--ivory)' }}>
            "Service is the architecture of memory."
          </div>
          <div style={{ marginTop: 24, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--brass-soft)' }}>
            — House motto · est. 1924
          </div>
        </div>

        <div style={{ position: 'relative', fontSize: 11, color: 'var(--mute-2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Maison Étoile · Côte d'Azur
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <div style={{ padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>

          <div className="eyebrow" style={{ marginBottom: 14 }}>
            {tab === 'signup' ? 'Staff account' : 'Welcome back'}
          </div>
          <h1 className="display" style={{ fontSize: 52, margin: '0 0 12px' }}>
            {tab === 'signup' ? <>Contact <em>admin.</em></> : <>Sign <em>in.</em></>}
          </h1>
          <p style={{ color: 'var(--ink-3)', marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
            {tab === 'signup'
              ? 'Staff accounts are created by your property administrator. Contact your General Manager to be onboarded.'
              : 'Sign in with your LuxuryStay staff credentials.'}
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', border: '1px solid var(--hairline)', marginBottom: 28, borderRadius: 2, overflow: 'hidden' }}>
            {[{ id: 'signin', label: 'Sign in' }, { id: 'signup', label: 'New account' }].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(''); }}
                style={{
                  flex: 1, padding: '12px 16px',
                  fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: tab === t.id ? 'var(--ink)' : 'transparent',
                  color: tab === t.id ? 'var(--paper)' : 'var(--mute)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{t.label}</button>
            ))}
          </div>

          {tab === 'signin' ? (
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="field" style={{ marginBottom: 18 }}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@luxurystay.co"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Password */}
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    style={{ width: '100%', paddingRight: 32 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    style={{ position: 'absolute', right: 0, bottom: 8, color: 'var(--mute)', padding: 0 }}
                    tabIndex={-1}
                  >
                    <Icon name="eye" size={14} />
                  </button>
                </div>
              </div>

              {/* Identity resolver strip */}
              {resolvedRole && email && (
                <div style={{
                  background: 'var(--linen)', border: '1px solid var(--hairline)',
                  padding: '10px 14px', marginBottom: 18,
                  fontSize: 12, color: 'var(--ink-3)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderRadius: 'var(--radius)',
                }}>
                  <Icon name="key" size={12} />
                  <span>LuxuryStay staff address recognised</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  background: 'var(--terracotta-soft)', border: '1px solid var(--terracotta)',
                  padding: '10px 14px', marginBottom: 18,
                  fontSize: 12, color: 'var(--terracotta)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderRadius: 'var(--radius)',
                }}>
                  <Icon name="alert" size={12} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '14px', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} /> Signing in…</>
                  : <>{resolvedRole ? `Sign in to ${ROLE_LABELS[resolvedRole] || 'console'}` : 'Sign in'} <Icon name="arrow_right" size={12} /></>
                }
              </button>
            </form>
          ) : (
            /* ── New account info panel ── */
            <div style={{ background: 'var(--linen)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-md)', padding: 24 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="users" size={20} style={{ color: 'var(--brass)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>Contact your General Manager</div>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                    All staff accounts are provisioned through the admin dashboard by the property administrator.
                    Ask your General Manager to create your account under <strong>Administration → Staff & Roles</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Demo quick-fill ── */}
          <div className="rule" style={{ margin: '28px 0 20px' }}><div className="dot" /></div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Demo · try a role</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start', fontSize: 11, padding: '10px 12px' }}
                onClick={() => quickFill(acc)}
              >
                {acc.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
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

  // Sign-in state
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPwd, setShowPwd]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState({});

  // Registration state
  const [regName, setRegName]           = useState('');
  const [regEmail, setRegEmail]         = useState('');
  const [regPhone, setRegPhone]         = useState('');
  const [regPassword, setRegPassword]   = useState('');
  const [regConfirm, setRegConfirm]     = useState('');
  const [showRegPwd, setShowRegPwd]     = useState(false);
  const [regLoading, setRegLoading]     = useState(false);
  const [regError, setRegError]         = useState('');
  const [regFieldErrors, setRegFieldErrors] = useState({});

  const { login, isAuthenticated, user } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Already authenticated — skip login
  useEffect(() => {
    if (isAuthenticated) {
      const dest = user?.role === 'guest' ? '/guest' : from;
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  // Derive recognised staff identity from email for the resolver strip
  const staffDomain = email.trim().toLowerCase().endsWith('@luxurystay.co');
  const resolvedRole = staffDomain ? 'staff' : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoginFieldErrors({});

    // Client-side validation
    const clientErrors = {};
    if (!email.trim()) clientErrors.email = 'Email is required.';
    if (!password.trim()) clientErrors.password = 'Password is required.';
    if (Object.keys(clientErrors).length > 0) {
      setLoginFieldErrors(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name?.split(' ')[0] || 'there'}.`);
      const dest = user.role === 'guest' ? '/guest' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.length) {
        const fieldMap = {};
        serverErrors.forEach(e => { fieldMap[e.field] = e.message; });
        setLoginFieldErrors(fieldMap);
      } else {
        setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

  async function handleRegister(e) {
    e.preventDefault();
    setRegError('');
    setRegFieldErrors({});

    // Client-side validation
    const clientErrors = {};
    if (!regName.trim()) clientErrors.name = 'Name is required.';
    else if (regName.trim().length < 2) clientErrors.name = 'Name must be at least 2 characters.';
    if (!regEmail.trim()) clientErrors.email = 'Email is required.';
    if (!regPassword) clientErrors.password = 'Password is required.';
    else if (regPassword.length < 8) clientErrors.password = 'Password must be at least 8 characters.';
    else if (!PASSWORD_REGEX.test(regPassword)) clientErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
    if (!regConfirm) clientErrors.confirmPassword = 'Please confirm your password.';
    else if (regPassword !== regConfirm) clientErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(clientErrors).length > 0) {
      setRegFieldErrors(clientErrors);
      return;
    }

    setRegLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim() || undefined,
      });
      const { token, user: newUser } = data.data;
      localStorage.setItem('ls_token', token);
      localStorage.setItem('ls_user', JSON.stringify(newUser));
      toast.success(`Welcome to LuxuryStay, ${newUser.name?.split(' ')[0] || 'there'}!`);
      navigate('/guest', { replace: true });
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.length) {
        // Map server field errors to a { fieldName: message } object
        const fieldMap = {};
        serverErrors.forEach(e => { fieldMap[e.field] = e.message; });
        setRegFieldErrors(fieldMap);
      } else {
        setRegError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setRegLoading(false);
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
            {tab === 'signup' ? 'Guest account' : 'Welcome back'}
          </div>
          <h1 className="display" style={{ fontSize: 52, margin: '0 0 12px' }}>
            {tab === 'signup' ? <>Create <em>account.</em></> : <>Sign <em>in.</em></>}
          </h1>
          <p style={{ color: 'var(--ink-3)', marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
            {tab === 'signup'
              ? 'Register as a guest to view your reservations and share your experience.'
              : 'Sign in to your LuxuryStay account.'}
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', border: '1px solid var(--hairline)', marginBottom: 28, borderRadius: 2, overflow: 'hidden' }}>
            {[{ id: 'signin', label: 'Sign in' }, { id: 'signup', label: 'New account' }].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(''); setLoginFieldErrors({}); setRegError(''); setRegFieldErrors({}); }}
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
              <div className="field" style={{ marginBottom: loginFieldErrors.email ? 6 : 18 }}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); setLoginFieldErrors(p => ({ ...p, email: '' })); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  style={loginFieldErrors.email ? { borderColor: 'var(--terracotta)' } : {}}
                />
              </div>
              {loginFieldErrors.email && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert" size={11} />{loginFieldErrors.email}
                </p>
              )}

              {/* Password */}
              <div className="field" style={{ marginBottom: loginFieldErrors.password ? 6 : 14 }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); setLoginFieldErrors(p => ({ ...p, password: '' })); }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    style={{ width: '100%', paddingRight: 32, ...(loginFieldErrors.password ? { borderColor: 'var(--terracotta)' } : {}) }}
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
              {loginFieldErrors.password && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert" size={11} />{loginFieldErrors.password}
                </p>
              )}

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

              {/* General error (wrong credentials etc.) */}
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
            /* ── Guest registration form ── */
            <form onSubmit={handleRegister} noValidate>
              <div className="field" style={{ marginBottom: regFieldErrors.name ? 6 : 14 }}>
                <label>Full name <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => { setRegName(e.target.value); setRegFieldErrors(p => ({ ...p, name: '' })); }}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  autoFocus
                  style={regFieldErrors.name ? { borderColor: 'var(--terracotta)' } : {}}
                />
              </div>
              {regFieldErrors.name && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert" size={11} />{regFieldErrors.name}
                </p>
              )}

              <div className="field" style={{ marginBottom: regFieldErrors.email ? 6 : 14 }}>
                <label>Email address <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => { setRegEmail(e.target.value); setRegFieldErrors(p => ({ ...p, email: '' })); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={regFieldErrors.email ? { borderColor: 'var(--terracotta)' } : {}}
                />
              </div>
              {regFieldErrors.email && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert" size={11} />{regFieldErrors.email}
                </p>
              )}

              <div className="field" style={{ marginBottom: regFieldErrors.phone ? 6 : 14 }}>
                <label>Phone <span style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 400 }}>optional</span></label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={e => { setRegPhone(e.target.value); setRegFieldErrors(p => ({ ...p, phone: '' })); }}
                  placeholder="+1 555 000 0000"
                  autoComplete="tel"
                  style={regFieldErrors.phone ? { borderColor: 'var(--terracotta)' } : {}}
                />
              </div>
              {regFieldErrors.phone && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert" size={11} />{regFieldErrors.phone}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: (regFieldErrors.password || regFieldErrors.confirmPassword) ? 6 : 14 }}>
                <div className="field">
                  <label>Password <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showRegPwd ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => { setRegPassword(e.target.value); setRegFieldErrors(p => ({ ...p, password: '' })); }}
                      placeholder="Min 8 chars"
                      autoComplete="new-password"
                      style={{ width: '100%', paddingRight: 32, ...(regFieldErrors.password ? { borderColor: 'var(--terracotta)' } : {}) }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPwd(v => !v)}
                      style={{ position: 'absolute', right: 0, bottom: 8, color: 'var(--mute)', padding: 0 }}
                      tabIndex={-1}
                    ><Icon name="eye" size={14} /></button>
                  </div>
                </div>
                <div className="field">
                  <label>Confirm password <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                  <input
                    type={showRegPwd ? 'text' : 'password'}
                    value={regConfirm}
                    onChange={e => { setRegConfirm(e.target.value); setRegFieldErrors(p => ({ ...p, confirmPassword: '' })); }}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    style={regFieldErrors.confirmPassword ? { borderColor: 'var(--terracotta)' } : {}}
                  />
                </div>
              </div>
              {regFieldErrors.password && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 6px', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <Icon name="alert" size={11} style={{ marginTop: 2, flexShrink: 0 }} />{regFieldErrors.password}
                </p>
              )}
              {regFieldErrors.confirmPassword && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert" size={11} />{regFieldErrors.confirmPassword}
                </p>
              )}

              {regError && (
                <div style={{
                  background: 'var(--terracotta-soft)', border: '1px solid var(--terracotta)',
                  padding: '10px 14px', marginBottom: 14,
                  fontSize: 12, color: 'var(--terracotta)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderRadius: 'var(--radius)',
                }}>
                  <Icon name="alert" size={12} />
                  <span>{regError}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={regLoading}
                style={{ width: '100%', padding: '14px', justifyContent: 'center', opacity: regLoading ? 0.7 : 1 }}
              >
                {regLoading
                  ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} /> Creating account…</>
                  : <>Create guest account <Icon name="arrow_right" size={12} /></>
                }
              </button>

              <p style={{ fontSize: 11, color: 'var(--mute)', marginTop: 12, lineHeight: 1.6 }}>
                Staff accounts are created by the property administrator via the admin panel.
              </p>
            </form>
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

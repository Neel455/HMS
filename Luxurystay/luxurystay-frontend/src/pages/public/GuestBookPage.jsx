import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PublicShell from '../../layouts/PublicShell';
import Icon from '../../components/Icon';
import Dropdown from '../../components/Dropdown';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Fallback gradients — used when a suite has no image and no gradient stored
const FALLBACK_GRAD = {
  deluxe_twin:   'linear-gradient(140deg, #EFE8DB, #C9AE82)',
  deluxe_king:   'linear-gradient(140deg, #C9AE82, #A08054)',
  junior_suite:  'linear-gradient(140deg, #A08054, #806339)',
  premier_suite: 'linear-gradient(140deg, #806339, #4A443B)',
  penthouse:     'linear-gradient(140deg, #4A443B, #1A1814)',
};

// Maps suite display-name → slug so StepConfirm can look up the gradient
const SUITE_NAME_TO_SLUG = {
  'Deluxe Twin':   'deluxe_twin',
  'Deluxe King':   'deluxe_king',
  'Junior Suite':  'junior_suite',
  'Premier Suite': 'premier_suite',
  'Penthouse':     'penthouse',
};

// ─── Step indicator ───────────────────────────────────────────────────────────

function BookStep({ n, label, done, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--ink)' : current ? 'var(--brass)' : 'transparent',
        border: done || current ? 'none' : '1px solid var(--hairline)',
        color: done || current ? 'var(--paper)' : 'var(--mute)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--serif)', fontSize: 13,
      }}>
        {done ? <Icon name="check" size={12} /> : n}
      </div>
      <span style={{
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: current ? 'var(--ink)' : 'var(--mute)',
        fontWeight: current ? 600 : 400,
      }}>
        {label}
      </span>
    </div>
  );
}

function StepLine() {
  return <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />;
}

// ─── Step 1 — Dates ───────────────────────────────────────────────────────────

function StepDates({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!data.checkIn)   e.checkIn  = 'Please select an arrival date.';
    if (!data.checkOut)  e.checkOut = 'Please select a departure date.';
    if (data.checkIn && data.checkOut && data.checkIn >= data.checkOut)
      e.checkOut = 'Departure must be after arrival.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  const nights = data.checkIn && data.checkOut
    ? Math.ceil((new Date(data.checkOut) - new Date(data.checkIn)) / 86400000)
    : 0;

  // Min date = today
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 className="display" style={{ fontSize: 40, margin: '0 0 8px' }}>
        Choose your <em>dates.</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 32 }}>
        Stays of three nights or more receive a complimentary spa ritual on arrival.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="field">
          <label>Arrival date</label>
          <input
            type="date"
            min={today}
            value={data.checkIn}
            onChange={e => { onChange('checkIn', e.target.value); setErrors(v => ({ ...v, checkIn: '' })); }}
            style={errors.checkIn ? { borderColor: 'var(--terracotta)' } : {}}
          />
          {errors.checkIn && <p style={{ color: 'var(--terracotta)', fontSize: 12, marginTop: 4 }}>{errors.checkIn}</p>}
        </div>
        <div className="field">
          <label>Departure date</label>
          <input
            type="date"
            min={data.checkIn || today}
            value={data.checkOut}
            onChange={e => { onChange('checkOut', e.target.value); setErrors(v => ({ ...v, checkOut: '' })); }}
            style={errors.checkOut ? { borderColor: 'var(--terracotta)' } : {}}
          />
          {errors.checkOut && <p style={{ color: 'var(--terracotta)', fontSize: 12, marginTop: 4 }}>{errors.checkOut}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div className="field">
          <label>Adults</label>
          <Dropdown
            value={data.adults}
            onChange={value => onChange('adults', Number(value))}
            options={[1,2,3,4,5,6].map(n => ({ value: n, label: `${n} adult${n > 1 ? 's' : ''}` }))}
            placeholder="Select adults"
          />
        </div>
        <div className="field">
          <label>Children</label>
          <Dropdown
            value={data.children}
            onChange={value => onChange('children', Number(value))}
            options={[0,1,2,3,4].map(n => ({ value: n, label: n === 0 ? 'No children' : `${n} child${n > 1 ? 'ren' : ''}` }))}
            placeholder="Select children"
          />
        </div>
      </div>

      {nights > 0 && (
        <div style={{
          background: 'var(--linen)', border: '1px solid var(--hairline)',
          padding: '14px 18px', marginBottom: 28,
          fontSize: 13, color: 'var(--ink-3)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="calendar" size={14} style={{ color: 'var(--brass)' }} />
          <span>
            <strong style={{ color: 'var(--ink)' }}>{nights} night{nights > 1 ? 's' : ''}</strong>
            {nights >= 3 && <span style={{ marginLeft: 8, color: 'var(--brass-deep)' }}>· Complimentary spa ritual included</span>}
          </span>
        </div>
      )}

      <button
        className="btn btn-primary"
        style={{ padding: '13px 28px' }}
        onClick={() => validate() && onNext()}
      >
        Continue to suite selection <Icon name="arrow_right" size={12} />
      </button>
    </div>
  );
}

// ─── Step 2 — Suite ───────────────────────────────────────────────────────────

function StepSuite({ dates, selectedType, onSelect, onNext, onBack }) {
  const [allSuites, setAllSuites] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  const nights = Math.ceil(
    (new Date(dates.checkOut) - new Date(dates.checkIn)) / 86400000
  );

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/api/suites'),
      api.get('/api/guest/rooms', {
        params: { checkIn: dates.checkIn, checkOut: dates.checkOut, adults: dates.adults },
      }),
    ])
      .then(([suitesRes, availRes]) => {
        setAllSuites(suitesRes.data?.data?.suites ?? []);
        setAvailable(availRes.data?.data?.types   ?? []);
      })
      .catch(() => setError('Could not check availability. Please try again.'))
      .finally(() => setLoading(false));
  }, [dates.checkIn, dates.checkOut, dates.adults]);

  // Merge suite marketing data with live availability (matched by slug ↔ type)
  const suites = allSuites.map((suite, i) => {
    const avail = available.find(a => a.type === suite.slug);
    const grad  = suite.gradient || FALLBACK_GRAD[suite.slug] || 'linear-gradient(140deg, #C9AE82, #A08054)';
    const num   = String(i + 1).padStart(2, '0');
    return {
      ...suite,
      grad,
      num,
      available: !!avail,
      rate:  avail?.rate  || null,
      total: avail?.total || null,
      count: avail?.count || 0,
    };
  });

  return (
    <div>
      <h2 className="display" style={{ fontSize: 40, margin: '0 0 8px' }}>
        Choose your <em>suite.</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 32 }}>
        {nights} night{nights > 1 ? 's' : ''} · {dates.adults} adult{dates.adults > 1 ? 's' : ''}
        {dates.children > 0 && ` · ${dates.children} child${dates.children > 1 ? 'ren' : ''}`}
      </p>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--mute)', marginBottom: 24 }}>
          <div className="spinner" style={{ width: 16, height: 16 }} />
          Checking availability…
        </div>
      )}
      {error && (
        <div style={{
          background: 'var(--terracotta-soft)', border: '1px solid var(--terracotta)',
          padding: '12px 16px', borderRadius: 'var(--radius)', fontSize: 13,
          color: 'var(--terracotta)', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <Icon name="alert" size={13} /> {error}
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {suites.map(s => {
            const selected  = selectedType === s.name;
            const hasImage  = s.images?.length > 0;
            return (
              <div
                key={s.id}
                onClick={() => s.available && onSelect(s.name)}
                style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr auto',
                  gap: 20, padding: 0, overflow: 'hidden',
                  border: selected ? '2px solid var(--brass)' : '1px solid var(--hairline)',
                  background: 'var(--paper)',
                  opacity: s.available ? 1 : 0.45,
                  cursor: s.available ? 'pointer' : 'not-allowed',
                  transition: 'border-color 0.15s',
                }}
              >
                {/* Thumbnail — image or gradient */}
                <div style={{ position: 'relative', minHeight: 110, overflow: 'hidden' }}>
                  {hasImage ? (
                    <img src={s.images[0]} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: s.grad, position: 'absolute', inset: 0 }}>
                      <div style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic', color: 'rgba(247,243,236,0.25)' }}>
                        {s.num}
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '18px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                    <h3 className="display" style={{ fontSize: 22, margin: 0 }}>{s.name}</h3>
                    {s.sqm && <span style={{ fontSize: 12, color: 'var(--mute)' }}>{s.sqm} m²</span>}
                  </div>
                  {s.description && (
                    <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '0 0 10px' }}>{s.description}</p>
                  )}
                  {s.amenities?.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {s.amenities.map((a, j) => (
                        <span key={j} className="chip chip-reserved" style={{ fontSize: 10 }}>{a.label}</span>
                      ))}
                    </div>
                  )}
                  {!s.available && (
                    <span style={{ fontSize: 11, color: 'var(--terracotta)', marginTop: 6, display: 'block' }}>
                      Not available for selected dates
                    </span>
                  )}
                </div>

                {/* Price + select */}
                <div style={{
                  padding: '18px 20px', borderLeft: '1px solid var(--hairline-2)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', alignItems: 'flex-end',
                  minWidth: 160, textAlign: 'right',
                }}>
                  {s.rate ? (
                    <>
                      <div>
                        <div className="display numeral" style={{ fontSize: 26, lineHeight: 1 }}>
                          €{s.rate.toLocaleString()}
                        </div>
                        <div className="label" style={{ marginTop: 2 }}>per night</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                          €{s.total.toLocaleString()} total
                        </div>
                      </div>
                      <button
                        className={selected ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                        onClick={e => { e.stopPropagation(); onSelect(s.name); }}
                      >
                        {selected ? <><Icon name="check" size={12} /> Selected</> : 'Select'}
                      </button>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--mute)', alignSelf: 'center' }}>Unavailable</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-ghost" style={{ padding: '12px 20px' }} onClick={onBack}>
          <Icon name="arrow_left" size={12} /> Back
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: '12px 24px', opacity: selectedType ? 1 : 0.5 }}
          disabled={!selectedType}
          onClick={onNext}
        >
          Continue to guest details <Icon name="arrow_right" size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 — Guest details ───────────────────────────────────────────────────

function StepDetails({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!data.firstName.trim()) e.firstName = 'First name is required.';
    if (!data.lastName.trim())  e.lastName  = 'Last name is required.';
    if (!data.phone.trim())     e.phone     = 'Phone number is required.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function set(field, value) {
    onChange(field, value);
    setErrors(v => ({ ...v, [field]: '' }));
  }

  return (
    <div style={{ maxWidth: 580 }}>
      <h2 className="display" style={{ fontSize: 40, margin: '0 0 8px' }}>
        Your <em>details.</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 32 }}>
        We'll use this to prepare your arrival and send your confirmation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="field">
          <label>First name <span style={{ color: 'var(--terracotta)' }}>*</span></label>
          <input
            value={data.firstName}
            onChange={e => set('firstName', e.target.value)}
            placeholder="Your first name"
            style={errors.firstName ? { borderColor: 'var(--terracotta)' } : {}}
          />
          {errors.firstName && <p style={{ color: 'var(--terracotta)', fontSize: 12, marginTop: 4 }}>{errors.firstName}</p>}
        </div>
        <div className="field">
          <label>Last name <span style={{ color: 'var(--terracotta)' }}>*</span></label>
          <input
            value={data.lastName}
            onChange={e => set('lastName', e.target.value)}
            placeholder="Your last name"
            style={errors.lastName ? { borderColor: 'var(--terracotta)' } : {}}
          />
          {errors.lastName && <p style={{ color: 'var(--terracotta)', fontSize: 12, marginTop: 4 }}>{errors.lastName}</p>}
        </div>
      </div>

      <div className="field" style={{ marginBottom: 16 }}>
        <label>Phone number <span style={{ color: 'var(--terracotta)' }}>*</span></label>
        <input
          type="tel"
          value={data.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="+1 555 000 0000"
          style={errors.phone ? { borderColor: 'var(--terracotta)' } : {}}
        />
        {errors.phone && <p style={{ color: 'var(--terracotta)', fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
      </div>

      <div className="field" style={{ marginBottom: 16 }}>
        <label>Nationality <span style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 400 }}>optional</span></label>
        <input
          value={data.nationality}
          onChange={e => onChange('nationality', e.target.value)}
          placeholder="e.g. French"
        />
      </div>

      <div className="field" style={{ marginBottom: 32 }}>
        <label>Special requests <span style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 400 }}>optional</span></label>
        <textarea
          rows={3}
          value={data.specialRequests}
          onChange={e => onChange('specialRequests', e.target.value)}
          placeholder="Dietary requirements, room preferences, celebration arrangements…"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-ghost" style={{ padding: '12px 20px' }} onClick={onBack}>
          <Icon name="arrow_left" size={12} /> Back
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
          onClick={() => validate() && onNext()}
        >
          Review & confirm <Icon name="arrow_right" size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 — Confirm ─────────────────────────────────────────────────────────

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--hairline-2)' }}>
      <span style={{ color: 'var(--ink-3)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function StepConfirm({ dates, suite, details, onBack, onSubmit, loading }) {
  const nights = Math.ceil(
    (new Date(dates.checkOut) - new Date(dates.checkIn)) / 86400000
  );
  const suiteGrad = FALLBACK_GRAD[SUITE_NAME_TO_SLUG[suite]] || 'linear-gradient(140deg, #C9AE82, #A08054)';

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 className="display" style={{ fontSize: 40, margin: '0 0 8px' }}>
        Review your <em>stay.</em>
      </h2>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 32 }}>
        Please review the details below before confirming.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Suite card */}
        <div style={{
          background: suiteGrad,
          position: 'relative', aspectRatio: '16/9', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: 16, left: 18,
            color: 'var(--paper)',
          }}>
            <div className="eyebrow" style={{ color: 'rgba(247,243,236,0.7)', marginBottom: 4 }}>Selected</div>
            <div className="display" style={{ fontSize: 22 }}>{suite}</div>
          </div>
        </div>

        {/* Booking summary */}
        <div className="card" style={{ padding: 20 }}>
          <SummaryRow label="Guest"        value={`${details.firstName} ${details.lastName}`} />
          <SummaryRow label="Arrival"      value={fmtDate(dates.checkIn)} />
          <SummaryRow label="Departure"    value={fmtDate(dates.checkOut)} />
          <SummaryRow label="Nights"       value={nights} />
          <SummaryRow label="Guests"       value={`${dates.adults} adult${dates.adults > 1 ? 's' : ''}${dates.children > 0 ? ` · ${dates.children} child${dates.children > 1 ? 'ren' : ''}` : ''}`} />
        </div>
      </div>

      {/* Cancellation note */}
      <div style={{
        background: 'var(--linen)', padding: '14px 18px', fontSize: 13,
        color: 'var(--ink-3)', marginBottom: 28, lineHeight: 1.6,
        border: '1px solid var(--hairline)',
      }}>
        <strong style={{ color: 'var(--ink)' }}>Free cancellation</strong> up to 72 hours before arrival.
        A 30% deposit will be collected to hold your reservation.
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          className="btn btn-ghost"
          style={{ padding: '12px 20px' }}
          onClick={onBack}
          disabled={loading}
        >
          <Icon name="arrow_left" size={12} /> Back
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: '13px 28px', opacity: loading ? 0.7 : 1 }}
          disabled={loading}
          onClick={onSubmit}
        >
          {loading
            ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} /> Confirming…</>
            : <>Confirm reservation <Icon name="arrow_right" size={12} /></>
          }
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STEPS = ['Dates', 'Suite', 'Your details', 'Confirm'];

export default function GuestBookPage() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const toast         = useToast();
  const queryClient   = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const [step, setStep] = useState(0);

  // Seed suite from navigation state (e.g. clicking Reserve on SuitesPage)
  const preselectedSuite = location.state?.suite || '';

  const [dates, setDates] = useState({
    checkIn: '', checkOut: '', adults: 2, children: 0,
  });
  const [selectedSuite, setSelectedSuite] = useState(preselectedSuite);
  const [details, setDetails] = useState({
    firstName:       user?.name?.split(' ')[0] || '',
    lastName:        user?.name?.split(' ').slice(1).join(' ') || '',
    phone:           user?.phone || '',
    nationality:     '',
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);

  function updateDate(field, value) {
    setDates(d => ({ ...d, [field]: value }));
  }

  function updateDetail(field, value) {
    setDetails(d => ({ ...d, [field]: value }));
  }

  async function handleSubmit() {
    if (!isAuthenticated || user?.role !== 'guest') {
      toast.error('Please sign in to your guest account to complete the booking.');
      navigate('/login', { state: { from: { pathname: '/book' } } });
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/api/guest/book', {
        checkIn:         dates.checkIn,
        checkOut:        dates.checkOut,
        adults:          dates.adults,
        children:        dates.children,
        roomType:        selectedSuite,
        firstName:       details.firstName.trim(),
        lastName:        details.lastName.trim(),
        phone:           details.phone.trim(),
        nationality:     details.nationality.trim(),
        specialRequests: details.specialRequests.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/guest/reservations'] });
      navigate('/confirm', { state: { booking: data.data.booking }, replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicShell>
      <section style={{ padding: '60px 64px 100px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: i < STEPS.length - 1 ? '1' : undefined }}>
              <BookStep n={i + 1} label={label} done={step > i} current={step === i} />
              {i < STEPS.length - 1 && <StepLine />}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <StepDates
            data={dates}
            onChange={updateDate}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <StepSuite
            dates={dates}
            selectedType={selectedSuite}
            onSelect={setSelectedSuite}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepDetails
            data={details}
            onChange={updateDetail}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepConfirm
            dates={dates}
            suite={selectedSuite}
            details={details}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        )}

      </section>
    </PublicShell>
  );
}

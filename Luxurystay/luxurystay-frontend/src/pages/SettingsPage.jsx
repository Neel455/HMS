import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import api from '../lib/api';

const TIMEZONES = [
  'UTC','Europe/London','Europe/Paris','Europe/Berlin','Europe/Rome',
  'America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
  'Asia/Dubai','Asia/Karachi','Asia/Kolkata','Asia/Bangkok','Asia/Singapore',
  'Asia/Tokyo','Australia/Sydney','Pacific/Auckland',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc' },
];

const CHILDREN_POLICIES = [
  { value: 'allowed', label: 'Children welcome' },
  { value: 'restricted', label: 'Adults only (18+)' },
  { value: 'on_request', label: 'On request only' },
];

const PETS_POLICIES = [
  { value: 'not_allowed', label: 'No pets allowed' },
  { value: 'allowed', label: 'Pets welcome' },
  { value: 'on_request', label: 'On request (fee may apply)' },
];

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--brass)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{hint}</span>}
    </div>
  );
}

function ToggleSwitch({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
        background: value ? 'var(--brass)' : 'var(--line)', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: property, loading, error, refetch } = useApi('/api/property');

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (property) {
      setForm({
        name: property.name || '',
        code: property.code || '',
        address: property.address || '',
        city: property.city || '',
        country: property.country || '',
        phone: property.phone || '',
        email: property.email || '',
        website: property.website || '',
        currency: property.currency || 'USD',
        timezone: property.timezone || 'UTC',
        checkInTime: property.checkInTime || '14:00',
        checkOutTime: property.checkOutTime || '11:00',
        cancellationWindowHours: property.cancellationWindowHours ?? 24,
        depositPercent: property.depositPercent ?? 20,
        childrenPolicy: property.childrenPolicy || 'allowed',
        petsPolicy: property.petsPolicy || 'not_allowed',
        vatPercent: property.vatPercent ?? 0,
        touristTaxPerNight: property.touristTaxPerNight ?? 0,
        taxIncludedInRates: property.taxIncludedInRates ?? false,
      });
      setDirty(false);
    }
  }, [property]);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    setDirty(true);
  }

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.patch('/api/property', form);
      showToast('Settings saved successfully.');
      setDirty(false);
      refetch();
    } catch (e) {
      showToast(e.response?.data?.message || e.message || 'Failed to save settings.', false);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)',
    background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, width: '100%',
    fontFamily: 'var(--font-sans)',
  };

  const selectStyle = { ...inputStyle };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading settings…</div>
  );

  if (error && !form) return (
    <div style={{ padding: 40 }}>
      <div style={{ background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: 8, padding: 16, color: '#b91c1c' }}>
        {error} — using default values below.
      </div>
      <button className="btn-primary" style={{ marginTop: 16 }} onClick={refetch}>Retry</button>
    </div>
  );

  if (!form) return null;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 0 60px' }}>
      {/* Header */}
      <div className="page-head" style={{ marginBottom: 32 }}>
        <div>
          <p className="eyebrow">Configuration</p>
          <h1 className="display">Settings</h1>
          <p className="sub">Manage property details, policies, and system preferences.</p>
        </div>
        {dirty && (
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ alignSelf: 'flex-end' }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: toast.ok ? 'var(--sage)' : 'var(--terracotta)',
          color: '#fff', padding: '12px 20px', borderRadius: 8,
          fontSize: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Property Identity */}
      <Section title="Property Identity">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Property Name">
            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="LuxuryStay Grand" />
          </Field>
          <Field label="Property Code" hint="Short unique identifier (e.g. LSG)">
            <input style={inputStyle} value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="LSG" maxLength={10} />
          </Field>
          <Field label="Phone">
            <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
          </Field>
          <Field label="Email">
            <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="reservations@hotel.com" />
          </Field>
          <Field label="Website">
            <input style={inputStyle} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://www.hotel.com" />
          </Field>
          <Field label="Currency">
            <select style={selectStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} — {c.label} ({c.code})</option>
              ))}
            </select>
          </Field>
          <Field label="Street Address" hint="">
            <input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Grand Avenue" />
          </Field>
          <Field label="City">
            <input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Dubai" />
          </Field>
          <Field label="Country">
            <input style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)} placeholder="United Arab Emirates" />
          </Field>
          <Field label="Timezone">
            <select style={selectStyle} value={form.timezone} onChange={e => set('timezone', e.target.value)}>
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* Check-in / Check-out Policies */}
      <Section title="Check-in &amp; Check-out">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <Field label="Check-in Time">
            <input style={inputStyle} type="time" value={form.checkInTime} onChange={e => set('checkInTime', e.target.value)} />
          </Field>
          <Field label="Check-out Time">
            <input style={inputStyle} type="time" value={form.checkOutTime} onChange={e => set('checkOutTime', e.target.value)} />
          </Field>
          <Field label="Cancellation Window" hint="Hours before arrival">
            <input style={inputStyle} type="number" min={0} max={168} value={form.cancellationWindowHours} onChange={e => set('cancellationWindowHours', Number(e.target.value))} />
          </Field>
          <Field label="Deposit %" hint="% of total charged at booking">
            <input style={inputStyle} type="number" min={0} max={100} value={form.depositPercent} onChange={e => set('depositPercent', Number(e.target.value))} />
          </Field>
        </div>
      </Section>

      {/* Guest Policies */}
      <Section title="Guest Policies">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Children Policy">
            <select style={selectStyle} value={form.childrenPolicy} onChange={e => set('childrenPolicy', e.target.value)}>
              {CHILDREN_POLICIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="Pets Policy">
            <select style={selectStyle} value={form.petsPolicy} onChange={e => set('petsPolicy', e.target.value)}>
              {PETS_POLICIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* Tax Configuration */}
      <Section title="Tax &amp; Charges">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Field label="VAT / GST (%)" hint="Applied to all invoices">
            <input style={inputStyle} type="number" min={0} max={50} step={0.5} value={form.vatPercent} onChange={e => set('vatPercent', Number(e.target.value))} />
          </Field>
          <Field label="Tourist Tax (per night)" hint="Fixed amount per room per night">
            <input style={inputStyle} type="number" min={0} step={0.5} value={form.touristTaxPerNight} onChange={e => set('touristTaxPerNight', Number(e.target.value))} />
          </Field>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ToggleSwitch value={form.taxIncludedInRates} onChange={v => set('taxIncludedInRates', v)} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Rates are tax-inclusive</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>When enabled, displayed room rates already include VAT. Tax is extracted for reporting.</div>
          </div>
        </div>
      </Section>

      {/* Save bar at bottom */}
      {dirty && (
        <div style={{
          position: 'sticky', bottom: 0, background: 'var(--surface)',
          borderTop: '1px solid var(--line)', padding: '12px 0',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}
            onClick={() => { setForm(null); setTimeout(() => refetch(), 0); }}
          >
            Discard
          </button>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>You have unsaved changes.</span>
        </div>
      )}
    </div>
  );
}

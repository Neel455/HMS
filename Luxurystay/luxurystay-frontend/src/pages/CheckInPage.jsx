import { useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import Icon from '../components/Icon';
import Spinner from '../components/Spinner';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(first = '', last = '') {
  return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
}

function fmtCurrency(val) {
  if (val == null) return '—';
  return `€${Number(val).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
}

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Mini({ label, value }) {
  return (
    <div className="metric" style={{ borderRight: 'none', borderBottom: 'none', borderTop: 'none', borderLeft: 'none' }}>
      <div className="label">{label}</div>
      <div className="val numeral">{value ?? '—'}</div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13, borderBottom: '1px solid var(--hairline)' }}>
      <span style={{ color: 'var(--mute)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function FolioLine({ d, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, color: 'var(--ink-3)' }}>
      <span>{d}</span>
      <span className="mono">{v}</span>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    expected:   { cls: 'chip-reserved',    label: 'Expected' },
    arrived:    { cls: 'chip-available',   label: 'Arrived' },
    'checked-in': { cls: 'chip-occupied',  label: 'Checked in' },
    'in-room':  { cls: 'chip-occupied',    label: 'In-room' },
    'checked-out': { cls: 'chip-cleaning', label: 'Checked out' },
    departed:   { cls: 'chip-cleaning',    label: 'Departed' },
    cancelled:  { cls: 'chip-maintenance', label: 'Cancelled' },
  };
  const { cls, label } = map[status] || { cls: 'chip-reserved', label: status };
  return <span className={`chip ${cls}`}><span className="chip-dot" />{label}</span>;
}

// ─── Arrivals / Departures List ───────────────────────────────────────────────

function CheckInList({ list, mode, onSelect, loading }) {
  const isArrival = mode === 'checkin';

  if (loading) return <div style={{ padding: 40 }}><Spinner page /></div>;
  if (!list.length) {
    return (
      <div className="t-wrap" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--mute)', fontSize: 13 }}>
        No {isArrival ? 'arrivals' : 'departures'} today.
      </div>
    );
  }

  const summary = isArrival
    ? [
        { l: 'Expected today',  v: list.filter(r => ['pending','confirmed'].includes(r.status)).length },
        { l: 'Checked in',      v: list.filter(r => r.status === 'checked-in').length },
        { l: 'VIP arrivals',    v: list.filter(r => r.guest?.isVIP || r.guest?.tier === 'etoile').length },
        { l: 'Avg. stay',       v: list.length ? `${(list.reduce((a, b) => a + (b.nights || 0), 0) / list.length).toFixed(1)} nts` : '—' },
      ]
    : [
        { l: 'Departing today', v: list.length },
        { l: 'Still in-room',   v: list.filter(r => r.status === 'checked-in').length },
        { l: 'Checked out',     v: list.filter(r => r.status === 'checked-out').length },
        { l: 'Folios open',     v: list.filter(r => r.status === 'checked-in').length },
      ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--hairline)', border: '1px solid var(--hairline)', marginBottom: 28 }}>
        {summary.map((s, i) => <Mini key={i} label={s.l} value={s.v} />)}
      </div>

      <div className="t-wrap">
        <table className="t">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Reservation</th>
              <th>Room</th>
              <th>Nights</th>
              <th>{isArrival ? 'ETA' : 'Departure'}</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => {
              const firstName = r.guest?.firstName || '';
              const lastName  = r.guest?.lastName  || '';
              const fullName  = [firstName, lastName].filter(Boolean).join(' ') || '—';
              const initials  = getInitials(firstName, lastName);
              const isVIP     = r.guest?.isVIP || r.guest?.tier === 'etoile';
              const canAct    = isArrival
                ? ['pending','confirmed'].includes(r.status)
                : r.status === 'checked-in';

              return (
                <tr key={r._id} onClick={() => onSelect(r)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{initials}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 500 }}>{fullName}</span>
                          {isVIP && <span className="chip chip-vip"><Icon name="crown" size={10} />Étoile</span>}
                        </div>
                        {r.specialRequests && (
                          <div style={{ fontSize: 10, color: 'var(--mute)', marginTop: 2 }}>{r.specialRequests}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="mono">{r.bookingId || r.id?.slice(-6).toUpperCase()}</span>
                    <div style={{ fontSize: 10, color: 'var(--mute)', marginTop: 2 }}>{r.source || '—'}</div>
                  </td>
                  <td>
                    <div className="numeral" style={{ fontSize: 18 }}>{r.room?.roomNumber || '—'}</div>
                    <div style={{ fontSize: 10, color: 'var(--mute)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.room?.type?.replace('_', ' ') || ''}</div>
                  </td>
                  <td>{r.nights ?? '—'}</td>
                  <td><span className="mono">{r.eta || r.checkOutDate?.slice(0, 10) || '—'}</span></td>
                  <td><StatusChip status={r.status} /></td>
                  <td className="numeral">{fmtCurrency(r.totalAmount)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={e => { e.stopPropagation(); onSelect(r); }}
                    >
                      {isArrival
                        ? (canAct ? 'Check in' : 'View')
                        : (canAct ? 'Check out' : 'View')}
                      <Icon name="arrow_right" size={10} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function CheckInDetail({ reservation, mode, onBack, onDone }) {
  const toast = useToast();
  const isArrival = mode === 'checkin';

  const [checklist, setChecklist] = useState({});
  const [notes, setNotes]         = useState('');
  const [loading, setLoading]     = useState(false);

  const r          = reservation;
  const firstName  = r.guest?.firstName || '';
  const lastName   = r.guest?.lastName  || '';
  const fullName   = [firstName, lastName].filter(Boolean).join(' ') || '—';
  const initials   = getInitials(firstName, lastName);
  const isVIP      = r.guest?.isVIP || r.guest?.tier === 'etoile';
  const subtotal   = r.totalAmount || 0;
  const tax        = Math.round(subtotal * 0.1);

  const arrivalItems   = ['Down pillow', 'Espresso amenities', 'Daily Le Monde', 'Private dining', 'Sea-view side', 'No turn-down'];
  const departureItems = ['Mini-bar verified', 'Safe emptied', 'Keys returned', 'Damage assessment', 'Lost & found cleared', 'Transfer dispatched'];
  const checklistItems = isArrival ? arrivalItems : departureItems;

  const canAct = isArrival
    ? ['pending', 'confirmed'].includes(r.status)
    : r.status === 'checked-in';

  async function handleAction() {
    setLoading(true);
    try {
      const endpoint = isArrival ? `/api/reservations/${r.id}/checkin` : `/api/reservations/${r.id}/checkout`;
      await api.patch(endpoint, { notes });
      toast.success(isArrival ? `${firstName} checked in to room ${r.room?.roomNumber}.` : `${fullName} checked out successfully.`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
        <Icon name="arrow_left" size={12} />Back to {isArrival ? 'arrivals' : 'departures'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
        {/* ── Left: main form ── */}
        <div>
          <div className="card" style={{ padding: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              {isArrival ? 'Check-in · Identity & Preferences' : 'Check-out · Departure review'}
            </div>
            <h2 className="display" style={{ fontSize: 36, margin: '0 0 4px' }}>{fullName}</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
              {isVIP && <span className="chip chip-vip"><Icon name="crown" size={10} />Étoile</span>}
              <StatusChip status={r.status} />
              <span className="chip chip-reserved">{r.bookingId || '—'} · {r.nights ?? '—'} nights</span>
              {r.room && <span className="chip chip-reserved">Room {r.room.roomNumber} · {r.room.type?.replace('_', ' ')}</span>}
              {r.source && <span className="chip chip-reserved">Source · {r.source}</span>}
            </div>

            {isArrival ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                  <div className="field">
                    <label>Guest name</label>
                    <input readOnly value={fullName} />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input readOnly value={r.guest?.email || '—'} />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input readOnly value={r.guest?.phone || '—'} />
                  </div>
                  <div className="field">
                    <label>ETA</label>
                    <input readOnly value={r.eta || '—'} />
                  </div>
                  <div className="field">
                    <label>Check-in date</label>
                    <input readOnly value={r.checkInDate?.slice(0, 10) || '—'} />
                  </div>
                  <div className="field">
                    <label>Check-out date</label>
                    <input readOnly value={r.checkOutDate?.slice(0, 10) || '—'} />
                  </div>
                </div>

                <div className="rule"><div className="dot" /></div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Stay preferences</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
                  {checklistItems.map((p, i) => (
                    <label key={i} onClick={() => setChecklist(c => ({ ...c, [p]: !c[p] }))}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--hairline)', borderRadius: 2, fontSize: 12, cursor: 'pointer', background: checklist[p] ? 'var(--linen)' : 'transparent' }}>
                      <span style={{ width: 14, height: 14, border: '1px solid var(--ink-3)', borderRadius: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checklist[p] ? 'var(--ink)' : 'transparent' }}>
                        {checklist[p] && <Icon name="check" size={10} style={{ color: 'var(--paper)' }} />}
                      </span>
                      {p}
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Folio review</div>
                <div style={{ marginBottom: 24 }}>
                  <FolioLine d={`Room · nightly rate × ${r.nights ?? 0}`} v={fmtCurrency(subtotal)} />
                  {r.services?.map((s, i) => (
                    <FolioLine key={i} d={s.description || s.type} v={fmtCurrency(s.amount)} />
                  ))}
                </div>
                <div className="rule"><div className="dot" /></div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Departure checklist</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  {checklistItems.map((p, i) => (
                    <label key={i} onClick={() => setChecklist(c => ({ ...c, [p]: !c[p] }))}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--hairline)', borderRadius: 2, fontSize: 12, cursor: 'pointer', background: checklist[p] ? 'var(--linen)' : 'transparent' }}>
                      <span style={{ width: 14, height: 14, border: '1px solid var(--ink-3)', borderRadius: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checklist[p] ? 'var(--ink)' : 'transparent' }}>
                        {checklist[p] && <Icon name="check" size={10} style={{ color: 'var(--paper)' }} />}
                      </span>
                      {p}
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Notes */}
            <div className="field" style={{ marginBottom: 28 }}>
              <label>Staff notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Any notes for handover…"
                style={{ minHeight: 72, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-ghost" onClick={onBack}>
                <Icon name="arrow_left" size={12} />Cancel
              </button>
              {canAct && (
                <button className="btn btn-primary" onClick={handleAction} disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading
                    ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Processing…</>
                    : <>{isArrival ? 'Issue keys · Check in' : 'Settle folio · Check out'}<Icon name="arrow_right" size={12} /></>
                  }
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: summary card ── */}
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              {isArrival ? 'Reservation summary' : 'Folio summary'}
            </div>
            <SummaryRow label="Confirmation" value={r.bookingId || '—'} />
            <SummaryRow label="Room" value={r.room ? `${r.room.roomNumber} · ${r.room.type?.replace('_', ' ')}` : '—'} />
            <SummaryRow label="Check-in"  value={r.checkInDate?.slice(0, 10)  || '—'} />
            <SummaryRow label="Check-out" value={r.checkOutDate?.slice(0, 10) || '—'} />
            <SummaryRow label="Nights"    value={r.nights ?? '—'} />
            <SummaryRow label="Adults"    value={r.adults ?? '—'} />
            <SummaryRow label="Subtotal"  value={fmtCurrency(subtotal)} />
            <SummaryRow label="Tax (10%)" value={fmtCurrency(tax)} />
            <div style={{ marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="label">Total due</span>
              <span className="display numeral" style={{ fontSize: 32 }}>{fmtCurrency(subtotal + tax)}</span>
            </div>
          </div>

          {r.specialRequests && (
            <div className="card" style={{ padding: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Special requests</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--ink-3)' }}>
                {r.specialRequests}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckInPage() {
  const [tab, setTab]               = useState('checkin');
  const [selected, setSelected]     = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: arrivalsData,   loading: arrivalsLoading }   = useApi('/api/reservations/today-arrivals',   { deps: [refreshKey] });
  const { data: departuresData, loading: departuresLoading } = useApi('/api/reservations/today-departures', { deps: [refreshKey] });

  const arrivals   = arrivalsData?.arrivals   || [];
  const departures = departuresData?.departures || [];

  const list      = tab === 'checkin' ? arrivals : departures;
  const loading   = tab === 'checkin' ? arrivalsLoading : departuresLoading;

  function switchTab(t) { setTab(t); setSelected(null); }
  function handleDone()  { setSelected(null); setRefreshKey(k => k + 1); }

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Front desk · {todayLabel()}</div>
          <h1 className="display">Welcome, &amp; <em>au revoir</em>.</h1>
          <p className="sub">
            Confirm identity, allocate keys, and brief the housekeeping team.
            Departures are auto-routed to billing on completion.
          </p>
        </div>
        <div className="switch">
          <button className={tab === 'checkin'  ? 'active' : ''} onClick={() => switchTab('checkin')}>
            Arrivals · {arrivals.length}
          </button>
          <button className={tab === 'checkout' ? 'active' : ''} onClick={() => switchTab('checkout')}>
            Departures · {departures.length}
          </button>
        </div>
      </div>

      {selected ? (
        <CheckInDetail
          reservation={selected}
          mode={tab}
          onBack={() => setSelected(null)}
          onDone={handleDone}
        />
      ) : (
        <CheckInList
          list={list}
          mode={tab}
          onSelect={setSelected}
          loading={loading}
        />
      )}
    </div>
  );
}

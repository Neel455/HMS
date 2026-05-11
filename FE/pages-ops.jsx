// LuxuryStay — operations pages: Dashboard, Reservations, Check-in, Rooms
const D = window.LS_DATA;

// ============ DASHBOARD ============
const DashboardPage = ({ role }) => {
  const m = D.metrics;
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Tuesday · 04 May · 09:14</div>
          <h1 className="display">Good morning, <em>Margaux</em>.</h1>
          <p className="sub">A quiet arrival schedule today. Three VIP turn-downs requested for this evening; the Penthouse reports a lingering thermostat concern.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost"><Icon name="download" size={12} />Export</button>
          <button className="btn btn-primary"><Icon name="plus" size={12} />New reservation</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)" }}>
        <Metric label="Occupancy" value={`${m.occupancy}%`} delta="+4 vs. last week" up />
        <Metric label="ADR" value="€612" delta="+€18 wk-over-wk" up />
        <Metric label="RevPAR" value="€532" delta="−€6 wk-over-wk" />
        <Metric label="In-house guests" value={m.inHouse} delta={`${m.arrivalsToday} arrivals · ${m.departuresToday} departures`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, marginTop: 40 }}>
        <div>
          <SectionHead title="Today's arrivals" caption={`${m.arrivalsToday} expected`} />
          <div className="t-wrap">
            <table className="t">
              <thead><tr><th>Guest</th><th>Room</th><th>Nights</th><th>ETA</th><th></th></tr></thead>
              <tbody>
                {[
                  { g: "Anika Patel", r: "302", n: 4, eta: "14:00", vip: false },
                  { g: "Theodore Greaves", r: "305", n: 5, eta: "16:30", vip: false },
                  { g: "Henrik Bergström", r: "402", n: 7, eta: "17:15", vip: true },
                  { g: "Whitfield-Hayes Family", r: "203", n: 3, eta: "18:00", vip: false },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{row.g.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{row.g}</div>
                          {row.vip && <span className="chip chip-vip" style={{ marginTop: 4 }}><Icon name="crown" size={10} />Étoile</span>}
                        </div>
                      </div>
                    </td>
                    <td className="numeral" style={{ fontSize: 18 }}>{row.r}</td>
                    <td>{row.n}</td>
                    <td><span className="mono">{row.eta}</span></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">Prepare</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHead title="Room status" caption="142 rooms" />
          <div className="card" style={{ padding: 24 }}>
            <OccupancyDonut />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
              <StatusLine color="var(--terracotta)" label="Occupied" value={96} />
              <StatusLine color="var(--sage)" label="Available" value={32} />
              <StatusLine color="var(--brass)" label="Cleaning" value={9} />
              <StatusLine color="var(--plum)" label="Maintenance" value={5} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <SectionHead title="Revenue · last 14 days" caption="€ thousand" />
        <div className="card" style={{ padding: 28 }}>
          <div className="bar-row">
            {[42, 51, 38, 60, 72, 68, 55, 49, 63, 78, 82, 71, 88, 92].map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h}%` }} title={`Day ${i+1}: €${h}k`} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 10, color: "var(--mute)", letterSpacing: "0.1em" }}>
            <span>21 APR</span><span>28 APR</span><span>04 MAY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value, delta, up }) => (
  <div className="metric" style={{ borderRight: "none", borderBottom: "none", borderTop: "none", borderLeft: "none" }}>
    <div className="label">{label}</div>
    <div className="val numeral">{value}</div>
    {delta && <div className={`delta ${up ? "up" : ""}`}>
      {up && <Icon name="arrow_up" size={12} />}
      {delta}
    </div>}
  </div>
);

const SectionHead = ({ title, caption }) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
    <h2 className="display" style={{ fontSize: 28, margin: 0 }}>{title}</h2>
    {caption && <span className="eyebrow">{caption}</span>}
  </div>
);

const StatusLine = ({ color, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
    <span style={{ fontSize: 12, color: "var(--ink-3)", flex: 1 }}>{label}</span>
    <span className="numeral" style={{ fontSize: 18 }}>{value}</span>
  </div>
);

const OccupancyDonut = () => {
  const total = 142;
  const occ = 96, avail = 32, clean = 9, maint = 5;
  const segments = [
    { v: occ, c: "var(--terracotta)" },
    { v: clean, c: "var(--brass)" },
    { v: maint, c: "var(--plum)" },
    { v: avail, c: "var(--sage)" },
  ];
  let offset = 0;
  const r = 60, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
      <svg width="180" height="180" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--hairline-2)" strokeWidth="14" />
        {segments.map((s, i) => {
          const len = (s.v / total) * c;
          const dash = `${len} ${c - len}`;
          const dashoffset = -offset;
          offset += len;
          return <circle key={i} cx="80" cy="80" r={r} fill="none"
            stroke={s.c} strokeWidth="14" strokeDasharray={dash}
            strokeDashoffset={dashoffset} transform="rotate(-90 80 80)" />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="display numeral" style={{ fontSize: 44 }}>87<span style={{ fontSize: 18, color: "var(--mute)" }}>%</span></div>
        <div className="label" style={{ marginTop: 4 }}>Occupied</div>
      </div>
    </div>
  );
};

// ============ RESERVATIONS ============
const ReservationsPage = () => {
  const [view, setView] = useState("calendar");
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Reservations</div>
          <h1 className="display">The <em>book of</em> guests.</h1>
          <p className="sub">Eight reservations active this week. Drag any segment to reassign rooms; click to inspect.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="switch">
            <button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}>Calendar</button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
          </div>
          <button className="btn btn-ghost"><Icon name="filter" size={12} />Filter</button>
          <button className="btn btn-primary"><Icon name="plus" size={12} />New reservation</button>
        </div>
      </div>

      {view === "calendar" ? <ReservationCalendar /> : <ReservationList />}
    </div>
  );
};

const ReservationCalendar = () => {
  const days = ["MON 04", "TUE 05", "WED 06", "THU 07", "FRI 08", "SAT 09", "SUN 10"];
  const rows = [
    { room: "201", type: "Deluxe King", bars: [{ start: 0, len: 3, label: "Mme. Laurent", color: "var(--terracotta-soft)", text: "var(--terracotta)" }] },
    { room: "202", type: "Deluxe King", bars: [] },
    { room: "203", type: "Junior Suite", bars: [{ start: 1, len: 4, label: "Whitfield-Hayes", color: "var(--linen)", text: "var(--ink)" }] },
    { room: "204", type: "Junior Suite", bars: [{ start: 0, len: 2, label: "Mr. Okafor", color: "var(--terracotta-soft)", text: "var(--terracotta)" }, { start: 4, len: 3, label: "C. Holloway", color: "var(--linen)", text: "var(--ink)" }] },
    { room: "206", type: "Deluxe King", bars: [{ start: 0, len: 4, label: "Sato Family", color: "var(--terracotta-soft)", text: "var(--terracotta)" }] },
    { room: "301", type: "Premier Suite", bars: [{ start: 0, len: 6, label: "Lord Ashbury · ÉTOILE", color: "var(--ink)", text: "var(--paper)" }] },
    { room: "302", type: "Deluxe King", bars: [{ start: 1, len: 4, label: "A. Patel", color: "var(--sage-soft)", text: "var(--sage)" }] },
    { room: "304", type: "Junior Suite", bars: [{ start: 0, len: 3, label: "Dr. Vasquez", color: "var(--terracotta-soft)", text: "var(--terracotta)" }] },
    { room: "305", type: "Deluxe Twin", bars: [{ start: 2, len: 5, label: "T. Greaves", color: "var(--sage-soft)", text: "var(--sage)" }] },
    { room: "306", type: "Premier Suite", bars: [{ start: 0, len: 7, label: "Mlle. Beaumont", color: "var(--terracotta-soft)", text: "var(--terracotta)" }] },
    { room: "401", type: "Penthouse", bars: [{ start: 0, len: 5, label: "M. Castellanos", color: "var(--terracotta-soft)", text: "var(--terracotta)" }] },
    { room: "402", type: "Penthouse", bars: [{ start: 3, len: 4, label: "H. Bergström", color: "var(--brass-soft)", text: "var(--brass-deep)" }] },
  ];
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px repeat(7, 1fr)", borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ padding: "14px 20px", borderRight: "1px solid var(--hairline)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mute)" }}>Room</div>
        {days.map((d, i) => (
          <div key={i} style={{ padding: "14px 12px", textAlign: "center", borderRight: i < 6 ? "1px solid var(--hairline-2)" : "none", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: i === 0 ? "var(--brass)" : "var(--mute)", fontWeight: i === 0 ? 600 : 500 }}>{d}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: "180px repeat(7, 1fr)", borderBottom: ri < rows.length - 1 ? "1px solid var(--hairline-2)" : "none", position: "relative", minHeight: 56 }}>
          <div style={{ padding: "14px 20px", borderRight: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 10 }}>
            <span className="numeral" style={{ fontSize: 18 }}>{row.room}</span>
            <span style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{row.type}</span>
          </div>
          {Array.from({ length: 7 }).map((_, di) => (
            <div key={di} style={{ borderRight: di < 6 ? "1px solid var(--hairline-2)" : "none", background: di === 0 ? "rgba(160, 128, 84, 0.03)" : "transparent" }} />
          ))}
          {row.bars.map((b, bi) => (
            <div key={bi} style={{
              position: "absolute",
              left: `calc(180px + ${b.start} * (100% - 180px) / 7 + 4px)`,
              width: `calc(${b.len} * (100% - 180px) / 7 - 8px)`,
              top: 10, bottom: 10,
              background: b.color, color: b.text,
              padding: "0 14px",
              borderRadius: 2,
              display: "flex", alignItems: "center",
              fontSize: 12, fontWeight: 500,
              cursor: "pointer",
              borderLeft: `3px solid ${b.text}`,
            }}>{b.label}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ReservationList = () => (
  <div className="t-wrap">
    <table className="t">
      <thead><tr><th>Reservation</th><th>Guest</th><th>Room</th><th>Arrival</th><th>Departure</th><th>Nights</th><th>Status</th><th>Total</th><th></th></tr></thead>
      <tbody>
        {D.reservations.map(r => (
          <tr key={r.id}>
            <td><span className="mono">{r.id}</span></td>
            <td style={{ fontWeight: 500 }}>{r.guest}</td>
            <td className="numeral" style={{ fontSize: 16 }}>{r.room}</td>
            <td>{r.arrival}</td>
            <td>{r.departure}</td>
            <td>{r.nights}</td>
            <td>
              {r.status === "in-house"
                ? <span className="chip chip-occupied"><span className="chip-dot" />In-house</span>
                : <span className="chip chip-reserved"><span className="chip-dot" />Confirmed</span>}
            </td>
            <td className="numeral">€{r.total.toLocaleString()}</td>
            <td><button className="btn btn-ghost btn-sm">View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============ CHECK-IN / OUT ============
const ARRIVALS = [
  { id: "RS-2848", name: "Henrik Bergström", initials: "HB", room: "402", type: "Penthouse", nights: 7, eta: "17:15", status: "expected", vip: true, source: "Direct", total: 18480, note: "Returning · 4th stay" },
  { id: "RS-2845", name: "Anika Patel", initials: "AP", room: "302", type: "Deluxe King", nights: 4, eta: "14:00", status: "expected", vip: false, source: "Travel Agent", total: 2112, note: "First visit" },
  { id: "RS-2846", name: "Theodore Greaves", initials: "TG", room: "305", type: "Deluxe Twin", nights: 5, eta: "16:30", status: "expected", vip: false, source: "Direct", total: 2530, note: "Anniversary stay" },
  { id: "RS-2849", name: "Whitfield-Hayes Family", initials: "WH", room: "203", type: "Junior Suite", nights: 3, eta: "18:00", status: "arrived", vip: false, source: "Direct", total: 2376, note: "Two children · cot requested" },
  { id: "RS-2850", name: "Mlle. Inès Garnier", initials: "IG", room: "204", type: "Junior Suite", nights: 2, eta: "19:30", status: "expected", vip: false, source: "Concierge", total: 1584, note: "Late dinner reservation 21:00" },
  { id: "RS-2851", name: "Sir Phillip Roe", initials: "PR", room: "306", type: "Premier Suite", nights: 6, eta: "12:45", status: "arrived", vip: true, source: "Direct", total: 8184, note: "Standing pre-arrival flowers" },
];

const DEPARTURES = [
  { id: "RS-2841", name: "Mme. Cécile Laurent", initials: "CL", room: "201", type: "Deluxe King", nights: 4, eta: "11:00", status: "departed", vip: false, source: "Direct", total: 2112, note: "Folio cleared" },
  { id: "RS-2842", name: "Mr. Adebayo Okafor", initials: "AO", room: "204", type: "Junior Suite", nights: 2, eta: "10:30", status: "in-room", vip: false, source: "Concierge", total: 1584, note: "Late check-out approved · 13:00" },
  { id: "RS-2847", name: "Dr. Elena Vasquez", initials: "EV", room: "304", type: "Junior Suite", nights: 5, eta: "12:00", status: "in-room", vip: false, source: "Direct", total: 3960, note: "Awaiting transfer" },
  { id: "RS-2843", name: "Sato Family", initials: "SF", room: "206", type: "Deluxe King", nights: 4, eta: "11:30", status: "in-room", vip: false, source: "Direct", total: 2112, note: "Children · early breakfast" },
];

const CheckinPage = () => {
  const [tab, setTab] = useState("checkin");
  const [selectedId, setSelectedId] = useState(null);
  const list = tab === "checkin" ? ARRIVALS : DEPARTURES;
  const selected = selectedId ? list.find(r => r.id === selectedId) : null;

  const switchTab = (t) => { setTab(t); setSelectedId(null); };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Front desk · 04 May</div>
          <h1 className="display">Welcome, &amp; <em>au revoir</em>.</h1>
          <p className="sub">Confirm identity, allocate keys, and brief the housekeeping team. Departures are auto-routed to billing on completion.</p>
        </div>
        <div className="switch">
          <button className={tab === "checkin" ? "active" : ""} onClick={() => switchTab("checkin")}>Arrivals · {ARRIVALS.length}</button>
          <button className={tab === "checkout" ? "active" : ""} onClick={() => switchTab("checkout")}>Departures · {DEPARTURES.length}</button>
        </div>
      </div>

      {selected ? (
        <CheckinDetail guest={selected} mode={tab} onBack={() => setSelectedId(null)} />
      ) : (
        <CheckinList list={list} mode={tab} onSelect={setSelectedId} />
      )}
    </div>
  );
};

const CheckinList = ({ list, mode, onSelect }) => {
  const isArrival = mode === "checkin";
  const summary = isArrival
    ? [
        { l: "Expected today", v: list.filter(r => r.status === "expected").length },
        { l: "Arrived", v: list.filter(r => r.status === "arrived").length },
        { l: "VIP arrivals", v: list.filter(r => r.vip).length },
        { l: "Avg. stay", v: `${(list.reduce((a, b) => a + b.nights, 0) / list.length).toFixed(1)} nts` },
      ]
    : [
        { l: "Departing today", v: list.length },
        { l: "Still in-room", v: list.filter(r => r.status === "in-room").length },
        { l: "Departed", v: list.filter(r => r.status === "departed").length },
        { l: "Folios open", v: list.filter(r => r.status === "in-room").length },
      ];
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", marginBottom: 28 }}>
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
              <th>{isArrival ? "ETA" : "Departure"}</th>
              <th>Status</th>
              <th>Folio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => {
              const statusChip =
                r.status === "expected" ? <span className="chip chip-reserved"><span className="chip-dot" />Expected</span>
                : r.status === "arrived" ? <span className="chip chip-available"><span className="chip-dot" />Arrived</span>
                : r.status === "in-room" ? <span className="chip chip-occupied"><span className="chip-dot" />In-room</span>
                : <span className="chip chip-cleaning"><span className="chip-dot" />Departed</span>;
              return (
                <tr key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{r.initials}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 500 }}>{r.name}</span>
                          {r.vip && <span className="chip chip-vip"><Icon name="crown" size={10} />Étoile</span>}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--mute)", marginTop: 2 }}>{r.note}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="mono">{r.id}</span><div style={{ fontSize: 10, color: "var(--mute)", marginTop: 2 }}>{r.source}</div></td>
                  <td>
                    <div className="numeral" style={{ fontSize: 18 }}>{r.room}</div>
                    <div style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{r.type}</div>
                  </td>
                  <td>{r.nights}</td>
                  <td><span className="mono">{r.eta}</span></td>
                  <td>{statusChip}</td>
                  <td className="numeral">€{r.total.toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onSelect(r.id); }}>
                      {isArrival
                        ? (r.status === "arrived" ? "View" : "Check in")
                        : (r.status === "departed" ? "View" : "Check out")}
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
};

const CheckinDetail = ({ guest, mode, onBack }) => {
  const isArrival = mode === "checkin";
  const subtotal = guest.total;
  const tax = Math.round(subtotal * 0.1);
  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
        <Icon name="arrow_left" size={12} />Back to {isArrival ? "arrivals" : "departures"}
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <div>
          <div className="card" style={{ padding: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{isArrival ? "Step 2 of 4 · Identity" : "Step 1 of 3 · Departure review"}</div>
            <h2 className="display" style={{ fontSize: 36, margin: "0 0 4px" }}>{guest.name}</h2>
            <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
              {guest.vip && <span className="chip chip-vip"><Icon name="crown" size={10} />Étoile</span>}
              <span className="chip chip-reserved">{guest.id} · {guest.nights} nights</span>
              <span className="chip chip-reserved">{guest.type} {guest.room}</span>
              <span className="chip chip-reserved">Source · {guest.source}</span>
            </div>

            {isArrival ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                  <div className="field"><label>Passport / ID</label><input defaultValue="—" placeholder="Scan or enter" /></div>
                  <div className="field"><label>Nationality</label><input defaultValue="—" /></div>
                  <div className="field"><label>Email</label><input defaultValue={`${guest.initials.toLowerCase()}@example.com`} /></div>
                  <div className="field"><label>Mobile</label><input defaultValue="+33 6 — — —" /></div>
                  <div className="field"><label>Vehicle / Plate</label><input defaultValue="—" /></div>
                  <div className="field"><label>Estimated arrival</label><input defaultValue={`${guest.eta} · By private transfer`} /></div>
                </div>

                <div className="rule"><div className="dot" /></div>

                <div className="eyebrow" style={{ marginBottom: 14 }}>Stay preferences</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
                  {["Down pillow", "Espresso amenities", "Daily Le Monde", "Private dining", "Sea-view side", "No turn-down"].map((p, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--hairline)", borderRadius: 2, fontSize: 12, cursor: "pointer", background: i < 3 ? "var(--linen)" : "transparent" }}>
                      <span style={{ width: 14, height: 14, border: "1px solid var(--ink-3)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", background: i < 3 ? "var(--ink)" : "transparent" }}>
                        {i < 3 && <Icon name="check" size={10} style={{ color: "var(--paper)" }} />}
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
                  <FolioLine d="Room · nightly rate" v={`€${(subtotal/guest.nights).toFixed(0)} × ${guest.nights}`} />
                  <FolioLine d="In-room dining" v="€385" />
                  <FolioLine d="Spa & wellness" v="€220" />
                  <FolioLine d="Bar · cellar" v="€140" />
                  <FolioLine d="Laundry" v="€40" />
                </div>
                <div className="rule"><div className="dot" /></div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Departure check</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {["Mini-bar verified", "Safe emptied", "Keys returned", "Damage assessment", "Lost & found cleared", "Transfer dispatched"].map((p, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--hairline)", borderRadius: 2, fontSize: 12, cursor: "pointer", background: i < 3 ? "var(--linen)" : "transparent" }}>
                      <span style={{ width: 14, height: 14, border: "1px solid var(--ink-3)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", background: i < 3 ? "var(--ink)" : "transparent" }}>
                        {i < 3 && <Icon name="check" size={10} style={{ color: "var(--paper)" }} />}
                      </span>
                      {p}
                    </label>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn btn-ghost" onClick={onBack}><Icon name="arrow_left" size={12} />Cancel</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost">Save draft</button>
                <button className="btn btn-primary">
                  {isArrival ? "Issue keys · Check in" : "Settle folio · Check out"}
                  <Icon name="arrow_right" size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>{isArrival ? "Reservation summary" : "Folio summary"}</div>
            <SummaryRow label="Folio" value={`#${guest.id.replace("RS-", "048")}`} />
            <SummaryRow label="Room" value={`${guest.room} · ${guest.type}`} />
            <SummaryRow label="Stay" value={`${guest.nights} nights`} />
            <SummaryRow label="Subtotal" value={`€${subtotal.toLocaleString()}`} />
            <SummaryRow label="Tax (10%)" value={`€${tax.toLocaleString()}`} />
            <div style={{ borderTop: "1px solid var(--hairline)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="label">Total due</span>
              <span className="display numeral" style={{ fontSize: 32 }}>€{(subtotal + tax).toLocaleString()}</span>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Concierge notes</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--ink-3)" }}>
              {guest.note}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FolioLine = ({ d, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, color: "var(--ink-3)" }}>
    <span>{d}</span>
    <span className="mono">{v}</span>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
    <span style={{ color: "var(--mute)" }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value}</span>
  </div>
);

// ============ ROOMS ============
const RoomsPage = () => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? D.rooms : D.rooms.filter(r => r.status === filter);
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Rooms</div>
          <h1 className="display">A <em>floor-by-floor</em> view.</h1>
          <p className="sub">Live status across 142 rooms. Updates from housekeeping and maintenance flow here in real time.</p>
        </div>
        <div className="switch">
          {[
            { id: "all", label: "All · 142" },
            { id: "occupied", label: "Occupied · 96" },
            { id: "available", label: "Available · 32" },
            { id: "cleaning", label: "Cleaning · 9" },
            { id: "maintenance", label: "Maint · 5" },
          ].map(b => (
            <button key={b.id} className={filter === b.id ? "active" : ""} onClick={() => setFilter(b.id)}>{b.label}</button>
          ))}
        </div>
      </div>

      {[2, 3, 4].map(floor => {
        const f = filtered.filter(r => r.floor === floor);
        if (!f.length) return null;
        return (
          <div key={floor} style={{ marginBottom: 36 }}>
            <SectionHead title={`${floor === 2 ? "Second" : floor === 3 ? "Third" : "Fourth"} floor`} caption={`${f.length} rooms`} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {f.map(r => <RoomCard key={r.num} room={r} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RoomCard = ({ room }) => {
  const statusMap = {
    occupied: { chip: "chip-occupied", label: "Occupied" },
    available: { chip: "chip-available", label: "Available" },
    cleaning: { chip: "chip-cleaning", label: "Cleaning" },
    maintenance: { chip: "chip-maintenance", label: "Maintenance" },
  };
  const s = statusMap[room.status];
  return (
    <div className="card" style={{ padding: 20, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="display numeral" style={{ fontSize: 40, lineHeight: 1 }}>{room.num}</div>
          <div className="label" style={{ marginTop: 4 }}>{room.type}</div>
        </div>
        <span className={`chip ${s.chip}`}><span className="chip-dot" />{s.label}</span>
      </div>
      <div style={{ height: 1, background: "var(--hairline-2)", margin: "16px 0" }} />
      <div style={{ minHeight: 38 }}>
        {room.guest ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{room.guest}</div>
            <div style={{ fontSize: 11, color: "var(--mute)", marginTop: 2 }}>Departs {room.checkout}</div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: "var(--mute)", fontStyle: "italic" }}>
            {room.status === "cleaning" && "Awaiting turn-down — 11:30"}
            {room.status === "maintenance" && "AC repair scheduled · Tomás R."}
            {room.status === "available" && "Ready for arrival"}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--hairline-2)" }}>
        <span className="numeral" style={{ fontSize: 16 }}>€{room.rate}<span style={{ fontSize: 10, color: "var(--mute)", marginLeft: 4 }}>/ NIGHT</span></span>
        <button className="btn btn-ghost btn-sm">Manage</button>
      </div>
    </div>
  );
};

Object.assign(window, { DashboardPage, ReservationsPage, CheckinPage, RoomsPage });

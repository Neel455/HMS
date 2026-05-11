// LuxuryStay — admin pages: Analytics, Staff, Settings
const DA = window.LS_DATA;

// ============ ANALYTICS ============
const AnalyticsPage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Analytics · Q2 2026</div>
        <h1 className="display">Patterns, <em>by season.</em></h1>
        <p className="sub">Forecasted occupancy for the summer high season is tracking +6 points above last year. Premier Suites continue to lead growth.</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div className="switch">
          <button>Day</button><button>Week</button><button className="active">Month</button><button>Year</button>
        </div>
        <button className="btn btn-ghost"><Icon name="download" size={12} />Export PDF</button>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", marginBottom: 32 }}>
      <Mini label="Total revenue · YTD" value="€4.82M" />
      <Mini label="Avg. occupancy" value="84%" />
      <Mini label="Repeat-guest rate" value="38%" />
      <Mini label="NPS" value="+72" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32, marginBottom: 36 }}>
      <div>
        <SectionHead title="Occupancy forecast · 6 months" caption="vs. last year" />
        <div className="card" style={{ padding: 28 }}>
          <ForecastChart />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mute)" }}>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--hairline-2)" }}>
            <Legend color="var(--ink)" label="2026 forecast" />
            <Legend color="var(--brass-soft)" label="2025 actual" />
            <Legend color="var(--hairline)" label="Booked already" dashed />
          </div>
        </div>
      </div>

      <div>
        <SectionHead title="Revenue by category" caption="this month" />
        <div className="card" style={{ padding: 28 }}>
          {[
            { label: "Rooms", val: 412, pct: 68, c: "var(--ink)" },
            { label: "Dining", val: 92, pct: 15, c: "var(--brass)" },
            { label: "Spa", val: 56, pct: 9, c: "var(--sage)" },
            { label: "Bar &amp; cellar", val: 31, pct: 5, c: "var(--terracotta)" },
            { label: "Other", val: 18, pct: 3, c: "var(--mute-2)" },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: row.label }} />
                <span className="numeral" style={{ fontSize: 18 }}>€{row.val}k</span>
              </div>
              <div style={{ height: 4, background: "var(--hairline-2)", position: "relative" }}>
                <div style={{ height: "100%", width: `${row.pct}%`, background: row.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Top room types</div>
        {[
          { t: "Premier Suite", o: "92%", r: "€1,240" },
          { t: "Penthouse", o: "84%", r: "€2,400" },
          { t: "Junior Suite", o: "88%", r: "€720" },
          { t: "Deluxe King", o: "81%", r: "€480" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--hairline-2)" : "none" }}>
            <span style={{ fontSize: 13 }}>{r.t}</span>
            <div style={{ display: "flex", gap: 16 }}>
              <span className="numeral" style={{ fontSize: 14, color: "var(--mute)" }}>{r.o}</span>
              <span className="numeral" style={{ fontSize: 14 }}>{r.r}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Booking source</div>
        {[
          { s: "Direct · website", p: 52 },
          { s: "Concierge / agent", p: 21 },
          { s: "Repeat guest", p: 18 },
          { s: "Travel partners", p: 9 },
        ].map((r, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>{r.s}</span><span className="mono">{r.p}%</span>
            </div>
            <div style={{ height: 3, background: "var(--hairline-2)" }}>
              <div style={{ height: "100%", width: `${r.p}%`, background: "var(--brass)" }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Guest origin</div>
        {[
          { c: "France", p: 28 },
          { c: "United Kingdom", p: 22 },
          { c: "United States", p: 18 },
          { c: "Germany", p: 11 },
          { c: "Other", p: 21 },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--hairline-2)" : "none", fontSize: 12 }}>
            <span>{r.c}</span>
            <span className="mono">{r.p}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Legend = ({ color, label, dashed }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--ink-3)" }}>
    <div style={{ width: 24, height: 2, background: dashed ? "transparent" : color, borderTop: dashed ? `1px dashed ${color}` : "none" }} />
    <span dangerouslySetInnerHTML={{ __html: label }} />
  </div>
);

const ForecastChart = () => {
  // generate two SVG lines
  const w = 600, h = 180;
  const last = [62, 71, 84, 88, 78, 65];
  const fc =   [68, 78, 91, 94, 84, 72];
  const booked = [44, 38, 28, 12, 4, 0];
  const path = (vals) => vals.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (vals.length - 1)) * w} ${h - (v / 100) * h}`).join(" ");
  const area = (vals) => path(vals) + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="180" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((g, i) => (
        <line key={i} x1="0" x2={w} y1={h * g} y2={h * g} stroke="var(--hairline-2)" strokeWidth="1" strokeDasharray="2 4" />
      ))}
      <path d={area(last)} fill="var(--brass-soft)" opacity="0.3" />
      <path d={path(last)} stroke="var(--brass)" strokeWidth="1.5" fill="none" />
      <path d={path(fc)} stroke="var(--ink)" strokeWidth="2" fill="none" />
      <path d={path(booked)} stroke="var(--ink-3)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
      {fc.map((v, i) => (
        <circle key={i} cx={(i / (fc.length - 1)) * w} cy={h - (v / 100) * h} r="3" fill="var(--ink)" />
      ))}
    </svg>
  );
};

// ============ STAFF ============
const StaffPage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Staff &amp; roles</div>
        <h1 className="display">The <em>house</em>.</h1>
        <p className="sub">42 active staff across six departments. Role permissions cascade through the system; revoke access at any time.</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost"><Icon name="filter" size={12} />Filter</button>
        <button className="btn btn-primary"><Icon name="plus" size={12} />Add staff</button>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
      <div className="t-wrap">
        <table className="t">
          <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Since</th><th></th></tr></thead>
          <tbody>
            {DA.staff.map((s, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar">{s.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: "var(--mute)" }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>{s.role}</td>
                <td><span className="chip chip-reserved">{s.dept}</span></td>
                <td>
                  {s.status === "active"
                    ? <span className="chip chip-available"><span className="chip-dot" />Active</span>
                    : <span className="chip chip-cleaning"><span className="chip-dot" />On leave</span>}
                </td>
                <td className="mono">{s.since}</td>
                <td><button className="btn btn-ghost btn-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <SectionHead title="Role permissions" caption="Receptionist" />
        <div className="card" style={{ padding: 24 }}>
          <p style={{ margin: "0 0 18px", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
            Grants front-desk access to reservations, check-in/out, billing, and guest records. Cannot view analytics or staff records.
          </p>
          {[
            { p: "View reservations", on: true },
            { p: "Create / edit reservations", on: true },
            { p: "Check-in / check-out guests", on: true },
            { p: "View &amp; print folios", on: true },
            { p: "Charge guest cards", on: true },
            { p: "Apply discounts &gt; 10%", on: false },
            { p: "View housekeeping board", on: true },
            { p: "Edit housekeeping tasks", on: false },
            { p: "View analytics", on: false },
            { p: "Manage staff &amp; roles", on: false },
            { p: "System settings", on: false },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 10 ? "1px solid var(--hairline-2)" : "none" }}>
              <span style={{ fontSize: 12 }} dangerouslySetInnerHTML={{ __html: p.p }} />
              <Toggle on={p.on} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Toggle = ({ on }) => (
  <div style={{ width: 32, height: 18, borderRadius: 10, background: on ? "var(--ink)" : "var(--hairline)", position: "relative", transition: "background 0.15s" }}>
    <div style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: "50%", background: "var(--paper)", transition: "left 0.15s" }} />
  </div>
);

// ============ SETTINGS ============
const SettingsPage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>System settings</div>
        <h1 className="display">House <em>rules.</em></h1>
        <p className="sub">Property configuration, rates, taxes, and operational policies. Changes are versioned and auditable.</p>
      </div>
      <button className="btn btn-primary">Save changes</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40 }}>
      <nav style={{ position: "sticky", top: 90, alignSelf: "start" }}>
        {["Property", "Room rates", "Taxes &amp; fees", "Policies", "Notifications", "Integrations", "Audit log"].map((s, i) => (
          <div key={i} style={{ padding: "10px 0", fontSize: 12, color: i === 0 ? "var(--ink)" : "var(--mute)", fontWeight: i === 0 ? 600 : 400, borderLeft: i === 0 ? "2px solid var(--brass)" : "2px solid transparent", paddingLeft: 14, cursor: "pointer", letterSpacing: "0.04em" }}
            dangerouslySetInnerHTML={{ __html: s }} />
        ))}
      </nav>

      <div>
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 6px" }}>Property</h3>
          <p style={{ margin: "0 0 24px", fontSize: 12, color: "var(--mute)" }}>Identity displayed on folios, emails, and the guest portal.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="field"><label>Property name</label><input defaultValue="LuxuryStay · Maison Étoile" /></div>
            <div className="field"><label>Property code</label><input defaultValue="LSME-CDA-01" /></div>
            <div className="field"><label>Address</label><input defaultValue="14 Promenade des Anglais" /></div>
            <div className="field"><label>City / region</label><input defaultValue="Nice · Côte d'Azur" /></div>
            <div className="field"><label>Currency</label><input defaultValue="EUR · €" /></div>
            <div className="field"><label>Time zone</label><input defaultValue="Europe / Paris (CET)" /></div>
          </div>
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 6px" }}>Room rates</h3>
          <p style={{ margin: "0 0 24px", fontSize: 12, color: "var(--mute)" }}>Default nightly rates by category. Seasonal modifiers cascade automatically.</p>
          <table className="t" style={{ background: "transparent" }}>
            <thead><tr style={{ background: "var(--linen)" }}><th>Category</th><th>Low</th><th>Standard</th><th>High</th><th>Peak</th></tr></thead>
            <tbody>
              {[
                ["Deluxe Twin", 380, 460, 540, 620],
                ["Deluxe King", 400, 480, 560, 640],
                ["Junior Suite", 620, 720, 840, 980],
                ["Premier Suite", 1080, 1240, 1440, 1680],
                ["Penthouse", 2100, 2400, 2800, 3200],
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r[0]}</td>
                  {r.slice(1).map((v, j) => (
                    <td key={j} className="numeral">€{v.toLocaleString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 6px" }}>Policies</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 }}>
            {[
              { l: "Check-in time", v: "15:00" },
              { l: "Check-out time", v: "12:00" },
              { l: "Cancellation window", v: "72 hours" },
              { l: "Deposit on booking", v: "30%" },
              { l: "Children policy", v: "Welcome · under 12 free" },
              { l: "Pets policy", v: "Small pets · €40 / stay" },
            ].map((row, i) => (
              <div key={i} className="field"><label>{row.l}</label><input defaultValue={row.v} /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { AnalyticsPage, StaffPage, SettingsPage });

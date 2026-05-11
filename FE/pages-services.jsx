// LuxuryStay — service pages: Housekeeping, Maintenance, Billing, Guests, Feedback
const DS = window.LS_DATA;

// ============ HOUSEKEEPING ============
const HousekeepingPage = () => {
  const cols = [
    { id: "queued", label: "Queued", count: 5 },
    { id: "in-progress", label: "In progress", count: 2 },
    { id: "done", label: "Completed today", count: 14 },
  ];
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Housekeeping · 04 May</div>
          <h1 className="display">The <em>pristine</em> board.</h1>
          <p className="sub">Five tasks queued for the morning rotation. High-priority departures are tagged for first attention.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost"><Icon name="filter" size={12} />Filter</button>
          <button className="btn btn-primary"><Icon name="plus" size={12} />Assign task</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {cols.map(c => (
          <div key={c.id}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" }}>
              <h3 className="display" style={{ fontSize: 22, margin: 0 }}>{c.label}</h3>
              <span className="eyebrow">{c.count}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DS.housekeeping.filter(t => t.status === c.id).map((t, i) => (
                <HousekeepingCard key={i} task={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HousekeepingCard = ({ task }) => {
  const priority = {
    high: { color: "var(--terracotta)", label: "High" },
    med: { color: "var(--brass)", label: "Medium" },
    low: { color: "var(--mute)", label: "Low" },
  }[task.priority];
  const done = task.status === "done";
  return (
    <div className="card" style={{ padding: 18, opacity: done ? 0.55 : 1, position: "relative", borderLeft: `3px solid ${priority.color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="display numeral" style={{ fontSize: 28, lineHeight: 1 }}>{task.room}</div>
        <span style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: priority.color, fontWeight: 600 }}>{priority.label}</span>
      </div>
      <div style={{ fontSize: 13, marginTop: 8, fontWeight: 500, textDecoration: done ? "line-through" : "none" }}>{task.task}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--hairline-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>
            {task.assigned.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{task.assigned}</span>
        </div>
        <span className="mono" style={{ color: "var(--mute)" }}>{task.eta}</span>
      </div>
    </div>
  );
};

// ============ MAINTENANCE ============
const MaintenancePage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Maintenance · open requests</div>
        <h1 className="display">Quietly <em>kept.</em></h1>
        <p className="sub">Two active requests, one resolved in the last 24 hours. The Penthouse 401 thermostat will receive a follow-up this afternoon.</p>
      </div>
      <button className="btn btn-primary"><Icon name="plus" size={12} />New request</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", marginBottom: 32 }}>
      <Mini label="Open" value="2" />
      <Mini label="In progress" value="2" />
      <Mini label="Resolved · today" value="3" />
      <Mini label="Avg. resolution" value="4.2h" />
    </div>

    <div className="t-wrap">
      <table className="t">
        <thead><tr><th>ID</th><th>Location</th><th>Issue</th><th>Reported</th><th>Priority</th><th>Assigned</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {DS.maintenance.map(m => (
            <tr key={m.id}>
              <td><span className="mono">{m.id}</span></td>
              <td className="numeral" style={{ fontSize: 16 }}>{m.room}</td>
              <td style={{ fontWeight: 500, maxWidth: 280 }}>{m.issue}</td>
              <td><span className="mono" style={{ color: "var(--mute)" }}>{m.reported}</span></td>
              <td>
                <span style={{ fontSize: 11, color: m.priority === "high" ? "var(--terracotta)" : m.priority === "med" ? "var(--brass)" : "var(--mute)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {m.priority}
                </span>
              </td>
              <td>{m.assigned}</td>
              <td>
                {m.status === "open" && <span className="chip chip-reserved"><span className="chip-dot" />Open</span>}
                {m.status === "in-progress" && <span className="chip chip-cleaning"><span className="chip-dot" />In progress</span>}
                {m.status === "resolved" && <span className="chip chip-available"><span className="chip-dot" />Resolved</span>}
              </td>
              <td><button className="btn btn-ghost btn-sm">Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Mini = ({ label, value }) => (
  <div style={{ background: "var(--paper)", padding: "20px 24px" }}>
    <div className="label" style={{ marginBottom: 8 }}>{label}</div>
    <div className="display numeral" style={{ fontSize: 36, lineHeight: 1 }}>{value}</div>
  </div>
);

// ============ BILLING ============
const BillingPage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Billing · folios &amp; invoices</div>
        <h1 className="display">The <em>ledger.</em></h1>
        <p className="sub">€18,200 in draft folios awaiting departure approval. Outstanding balances flagged in terracotta.</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost"><Icon name="download" size={12} />Export ledger</button>
        <button className="btn btn-primary"><Icon name="plus" size={12} />New invoice</button>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32 }}>
      <div>
        <SectionHead title="Recent invoices" />
        <div className="t-wrap">
          <table className="t">
            <thead><tr><th>Invoice</th><th>Guest</th><th>Room</th><th>Issued</th><th>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {DS.invoices.map(inv => (
                <tr key={inv.id}>
                  <td><span className="mono">{inv.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{inv.guest}</td>
                  <td className="numeral" style={{ fontSize: 16 }}>{inv.room}</td>
                  <td>{inv.issued}</td>
                  <td className="numeral" style={{ fontSize: 16 }}>€{inv.amount.toLocaleString()}</td>
                  <td>
                    {inv.status === "paid" && <span className="chip chip-available"><span className="chip-dot" />Paid</span>}
                    {inv.status === "open" && <span className="chip chip-occupied"><span className="chip-dot" />Outstanding</span>}
                    {inv.status === "draft" && <span className="chip chip-reserved"><span className="chip-dot" />Draft</span>}
                  </td>
                  <td><button className="btn btn-ghost btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionHead title="Folio · 04822" caption="Lord Ashbury" />
        <div className="card" style={{ padding: 28 }}>
          <div className="ornament">· · ·</div>
          <div style={{ textAlign: "center", margin: "16px 0 24px" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic" }}>LuxuryStay</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>Maison Étoile · Côte d'Azur</div>
          </div>
          <div className="rule"><div className="dot" /></div>
          <FolioRow desc="Premier Suite 301 · 7 nights" amount="8,680.00" />
          <FolioRow desc="Spa · La Mer ritual" amount="420.00" />
          <FolioRow desc="In-room dining · 04 May" amount="285.00" />
          <FolioRow desc="Wine cellar · Krug Grande" amount="640.00" />
          <FolioRow desc="Laundry &amp; pressing" amount="95.00" />
          <FolioRow desc="Transfer · Nice airport" amount="180.00" />
          <div className="rule"><div className="dot" /></div>
          <FolioRow desc="Subtotal" amount="10,300.00" muted />
          <FolioRow desc="Tourist tax (€5/night)" amount="35.00" muted />
          <FolioRow desc="VAT (10%)" amount="1,033.50" muted />
          <div style={{ borderTop: "1px solid var(--ink)", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Total due</span>
            <span className="display numeral" style={{ fontSize: 36 }}>€11,368<span style={{ fontSize: 18 }}>.50</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }}><Icon name="mail" size={12} />Email</button>
            <button className="btn btn-primary" style={{ flex: 1 }}>Charge card</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FolioRow = ({ desc, amount, muted }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, color: muted ? "var(--mute)" : "var(--ink)" }}>
    <span dangerouslySetInnerHTML={{ __html: desc }} />
    <span className="mono">€{amount}</span>
  </div>
);

// ============ GUESTS ============
const GuestsPage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Guest registry</div>
        <h1 className="display">A <em>familiar</em> face.</h1>
        <p className="sub">2,418 known guests. Étoile-tier members are invited to the autumn vintners' gala.</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost"><Icon name="download" size={12} />Export</button>
        <button className="btn btn-primary"><Icon name="plus" size={12} />New guest</button>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
      <div>
        <div className="t-wrap">
          <table className="t">
            <thead><tr><th>Guest</th><th>Country</th><th>Tier</th><th>Visits</th><th>Lifetime</th><th>Room</th></tr></thead>
            <tbody>
              {DS.guests.map((g, i) => (
                <tr key={i} style={i === 0 ? { background: "var(--linen)" } : {}}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="avatar">{g.name.split(" ").slice(-1)[0][0]}</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{g.name}</div>
                        <div style={{ fontSize: 10, color: "var(--mute)", marginTop: 2 }}>{g.note}</div>
                      </div>
                    </div>
                  </td>
                  <td>{g.country}</td>
                  <td>
                    {g.tier === "Étoile" && <span className="chip chip-vip"><Icon name="crown" size={10} />Étoile</span>}
                    {g.tier === "Or" && <span className="chip chip-cleaning">Or</span>}
                    {g.tier === "Argent" && <span className="chip chip-reserved">Argent</span>}
                  </td>
                  <td className="numeral" style={{ fontSize: 16 }}>{g.visits}</td>
                  <td className="numeral">€{g.lifetime.toLocaleString()}</td>
                  <td className="numeral" style={{ fontSize: 16 }}>{g.room || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
            <div className="avatar avatar-lg">A</div>
            <div>
              <h2 className="display" style={{ fontSize: 26, margin: 0 }}>Lord Ashbury</h2>
              <div style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
                United Kingdom · Étoile member
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <span className="chip chip-vip"><Icon name="crown" size={10} />Étoile</span>
                <span className="chip chip-reserved">In-house · 301</span>
              </div>
            </div>
          </div>
          <div className="rule"><div className="dot" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Stat label="Total visits" value="14" />
            <Stat label="Lifetime spend" value="€52,400" />
            <Stat label="Avg. stay" value="6.2 nights" />
            <Stat label="Last visit" value="Mar 2026" />
          </div>
          <div className="rule"><div className="dot" /></div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Standing preferences</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 13, color: "var(--ink-3)" }}>
            <li style={{ padding: "6px 0", borderBottom: "1px solid var(--hairline-2)" }}>· Earl Grey at 6:30am, with shortbread</li>
            <li style={{ padding: "6px 0", borderBottom: "1px solid var(--hairline-2)" }}>· Premier Suite, sea-view side, high floor</li>
            <li style={{ padding: "6px 0", borderBottom: "1px solid var(--hairline-2)" }}>· Times of London on the breakfast tray</li>
            <li style={{ padding: "6px 0" }}>· No turn-down service after 8pm</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div>
    <div className="label" style={{ marginBottom: 6 }}>{label}</div>
    <div className="display numeral" style={{ fontSize: 22 }}>{value}</div>
  </div>
);

// ============ FEEDBACK ============
const FeedbackPage = () => (
  <div>
    <div className="page-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Guest feedback</div>
        <h1 className="display">In their <em>own words.</em></h1>
        <p className="sub">An average rating of 4.8 across 312 reviews this quarter. One thermostat note flagged for engineering follow-up.</p>
      </div>
      <button className="btn btn-ghost"><Icon name="download" size={12} />Export</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", marginBottom: 36 }}>
      <Mini label="Avg. rating" value="4.8" />
      <Mini label="Reviews · Q2" value="312" />
      <Mini label="NPS" value="+72" />
      <Mini label="Action items" value="3" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
      {DS.feedback.map((f, i) => (
        <div key={i} className="card" style={{ padding: 28, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar">{f.guest[0]}</div>
              <div>
                <div style={{ fontWeight: 500 }}>{f.guest}</div>
                <div style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Room {f.room} · {f.date}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 2, color: "var(--brass)" }}>
              {Array.from({ length: 5 }).map((_, si) => (
                <Icon key={si} name="star" size={14} style={{ fill: si < f.rating ? "var(--brass)" : "transparent" }} />
              ))}
            </div>
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.35, fontStyle: "italic", color: "var(--ink)", textWrap: "pretty" }}>
            "{f.comment}"
          </div>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, { HousekeepingPage, MaintenancePage, BillingPage, GuestsPage, FeedbackPage, SectionHead, Mini });

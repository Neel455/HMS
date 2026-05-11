// LuxuryStay — public/guest experience: shared shell + cohesive flow
// Landing → Suites → Booking → Confirmation → My Stay → Contact
const DG = window.LS_DATA;

// ============ SHARED PUBLIC SHELL ============
const PublicShell = ({ page, setPage, children, guest, setGuest, dark = false }) => {
  const navItems = [
    { id: "landing", label: "The House" },
    { id: "suites", label: "Suites" },
    { id: "book", label: "Reserve" },
    { id: "stay", label: "My Stay" },
    { id: "contact", label: "Contact" },
  ];
  const fg = dark ? "var(--ivory)" : "var(--ink)";
  const muted = dark ? "var(--mute-2)" : "var(--mute)";
  const border = dark ? "rgba(247, 243, 236, 0.12)" : "var(--hairline-2)";
  return (
    <div style={{ background: dark ? "var(--ink)" : "var(--ivory)", minHeight: "100vh", color: fg }}>
      <header style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        padding: "26px 64px", borderBottom: `1px solid ${border}`,
        position: "sticky", top: 0, background: dark ? "var(--ink)" : "var(--ivory)", zIndex: 10
      }}>
        <div onClick={() => setPage("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 26, fontStyle: "italic" }}>Luxury</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "0.04em" }}>STAY</span>
        </div>
        <nav style={{ display: "flex", gap: 36, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", justifyContent: "center" }}>
          {navItems.map(item => (
            <a key={item.id} onClick={() => setPage(item.id)} style={{
              cursor: "pointer", color: page === item.id ? fg : muted,
              borderBottom: page === item.id ? `1px solid ${fg}` : "1px solid transparent",
              paddingBottom: 4, transition: "color 0.15s"
            }}>{item.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", alignItems: "center" }}>
          {guest ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, background: "var(--brass)", color: "var(--paper)" }}>{guest.initials}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.06em", color: fg }}>
                {guest.name}
                <a onClick={() => setGuest(null)} style={{ display: "block", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, cursor: "pointer", marginTop: 2 }}>Sign out</a>
              </div>
            </div>
          ) : (
            <a onClick={() => setPage("signin")} style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, cursor: "pointer" }}>Sign in</a>
          )}
          <button className={dark ? "btn btn-brass btn-sm" : "btn btn-primary btn-sm"} onClick={() => setPage("book")}>
            Reserve <Icon name="arrow_right" size={10} />
          </button>
        </div>
      </header>
      {children}
      <PublicFooter />
    </div>
  );
};

const PublicFooter = () => (
  <footer style={{ background: "var(--ink)", color: "var(--ivory)", padding: "60px 64px 36px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
      <div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 28 }}><em>Luxury</em>STAY</div>
        <p style={{ fontSize: 12, color: "var(--mute-2)", marginTop: 16, maxWidth: 320, lineHeight: 1.6 }}>
          Maison Étoile · 14 Promenade des Anglais, 06000 Nice, France. A member of Leading Hotels of the World.
        </p>
      </div>
      {[
        { h: "House", l: ["About", "Press", "Careers", "Sustainability"] },
        { h: "Stay", l: ["Suites", "Dining", "Spa", "Events"] },
        { h: "Guest", l: ["Reservations", "Concierge", "Gift cards", "Sign in"] },
      ].map((c, i) => (
        <div key={i}>
          <div className="eyebrow" style={{ color: "var(--brass-soft)", marginBottom: 16 }}>{c.h}</div>
          {c.l.map(item => <div key={item} style={{ fontSize: 13, color: "var(--mute-2)", padding: "4px 0", cursor: "pointer" }}>{item}</div>)}
        </div>
      ))}
    </div>
    <div style={{ borderTop: "1px solid #4A443B", paddingTop: 24, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mute)", display: "flex", justifyContent: "space-between" }}>
      <span>© MMXXVI LuxuryStay Hospitality</span>
      <span>Privacy · Terms · Press</span>
    </div>
  </footer>
);

// ============ LANDING ============
const LandingPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="landing" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "100px 64px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 24 }}>EST. MCMXXIV · Côte d'Azur</div>
        <h1 className="display" style={{ fontSize: 100, margin: "0 0 28px", lineHeight: 0.95 }}>
          The art of <em>arriving</em>,<br />and never quite<br />leaving.
        </h1>
        <p style={{ fontSize: 17, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 480, marginBottom: 36, textWrap: "pretty" }}>
          A century of hospitality on the Mediterranean coast. Forty-two suites, three restaurants, one spa carved from sea-stone. Each stay is composed, not booked.
        </p>
        <div style={{ display: "flex", gap: 14 }}>
          <button className="btn btn-primary" onClick={() => setPage("book")} style={{ padding: "14px 28px" }}>
            Reserve your stay <Icon name="arrow_right" size={12} />
          </button>
          <button className="btn btn-ghost" onClick={() => setPage("suites")} style={{ padding: "14px 28px" }}>Explore the suites</button>
        </div>
      </div>
      <div style={{ aspectRatio: "4/5", background: "linear-gradient(160deg, #2A2620 0%, #4A443B 50%, #806339 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 70%, rgba(247, 243, 236, 0.12), transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, color: "var(--ivory)" }}>
          <div className="eyebrow" style={{ color: "var(--brass-soft)", marginBottom: 8 }}>The Penthouse</div>
          <div className="display display-italic" style={{ fontSize: 32 }}>From €2,400 / night</div>
        </div>
        <div style={{ position: "absolute", top: 32, right: 32, fontFamily: "var(--serif)", fontSize: 60, fontStyle: "italic", color: "rgba(247, 243, 236, 0.15)", lineHeight: 1 }}>★</div>
      </div>
    </section>

    <section style={{ padding: "0 64px 80px" }}>
      <div className="rule"><div className="dot" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", marginTop: 48 }}>
        {[{ l: "Founded", v: "1924" }, { l: "Suites", v: "42" }, { l: "Michelin stars", v: "★★" }, { l: "Returning guests", v: "62%" }].map((s, i) => (
          <div key={i} style={{ background: "var(--paper)", padding: "32px 28px", textAlign: "center" }}>
            <div className="display numeral" style={{ fontSize: 52, lineHeight: 1 }}>{s.v}</div>
            <div className="label" style={{ marginTop: 10 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: "60px 64px 100px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
        <h2 className="display" style={{ fontSize: 56, margin: 0 }}>The <em>suites.</em></h2>
        <a onClick={() => setPage("suites")} style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid var(--ink)", cursor: "pointer" }}>View all →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {[
          { name: "Deluxe King", from: "€480", grad: "linear-gradient(160deg, #EFE8DB, #C9AE82)" },
          { name: "Junior Suite", from: "€720", grad: "linear-gradient(160deg, #C9AE82, #806339)" },
          { name: "Premier Suite", from: "€1,240", grad: "linear-gradient(160deg, #806339, #2A2620)" },
        ].map((s, i) => (
          <div key={i} onClick={() => setPage("book")} style={{ cursor: "pointer" }}>
            <div style={{ aspectRatio: "1", background: s.grad, marginBottom: 16, position: "relative" }}>
              <div style={{ position: "absolute", top: 20, left: 20, fontFamily: "var(--serif)", fontSize: 80, fontStyle: "italic", color: "rgba(247, 243, 236, 0.2)", lineHeight: 0.8 }}>0{i + 1}</div>
            </div>
            <h3 className="display" style={{ fontSize: 28, margin: "0 0 4px" }}>{s.name}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
              <span className="label">From {s.from} / night</span>
              <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid var(--ink)" }}>Reserve →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  </PublicShell>
);

// ============ SUITES ============
const SuitesPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="suites" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "80px 64px 40px", maxWidth: 1280, margin: "0 auto" }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>The accommodations</div>
      <h1 className="display" style={{ fontSize: 84, margin: "0 0 24px", lineHeight: 0.95, maxWidth: 900 }}>
        Forty-two rooms, <em>each composed</em> by hand.
      </h1>
      <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 600, marginBottom: 64 }}>
        Five categories. Walnut joinery, linens from Florence, marble bathrooms drawn from the Carrara quarries. No two suites are identical.
      </p>
    </section>

    <section style={{ padding: "0 64px 100px", maxWidth: 1280, margin: "0 auto" }}>
      {[
        { n: "Deluxe Twin", from: 460, sqm: 28, grad: "linear-gradient(140deg, #EFE8DB, #C9AE82)", desc: "Twin beds for travel companions or family. Garden-side aspect, full marble bathroom, walk-in shower." },
        { n: "Deluxe King", from: 480, sqm: 32, grad: "linear-gradient(140deg, #C9AE82, #A08054)", desc: "Our signature category. King bed, sitting nook, French balcony with views over the gardens or Promenade." },
        { n: "Junior Suite", from: 720, sqm: 48, grad: "linear-gradient(140deg, #A08054, #806339)", desc: "Generous proportions, separate sitting area, soaking tub overlooking the sea. Espresso service standard." },
        { n: "Premier Suite", from: 1240, sqm: 76, grad: "linear-gradient(140deg, #806339, #4A443B)", desc: "Two-bedroom configuration available. Private terrace, dressing room, dedicated butler service." },
        { n: "Penthouse", from: 2400, sqm: 180, grad: "linear-gradient(140deg, #4A443B, #1A1814)", desc: "The crown of the house. Wraparound terrace with plunge pool, dining for ten, panoramic Mediterranean views." },
      ].map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1.2fr" : "1.2fr 1fr", gap: 60, alignItems: "center", padding: "60px 0", borderTop: i > 0 ? "1px solid var(--hairline-2)" : "none" }}>
          <div style={{ order: i % 2, aspectRatio: "4/3", background: s.grad, position: "relative" }}>
            <div style={{ position: "absolute", top: 24, left: 24, fontFamily: "var(--serif)", fontSize: 96, fontStyle: "italic", color: "rgba(247, 243, 236, 0.18)", lineHeight: 0.9 }}>0{i + 1}</div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Category 0{i + 1} · {s.sqm} m²</div>
            <h2 className="display" style={{ fontSize: 56, margin: "0 0 18px", lineHeight: 1 }}>{s.n}</h2>
            <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>{s.desc}</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
              <span className="chip chip-reserved"><Icon name="wifi" size={10} />Fibre Wi-Fi</span>
              <span className="chip chip-reserved"><Icon name="coffee" size={10} />Espresso</span>
              <span className="chip chip-reserved"><Icon name="spa" size={10} />Bath ritual</span>
              {s.from >= 720 && <span className="chip chip-reserved"><Icon name="leaf" size={10} />Terrace</span>}
              {s.from >= 1240 && <span className="chip chip-vip"><Icon name="crown" size={10} />Butler</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
              <div>
                <div className="label">From</div>
                <div className="display numeral" style={{ fontSize: 40, lineHeight: 1, marginTop: 4 }}>€{s.from.toLocaleString()}<span style={{ fontSize: 14, color: "var(--mute)", marginLeft: 6 }}>/ night</span></div>
              </div>
              <button className="btn btn-primary" onClick={() => setPage("book")}>Reserve <Icon name="arrow_right" size={12} /></button>
            </div>
          </div>
        </div>
      ))}
    </section>
  </PublicShell>
);

// ============ UNIFIED SIGN IN ============
// One form for everyone — backend resolves the email and routes by role.
const SignInPage = ({ setRole, setPage, setGuest }) => {
  const [tab, setTab] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [resolved, setResolved] = useState(null); // { kind, role?, name?, initials? }
  const [pending, setPending] = useState(false);

  // Faux backend resolver: derive identity from email
  const resolve = (e) => {
    const v = (e || "").trim().toLowerCase();
    if (!v) return null;
    const STAFF = {
      "m.devereaux@luxurystay.co": { role: "admin", name: "Margaux Devereaux", initials: "MD" },
      "h.aubert@luxurystay.co": { role: "manager", name: "Henri Aubert", initials: "HA" },
      "y.tanaka@luxurystay.co": { role: "receptionist", name: "Yuki Tanaka", initials: "YT" },
      "r.silva@luxurystay.co": { role: "housekeeping", name: "Rosa Silva", initials: "RS" },
    };
    if (STAFF[v]) return { kind: "staff", ...STAFF[v] };
    if (v.endsWith("@luxurystay.co")) return { kind: "staff", role: "manager", name: "Staff member", initials: "S" };
    // Treat anything else as a returning guest
    const local = v.split("@")[0] || "guest";
    const parts = local.split(/[._-]/).filter(Boolean);
    const name = parts.map(p => p[0].toUpperCase() + p.slice(1)).join(" ") || "Guest";
    const initials = (parts.map(p => p[0].toUpperCase()).join("").slice(0, 2)) || "G";
    return { kind: "guest", role: "guest", name, initials };
  };

  useEffect(() => { setResolved(resolve(email)); }, [email]);

  const submit = () => {
    setPending(true);
    setTimeout(() => {
      let info = resolved;
      if (tab === "signup") {
        const initials = ((firstName[0] || "G") + (lastName[0] || "")).toUpperCase();
        info = { kind: "guest", role: "guest", name: `${firstName} ${lastName}`.trim() || "New guest", initials };
      }
      if (!info) { setPending(false); return; }
      if (info.kind === "staff") {
        setRole(info.role);
        setPage("dashboard");
      } else {
        setGuest({ name: info.name, initials: info.initials, email });
        setPage("stay");
      }
      setPending(false);
    }, 350);
  };

  const isStaff = resolved?.kind === "staff";
  const ctaLabel = tab === "signup"
    ? "Create account"
    : isStaff ? `Sign in to ${resolved.role} console` : resolved ? "Sign in to My Stay" : "Continue";

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--ivory)" }}>
      <div style={{ background: "linear-gradient(160deg, #2A2620 0%, #1A1814 100%)", color: "var(--ivory)", padding: 64, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, rgba(160, 128, 84, 0.18), transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <div onClick={() => setPage("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 28, fontStyle: "italic" }}>Luxury</span>
            <span style={{ fontFamily: "var(--serif)", fontSize: 28, letterSpacing: "0.04em" }}>STAY</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--brass-soft)", marginTop: 10 }}>One door, every guest</div>
        </div>
        <div style={{ position: "relative" }}>
          <div className="display display-italic" style={{ fontSize: 60, lineHeight: 1, maxWidth: 520, color: "var(--ivory)" }}>
            "Service is the architecture of memory."
          </div>
          <div style={{ marginTop: 24, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--brass-soft)" }}>— House motto · est. 1924</div>
        </div>
        <div style={{ position: "relative", fontSize: 11, color: "var(--mute-2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Maison Étoile · Côte d'Azur</div>
      </div>
      <div style={{ padding: 64, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{tab === "signup" ? "Create your account" : "Welcome back"}</div>
          <h1 className="display" style={{ fontSize: 52, margin: "0 0 12px" }}>
            {tab === "signup" ? <>Begin your <em>residency.</em></> : <>Sign <em>in.</em></>}
          </h1>
          <p style={{ color: "var(--ink-3)", marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
            One sign-in for guests and staff alike. We’ll route you to the right place.
          </p>

          <div style={{ display: "flex", border: "1px solid var(--hairline)", marginBottom: 28, borderRadius: 2, overflow: "hidden" }}>
            {[{ id: "signin", l: "Sign in" }, { id: "signup", l: "Create account" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "12px 16px", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
                background: tab === t.id ? "var(--ink)" : "transparent",
                color: tab === t.id ? "var(--paper)" : "var(--mute)",
                border: "none", cursor: "pointer"
              }}>{t.l}</button>
            ))}
          </div>

          {tab === "signup" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div className="field"><label>First name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Your name" /></div>
              <div className="field"><label>Last name</label><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Your name" /></div>
            </div>
          )}

          <div className="field" style={{ marginBottom: 18 }}>
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Password</label>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••••••" />
          </div>

          {resolved && tab === "signin" && (
            <div style={{ background: "var(--linen)", border: "1px solid var(--hairline)", padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name={isStaff ? "key" : "crown"} size={12} />
              <span>Recognised as <strong style={{ fontWeight: 600 }}>{resolved.name}</strong> · routing to {isStaff ? `${resolved.role} console` : "My Stay"}</span>
            </div>
          )}

          <button className="btn btn-primary" disabled={pending} style={{ width: "100%", padding: "14px", justifyContent: "center", opacity: pending ? 0.6 : 1 }} onClick={submit}>
            {pending ? "…" : ctaLabel} <Icon name="arrow_right" size={12} />
          </button>

          <div className="rule"><div className="dot" /></div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Demo · try a role</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { e: "m.devereaux@luxurystay.co", l: "Admin · Margaux" },
              { e: "h.aubert@luxurystay.co", l: "Manager · Henri" },
              { e: "y.tanaka@luxurystay.co", l: "Reception · Yuki" },
              { e: "r.silva@luxurystay.co", l: "Housekeep · Rosa" },
              { e: "lord.ashbury@example.com", l: "Guest · Lord Ashbury" },
              { e: "isabel.moreno@example.com", l: "Guest · Isabel" },
            ].map(r => (
              <button key={r.e} className="btn btn-ghost" style={{ justifyContent: "flex-start", fontSize: 11, padding: "10px 12px" }} onClick={() => { setEmail(r.e); setPwd("demo-password"); }}>{r.l}</button>
            ))}
          </div>

          <div style={{ marginTop: 24, fontSize: 11, color: "var(--mute)", textAlign: "center" }}>
            <a onClick={() => setPage("landing")} style={{ color: "var(--brass-deep)", borderBottom: "1px solid var(--brass-deep)", cursor: "pointer" }}>← Back to the public site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ CONTACT ============
const ContactPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="contact" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1280, margin: "0 auto" }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 24 }}>Contact us</div>
        <h1 className="display" style={{ fontSize: 84, margin: "0 0 24px", lineHeight: 0.95 }}>A note, <em>before</em><br />you arrive.</h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
          Our concierge replies within four hours, in any language, day or night. For urgent matters during travel, please use the direct line below.
        </p>
        <div style={{ display: "grid", gap: 28, maxWidth: 420 }}>
          <ContactBlock label="Concierge" main="+33 4 93 88 14 24" sub="24 hours · all languages" />
          <ContactBlock label="Reservations" main="reservations@luxurystay.co" />
          <ContactBlock label="The house" main="14 Promenade des Anglais" sub="06000 Nice · France" />
        </div>
      </div>
      <div className="card" style={{ padding: 40, alignSelf: "start" }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Send a message</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div className="field"><label>First name</label><input placeholder="Your name" /></div>
          <div className="field"><label>Last name</label><input placeholder="Your name" /></div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Email</label><input placeholder="you@example.com" /></div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Subject</label>
            <select defaultValue="reservation">
              <option value="reservation">Reservation enquiry</option>
              <option value="event">Private event</option>
              <option value="press">Press</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Message</label>
            <textarea rows="5" placeholder="How may we be of service?" style={{ resize: "vertical" }} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }}>Send message</button>
      </div>
    </section>
  </PublicShell>
);

const ContactBlock = ({ label, main, sub }) => (
  <div>
    <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{main}</div>
    {sub && <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 4 }}>{sub}</div>}
  </div>
);

// ============ GUEST BOOKING ============
const GuestBookPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="book" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "60px 64px 80px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <BookStep n="1" l="Dates" done />
        <StepLine />
        <BookStep n="2" l="Choose suite" current />
        <StepLine />
        <BookStep n="3" l="Guest details" />
        <StepLine />
        <BookStep n="4" l="Confirm" />
      </div>
      <h1 className="display" style={{ fontSize: 64, margin: "0 0 8px" }}>Compose <em>your stay.</em></h1>
      <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 24 }}>Three nights or more receive a complimentary spa ritual on arrival.</p>

      <div style={{ display: "flex", gap: 16, padding: "20px 24px", border: "1px solid var(--hairline)", background: "var(--paper)", marginTop: 8, marginBottom: 32, borderRadius: 2 }}>
        <BookField label="Arrival" value="Fri, 12 Jun 2026" />
        <Sep />
        <BookField label="Departure" value="Tue, 16 Jun 2026" />
        <Sep />
        <BookField label="Nights" value="4" />
        <Sep />
        <BookField label="Guests" value="2 adults" />
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>Modify</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { name: "Deluxe King", desc: "32 m² · garden view · marble bath", rate: 480, grad: "linear-gradient(140deg, #EFE8DB, #C9AE82)" },
            { name: "Junior Suite", desc: "48 m² · sea view · separate sitting area", rate: 720, grad: "linear-gradient(140deg, #C9AE82, #A08054)", selected: true },
            { name: "Premier Suite", desc: "76 m² · sea view · private terrace", rate: 1240, grad: "linear-gradient(140deg, #806339, #4A443B)" },
            { name: "Penthouse", desc: "180 m² · panoramic terrace · butler", rate: 2400, grad: "linear-gradient(140deg, #2A2620, #1A1814)" },
          ].map((s, i) => (
            <div key={i} className="card" style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 24, padding: 0, overflow: "hidden", borderColor: s.selected ? "var(--brass)" : "var(--hairline)", borderWidth: s.selected ? 2 : 1 }}>
              <div style={{ background: s.grad, position: "relative", minHeight: 160 }}>
                <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: "var(--serif)", fontSize: 36, fontStyle: "italic", color: "rgba(247, 243, 236, 0.2)" }}>0{i+1}</div>
              </div>
              <div style={{ padding: "24px 0" }}>
                <h3 className="display" style={{ fontSize: 26, margin: "0 0 6px" }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: "var(--mute)", margin: "0 0 14px" }}>{s.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span className="chip chip-reserved"><Icon name="wifi" size={10} />Wi-Fi</span>
                  <span className="chip chip-reserved"><Icon name="coffee" size={10} />Espresso</span>
                  <span className="chip chip-reserved"><Icon name="spa" size={10} />Bath ritual</span>
                </div>
              </div>
              <div style={{ padding: 24, borderLeft: "1px solid var(--hairline-2)", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", textAlign: "right", minWidth: 180 }}>
                <div>
                  <div className="display numeral" style={{ fontSize: 32, lineHeight: 1 }}>€{s.rate.toLocaleString()}</div>
                  <div className="label" style={{ marginTop: 4 }}>per night</div>
                </div>
                <button className={s.selected ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}>
                  {s.selected ? <><Icon name="check" size={12} />Selected</> : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "sticky", top: 100, alignSelf: "start" }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Your stay</div>
            <div style={{ aspectRatio: "16/10", background: "linear-gradient(140deg, #C9AE82, #A08054)", marginBottom: 16, position: "relative" }}>
              <div style={{ position: "absolute", bottom: 14, left: 16, color: "var(--paper)" }}>
                <div className="eyebrow" style={{ color: "rgba(247, 243, 236, 0.7)" }}>Selected</div>
                <div className="display" style={{ fontSize: 22, color: "var(--paper)" }}>Junior Suite</div>
              </div>
            </div>
            <SummaryRow label="4 nights · Junior" value="€2,880" />
            <SummaryRow label="Spa ritual (gift)" value="—" />
            <SummaryRow label="Tourist tax" value="€20" />
            <SummaryRow label="VAT (10%)" value="€288" />
            <div style={{ borderTop: "1px solid var(--ink)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="label">Total</span>
              <span className="display numeral" style={{ fontSize: 28 }}>€3,188</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, marginTop: 18 }} onClick={() => setPage("confirm")}>
              Continue to guest details <Icon name="arrow_right" size={12} />
            </button>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--mute)", textAlign: "center" }}>Free cancellation through 09 Jun · Pay 30% now</div>
          </div>
        </div>
      </div>
    </section>
  </PublicShell>
);

const BookStep = ({ n, l, done, current }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: done ? "var(--ink)" : current ? "var(--brass)" : "transparent",
      border: current || done ? "none" : "1px solid var(--hairline)",
      color: done || current ? "var(--paper)" : "var(--mute)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--serif)", fontSize: 14
    }}>{done ? <Icon name="check" size={12} /> : n}</div>
    <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: current ? "var(--ink)" : "var(--mute)", fontWeight: current ? 600 : 400 }}>{l}</span>
  </div>
);
const StepLine = () => <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />;

const BookField = ({ label, value }) => (
  <div style={{ flex: 1 }}>
    <div className="label" style={{ marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
  </div>
);
const Sep = () => <div style={{ width: 1, background: "var(--hairline)" }} />;
// SummaryRow lives in pages-ops.jsx (shared)

// ============ CONFIRMATION ============
const ConfirmationPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="book" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "80px 64px", maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
      <div className="ornament" style={{ marginBottom: 24 }}>· · ·</div>
      <div className="eyebrow" style={{ marginBottom: 18 }}>Reservation confirmed</div>
      <h1 className="display" style={{ fontSize: 88, margin: "0 0 24px", lineHeight: 0.95 }}>Until <em>June.</em></h1>
      <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto 48px" }}>
        A confirmation has been sent to your inbox. Our concierge will be in touch shortly to arrange any preferences for your arrival.
      </p>

      <div className="card" style={{ padding: 40, textAlign: "left", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Confirmation number</div>
            <div className="display numeral" style={{ fontSize: 32 }}>RS-2849</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Total · 30% deposit charged</div>
            <div className="display numeral" style={{ fontSize: 32 }}>€956<span style={{ fontSize: 14, color: "var(--mute)" }}> / €3,188</span></div>
          </div>
        </div>
        <div className="rule"><div className="dot" /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <ConfirmRow l="Guest" v="Mr. & Mrs. Whitfield" />
          <ConfirmRow l="Suite" v="Junior Suite · sea view" />
          <ConfirmRow l="Arrival" v="Fri, 12 June 2026 · from 15:00" />
          <ConfirmRow l="Departure" v="Tue, 16 June 2026 · by 12:00" />
          <ConfirmRow l="Nights" v="4" />
          <ConfirmRow l="Guests" v="2 adults" />
        </div>
        <div style={{ background: "var(--linen)", padding: "16px 20px", borderRadius: 2, fontSize: 13, color: "var(--ink-3)" }}>
          <strong style={{ fontWeight: 600 }}>Free cancellation</strong> through 09 June 2026. After that, the deposit is retained.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button className="btn btn-ghost"><Icon name="download" size={12} />Save PDF</button>
        <button className="btn btn-ghost"><Icon name="mail" size={12} />Email me</button>
        <button className="btn btn-primary" onClick={() => setPage("stay")}>Open My Stay <Icon name="arrow_right" size={12} /></button>
      </div>
    </section>
  </PublicShell>
);

const ConfirmRow = ({ l, v }) => (
  <div>
    <div className="label" style={{ marginBottom: 4 }}>{l}</div>
    <div style={{ fontSize: 15, fontWeight: 500 }}>{v}</div>
  </div>
);

// ============ MY STAY (in-stay portal — guest dashboard during their stay) ============
const PortalPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="stay" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "60px 64px 80px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8, gap: 24, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>My Stay · Day 2 of 7 · Suite 301</div>
          <h1 className="display" style={{ fontSize: 64, margin: "0 0 8px", lineHeight: 1 }}>Bonjour, <em>Lord Ashbury.</em></h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar avatar-lg">A</div>
          <div>
            <div style={{ fontWeight: 500 }}>Lord Ashbury</div>
            <div style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Étoile member</div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: "var(--ink-3)", maxWidth: 540, marginBottom: 36 }}>
        The terrace was readied this morning with the Times of London and your usual pot of Earl Grey. Below, your stay at a glance — should anything be wanting, the concierge stands ready.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)", marginBottom: 40 }}>
        <Mini label="Check-out" value="Mon, 11 May" />
        <Mini label="Nights remaining" value="5" />
        <Mini label="Folio · current" value="€11,368" />
        <Mini label="Spa visits" value="1 / 3" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <div>
          <SectionHead title="Today at the house" caption="Tue · 5 May" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
            {[
              { i: "spa", t: "Spa · La Mer ritual", s: "Booked · 14:00 · 90 min" },
              { i: "coffee", t: "Le Jardin · breakfast", s: "Reserved · 9:00 · table 4" },
              { i: "pool", t: "Cabana · pool deck", s: "Standing · all-day" },
              { i: "leaf", t: "Sunset garden walk", s: "Suggested · 19:30" },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: 22, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 2, background: "var(--linen)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brass-deep)" }}>
                  <Icon name={c.i} size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.t}</div>
                  <div style={{ fontSize: 11, color: "var(--mute)", marginTop: 4 }}>{c.s}</div>
                </div>
              </div>
            ))}
          </div>

          <SectionHead title="Request a service" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { l: "In-room dining", i: "coffee" },
              { l: "Housekeeping refresh", i: "sparkle" },
              { l: "Wake-up call", i: "clock" },
              { l: "Laundry & pressing", i: "leaf" },
              { l: "Airport transfer", i: "arrow_right" },
              { l: "Reserve dinner", i: "star" },
              { l: "Spa appointment", i: "spa" },
              { l: "Concierge note", i: "mail" },
              { l: "Late check-out", i: "key" },
            ].map((s, i) => (
              <button key={i} className="btn btn-ghost" style={{ justifyContent: "space-between", padding: "16px 18px", textTransform: "none", letterSpacing: 0, fontSize: 13 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name={s.i} size={14} />{s.l}</span>
                <Icon name="arrow_right" size={12} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Suite 301 · Premier</div>
            <div style={{ aspectRatio: "16/10", background: "linear-gradient(140deg, #806339, #2A2620)", marginBottom: 18, position: "relative" }}>
              <div style={{ position: "absolute", bottom: 16, left: 18, color: "var(--paper)", fontFamily: "var(--serif)", fontSize: 28, fontStyle: "italic" }}>301</div>
            </div>
            <SummaryRow label="Check-in" value="Mon, 4 May" />
            <SummaryRow label="Check-out" value="Mon, 11 May" />
            <SummaryRow label="Nights" value="7" />
            <SummaryRow label="Folio · current" value="€11,368" />
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>View live folio</button>
          </div>

          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Maintenance</div>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
              Notice anything amiss? Report it discreetly and Tomás will attend within the hour.
            </p>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
              <Icon name="wrench" size={12} />Report a concern
            </button>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Concierge</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <div className="avatar">PS</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Priya Shankar</div>
                <div style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.1em", textTransform: "uppercase" }}>On duty · 06:00–22:00</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }}><Icon name="phone" size={12} />Call</button>
              <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="mail" size={12} />Message</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicShell>
);

Object.assign(window, { SignInPage, LandingPage, SuitesPage, ContactPage, GuestBookPage, ConfirmationPage, PortalPage });

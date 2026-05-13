// LuxuryStay — public/guest experience: richer, more editorial
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
      <div style={{ background: "var(--ink)", color: "var(--brass-soft)", padding: "8px 32px", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", display: "flex", justifyContent: "space-between", gap: 16, whiteSpace: "nowrap", overflow: "hidden" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>★ Member of Leading Hotels of the World</span>
        <span className="hide-md" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>EN · FR · IT · 中文 · 日本語</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>+33 4 93 88 14 24</span>
      </div>
      <header style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        padding: "22px 64px", borderBottom: `1px solid ${border}`,
        position: "sticky", top: 0, background: dark ? "var(--ink)" : "var(--ivory)", zIndex: 10, backdropFilter: "blur(8px)"
      }}>
        <div onClick={() => setPage("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 28, fontStyle: "italic" }}>Luxury</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 28, letterSpacing: "0.04em" }}>STAY</span>
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
              <div style={{ fontSize: 11, letterSpacing: "0.06em", color: fg, lineHeight: 1.2 }}>
                {guest.name}
                <a onClick={() => setGuest(null)} style={{ display: "block", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, cursor: "pointer", marginTop: 2 }}>Sign out</a>
              </div>
            </div>
          ) : (
            <a onClick={() => setPage("signin")} style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, cursor: "pointer", whiteSpace: "nowrap" }}>Sign in</a>
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
  <footer style={{ background: "var(--ink)", color: "var(--ivory)", padding: "80px 64px 36px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 40, right: 64, fontFamily: "var(--serif)", fontSize: 220, fontStyle: "italic", color: "rgba(160, 128, 84, 0.06)", lineHeight: 0.8, letterSpacing: "-0.04em" }}>L·S</div>
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 48 }}>
      <div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 32 }}><em>Luxury</em>STAY</div>
        <p style={{ fontSize: 13, color: "var(--mute-2)", marginTop: 16, maxWidth: 320, lineHeight: 1.7 }}>
          Maison Étoile · 14 Promenade des Anglais, 06000 Nice. A century on the Mediterranean. A member of Leading Hotels of the World.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          {["★★★★★", "M. Guide", "R. Forbes", "Condé"].map((b, i) => (
            <div key={i} style={{ padding: "6px 10px", border: "1px solid rgba(247, 243, 236, 0.15)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brass-soft)" }}>{b}</div>
          ))}
        </div>
      </div>
      {[
        { h: "House", l: ["About the maison", "Press & awards", "Careers", "Sustainability"] },
        { h: "Stay", l: ["The suites", "Dining", "La Mer spa", "Private events"] },
        { h: "Guest", l: ["Reservations", "Concierge", "Gift cards", "My account"] },
      ].map((c, i) => (
        <div key={i}>
          <div className="eyebrow" style={{ color: "var(--brass-soft)", marginBottom: 16 }}>{c.h}</div>
          {c.l.map(item => <div key={item} style={{ fontSize: 13, color: "var(--mute-2)", padding: "5px 0", cursor: "pointer" }}>{item}</div>)}
        </div>
      ))}
      <div>
        <div className="eyebrow" style={{ color: "var(--brass-soft)", marginBottom: 16 }}>Letters from the house</div>
        <p style={{ fontSize: 12, color: "var(--mute-2)", lineHeight: 1.6, marginBottom: 14 }}>A seasonal correspondence — never more than four a year.</p>
        <div style={{ display: "flex", border: "1px solid rgba(247, 243, 236, 0.18)" }}>
          <input placeholder="your@email" style={{ flex: 1, background: "transparent", border: "none", color: "var(--ivory)", padding: "10px 12px", fontSize: 12 }} />
          <button style={{ background: "var(--brass)", color: "var(--paper)", border: "none", padding: "0 14px", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer" }}>Send</button>
        </div>
      </div>
    </div>
    <div style={{ position: "relative", borderTop: "1px solid rgba(247, 243, 236, 0.12)", paddingTop: 24, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mute)", display: "flex", justifyContent: "space-between" }}>
      <span>© MMXXVI LuxuryStay Hospitality</span>
      <span>Privacy · Terms · Press · Modern slavery</span>
    </div>
  </footer>
);

// ============ TEXTURE HELPERS — placeholder imagery ============
// Editorial palettes — multi-stop with shadow + highlight stops for painterly depth
const Photo = ({ tone = "warm", label, num, sub, ratio = "4/5", children, style = {}, mood }) => {
  const palettes = {
    warm:   { base: "#C9AE82", deep: "#5A4528", light: "#F0E2C8", shadow: "#3E2E18" },
    deep:   { base: "#5A4530", deep: "#1A1814", light: "#A0855C", shadow: "#0A0806" },
    sea:    { base: "#5A6E72", deep: "#1F2A2E", light: "#9FB0B4", shadow: "#0E1416" },
    sand:   { base: "#C8B088", deep: "#6E5634", light: "#E8D5B0", shadow: "#3E2E1A" },
    night:  { base: "#2A2620", deep: "#0A0806", light: "#5A4530", shadow: "#000000" },
    ivory:  { base: "#EFE8DB", deep: "#C8BFA8", light: "#FBF8F2", shadow: "#9A9180" },
    olive:  { base: "#6E7F5C", deep: "#2F3A28", light: "#B5C29C", shadow: "#1A2014" },
    bronze: { base: "#8B6A3F", deep: "#3E2A14", light: "#D4A876", shadow: "#1E1408" },
    rose:   { base: "#B5573B", deep: "#5A2818", light: "#E8A88A", shadow: "#2A0E06" },
  };
  const p = palettes[tone] || palettes.warm;
  // mood positions the "key light" — gives each photo a distinct compositional feel
  const lights = {
    topright: { x: "78%", y: "18%" },
    topleft:  { x: "22%", y: "20%" },
    bottom:   { x: "50%", y: "92%" },
    side:     { x: "8%",  y: "55%" },
    center:   { x: "50%", y: "45%" },
  };
  const L = lights[mood] || lights.topright;
  return (
    <div style={{
      aspectRatio: ratio, position: "relative", overflow: "hidden",
      background: `
        radial-gradient(ellipse 80% 60% at ${L.x} ${L.y}, ${p.light} 0%, transparent 55%),
        radial-gradient(ellipse 120% 90% at 90% 100%, ${p.shadow} 0%, transparent 60%),
        radial-gradient(ellipse 100% 80% at 0% 0%, ${p.deep} 0%, transparent 50%),
        linear-gradient(165deg, ${p.base} 0%, ${p.deep} 100%)
      `,
      ...style
    }}>
      {/* vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.32) 100%)", pointerEvents: "none" }} />
      {/* film grain — SVG noise */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.35, mixBlendMode: "overlay", pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 0 0.85  0 0 0 1.6 -0.5'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>")` }} />
      {/* directional light shaft */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 30%, rgba(255, 240, 210, 0.08) 45%, transparent 60%)`, pointerEvents: "none" }} />
      {/* hairline border for editorial frame */}
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", pointerEvents: "none" }} />
      {num && <div style={{ position: "absolute", top: 20, left: 28, fontFamily: "var(--display)", fontSize: 132, color: "rgba(247, 243, 236, 0.16)", lineHeight: 0.82, letterSpacing: "-0.04em" }}>{num}</div>}
      {label && (
        <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, color: "var(--paper)" }}>
          <div style={{ fontFamily: "var(--sc)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--brass-soft)", marginBottom: 10 }}>{sub}</div>
          <div style={{ fontFamily: "var(--display)", fontSize: 36, lineHeight: 1, letterSpacing: "-0.01em" }}>{label}</div>
        </div>
      )}
      {children}
    </div>
  );
};

const Ornament = ({ children = "·  ·  ·" }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, color: "var(--brass)", fontSize: 16, letterSpacing: "0.4em" }}>
    <div style={{ width: 40, height: 1, background: "var(--hairline)" }} />
    <span style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>{children}</span>
    <div style={{ width: 40, height: 1, background: "var(--hairline)" }} />
  </div>
);

// ============ LANDING ============
const LandingPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="landing" setPage={setPage} guest={guest} setGuest={setGuest}>
    {/* HERO — full bleed editorial cover */}
    <section style={{ position: "relative", padding: "0 0 0", overflow: "hidden", background: "var(--ivory)" }}>
      {/* watermark numeral */}
      <div aria-hidden style={{ position: "absolute", top: -60, right: -40, fontFamily: "var(--display)", fontSize: 580, color: "rgba(160, 128, 84, 0.07)", lineHeight: 0.8, letterSpacing: "-0.06em", pointerEvents: "none", userSelect: "none" }}>
        I
      </div>
      {/* vertical folio marker */}
      <div style={{ position: "absolute", top: 100, left: 24, fontFamily: "var(--sc)", fontSize: 10, color: "var(--mute)", letterSpacing: "0.4em", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
        Vol. CII · Folio I · Spring–Summer MMXXVI
      </div>

      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 0, minHeight: 720, alignItems: "stretch" }}>
        {/* LEFT — typography */}
        <div style={{ padding: "84px 56px 84px 88px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
            <div style={{ width: 48, height: 1, background: "var(--brass)" }} />
            <div className="eyebrow" style={{ color: "var(--brass-deep)" }}>Est. MCMXXIV · Côte d'Azur</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brass)" }} />
          </div>

          <h1 className="didone" style={{ fontSize: "clamp(72px, 9.2vw, 132px)", margin: 0, lineHeight: 0.92, color: "var(--ink)" }}>
            The art of<br />
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, color: "var(--brass-deep)" }}>arriving,</span>
            <br />
            <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300 }}>&</span>{" "}
            <span style={{ fontSize: "0.72em" }}>never quite</span>
            <br />
            <span style={{ letterSpacing: "0.02em" }}>leaving.</span>
          </h1>

          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300, fontSize: 21, color: "var(--ink-3)", lineHeight: 1.55, maxWidth: 480, margin: "44px 0 40px", textWrap: "pretty" }}>
            A century of hospitality on the Mediterranean. Forty-two suites, three restaurants, one spa carved from sea-stone. <span style={{ color: "var(--ink)" }}>Each stay is composed — not booked.</span>
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setPage("book")} style={{ padding: "16px 26px", fontSize: 11, whiteSpace: "nowrap" }}>
              Reserve your stay <Icon name="arrow_right" size={12} />
            </button>
            <button className="btn btn-ghost" onClick={() => setPage("suites")} style={{ padding: "16px 22px", fontSize: 11, whiteSpace: "nowrap" }}>The suites →</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--hairline)" }}>
            {[
              { n: "★★", l: "Michelin", s: "Le Jardin · 2024" },
              { n: "98", l: "Forbes", s: "Five-star · 2025" },
              { n: "IX", l: "Decades", s: "Family-owned" },
              { n: "42", l: "Suites", s: "No two alike" },
            ].map((m, i) => (
              <div key={i}>
                <div className="didone" style={{ fontSize: 48, lineHeight: 0.9, color: "var(--ink)", marginBottom: 8 }}>{m.n}</div>
                <div className="eyebrow" style={{ fontSize: 9, color: "var(--ink)", marginBottom: 4 }}>{m.l}</div>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11, color: "var(--mute)" }}>{m.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — image stack */}
        <div style={{ position: "relative", padding: "84px 64px 84px 24px" }}>
          <div style={{ position: "relative", height: "100%" }}>
            <Photo tone="deep" ratio="4/5" mood="topright" label="The Penthouse · 402" sub="from €2,400 / night" style={{ height: "100%", width: "100%" }} />

            {/* Étoile seal — anchored ON the photo */}
            <div style={{ position: "absolute", top: 20, left: 20, width: 104, height: 104, border: "1px solid var(--brass-soft)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(247, 243, 236, 0.96)", flexDirection: "column", backdropFilter: "blur(6px)" }}>
              <div className="didone" style={{ fontSize: 34, lineHeight: 0.9, color: "var(--brass-deep)" }}>★</div>
              <div style={{ fontFamily: "var(--sc)", fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--mute)", marginTop: 4 }}>Étoile · 1924</div>
            </div>

            {/* Live tile — sits over bottom-right corner of photo */}
            <div style={{ position: "absolute", bottom: 20, right: 20, width: 180, padding: "20px", background: "var(--paper)", border: "1px solid var(--hairline)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sage)", boxShadow: "0 0 0 3px rgba(110, 127, 92, 0.18)" }} />
                <div className="eyebrow" style={{ fontSize: 9, color: "var(--ink-3)" }}>Live · Nice</div>
              </div>
              <div className="didone" style={{ fontSize: 48, lineHeight: 0.9, letterSpacing: "-0.02em" }}>23°</div>
              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12, color: "var(--mute)", marginTop: 6 }}>Clear · sea breeze<br />sunset 21:12</div>
            </div>

            {/* Caption strip — anchored at top-right of photo */}
            <div style={{ position: "absolute", top: 28, right: 0, padding: "10px 16px", background: "var(--ink)", color: "var(--paper)", transform: "translateX(12px)" }}>
              <div style={{ fontFamily: "var(--sc)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase" }}>Cover · The Penthouse</div>
            </div>

            {/* secondary "olive grove" polaroid — anchored to bottom-left INSIDE the photo column */}
            <div style={{ position: "absolute", left: 20, bottom: 60, width: 150, height: 200, border: "6px solid var(--ivory)", boxShadow: "0 20px 40px -16px rgba(26, 24, 20, 0.5)", transform: "rotate(-3deg)" }}>
              <Photo tone="sand" ratio="3/4" mood="bottom" style={{ width: "100%", height: "100%" }} />
              <div style={{ position: "absolute", bottom: -28, left: 0, right: 0, textAlign: "center", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 10, color: "var(--paper)", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
                — la cour des oliviers —
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* AWARDS MARQUEE */}
    <section style={{ borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", padding: "24px 0", background: "var(--paper)", overflow: "hidden", marginTop: 60 }}>
      <div style={{ display: "flex", gap: 80, fontFamily: "var(--display)", fontSize: 26, color: "var(--ink-3)", whiteSpace: "nowrap", animation: "marquee 60s linear infinite" }}>
        {Array.from({ length: 3 }).flatMap((_, j) => [
          "Forbes Travel Guide · five-star",
          "Michelin · two stars · Le Jardin",
          "★",
          "Condé Nast Traveler · gold list",
          "Leading Hotels of the World",
          "★",
          "Relais & Châteaux",
          "World's 50 Best · Hotels",
        ].map((t, i) => <span key={`${j}-${i}`}>{t}</span>))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>

    {/* THE HOUSE — story */}
    <section style={{ padding: "140px 64px", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 96, alignItems: "center", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, position: "relative" }}>
        <Photo tone="sand" ratio="3/4" mood="topleft" />
        <div style={{ display: "grid", gap: 14, marginTop: 48 }}>
          <Photo tone="ivory" ratio="1/1" mood="side" />
          <Photo tone="warm" ratio="1/1" mood="bottom" />
        </div>
        <div style={{ position: "absolute", bottom: -24, left: -24, fontFamily: "var(--display)", fontSize: 220, color: "rgba(160, 128, 84, 0.14)", lineHeight: 0.8, pointerEvents: "none" }}>I</div>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 22, color: "var(--brass-deep)" }}>Chapter I · The House</div>
        <h2 className="didone" style={{ fontSize: 92, margin: "0 0 32px", lineHeight: 0.95 }}>
          A maison of <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300 }}>quiet</span>
          <br />consequence.
        </h2>
        <p style={{ fontSize: 17, color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 520, marginBottom: 24, fontFamily: "var(--serif)" }}>
          In 1924, the architect <em>Édouard Pellier</em> drew forty-two rooms into the cliff face above the Baie des Anges. He built around an old olive grove that still stands at the centre of the courtyard.
        </p>
        <p style={{ fontSize: 17, color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 520, marginBottom: 40, fontFamily: "var(--serif)" }}>
          Four generations on, the maison remains in family hands — and remains, deliberately, half a step out of time.
        </p>
        <a style={{ fontFamily: "var(--sc)", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", borderBottom: "1px solid var(--ink)", cursor: "pointer", paddingBottom: 6 }}>Read the full history →</a>
      </div>
    </section>

    {/* SUITES PREVIEW */}
    <section style={{ padding: "0 64px 140px", maxWidth: 1440, margin: "0 auto" }}>
      <Ornament>II · The Suites</Ornament>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "48px 0 56px" }}>
        <h2 className="didone" style={{ fontSize: 104, margin: 0, lineHeight: 0.92 }}>
          Five <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300 }}>categories,</span>
          <br />no two alike.
        </h2>
        <a onClick={() => setPage("suites")} style={{ fontFamily: "var(--sc)", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", borderBottom: "1px solid var(--ink)", cursor: "pointer", paddingBottom: 6 }}>View all forty-two →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 28 }}>
        {[
          { name: "Deluxe King", from: "480", tone: "warm", n: "01", desc: "King bed · garden view · marble bath", mood: "topright" },
          { name: "Junior Suite", from: "720", tone: "sand", n: "02", desc: "Sitting area · soaking tub · sea view", mood: "topleft" },
          { name: "Premier Suite", from: "1,240", tone: "deep", n: "03", desc: "Terrace · dressing room · butler", mood: "side" },
        ].map((s, i) => (
          <div key={i} onClick={() => setPage("book")} style={{ cursor: "pointer" }}>
            <Photo tone={s.tone} ratio={i === 0 ? "4/5" : "1/1"} num={s.n} mood={s.mood} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 22, paddingBottom: 4 }}>
              <h3 className="didone" style={{ fontSize: 32, margin: 0 }}>{s.name}</h3>
              <span className="didone" style={{ fontSize: 22, color: "var(--brass-deep)" }}>€{s.from}<span style={{ fontFamily: "var(--sc)", fontSize: 10, color: "var(--mute)", marginLeft: 4, letterSpacing: "0.2em" }}>/N</span></span>
            </div>
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: "var(--mute)", marginTop: 6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* DINING + SPA */}
    <section style={{ background: "var(--ink)", color: "var(--ivory)", padding: "140px 64px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 30%, rgba(160, 128, 84, 0.22), transparent 55%), radial-gradient(circle at 10% 90%, rgba(160, 128, 84, 0.12), transparent 50%)" }} />
      <div aria-hidden style={{ position: "absolute", top: 60, right: 80, fontFamily: "var(--display)", fontSize: 360, color: "rgba(160, 128, 84, 0.06)", lineHeight: 0.8, pointerEvents: "none" }}>II</div>
      <div style={{ position: "relative", maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96 }}>
        {[
          { tone: "night", title: "Le Jardin", sub: "Two-star · beneath the olive", n: "★★", body: "Chef Adèle Marchand draws from a kitchen garden tended by hand. Twelve covers an evening.", mood: "topright" },
          { tone: "sea", title: "La Mer", sub: "Spa · carved from sea-stone", n: "I", body: "Eight treatment rooms below the cliff. Salt-water hammam, sound bath, Provençal botanicals.", mood: "side" },
        ].map((s, i) => (
          <div key={i}>
            <Photo tone={s.tone} ratio="4/3" mood={s.mood} />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 28 }}>
              <div className="eyebrow" style={{ color: "var(--brass-soft)" }}>{s.sub}</div>
              <span className="didone" style={{ fontSize: 34, color: "var(--brass-soft)" }}>{s.n}</span>
            </div>
            <h3 className="didone" style={{ fontSize: 76, margin: "16px 0 20px", color: "var(--ivory)" }}>{s.title}</h3>
            <p style={{ fontSize: 16, color: "var(--mute-2)", lineHeight: 1.7, maxWidth: 440, fontFamily: "var(--serif)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* TESTIMONIAL */}
    <section style={{ padding: "140px 64px", textAlign: "center", maxWidth: 1080, margin: "0 auto", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--display)", fontSize: 420, color: "rgba(160, 128, 84, 0.07)", lineHeight: 0.8, pointerEvents: "none" }}>"</div>
      <Ornament>·  ★  ·</Ornament>
      <div className="didone" style={{ fontSize: 64, lineHeight: 1.12, margin: "48px 0 40px", letterSpacing: "-0.01em", position: "relative" }}>
        "One leaves the maison the way one leaves an <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300 }}>old friend</span> — already counting the months until the next visit."
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ width: 48, height: 1, background: "var(--brass)" }} />
        <div className="eyebrow" style={{ color: "var(--brass-deep)" }}>Vanity Fair · April MMXXV</div>
        <div style={{ width: 48, height: 1, background: "var(--brass)" }} />
      </div>
    </section>

    {/* FINAL CTA */}
    <section style={{ padding: "0 64px 140px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ background: "var(--linen)", padding: "96px 72px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -40, right: 60, fontFamily: "var(--display)", fontSize: 280, color: "rgba(160, 128, 84, 0.14)", lineHeight: 0.8, pointerEvents: "none" }}>★</div>
        <div className="eyebrow" style={{ marginBottom: 22, color: "var(--brass-deep)" }}>Chapter III · Compose your stay</div>
        <h2 className="didone" style={{ fontSize: 76, margin: "0 0 24px", maxWidth: 800, lineHeight: 0.95 }}>
          Speak with a <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 300 }}>concierge</span><br />before you arrive.
        </h2>
        <p style={{ fontSize: 17, color: "var(--ink-3)", maxWidth: 580, marginBottom: 36, lineHeight: 1.7, fontFamily: "var(--serif)" }}>
          A note, a preference, a celebration — the more we know, the more quietly we can attend to it. Our concierge replies within four hours, in any language.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={() => setPage("book")} style={{ padding: "16px 30px" }}>Begin reservation <Icon name="arrow_right" size={12} /></button>
          <button className="btn btn-ghost" onClick={() => setPage("contact")} style={{ padding: "16px 28px" }}>Write to the concierge</button>
        </div>
      </div>
    </section>
  </PublicShell>
);

// ============ SUITES — lookbook ============
const SuitesPage = ({ setPage, guest, setGuest }) => {
  const [filter, setFilter] = useState("all");
  const suites = [
    { n: "Deluxe Twin", from: 460, sqm: 28, tone: "ivory", aspect: "garden", beds: "2 twin", view: "Garden", desc: "Twin beds for travel companions or family. Garden-side aspect, full marble bath, walk-in shower.", amenities: ["Walk-in shower", "Espresso", "Linens · Florence", "Fibre Wi-Fi"], cat: "deluxe" },
    { n: "Deluxe King", from: 480, sqm: 32, tone: "warm", aspect: "garden", beds: "1 king", view: "Garden or Promenade", desc: "Our signature category. King bed, sitting nook, French balcony with views over the gardens or Promenade des Anglais.", amenities: ["French balcony", "Soaking tub", "Espresso", "Bath ritual"], cat: "deluxe" },
    { n: "Junior Suite", from: 720, sqm: 48, tone: "sand", aspect: "sea", beds: "1 king + sitting", view: "Sea", desc: "Generous proportions, separate sitting area, soaking tub overlooking the sea. Espresso service standard.", amenities: ["Sea view", "Soaking tub", "Sitting room", "In-room dining"], cat: "suite" },
    { n: "Premier Suite", from: 1240, sqm: 76, tone: "deep", aspect: "sea", beds: "1 king + sitting", view: "Sea · private terrace", desc: "Two-bedroom configuration available. Private terrace, dressing room, dedicated butler service.", amenities: ["Private terrace", "Dressing room", "Butler service", "Dining for six"], cat: "suite" },
    { n: "Penthouse", from: 2400, sqm: 180, tone: "night", aspect: "panoramic", beds: "2 king", view: "Panoramic Mediterranean", desc: "The crown of the house. Wraparound terrace with plunge pool, dining for ten, panoramic Mediterranean views.", amenities: ["Plunge pool", "Dining for ten", "Butler · 24h", "Private chef"], cat: "signature" },
  ];
  const shown = filter === "all" ? suites : suites.filter(s => s.cat === filter);

  return (
    <PublicShell page="suites" setPage={setPage} guest={guest} setGuest={setGuest}>
      <section style={{ padding: "60px 64px 32px", maxWidth: 1440, margin: "0 auto" }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>The accommodations · Folio II</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "end" }}>
          <h1 className="display" style={{ fontSize: 96, margin: 0, lineHeight: 0.92 }}>
            Forty-two rooms,<br /><em>each composed</em><br />by hand.
          </h1>
          <div>
            <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.75, fontFamily: "var(--serif)" }}>
              Five categories. Walnut joinery from the Jura, linens from Florence, marble bathrooms drawn from the Carrara quarries. No two suites are identical — each carries the trace of the artisans who shaped it.
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 32, flexWrap: "wrap" }}>
              {[{ id: "all", l: "All · 5" }, { id: "deluxe", l: "Deluxe" }, { id: "suite", l: "Suites" }, { id: "signature", l: "Signature" }].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "8px 16px", border: `1px solid ${filter === f.id ? "var(--ink)" : "var(--hairline)"}`,
                  background: filter === f.id ? "var(--ink)" : "transparent",
                  color: filter === f.id ? "var(--paper)" : "var(--ink)",
                  fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer"
                }}>{f.l}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 64px 100px", maxWidth: 1440, margin: "0 auto" }}>
        {shown.map((s, i) => (
          <div key={s.n} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1.1fr 1fr" : "1fr 1.1fr", gap: 72, alignItems: "center", padding: "60px 0", borderTop: "1px solid var(--hairline)" }}>
            <div style={{ order: i % 2, position: "relative" }}>
              <Photo tone={s.tone} ratio="4/5" num={`0${i + 1}`} />
              <div style={{ position: "absolute", top: 24, right: -24, padding: "8px 14px", background: "var(--ivory)", border: "1px solid var(--hairline)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mute)" }}>{s.sqm} m² · {s.beds}</div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14, color: "var(--brass-deep)" }}>Category 0{i + 1} · {s.view}</div>
              <h2 className="display" style={{ fontSize: 64, margin: "0 0 20px", lineHeight: 1 }}>{s.n}</h2>
              <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.75, marginBottom: 28, maxWidth: 480, fontFamily: "var(--serif)" }}>{s.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 32, maxWidth: 440 }}>
                {s.amenities.map((a, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-3)" }}>
                    <span style={{ color: "var(--brass)", fontFamily: "var(--serif)", fontStyle: "italic" }}>·</span>{a}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 24, borderTop: "1px solid var(--hairline)", maxWidth: 480 }}>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>From</div>
                  <div className="display numeral" style={{ fontSize: 48, lineHeight: 1, fontStyle: "italic" }}>€{s.from.toLocaleString()}<span style={{ fontSize: 14, color: "var(--mute)", marginLeft: 8, fontStyle: "normal" }}>/ night</span></div>
                </div>
                <button className="btn btn-primary" onClick={() => setPage("book")}>Reserve <Icon name="arrow_right" size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </PublicShell>
  );
};

// ============ BOOKING — 4-step flow ============
const SUITES = [
  { name: "Deluxe King", desc: "32 m² · garden view · marble bath", rate: 480, tone: "warm" },
  { name: "Junior Suite", desc: "48 m² · sea view · separate sitting area", rate: 720, tone: "sand" },
  { name: "Premier Suite", desc: "76 m² · sea view · private terrace", rate: 1240, tone: "deep" },
  { name: "Penthouse", desc: "180 m² · panoramic terrace · butler", rate: 2400, tone: "night" },
];

const StepIndicator = ({ step }) => {
  const steps = [{ n: "I", l: "Dates" }, { n: "II", l: "Suite" }, { n: "III", l: "Guest" }, { n: "IV", l: "Confirm" }];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
      {steps.map((s, i, arr) => {
        const done = i < step, current = i === step;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "var(--ink)" : current ? "var(--brass)" : "transparent",
                border: done || current ? "none" : "1px solid var(--hairline)",
                color: done || current ? "var(--paper)" : "var(--mute)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--serif)", fontSize: 14, fontStyle: "italic"
              }}>{done ? <Icon name="check" size={12} /> : s.n}</div>
              <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: current ? "var(--ink)" : done ? "var(--ink-3)" : "var(--mute)", fontWeight: current ? 600 : 400 }}>{s.l}</span>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: 1, background: done ? "var(--ink)" : "var(--hairline)", maxWidth: 80 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const FolioRail = ({ step, sel, nights, subtotal, tax, total, onContinue, ctaLabel, disabled }) => (
  <div style={{ position: "sticky", top: 110, alignSelf: "start" }}>
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {sel && <Photo tone={sel.tone} ratio="16/10" label={sel.name} sub="Your selection" />}
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div className="eyebrow">Folio summary</div>
          <div className="eyebrow" style={{ color: "var(--brass-deep)" }}>RS-2849</div>
        </div>
        {sel ? (
          <>
            {[
              { l: `${nights} nights · ${sel.name}`, v: `€${subtotal.toLocaleString()}` },
              { l: "Spa ritual (gift)", v: "—" },
              { l: "Tourist tax", v: "€20" },
              { l: "VAT (10%)", v: `€${tax.toLocaleString()}` },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13, borderBottom: i === 3 ? "none" : "1px dotted var(--hairline)" }}>
                <span style={{ color: "var(--mute)" }}>{r.l}</span>
                <span style={{ fontWeight: 500 }}>{r.v}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--ink)", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="eyebrow">Total</span>
              <span className="display numeral" style={{ fontSize: 36, fontStyle: "italic" }}>€{total.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <p style={{ fontSize: 13, color: "var(--mute)", fontStyle: "italic", fontFamily: "var(--serif)", margin: 0, padding: "20px 0" }}>Choose your dates and suite to see a folio summary.</p>
        )}
        <button className="btn btn-primary" disabled={disabled} style={{ width: "100%", justifyContent: "center", padding: 16, marginTop: 20, opacity: disabled ? 0.5 : 1 }} onClick={onContinue}>
          {ctaLabel} <Icon name="arrow_right" size={12} />
        </button>
        <div style={{ marginTop: 14, fontSize: 11, color: "var(--mute)", textAlign: "center", lineHeight: 1.6 }}>
          <span style={{ color: "var(--brass-deep)" }}>★</span> Free cancellation through 09 Jun · Pay 30% deposit now
        </div>
      </div>
    </div>
    <div style={{ marginTop: 16, padding: "16px 20px", background: "var(--linen)", border: "1px solid var(--hairline)", display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--brass)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--paper)" }}><Icon name="phone" size={14} /></div>
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ fontWeight: 600 }}>Speak with a concierge</div>
        <div style={{ color: "var(--mute)" }}>+33 4 93 88 14 24 · 24h</div>
      </div>
    </div>
  </div>
);

const GuestBookPage = ({ setPage, guest, setGuest }) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    arrival: "Fri, 12 Jun",
    departure: "Tue, 16 Jun",
    nights: 4,
    adults: 2,
    children: 0,
    rooms: 1,
    firstName: guest?.name?.split(" ")[0] || "",
    lastName: guest?.name?.split(" ").slice(1).join(" ") || "",
    email: guest?.email || "",
    phone: "",
    country: "France",
    arrivalTime: "After 17:00",
    requests: "",
    bed: "King",
    occasion: "None",
    card: "",
    expiry: "",
    cvv: "",
    name: "",
    accepted: false,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const sel = selected != null ? SUITES[selected] : null;
  const subtotal = sel ? sel.rate * form.nights : 0;
  const tax = Math.round(subtotal * 0.1);
  const total = sel ? subtotal + tax + 20 : 0;

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const titles = [
    { eyebrow: "Step I · When", h: <>Choose <em>your dates.</em></>, sub: "Three nights or more receive a complimentary spa ritual on arrival, and a chilled bottle of Ruinart in your suite." },
    { eyebrow: "Step II · Where", h: <>Choose <em>your suite.</em></>, sub: "Forty-two suites, each composed by hand. Floating tags indicate size and view." },
    { eyebrow: "Step III · Who", h: <>Tell us <em>about yourself.</em></>, sub: "A few small marks of the occasion — anything you tell us is held in confidence and pinned to your folio." },
    { eyebrow: "Step IV · Confirm", h: <>Review <em>& reserve.</em></>, sub: "A 30% deposit secures the booking. The balance is settled on departure, with no surprises." },
  ];
  const t = titles[step];

  const canContinue = [
    () => form.arrival && form.departure && form.nights > 0,
    () => selected != null,
    () => form.firstName && form.lastName && form.email,
    () => form.accepted && form.card,
  ][step]();

  const ctaLabel = step === 3 ? "Reserve & pay deposit" : ["Choose suite", "Continue to guest", "Continue to review", "Reserve"][step];

  return (
    <PublicShell page="book" setPage={setPage} guest={guest} setGuest={setGuest}>
      <section style={{ padding: "48px 64px 80px", maxWidth: 1440, margin: "0 auto" }}>
        <StepIndicator step={step} />
        <div className="eyebrow" style={{ marginBottom: 14 }}>Folio · RS-2849 · draft</div>
        <h1 className="display" style={{ fontSize: "clamp(48px, 6.4vw, 80px)", margin: "0 0 12px", lineHeight: 1.02 }}>{t.h}</h1>
        <p style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 40, maxWidth: 600, fontFamily: "var(--serif)" }}>{t.sub}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40 }}>
          <div>
            {step === 0 && <StepDates form={form} set={set} />}
            {step === 1 && <StepSuite selected={selected} setSelected={setSelected} />}
            {step === 2 && <StepGuest form={form} set={set} />}
            {step === 3 && <StepReview form={form} sel={sel} subtotal={subtotal} tax={tax} total={total} set={set} />}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
              {step > 0 ? (
                <button className="btn btn-ghost" onClick={back}><Icon name="arrow_left" size={12} />Back · {["Dates", "Suite", "Guest"][step - 1]}</button>
              ) : <span />}
              <button className="btn btn-primary" disabled={!canContinue} style={{ opacity: canContinue ? 1 : 0.5 }} onClick={() => step === 3 ? setPage("confirm") : next()}>
                {ctaLabel} <Icon name="arrow_right" size={12} />
              </button>
            </div>
          </div>

          <FolioRail step={step} sel={sel} nights={form.nights} subtotal={subtotal} tax={tax} total={total}
            ctaLabel={ctaLabel} disabled={!canContinue}
            onContinue={() => step === 3 ? setPage("confirm") : next()} />
        </div>
      </section>
    </PublicShell>
  );
};

// ============ Step I — Dates ============
const StepDates = ({ form, set }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // a fake June 2026 grid starting on a Monday
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = i - 0; // 1..30 in june, shift for layout
    return d >= 1 && d <= 30 ? d : null;
  });
  const arrivalDay = 12, departureDay = 16;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Arrival → Departure</div>
            <div className="display" style={{ fontSize: 32, fontStyle: "italic", lineHeight: 1 }}>{form.arrival} → {form.departure}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Length of stay</div>
            <div className="display numeral" style={{ fontSize: 32, fontStyle: "italic", lineHeight: 1 }}>{form.nights} nights</div>
          </div>
        </div>

        {/* Mini calendar */}
        <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="arrow_left" size={10} /></button>
            <div className="display" style={{ fontSize: 22, fontStyle: "italic" }}>June MMXXVI</div>
            <button className="btn btn-ghost btn-sm"><Icon name="arrow_right" size={10} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {days.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--mute)", letterSpacing: "0.16em", textTransform: "uppercase", paddingBottom: 6 }}>{d}</div>)}
            {cells.map((d, i) => {
              if (d == null) return <div key={i} />;
              const inRange = d >= arrivalDay && d <= departureDay;
              const isEdge = d === arrivalDay || d === departureDay;
              return (
                <div key={i} style={{
                  aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--serif)", fontSize: 14,
                  background: isEdge ? "var(--ink)" : inRange ? "var(--linen)" : "transparent",
                  color: isEdge ? "var(--paper)" : inRange ? "var(--ink)" : d < 7 ? "var(--mute)" : "var(--ink-3)",
                  border: "1px solid " + (isEdge ? "var(--ink)" : inRange ? "var(--hairline)" : "transparent"),
                  cursor: d >= 7 ? "pointer" : "default", fontStyle: isEdge ? "italic" : "normal",
                }}>{d}</div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 18, fontSize: 11, color: "var(--mute)" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--ink)", marginRight: 6, verticalAlign: "middle" }} />Arrival / Departure</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--linen)", border: "1px solid var(--hairline)", marginRight: 6, verticalAlign: "middle" }} />Stay</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Guests · rooms</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          <Stepper label="Adults" value={form.adults} onChange={v => set("adults", v)} min={1} max={6} />
          <Stepper label="Children" value={form.children} onChange={v => set("children", v)} min={0} max={4} />
          <Stepper label="Rooms" value={form.rooms} onChange={v => set("rooms", v)} min={1} max={3} />
        </div>
      </div>

      <div className="card" style={{ padding: 24, background: "var(--linen)" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Icon name="star" size={16} style={{ color: "var(--brass-deep)", marginTop: 3 }} />
          <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, fontFamily: "var(--serif)" }}>
            <strong style={{ fontWeight: 600, color: "var(--ink)" }}>The week of 12 June is a favourite among returning guests.</strong> The lavender begins in Provence, and the Riviera enjoys mild evenings — 22° to 26°. We recommend booking dinners at La Réserve early.
          </div>
        </div>
      </div>
    </div>
  );
};

const Stepper = ({ label, value, onChange, min, max }) => (
  <div>
    <div className="label" style={{ marginBottom: 8 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--hairline)", padding: 4 }}>
      <button className="btn btn-ghost btn-sm" disabled={value <= min} onClick={() => onChange(value - 1)} style={{ minWidth: 32, padding: "8px 0" }}>−</button>
      <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic" }}>{value}</div>
      <button className="btn btn-ghost btn-sm" disabled={value >= max} onClick={() => onChange(value + 1)} style={{ minWidth: 32, padding: "8px 0" }}>+</button>
    </div>
  </div>
);

// ============ Step II — Suite ============
const StepSuite = ({ selected, setSelected }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <div className="eyebrow">Choose your suite · 4 of 5 available</div>
    {SUITES.map((s, i) => (
      <div key={i} onClick={() => setSelected(i)} className="card" style={{
        display: "grid", gridTemplateColumns: "240px 1fr auto", gap: 0, padding: 0, overflow: "hidden",
        borderColor: selected === i ? "var(--brass)" : "var(--hairline)", borderWidth: selected === i ? 2 : 1,
        cursor: "pointer", transition: "border 0.15s"
      }}>
        <Photo tone={s.tone} ratio="4/3" num={`0${i + 1}`} />
        <div style={{ padding: "28px 28px 28px 32px" }}>
          <h3 className="display" style={{ fontSize: 32, margin: "0 0 6px", lineHeight: 1 }}>{s.name}</h3>
          <p style={{ fontSize: 13, color: "var(--mute)", margin: "0 0 16px", fontFamily: "var(--serif)", fontStyle: "italic" }}>{s.desc}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Wi-Fi", "Espresso", "Bath ritual", i >= 1 && "Sea view", i >= 2 && "Butler"].filter(Boolean).map((a, j) => (
              <span key={j} style={{ fontSize: 10, padding: "4px 10px", border: "1px solid var(--hairline)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>{a}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: "28px 28px", borderLeft: "1px solid var(--hairline-2)", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", textAlign: "right", minWidth: 200, background: selected === i ? "var(--linen)" : "transparent" }}>
          <div>
            <div className="display numeral" style={{ fontSize: 36, lineHeight: 1, fontStyle: "italic" }}>€{s.rate.toLocaleString()}</div>
            <div className="label" style={{ marginTop: 4 }}>per night</div>
          </div>
          <div className={selected === i ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} style={{ pointerEvents: "none" }}>
            {selected === i ? <><Icon name="check" size={12} />Selected</> : "Select"}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============ Step III — Guest details ============
const StepGuest = ({ form, set }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
    <div className="card" style={{ padding: 32 }}>
      <div className="eyebrow" style={{ marginBottom: 20 }}>Primary guest</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="field"><label>First name</label><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Your given name" /></div>
        <div className="field"><label>Last name</label><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Family name" /></div>
        <div className="field"><label>Email</label><input value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></div>
        <div className="field"><label>Mobile</label><input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+33 6 12 34 56 78" /></div>
        <div className="field"><label>Country</label>
          <select value={form.country} onChange={e => set("country", e.target.value)}>
            {["France", "United Kingdom", "Italy", "Switzerland", "Germany", "United States", "Spain", "Other"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Estimated arrival</label>
          <select value={form.arrivalTime} onChange={e => set("arrivalTime", e.target.value)}>
            {["Before 15:00", "15:00–17:00", "After 17:00", "After 21:00", "Next morning"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>

    <div className="card" style={{ padding: 32 }}>
      <div className="eyebrow" style={{ marginBottom: 20 }}>Preferences</div>
      <div className="label" style={{ marginBottom: 10 }}>Bedding</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {["King", "Twin", "Connecting"].map(b => (
          <button key={b} onClick={() => set("bed", b)} style={{
            padding: "12px 22px", border: "1px solid " + (form.bed === b ? "var(--ink)" : "var(--hairline)"),
            background: form.bed === b ? "var(--ink)" : "transparent",
            color: form.bed === b ? "var(--paper)" : "var(--ink)",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, cursor: "pointer"
          }}>{b}</button>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Occasion</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { id: "None", i: "leaf" },
          { id: "Honeymoon", i: "crown" },
          { id: "Anniversary", i: "star" },
          { id: "Birthday", i: "spa" },
        ].map(o => (
          <button key={o.id} onClick={() => set("occasion", o.id)} style={{
            padding: "16px 14px", border: "1px solid " + (form.occasion === o.id ? "var(--brass)" : "var(--hairline)"),
            background: form.occasion === o.id ? "var(--linen)" : "transparent",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            fontSize: 12, fontFamily: "var(--serif)", cursor: "pointer"
          }}>
            <Icon name={o.i} size={18} style={{ color: "var(--brass-deep)" }} />
            {o.id}
          </button>
        ))}
      </div>

      <div className="field"><label>Special requests</label>
        <textarea value={form.requests} onChange={e => set("requests", e.target.value)}
          rows="3" placeholder="Allergies, transfers, surprises, particular bottles…"
          style={{ resize: "vertical", fontFamily: "var(--serif)", fontStyle: "italic" }} />
      </div>
    </div>

    <div className="card" style={{ padding: 24, background: "var(--linen)" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Icon name="crown" size={16} style={{ color: "var(--brass-deep)", marginTop: 3 }} />
        <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, fontFamily: "var(--serif)" }}>
          <strong style={{ fontWeight: 600, color: "var(--ink)" }}>Become an Étoile member.</strong> Complimentary on first stay. Earn one night for every five, plus a private welcome on every arrival.
          <a style={{ marginLeft: 8, color: "var(--brass-deep)", borderBottom: "1px solid var(--brass-deep)", cursor: "pointer" }}>Add to my reservation →</a>
        </div>
      </div>
    </div>
  </div>
);

// ============ Step IV — Review & pay ============
const StepReview = ({ form, sel, subtotal, tax, total, set }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
    <div className="card" style={{ padding: 32 }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>Your reservation</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <ReviewRow l="Guest" v={`${form.firstName || "—"} ${form.lastName || ""}`.trim()} />
        <ReviewRow l="Email" v={form.email || "—"} />
        <ReviewRow l="Suite" v={sel ? sel.name : "—"} />
        <ReviewRow l="Bed" v={form.bed} />
        <ReviewRow l="Arrival" v={`${form.arrival} · ${form.arrivalTime}`} />
        <ReviewRow l="Departure" v={form.departure} />
        <ReviewRow l="Nights" v={form.nights} />
        <ReviewRow l="Guests" v={`${form.adults} adult${form.adults > 1 ? "s" : ""}${form.children ? `, ${form.children} child${form.children > 1 ? "ren" : ""}` : ""}`} />
        <ReviewRow l="Occasion" v={form.occasion} />
        <ReviewRow l="Notes" v={form.requests || "—"} />
      </div>
    </div>

    <div className="card" style={{ padding: 32 }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>Payment · 30% deposit</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {["Visa", "Mastercard", "Amex", "Apple Pay"].map(p => (
          <div key={p} style={{ padding: "10px 16px", border: "1px solid var(--hairline)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{p}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="field" style={{ gridColumn: "span 3" }}><label>Card number</label>
          <input value={form.card} onChange={e => set("card", e.target.value)} placeholder="•••• •••• •••• ••••" style={{ fontFamily: "var(--mono)", letterSpacing: "0.1em" }} />
        </div>
        <div className="field"><label>Expiry</label><input value={form.expiry} onChange={e => set("expiry", e.target.value)} placeholder="MM / YY" /></div>
        <div className="field"><label>CVV</label><input value={form.cvv} onChange={e => set("cvv", e.target.value)} placeholder="•••" /></div>
        <div className="field"><label>Name on card</label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="As printed" /></div>
      </div>
      <div style={{ fontSize: 12, color: "var(--mute)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="key" size={12} />Secured with 3-D Secure · charges appear as "LuxuryStay Nice"
      </div>
    </div>

    <div className="card" style={{ padding: 24, background: "var(--paper)" }}>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
        <span style={{
          width: 18, height: 18, marginTop: 2, border: "1px solid " + (form.accepted ? "var(--ink)" : "var(--hairline)"),
          background: form.accepted ? "var(--ink)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }} onClick={() => set("accepted", !form.accepted)}>
          {form.accepted && <Icon name="check" size={11} style={{ color: "var(--paper)" }} />}
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, fontFamily: "var(--serif)" }}>
          I agree to the <a style={{ color: "var(--brass-deep)", borderBottom: "1px solid var(--brass-deep)" }}>house terms</a>, <a style={{ color: "var(--brass-deep)", borderBottom: "1px solid var(--brass-deep)" }}>cancellation policy</a> (free through 09 June 2026), and authorise a deposit of <strong style={{ color: "var(--ink)" }}>€{Math.round(total * 0.3).toLocaleString()}</strong> to be charged today. The balance is settled on departure.
        </span>
      </label>
    </div>
  </div>
);

const ReviewRow = ({ l, v }) => (
  <div style={{ paddingBottom: 14, borderBottom: "1px dotted var(--hairline)" }}>
    <div className="label" style={{ marginBottom: 4 }}>{l}</div>
    <div style={{ fontSize: 14, fontFamily: "var(--serif)", fontStyle: "italic" }}>{v}</div>
  </div>
);

// ============ CONFIRMATION — ticket-style ============
const ConfirmationPage = ({ setPage, guest, setGuest }) => {
  const name = guest?.name || "Mr. & Mrs. Whitfield";
  return (
    <PublicShell page="book" setPage={setPage} guest={guest} setGuest={setGuest}>
      <section style={{ padding: "60px 64px 100px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Ornament>·  ★  ·</Ornament>
          <div className="eyebrow" style={{ margin: "24px 0 18px", color: "var(--brass-deep)" }}>Reservation confirmed</div>
          <h1 className="display" style={{ fontSize: "clamp(56px, 7.4vw, 96px)", margin: 0, lineHeight: 1.02, letterSpacing: "-0.02em" }}>Until <em>June.</em></h1>
          <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 560, margin: "28px auto 0", fontFamily: "var(--serif)", fontStyle: "italic" }}>
            A confirmation has been sent to your inbox. Our concierge will be in touch shortly to arrange any preferences for your arrival.
          </p>
        </div>

        {/* TICKET */}
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", border: "1px solid var(--ink)", background: "var(--paper)" }}>
          {/* perforation */}
          <div style={{ position: "absolute", left: "calc(58.3% - 0.5px)", top: 0, bottom: 0, width: 1, borderLeft: "2px dashed var(--hairline)" }} />
          <div style={{ position: "absolute", left: "calc(58.3% - 8px)", top: -8, width: 16, height: 16, borderRadius: "50%", background: "var(--ivory)", border: "1px solid var(--ink)" }} />
          <div style={{ position: "absolute", left: "calc(58.3% - 8px)", bottom: -8, width: 16, height: 16, borderRadius: "50%", background: "var(--ivory)", border: "1px solid var(--ink)" }} />

          <div style={{ padding: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic" }}><em>Luxury</em>STAY</div>
                <div className="eyebrow" style={{ marginTop: 8 }}>Boarding pass · Maison Étoile</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Confirmation</div>
                <div className="display numeral" style={{ fontSize: 32, fontStyle: "italic" }}>RS-2849</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 32 }}>
              <ConfirmRow l="Guest" v={name} />
              <ConfirmRow l="Suite" v="Junior 308 · sea view" />
              <ConfirmRow l="Arrival" v="Fri, 12 Jun 2026" sub="from 15:00 · transfer arranged" />
              <ConfirmRow l="Departure" v="Tue, 16 Jun 2026" sub="by 12:00 · or late at €60/h" />
              <ConfirmRow l="Nights" v="4" sub="Spa ritual gift included" />
              <ConfirmRow l="Guests" v="2 adults" sub="1 king bed · cot available" />
            </div>

            <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Concierge note · before you arrive</div>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, fontFamily: "var(--serif)", fontStyle: "italic", margin: 0 }}>
                Priya from our concierge desk will be in touch within the day to ask about transfers, dietary preferences, and any small marks of the occasion you'd like us to attend to.
              </p>
            </div>
          </div>

          <div style={{ padding: 48, background: "var(--linen)" }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Folio total</div>
            <div className="display numeral" style={{ fontSize: 56, lineHeight: 1, fontStyle: "italic", marginBottom: 6 }}>€3,188</div>
            <div style={{ fontSize: 12, color: "var(--mute)", marginBottom: 24 }}>incl. VAT · all extras on departure</div>

            <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: "var(--mute)" }}>Deposit · 30%</span>
                <span style={{ fontFamily: "var(--mono)" }}>€956</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "var(--mute)" }}>Balance on arrival</span>
                <span style={{ fontFamily: "var(--mono)" }}>€2,232</span>
              </div>
            </div>

            <div style={{ padding: "12px 14px", background: "var(--paper)", border: "1px solid var(--hairline)", fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6, marginBottom: 20 }}>
              <strong style={{ fontWeight: 600 }}>Free cancellation</strong> through 09 June 2026. After that, the deposit is retained.
            </div>

            {/* Barcode-ish */}
            <div style={{ display: "flex", gap: 1, height: 36, marginBottom: 8 }}>
              {Array.from({ length: 38 }).map((_, i) => (
                <div key={i} style={{ flex: i % 3 === 0 ? 2 : i % 5 === 0 ? 3 : 1, background: "var(--ink)" }} />
              ))}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--mute)", letterSpacing: "0.2em", textAlign: "center" }}>RS · 2849 · 120626</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 36 }}>
          <button className="btn btn-ghost"><Icon name="download" size={12} />Save as PDF</button>
          <button className="btn btn-ghost"><Icon name="mail" size={12} />Email me a copy</button>
          <button className="btn btn-ghost"><Icon name="calendar" size={12} />Add to calendar</button>
          <button className="btn btn-primary" onClick={() => setPage("stay")}>Open My Stay <Icon name="arrow_right" size={12} /></button>
        </div>

        {/* What's next */}
        <div style={{ marginTop: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>What happens next</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)" }}>
            {[
              { n: "I", t: "Concierge call", s: "Within 24h · preferences" },
              { n: "II", t: "Confirmation pack", s: "Letter + key code by post" },
              { n: "III", t: "Travel notes", s: "48h before arrival" },
              { n: "IV", t: "Welcome", s: "Suite ready from 15:00" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--paper)", padding: "24px 24px 28px" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontStyle: "italic", color: "var(--brass-deep)", marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.06em" }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
};

const ConfirmRow = ({ l, v, sub }) => (
  <div>
    <div className="label" style={{ marginBottom: 4 }}>{l}</div>
    <div style={{ fontSize: 16, fontWeight: 500, fontFamily: "var(--serif)" }}>{v}</div>
    {sub && <div style={{ fontSize: 11, color: "var(--mute)", marginTop: 4 }}>{sub}</div>}
  </div>
);

// ============ MY STAY ============
const PortalPage = ({ setPage, guest, setGuest }) => {
  const name = guest?.name || "Lord Ashbury";
  const initials = guest?.initials || "A";
  const first = name.split(" ").pop();
  return (
    <PublicShell page="stay" setPage={setPage} guest={guest} setGuest={setGuest}>
      {/* HERO STRIP */}
      <section style={{ background: "linear-gradient(160deg, #2A2620 0%, #1A1814 100%)", color: "var(--ivory)", padding: "64px 64px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(160, 128, 84, 0.22), transparent 55%)" }} />
        <div style={{ position: "absolute", top: 40, right: 64, fontFamily: "var(--serif)", fontSize: 220, fontStyle: "italic", color: "rgba(160, 128, 84, 0.08)", lineHeight: 0.85 }}>★</div>
        <div style={{ position: "relative", maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 1, background: "var(--brass)" }} />
            <div className="eyebrow" style={{ color: "var(--brass-soft)" }}>My Stay · Day II of VII · Suite 301</div>
          </div>
          <h1 className="display" style={{ fontSize: 96, margin: "0 0 18px", lineHeight: 0.95, color: "var(--ivory)" }}>Bonjour, <em>{first}.</em></h1>
          <p style={{ fontSize: 18, color: "var(--mute-2)", maxWidth: 620, lineHeight: 1.65, fontFamily: "var(--serif)", fontStyle: "italic", marginBottom: 36 }}>
            The terrace was readied this morning with the Times of London and your usual pot of Earl Grey. The sea is calm; we expect a clear sunset at 21:12.
          </p>

          {/* live tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "rgba(247, 243, 236, 0.08)", border: "1px solid rgba(247, 243, 236, 0.12)" }}>
            {[
              { l: "Today · Nice", v: "23°", s: "Clear · breeze" },
              { l: "Sunset", v: "21:12", s: "Cabana ready" },
              { l: "Nights remaining", v: "V", s: "Check-out Mon" },
              { l: "Folio · current", v: "€11,368", s: "Settled on dep." },
              { l: "Concierge", v: "Priya", s: "On until 22:00" },
            ].map((t, i) => (
              <div key={i} style={{ background: "rgba(26, 24, 20, 0.85)", padding: "20px 22px" }}>
                <div className="eyebrow" style={{ color: "var(--brass-soft)", marginBottom: 8 }}>{t.l}</div>
                <div className="display numeral" style={{ fontSize: 30, fontStyle: "italic", lineHeight: 1, color: "var(--ivory)" }}>{t.v}</div>
                <div style={{ fontSize: 10, color: "var(--mute-2)", marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 64px 80px", maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48 }}>
        {/* LEFT */}
        <div>
          {/* Today's schedule */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 className="display" style={{ fontSize: 44, margin: 0 }}>Today at <em>the house.</em></h2>
            <span className="eyebrow">Tuesday · 5 May</span>
          </div>

          <div style={{ borderTop: "1px solid var(--hairline)", marginBottom: 48 }}>
            {[
              { time: "09:00", t: "Breakfast · Le Jardin", s: "Table 4 · under the olive", i: "coffee", tone: "warm", status: "Reserved" },
              { time: "11:30", t: "Tennis · clay court II", s: "Coach Mathéo · 60 min", i: "star", tone: "olive", status: "Confirmed" },
              { time: "14:00", t: "Spa · La Mer ritual", s: "Hammam, salt scrub, oil", i: "spa", tone: "sea", status: "Booked · 90 min" },
              { time: "19:30", t: "Sunset walk · garden", s: "Suggested · Adèle will leave a flute", i: "leaf", tone: "sand", status: "Suggested" },
              { time: "20:30", t: "Dinner · Le Jardin", s: "Tasting menu · paired wines", i: "star", tone: "deep", status: "Reserved" },
            ].map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 20, padding: "20px 0", borderBottom: "1px solid var(--hairline)", alignItems: "center" }}>
                <div className="display numeral" style={{ fontSize: 24, fontStyle: "italic", color: "var(--brass-deep)" }}>{c.time}</div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: "var(--linen)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brass-deep)" }}>
                    <Icon name={c.i} size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{c.t}</div>
                    <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 3, fontFamily: "var(--serif)", fontStyle: "italic" }}>{c.s}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mute)", textAlign: "right" }}>{c.status}</div>
              </div>
            ))}
          </div>

          {/* Request a service */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 className="display" style={{ fontSize: 36, margin: 0 }}>Request <em>a service.</em></h2>
            <span style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.06em" }}>typical reply · 4 min</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 24, maxWidth: 540, fontFamily: "var(--serif)", fontStyle: "italic" }}>
            A note, a tray, a car at the entrance. Tap and our team will respond. For something more specific, speak with Priya directly.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--hairline)", border: "1px solid var(--hairline)" }}>
            {[
              { l: "In-room dining", s: "Menu · 24h", i: "coffee" },
              { l: "Housekeeping refresh", s: "Turn-down · linens", i: "sparkle" },
              { l: "Wake-up call", s: "Verbal · or piano", i: "clock" },
              { l: "Laundry & pressing", s: "Returned · 4h", i: "leaf" },
              { l: "Airport transfer", s: "Sedan or limousine", i: "arrow_right" },
              { l: "Reserve dinner", s: "Le Jardin · 2★", i: "star" },
              { l: "Spa appointment", s: "Six rituals · two hammams", i: "spa" },
              { l: "Maintenance · discreet", s: "Tomás · within the hour", i: "wrench" },
              { l: "Late check-out", s: "€60 / hour · subject to availability", i: "key" },
            ].map((s, i) => (
              <button key={i} style={{
                background: "var(--paper)", border: "none", padding: "22px 22px",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, cursor: "pointer", textAlign: "left",
                transition: "background 0.15s"
              }} onMouseEnter={e => e.currentTarget.style.background = "var(--linen)"} onMouseLeave={e => e.currentTarget.style.background = "var(--paper)"}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <Icon name={s.i} size={16} style={{ color: "var(--brass-deep)" }} />
                  <Icon name="arrow_right" size={11} style={{ color: "var(--mute)" }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.l}</div>
                <div style={{ fontSize: 11, color: "var(--mute)", fontFamily: "var(--serif)", fontStyle: "italic" }}>{s.s}</div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — suite + folio + concierge */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Suite card */}
          <div style={{ border: "1px solid var(--hairline)", overflow: "hidden", background: "var(--paper)" }}>
            <Photo tone="deep" ratio="16/10" num="301" label="Premier Suite" sub="Your suite this stay" />
            <div style={{ padding: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Stay · 7 nights</div>
              {[
                { l: "Check-in", v: "Mon, 4 May" },
                { l: "Check-out", v: "Mon, 11 May" },
                { l: "Guests", v: "1 + butler" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                  <span style={{ color: "var(--mute)" }}>{r.l}</span>
                  <span style={{ fontWeight: 500 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live folio */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <div className="eyebrow">Live folio</div>
              <div style={{ fontSize: 10, color: "var(--brass-deep)", letterSpacing: "0.16em", textTransform: "uppercase" }}>● Updating</div>
            </div>
            <div className="display numeral" style={{ fontSize: 48, lineHeight: 1, fontStyle: "italic", marginBottom: 4 }}>€11,368</div>
            <div style={{ fontSize: 11, color: "var(--mute)", marginBottom: 18 }}>incl. VAT · settled on departure</div>
            {[
              { l: "Suite · 2 nights", v: "€6,200" },
              { l: "In-room dining", v: "€385" },
              { l: "La Mer spa", v: "€420" },
              { l: "Bar · cellar", v: "€140" },
              { l: "VAT (10%)", v: "€1,034" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                <span style={{ color: "var(--mute)" }}>{r.l}</span>
                <span style={{ fontFamily: "var(--mono)" }}>{r.v}</span>
              </div>
            ))}
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>View full folio</button>
          </div>

          {/* Concierge */}
          <div style={{ background: "var(--ink)", color: "var(--ivory)", padding: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -10, fontFamily: "var(--serif)", fontSize: 140, fontStyle: "italic", color: "rgba(160, 128, 84, 0.12)", lineHeight: 0.8 }}>P</div>
            <div className="eyebrow" style={{ color: "var(--brass-soft)", marginBottom: 16, position: "relative" }}>Your concierge</div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20, position: "relative" }}>
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, background: "var(--brass)", color: "var(--paper)" }}>PS</div>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontStyle: "italic" }}>Priya Shankar</div>
                <div style={{ fontSize: 11, color: "var(--brass-soft)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 3 }}>On duty · 06:00–22:00</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--mute-2)", lineHeight: 1.6, fontFamily: "var(--serif)", fontStyle: "italic", marginBottom: 20, position: "relative" }}>
              "A pleasure, sir. Anything I can attend to before your spa visit — perhaps a tisane brought up to the terrace?"
            </p>
            <div style={{ display: "flex", gap: 8, position: "relative" }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, color: "var(--ivory)", borderColor: "rgba(247, 243, 236, 0.2)" }}><Icon name="phone" size={12} />Call</button>
              <button className="btn btn-brass btn-sm" style={{ flex: 1 }}><Icon name="mail" size={12} />Message</button>
            </div>
          </div>

          {/* Étoile member */}
          <div style={{ padding: 20, background: "var(--linen)", border: "1px solid var(--hairline)", display: "flex", gap: 14, alignItems: "center" }}>
            <Icon name="crown" size={20} style={{ color: "var(--brass-deep)" }} />
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600 }}>Étoile · year IV</div>
              <div style={{ color: "var(--mute)" }}>3 stays earn a complimentary night. You're 2 of 3.</div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
};

// ============ CONTACT ============
const ContactPage = ({ setPage, guest, setGuest }) => (
  <PublicShell page="contact" setPage={setPage} guest={guest} setGuest={setGuest}>
    <section style={{ padding: "60px 64px 40px", maxWidth: 1440, margin: "0 auto" }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>Folio VI · Correspondence</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "end" }}>
        <h1 className="display" style={{ fontSize: "clamp(52px, 7vw, 88px)", margin: 0, lineHeight: 1.02 }}>A note, <em>before</em><br />you arrive.</h1>
        <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.75, fontFamily: "var(--serif)", maxWidth: 460 }}>
          Our concierge replies within four hours, in any language, day or night. For urgent matters during travel, the direct line below is answered by a human, always.
        </p>
      </div>
    </section>

    {/* MAP + CHANNELS */}
    <section style={{ padding: "60px 64px 60px", maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }}>
      {/* faux map */}
      <div style={{ position: "relative", aspectRatio: "16/10", border: "1px solid var(--hairline)", overflow: "hidden", background: "linear-gradient(160deg, #EFE8DB, #D9D2C3)" }}>
        <svg viewBox="0 0 800 500" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74, 68, 59, 0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="500" fill="url(#grid)" />
          {/* coast line */}
          <path d="M 0 380 Q 200 360 400 370 T 800 350 L 800 500 L 0 500 Z" fill="#7A8A8E" opacity="0.35" />
          <path d="M 0 380 Q 200 360 400 370 T 800 350" fill="none" stroke="#4A5A60" strokeWidth="1.2" />
          {/* roads */}
          <path d="M 0 200 Q 250 230 500 220 T 800 240" fill="none" stroke="rgba(74, 68, 59, 0.3)" strokeWidth="1" />
          <path d="M 200 0 L 250 500" fill="none" stroke="rgba(74, 68, 59, 0.2)" strokeWidth="1" />
          <path d="M 600 0 L 550 500" fill="none" stroke="rgba(74, 68, 59, 0.2)" strokeWidth="1" />
          {/* parcels */}
          {Array.from({ length: 14 }).map((_, i) => {
            const x = (i % 7) * 110 + 30;
            const y = Math.floor(i / 7) * 120 + 50;
            return <rect key={i} x={x} y={y} width="80" height="90" fill="rgba(160, 128, 84, 0.1)" stroke="rgba(74, 68, 59, 0.15)" strokeWidth="0.5" />;
          })}
          {/* pin */}
          <circle cx="420" cy="290" r="14" fill="#A08054" />
          <circle cx="420" cy="290" r="36" fill="rgba(160, 128, 84, 0.2)" />
          <text x="420" y="294" textAnchor="middle" fill="#FBF8F2" fontFamily="serif" fontSize="14" fontStyle="italic">★</text>
        </svg>
        <div style={{ position: "absolute", top: 24, left: 24, background: "var(--paper)", padding: "14px 18px", border: "1px solid var(--ink)" }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Maison Étoile</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic" }}>14 Promenade des Anglais</div>
          <div style={{ fontSize: 11, color: "var(--mute)", marginTop: 2 }}>06000 Nice · France</div>
        </div>
        <div style={{ position: "absolute", bottom: 24, right: 24, fontSize: 10, color: "var(--mute)", letterSpacing: "0.16em", textTransform: "uppercase" }}>43.6961° N · 7.2719° E</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { i: "phone", l: "Concierge · 24h", main: "+33 4 93 88 14 24", sub: "All languages · always a human" },
          { i: "mail", l: "Reservations", main: "reservations@luxurystay.co", sub: "Reply within 4 hours" },
          { i: "leaf", l: "Press & enquiries", main: "press@luxurystay.co", sub: "Veuillez écrire à Madame Aubert" },
          { i: "key", l: "The house", main: "14 Promenade des Anglais", sub: "06000 Nice · France" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 18, padding: "20px 0", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ width: 40, height: 40, border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brass-deep)", flexShrink: 0 }}>
              <Icon name={c.i} size={16} />
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>{c.l}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic", lineHeight: 1.1 }}>{c.main}</div>
              <div style={{ fontSize: 11, color: "var(--mute)", marginTop: 6, letterSpacing: "0.06em" }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* HOURS + FORM */}
    <section style={{ padding: "40px 64px 100px", maxWidth: 1440, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Hours · venues of the house</div>
        {[
          { v: "Reception", h: "24 hours" },
          { v: "Le Jardin · dining", h: "19:00 – 23:00 · Wed–Sun" },
          { v: "Le Petit Bar", h: "17:00 – 02:00 · daily" },
          { v: "La Mer · spa", h: "08:00 – 21:00 · daily" },
          { v: "Pool & cabanas", h: "07:00 – sunset" },
          { v: "Concierge desk", h: "06:00 – 22:00" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--hairline)" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic" }}>{r.v}</span>
            <span style={{ fontSize: 12, color: "var(--mute)", letterSpacing: "0.04em" }}>{r.h}</span>
          </div>
        ))}
        <div style={{ marginTop: 24, padding: 18, background: "var(--linen)", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6, fontFamily: "var(--serif)", fontStyle: "italic" }}>
          Closed annually for renewal, the first two weeks of February.
        </div>
      </div>

      <div className="card" style={{ padding: 40, alignSelf: "start" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div className="eyebrow">Send a message</div>
          <div style={{ fontSize: 11, color: "var(--brass-deep)", letterSpacing: "0.16em", textTransform: "uppercase" }}>★ Reply within 4h</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div className="field"><label>First name</label><input placeholder="Your name" /></div>
          <div className="field"><label>Last name</label><input placeholder="Your name" /></div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Email</label><input placeholder="you@example.com" /></div>
          <div className="field"><label>Phone (optional)</label><input placeholder="+33…" /></div>
          <div className="field"><label>Preferred language</label>
            <select defaultValue="en">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Subject</label>
            <select defaultValue="reservation">
              <option value="reservation">Reservation enquiry</option>
              <option value="event">Private event · wedding · celebration</option>
              <option value="press">Press</option>
              <option value="career">Careers</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Message</label>
            <textarea rows="6" placeholder="How may we be of service?" style={{ resize: "vertical" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          <div style={{ fontSize: 11, color: "var(--mute)" }}>By writing, you accept our discretion policy.</div>
          <button className="btn btn-primary" style={{ padding: "14px 30px" }}>Send message <Icon name="arrow_right" size={12} /></button>
        </div>
      </div>
    </section>
  </PublicShell>
);

// ============ UNIFIED SIGN IN ============
const SignInPage = ({ setRole, setPage, setGuest }) => {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [resolved, setResolved] = useState(null);
  const [pending, setPending] = useState(false);

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
  const ctaLabel = tab === "signup" ? "Create account" : isStaff ? `Sign in to ${resolved.role} console` : resolved ? "Sign in to My Stay" : "Continue";

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.1fr 1fr", background: "var(--ivory)" }}>
      <div style={{ background: "linear-gradient(160deg, #2A2620 0%, #1A1814 100%)", color: "var(--ivory)", padding: "56px 56px 56px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 25%, rgba(160, 128, 84, 0.22), transparent 55%)" }} />
        <div style={{ position: "absolute", top: 40, right: 56, fontFamily: "var(--serif)", fontSize: 300, fontStyle: "italic", color: "rgba(160, 128, 84, 0.08)", lineHeight: 0.8 }}>★</div>
        <div style={{ position: "relative" }}>
          <div onClick={() => setPage("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 30, fontStyle: "italic" }}>Luxury</span>
            <span style={{ fontFamily: "var(--serif)", fontSize: 30, letterSpacing: "0.04em" }}>STAY</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--brass-soft)", marginTop: 10 }}>One door · every guest</div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ width: 60, height: 1, background: "var(--brass)", marginBottom: 28 }} />
          <div className="display display-italic" style={{ fontSize: 64, lineHeight: 1.02, maxWidth: 560, color: "var(--ivory)", letterSpacing: "-0.01em" }}>
            "Service is the architecture of memory."
          </div>
          <div style={{ marginTop: 28, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--brass-soft)" }}>— House motto · MCMXXIV</div>
        </div>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--mute-2)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          <span>Maison Étoile · Côte d'Azur</span>
          <span>Vol. CII · MMXXVI</span>
        </div>
      </div>
      <div style={{ padding: 56, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 460, margin: "0 auto", width: "100%" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{tab === "signup" ? "Create your account" : "Welcome back"}</div>
          <h1 className="display" style={{ fontSize: 60, margin: "0 0 12px", lineHeight: 1 }}>
            {tab === "signup" ? <>Begin your <em>residency.</em></> : <>Sign <em>in.</em></>}
          </h1>
          <p style={{ color: "var(--ink-3)", marginBottom: 28, fontSize: 14, lineHeight: 1.6, fontFamily: "var(--serif)", fontStyle: "italic" }}>
            One sign-in for guests and staff alike. We'll route you to the right place.
          </p>

          <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)", marginBottom: 28 }}>
            {[{ id: "signin", l: "Sign in" }, { id: "signup", l: "Create account" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "14px 16px", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
                background: "transparent",
                color: tab === t.id ? "var(--ink)" : "var(--mute)",
                borderBottom: tab === t.id ? "2px solid var(--ink)" : "2px solid transparent", marginBottom: -1,
                border: "none", borderBottomWidth: 2, cursor: "pointer", fontWeight: tab === t.id ? 600 : 400
              }}>{t.l}</button>
            ))}
          </div>

          {tab === "signup" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div className="field"><label>First name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Your name" /></div>
              <div className="field"><label>Last name</label><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Your name" /></div>
            </div>
          )}

          <div className="field" style={{ marginBottom: 18 }}><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div className="field" style={{ marginBottom: 14 }}><label>Password</label><input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••••••" /></div>

          {resolved && tab === "signin" && (
            <div style={{ background: "var(--linen)", border: "1px solid var(--hairline)", padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name={isStaff ? "key" : "crown"} size={14} style={{ color: "var(--brass-deep)" }} />
              <span style={{ fontFamily: "var(--serif)" }}>Recognised as <strong style={{ fontWeight: 600, fontStyle: "italic" }}>{resolved.name}</strong> · routing to {isStaff ? `${resolved.role} console` : "My Stay"}</span>
            </div>
          )}

          <button className="btn btn-primary" disabled={pending} style={{ width: "100%", padding: "16px", justifyContent: "center", opacity: pending ? 0.6 : 1 }} onClick={submit}>
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

Object.assign(window, { SignInPage, LandingPage, SuitesPage, ContactPage, GuestBookPage, ConfirmationPage, PortalPage });

// LuxuryStay app shell — sidebar, topbar, role-aware navigation
const { useState, useMemo, useEffect } = React;

// Navigation map — each item declares which roles see it
const NAV = [
  { section: "Operations", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["admin", "manager", "receptionist"] },
    { id: "reservations", label: "Reservations", icon: "calendar", roles: ["admin", "manager", "receptionist"] },
    { id: "checkin", label: "Check-in / out", icon: "key", roles: ["admin", "manager", "receptionist"] },
    { id: "rooms", label: "Rooms", icon: "bed", roles: ["admin", "manager", "receptionist", "housekeeping"] },
    { id: "housekeeping", label: "Housekeeping", icon: "sparkle", roles: ["admin", "manager", "housekeeping"], badge: "5" },
    { id: "maintenance", label: "Maintenance", icon: "wrench", roles: ["admin", "manager", "housekeeping"] },
  ]},
  { section: "Commerce", items: [
    { id: "billing", label: "Billing", icon: "receipt", roles: ["admin", "manager", "receptionist"] },
    { id: "guests", label: "Guests", icon: "user", roles: ["admin", "manager", "receptionist"] },
    { id: "feedback", label: "Feedback", icon: "star", roles: ["admin", "manager"] },
  ]},
  { section: "Administration", items: [
    { id: "analytics", label: "Analytics", icon: "chart", roles: ["admin", "manager"] },
    { id: "staff", label: "Staff & Roles", icon: "users", roles: ["admin"] },
    { id: "settings", label: "Settings", icon: "settings", roles: ["admin"] },
  ]},
];

const ROLE_INFO = {
  admin: { name: "Margaux Devereaux", title: "General Manager · Admin", initials: "MD" },
  manager: { name: "Henri Cassel", title: "Front Office Manager", initials: "HC" },
  receptionist: { name: "Yuki Tanaka", title: "Receptionist", initials: "YT" },
  housekeeping: { name: "Rosa Mendoza", title: "Head of Housekeeping", initials: "RM" },
};

const PAGE_META = {
  dashboard: { crumbs: ["Operations", "Dashboard"] },
  reservations: { crumbs: ["Operations", "Reservations"] },
  checkin: { crumbs: ["Operations", "Front Desk"] },
  rooms: { crumbs: ["Operations", "Rooms"] },
  housekeeping: { crumbs: ["Operations", "Housekeeping"] },
  maintenance: { crumbs: ["Operations", "Maintenance"] },
  billing: { crumbs: ["Commerce", "Billing"] },
  guests: { crumbs: ["Commerce", "Guests"] },
  feedback: { crumbs: ["Commerce", "Feedback"] },
  analytics: { crumbs: ["Administration", "Analytics"] },
  staff: { crumbs: ["Administration", "Staff"] },
  settings: { crumbs: ["Administration", "Settings"] },
};

const Sidebar = ({ role, page, setPage }) => {
  const filteredNav = NAV
    .map(s => ({ ...s, items: s.items.filter(i => i.roles.includes(role)) }))
    .filter(s => s.items.length > 0);
  const info = ROLE_INFO[role];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mark">
          <span className="name">Luxury</span><span className="suf">STAY</span>
        </div>
        <div className="tag">Maison Étoile · Côte d'Azur</div>
      </div>
      {filteredNav.map(section => (
        <div key={section.section} style={{ marginBottom: 8 }}>
          <div className="sidebar-section">{section.section}</div>
          {section.items.map(item => (
            <div key={item.id}
              className={`sidebar-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}>
              <Icon name={item.icon} size={16} className="icon" />
              <span>{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}
      <div className="sidebar-user">
        <div className="avatar">{info.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{info.name}</div>
          <div style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{info.title}</div>
        </div>
        <button className="icon-btn" title="Sign out" onClick={() => setPage("login")}>
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
  );
};

const Topbar = ({ page, role, setRole }) => {
  const meta = PAGE_META[page] || { crumbs: ["—"] };
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="crumbs">
          {meta.crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">/</span>}
              <span className={i === meta.crumbs.length - 1 ? "current" : ""}>{c}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="topbar-right">
        <div className="search">
          <Icon name="search" size={14} />
          <span>Search rooms, guests, reservations…</span>
          <span className="kbd" style={{ marginLeft: "auto" }}>⌘K</span>
        </div>
        <RoleSwitcher role={role} setRole={setRole} />
        <button className="icon-btn" title="Notifications">
          <Icon name="bell" size={16} />
          <span className="dot" />
        </button>
      </div>
    </header>
  );
};

const RoleSwitcher = ({ role, setRole }) => {
  const [open, setOpen] = useState(false);
  const roles = [
    { id: "admin", label: "Admin" },
    { id: "manager", label: "Manager" },
    { id: "receptionist", label: "Receptionist" },
    { id: "housekeeping", label: "Housekeeping" },
  ];
  const current = roles.find(r => r.id === role);
  return (
    <div style={{ position: "relative" }}>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(o => !o)}
        style={{ borderColor: "var(--brass)", color: "var(--brass-deep)" }}>
        <span style={{ color: "var(--mute)" }}>Viewing as</span>
        <span style={{ marginLeft: 4 }}>{current.label}</span>
        <Icon name="arrow_down" size={12} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "var(--paper)", border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-md)", padding: 6, minWidth: 220, zIndex: 21,
            boxShadow: "0 12px 32px rgba(26, 24, 20, 0.08)"
          }}>
            <div style={{ padding: "8px 12px", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--mute)" }}>
              Demo · Switch role
            </div>
            {roles.map(r => (
              <div key={r.id}
                onClick={() => { setRole(r.id); setOpen(false); }}
                style={{
                  padding: "10px 12px", borderRadius: "var(--radius)", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                  background: role === r.id ? "var(--linen)" : "transparent",
                  fontSize: 13,
                }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>
                  {ROLE_INFO[r.id].initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: "var(--mute)" }}>{ROLE_INFO[r.id].name}</div>
                </div>
                {role === r.id && <Icon name="check" size={14} style={{ color: "var(--brass)" }} />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.NAV = NAV;
window.ROLE_INFO = ROLE_INFO;

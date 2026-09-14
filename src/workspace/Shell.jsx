import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { catParts, sprayForMonth } from "./lib/time.js";
import { useWorkspace } from "./store.jsx";
import Pulse from "./views/Pulse.jsx";
import Vault from "./views/Vault.jsx";
import Ledger from "./views/Ledger.jsx";
import Journeys from "./views/Journeys.jsx";
import Accomodations from "./views/Accomodations.jsx";
import Crew from "./views/Crew.jsx";
import Settings from "./views/Settings.jsx";

const NAV = [
  { section: "Today", items: [
    { to: "/admin", label: "Dashboard", end: true }
  ]},
  { section: "Guests", items: [
    { to: "/admin/journeys", label: "Bookings" },
    { to: "/admin/accomodations", label: "Accommodations" }
  ]},
  { section: "Office", items: [
    { to: "/admin/vault", label: "Files" },
    { to: "/admin/ledger", label: "Finance" },
    { to: "/admin/crew", label: "Team" },
    { to: "/admin/settings", label: "Settings" }
  ]}
];

export default function Shell() {
  const { you, signOut, toasts } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState(catParts());
  const navigate = useNavigate();
  const location = useLocation();
  const spray = sprayForMonth();

  useEffect(() => {
    const t = setInterval(() => setClock(catParts()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("ws-nav-lock", open);
    return () => document.documentElement.classList.remove("ws-nav-lock");
  }, [open]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Tunyafrika Admin";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.title = prev;
      robots.remove();
    };
  }, []);

  return (
    <div className={`ws${open ? " is-nav-open" : ""}`}>
      {open && <button type="button" className="ws-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <aside className={`ws-side${open ? " is-open" : ""}`}>
        <div className="ws-brand">
          <img src="/assets/logo-cream.png" alt="Tunyafrika" />
          <div className="ws-kicker">Admin</div>
        </div>
        <nav className="ws-nav" onClick={() => setOpen(false)}>
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="ws-nav-sec">{group.section}</div>
              {group.items.map((item) => (
                <NavLink key={item.label} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "active" : "")}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="ws-side-foot">
          <a href="/">Website</a>
          <button type="button" onClick={() => { signOut(); navigate("/admin"); }}>Sign out</button>
        </div>
      </aside>
      <div className="ws-main">
        <header className="ws-top">
          <div className="ws-top-meta">
            <button type="button" className="ws-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <span /><span /><span />
            </button>
            <div>
              <div className="ws-kicker">CAT</div>
              <div className="ws-clock">{clock.weekday} {clock.day} {clock.month} · {clock.hour}:{clock.minute}</div>
            </div>
            <div className="ws-chip">{spray.label}</div>
          </div>
          <div className="ws-you">
            <span className="ws-mono">{you?.initials || "—"}</span>
            <span className="ws-you-name">
              <div className="ws-kicker">Admin</div>
              {you?.name}
            </span>
          </div>
        </header>
        <div className="ws-page">
          <Routes>
            <Route index element={<Pulse />} />
            <Route path="vault" element={<Vault />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="journeys" element={<Journeys />} />
            <Route path="accomodations" element={<Accomodations />} />
            <Route path="crew" element={<Crew />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
      <div className="ws-toasts">
        {toasts.map((t) => <div key={t.id} className="ws-toast">{t.message}</div>)}
      </div>
    </div>
  );
}

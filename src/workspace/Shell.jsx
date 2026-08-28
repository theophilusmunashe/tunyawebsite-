import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { catParts, greeting, sprayForMonth } from "./lib/time.js";
import { useWorkspace } from "./store.jsx";
import Pulse from "./views/Pulse.jsx";
import Vault from "./views/Vault.jsx";
import Dispatch from "./views/Dispatch.jsx";
import Ledger from "./views/Ledger.jsx";
import Journeys from "./views/Journeys.jsx";
import Manifest from "./views/Manifest.jsx";
import BorderDesk from "./views/BorderDesk.jsx";
import Spray from "./views/Spray.jsx";
import Brief from "./views/Brief.jsx";
import Crew from "./views/Crew.jsx";
import Settings from "./views/Settings.jsx";

const NAV = [
  { section: "The desk", items: [
    { to: "/admin", label: "Pulse", end: true },
    { to: "/admin/dispatch", label: "Dispatch" },
    { to: "/admin/manifest", label: "Manifest" },
    { to: "/admin/brief", label: "Thunder Brief" }
  ]},
  { section: "The journey", items: [
    { to: "/admin/journeys", label: "Journeys" },
    { to: "/admin/border", label: "Border Desk" },
    { to: "/admin/spray", label: "Spray Index" }
  ]},
  { section: "The house", items: [
    { to: "/admin/vault", label: "The Vault" },
    { to: "/admin/ledger", label: "The Ledger" },
    { to: "/admin/crew", label: "Crew" },
    { to: "/admin/settings", label: "Settings" }
  ]}
];

export default function Shell() {
  const { you, signOut, toasts } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState(catParts());
  const navigate = useNavigate();
  const spray = sprayForMonth();

  useEffect(() => {
    const t = setInterval(() => setClock(catParts()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = "Tunyafrika Workspace — The Basecamp";
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
    <div className="ws">
      <aside className={`ws-side${open ? " is-open" : ""}`}>
        <div className="ws-brand">
          <img src="/assets/logo-cream.png" alt="Tunyafrika" />
          <div className="ws-kicker">The Basecamp</div>
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
          <a href="/">Leave for the public site</a>
          <button type="button" onClick={() => { signOut(); navigate("/admin"); }}>Lock the desk</button>
        </div>
      </aside>
      <div className="ws-main">
        <header className="ws-top">
          <div className="ws-top-meta">
            <button type="button" className="ws-burger" aria-label="Open menu" onClick={() => setOpen((v) => !v)}>
              <span /><span /><span />
            </button>
            <div>
              <div className="ws-kicker">Central Africa Time</div>
              <div style={{ fontSize: 14 }}>{clock.weekday} {clock.day} {clock.month} · {clock.hour}:{clock.minute}</div>
            </div>
            <div className="ws-chip">{spray.label} · curtain {spray.curtain}%</div>
          </div>
          <div className="ws-you">
            <span className="ws-mono">{you?.initials || "—"}</span>
            <span>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b3955c" }}>{greeting()}</div>
              {you?.name}
            </span>
          </div>
        </header>
        <div className="ws-page">
          <Routes>
            <Route index element={<Pulse />} />
            <Route path="vault" element={<Vault />} />
            <Route path="dispatch" element={<Dispatch />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="journeys" element={<Journeys />} />
            <Route path="manifest" element={<Manifest />} />
            <Route path="border" element={<BorderDesk />} />
            <Route path="spray" element={<Spray />} />
            <Route path="brief" element={<Brief />} />
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

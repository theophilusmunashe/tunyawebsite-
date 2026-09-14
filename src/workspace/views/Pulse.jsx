import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminBootstrap } from "../../accomodations/api.js";
import { useWorkspace } from "../store.jsx";
import { Money, PageHead } from "../ui.jsx";

export default function Pulse() {
  const { you, journeys, files, quotes, settings, updateSettings } = useWorkspace();
  const live = journeys.filter((j) => ["confirmed", "in-country", "quoted"].includes(j.stage));
  const [newEnquiries, setNewEnquiries] = useState(0);

  useEffect(() => {
    let alive = true;
    adminBootstrap()
      .then((data) => {
        if (!alive) return;
        setNewEnquiries((data.enquiries || []).filter((e) => e.status === "new").length);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <PageHead
        title={you?.name?.split(" ")[0] ? `Hi, ${you.name.split(" ")[0]}` : "Dashboard"}
        action={<Link to="/admin/journeys" className="ws-btn">New booking</Link>}
      />

      <div className="ws-stats">
        <div className="ws-stat"><div className="ws-kicker">Bookings</div><b>{journeys.length}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Quotes</div><b>{quotes.length}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Stay enquiries</div><b>{newEnquiries}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Files</div><b>{files.length}</b></div>
      </div>

      <div className="ws-grid-2">
        <div className="ws-panel">
          <div className="ws-kicker">Active bookings</div>
          {live.length === 0 && <p className="ws-lede">No active bookings.</p>}
          {live.slice(0, 6).map((j) => (
            <div className="ws-row" key={j.id}>
              <div>
                <div className="ws-kicker">{j.stage === "in-country" ? "On trip" : j.stage}</div>
                <strong>{j.guestName}</strong>
                <p>{j.product} · {j.dates || "Dates TBA"} · <Money value={j.value} /></p>
              </div>
            </div>
          ))}
          <div className="ws-actions">
            <Link to="/admin/journeys" className="ws-btn slim ghost">Bookings</Link>
            <Link to="/admin/accomodations" className="ws-btn slim">Accommodations</Link>
            <Link to="/admin/ledger" className="ws-btn slim ghost">Finance</Link>
          </div>
        </div>

        <div className="ws-panel paper">
          <div className="ws-kicker">Team note</div>
          <textarea
            style={{ width: "100%", minHeight: 140, background: "#fff", color: "#0d2b1e", border: "1px solid rgba(13,43,30,0.28)", padding: 12, fontFamily: "inherit", fontSize: 15, marginTop: 10 }}
            value={settings.chalkboard || ""}
            onChange={(e) => updateSettings({ chalkboard: e.target.value })}
            placeholder="Shared note for the team"
          />
        </div>
      </div>
    </div>
  );
}

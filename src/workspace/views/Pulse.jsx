import { Link } from "react-router-dom";
import { prettyDate, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { CrewName, Money, PageHead, PriorityMark } from "../ui.jsx";

export default function Pulse() {
  const { you, tasks, journeys, movements, files, settings, updateSettings, crew } = useWorkspace();
  const today = todayISO();
  const openTasks = tasks.filter((t) => t.status !== "done");
  const high = openTasks.filter((t) => t.priority === "thunder");
  const todayMoves = movements.filter((m) => m.whenDate === today);
  const live = journeys.filter((j) => ["confirmed", "in-country"].includes(j.stage));

  return (
    <div>
      <PageHead
        title={you?.name?.split(" ")[0] ? `Hi, ${you.name.split(" ")[0]}` : "Dashboard"}
        action={<Link to="/admin/dispatch" className="ws-btn">New task</Link>}
      />

      <div className="ws-stats">
        <div className="ws-stat"><div className="ws-kicker">Tasks</div><b>{openTasks.length}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Today</div><b>{todayMoves.length}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Bookings</div><b>{live.length}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Files</div><b>{files.length}</b></div>
      </div>

      <div className="ws-grid-2">
        <div className="ws-panel">
          <div className="ws-kicker">Open tasks</div>
          {openTasks.length === 0 && <p className="ws-lede">Nothing open.</p>}
          <div className="ws-list">
            {(high.length ? high : openTasks.slice(0, 5)).map((task) => (
              <div className="ws-row" key={task.id}>
                <div>
                  <PriorityMark id={task.priority} />
                  <strong style={{ display: "block", marginTop: 4 }}>{task.title}</strong>
                  <p>Due {prettyDate(task.due)} · <CrewName id={task.assignedTo} crew={crew} /></p>
                </div>
              </div>
            ))}
          </div>
          <div className="ws-actions">
            <Link to="/admin/dispatch" className="ws-btn slim ghost">All tasks</Link>
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

      <div className="ws-grid-2" style={{ marginTop: 16 }}>
        <div className="ws-panel">
          <div className="ws-kicker">Schedule · {prettyDate(today)}</div>
          {todayMoves.length === 0 && <p className="ws-lede">Nothing scheduled today.</p>}
          {todayMoves.sort((a, b) => (a.whenTime || "").localeCompare(b.whenTime || "")).map((m) => (
            <div className="ws-row" key={m.id}>
              <div>
                <strong>{m.whenTime} · {m.kind}</strong>
                <p>{m.detail} · <CrewName id={m.assignedTo} crew={crew} /></p>
              </div>
            </div>
          ))}
          <div className="ws-actions">
            <Link to="/admin/manifest" className="ws-btn slim ghost">Full schedule</Link>
          </div>
        </div>

        <div className="ws-panel">
          <div className="ws-kicker">Active bookings</div>
          {live.concat(journeys.filter((j) => j.stage === "quoted")).slice(0, 5).map((j) => (
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
            <Link to="/admin/ledger" className="ws-btn slim">Finance</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

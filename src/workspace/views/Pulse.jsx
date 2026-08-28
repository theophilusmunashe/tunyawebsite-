import { Link } from "react-router-dom";
import { greeting, prettyDate, sprayForMonth, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { CrewName, Kicker, Money, PriorityMark } from "../ui.jsx";

export default function Pulse() {
  const { you, tasks, journeys, movements, quotes, files, settings, updateSettings, crew } = useWorkspace();
  const spray = sprayForMonth();
  const today = todayISO();
  const openTasks = tasks.filter((t) => t.status !== "done");
  const thunder = openTasks.filter((t) => t.priority === "thunder");
  const arrivals = movements.filter((m) => m.whenDate === today);
  const live = journeys.filter((j) => ["confirmed", "in-country"].includes(j.stage));
  const openQuotes = quotes.filter((q) => q.status !== "invoiced");

  return (
    <div>
      <div className="ws-page-head">
        <div>
          <Kicker>The Pulse</Kicker>
          <h1>{greeting()}, {you?.name?.split(" ")[0] || "crew"}.</h1>
          <p className="ws-lede">{spray.river} This is the morning view of the house — what is moving, what is owed, and who needs you.</p>
        </div>
        <Link to="/admin/brief" className="ws-btn">Write the Thunder Brief</Link>
      </div>

      <div className="ws-stats">
        <div className="ws-stat"><Kicker>Open dispatch</Kicker><b>{openTasks.length}</b></div>
        <div className="ws-stat"><Kicker>Today's movements</Kicker><b>{arrivals.length}</b></div>
        <div className="ws-stat"><Kicker>Live journeys</Kicker><b>{live.length}</b></div>
        <div className="ws-stat"><Kicker>Vault files</Kicker><b>{files.length}</b></div>
      </div>

      <div className="ws-grid-2">
        <div className="ws-panel">
          <Kicker>Thunder — do these first</Kicker>
          <h2>What cannot wait</h2>
          {thunder.length === 0 && openTasks.length === 0 && <p className="ws-lede">The desk is clear. Enjoy the spray.</p>}
          <div className="ws-list">
            {(thunder.length ? thunder : openTasks.slice(0, 5)).map((task) => (
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
            <Link to="/admin/dispatch" className="ws-btn slim ghost">Open Dispatch</Link>
          </div>
        </div>

        <div className="ws-panel paper">
          <Kicker>The chalkboard</Kicker>
          <h2>Word from the deck</h2>
          <textarea
            style={{ width: "100%", minHeight: 120, background: "#fff", color: "#0d2b1e", border: "1px solid rgba(13,43,30,0.28)", padding: 12, fontFamily: "inherit", fontSize: 15 }}
            value={settings.chalkboard || ""}
            onChange={(e) => updateSettings({ chalkboard: e.target.value })}
          />
          <p className="ws-lede">Everyone at the Basecamp sees this. Keep it to one breath.</p>
        </div>
      </div>

      <div className="ws-grid-2" style={{ marginTop: 16 }}>
        <div className="ws-panel">
          <Kicker>Manifest · {prettyDate(today)}</Kicker>
          <h2>On the river today</h2>
          {arrivals.length === 0 && <p className="ws-lede">No timed movements today. Check Journeys for what is coming.</p>}
          {arrivals.sort((a, b) => (a.whenTime || "").localeCompare(b.whenTime || "")).map((m) => (
            <div className="ws-row" key={m.id}>
              <div>
                <strong>{m.whenTime} · {m.kind}</strong>
                <p>{m.detail} · <CrewName id={m.assignedTo} crew={crew} /></p>
              </div>
            </div>
          ))}
          <div className="ws-actions">
            <Link to="/admin/manifest" className="ws-btn slim ghost">Full manifest</Link>
          </div>
        </div>

        <div className="ws-panel">
          <Kicker>The house</Kicker>
          <h2>Live and quoted</h2>
          {live.concat(journeys.filter((j) => j.stage === "quoted")).slice(0, 5).map((j) => (
            <div className="ws-row" key={j.id}>
              <div>
                <div className="ws-kicker">{j.stage}</div>
                <strong>{j.guestName}</strong>
                <p>{j.product} · {j.dates || "Dates TBA"} · <Money value={j.value} /></p>
              </div>
            </div>
          ))}
          <p className="ws-lede">{openQuotes.length} quotation{openQuotes.length === 1 ? "" : "s"} still open on the Ledger.</p>
          <div className="ws-actions">
            <Link to="/admin/journeys" className="ws-btn slim ghost">Journeys</Link>
            <Link to="/admin/ledger" className="ws-btn slim">The Ledger</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

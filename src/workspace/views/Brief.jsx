import { useMemo } from "react";
import { esc } from "../lib/ids.js";
import { openPrint } from "../lib/printDoc.js";
import { catParts, prettyDate, sprayForMonth, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, PageHead, PriorityMark } from "../ui.jsx";

export default function Brief() {
  const { you, tasks, movements, journeys, settings, upsert, briefs, toast } = useWorkspace();
  const today = todayISO();
  const spray = sprayForMonth();
  const clock = catParts();
  const openTasks = tasks.filter((t) => t.status !== "done");
  const high = openTasks.filter((t) => t.priority === "thunder");
  const todayMove = movements.filter((m) => m.whenDate === today).sort((a, b) => (a.whenTime || "").localeCompare(b.whenTime || ""));
  const arriving = journeys.filter((j) => j.arrive === today || (j.stage === "confirmed" && j.arrive && j.arrive <= today && j.depart >= today));

  const body = useMemo(() => ({
    title: `Brief · ${prettyDate(today)}`,
    chalkboard: settings.chalkboard || "",
    moves: todayMove,
    high,
    arriving
  }), [settings.chalkboard, todayMove, high, arriving, today]);

  const save = async () => {
    await upsert("briefs", { date: today, ...body, author: you?.name });
    toast("Brief saved.");
  };

  const print = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${esc(body.title)}</title>
      <style>
        body { font-family: Poppins, sans-serif; color: #0d2b1e; padding: 28px; }
        .k { letter-spacing: .32em; text-transform: uppercase; color: #b3955c; font-size: 11px; }
        h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 36px; font-weight: 500; }
        li { line-height: 1.7; }
      </style></head><body>
      <div class="k">Tunyafrika Admin</div>
      <h1>${esc(body.title)}</h1>
      <p>${esc(clock.weekday)} · ${esc(spray.label)}</p>
      ${body.chalkboard ? `<p>${esc(body.chalkboard)}</p>` : ""}
      <div class="k">Schedule</div>
      <ul>${todayMove.map((m) => `<li>${esc(m.whenTime)} · ${esc(m.kind)} — ${esc(m.detail)}</li>`).join("") || "<li>None</li>"}</ul>
      <div class="k">High priority</div>
      <ul>${high.map((t) => `<li>${esc(t.title)}</li>`).join("") || "<li>None</li>"}</ul>
      </body></html>`;
    openPrint(html);
  };

  return (
    <div>
      <PageHead
        title="Brief"
        action={
          <div className="ws-actions" style={{ marginTop: 0 }}>
            <Button kind="ghost" onClick={save}>Save</Button>
            <Button onClick={print}>Print</Button>
          </div>
        }
      />

      <div className="ws-panel paper">
        <div className="ws-kicker">{prettyDate(today)} · {spray.label}</div>
        <h2 style={{ color: "#0d2b1e" }}>{body.title}</h2>
        {body.chalkboard && <p style={{ fontStyle: "italic" }}>{body.chalkboard}</p>}
        <div className="ws-kicker">Schedule</div>
        {todayMove.length === 0 && <p>Nothing scheduled.</p>}
        {todayMove.map((m) => (
          <div className="ws-row" key={m.id}>
            <div>
              <strong>{m.whenTime} · {m.kind}</strong>
              <p>{m.detail}</p>
            </div>
          </div>
        ))}
        <div className="ws-kicker">High priority</div>
        {high.length === 0 && <p>None.</p>}
        {high.map((t) => (
          <div className="ws-row" key={t.id}>
            <div>
              <PriorityMark id="thunder" />
              <strong style={{ display: "block", marginTop: 4 }}>{t.title}</strong>
            </div>
          </div>
        ))}
        <div className="ws-kicker">Guests</div>
        {arriving.length === 0 && <p>None.</p>}
        {arriving.map((j) => (
          <div className="ws-row" key={j.id}>
            <div>
              <strong>{j.guestName}</strong>
              <p>{j.product} · {j.pax}</p>
            </div>
          </div>
        ))}
      </div>

      {briefs.length > 0 && (
        <div className="ws-panel" style={{ marginTop: 16 }}>
          <div className="ws-kicker">Saved</div>
          {briefs.map((b) => (
            <div className="ws-row" key={b.id}>
              <div>
                <strong>{b.title}</strong>
                <p>{b.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

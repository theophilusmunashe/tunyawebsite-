import { useMemo } from "react";
import { esc } from "../lib/ids.js";
import { openPrint } from "../lib/printDoc.js";
import { catParts, greeting, prettyDate, sprayForMonth, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, CrewName, Kicker, PriorityMark } from "../ui.jsx";

export default function Brief() {
  const { you, tasks, movements, journeys, settings, upsert, briefs, toast } = useWorkspace();
  const today = todayISO();
  const spray = sprayForMonth();
  const clock = catParts();
  const openTasks = tasks.filter((t) => t.status !== "done");
  const thunder = openTasks.filter((t) => t.priority === "thunder");
  const todayMove = movements.filter((m) => m.whenDate === today).sort((a, b) => (a.whenTime || "").localeCompare(b.whenTime || ""));
  const arriving = journeys.filter((j) => j.arrive === today || (j.stage === "confirmed" && j.arrive && j.arrive <= today && j.depart >= today));

  const body = useMemo(() => ({
    title: `Thunder Brief · ${prettyDate(today)}`,
    chalkboard: settings.chalkboard || "",
    river: spray.river,
    sell: spray.sell,
    hold: spray.hold,
    moves: todayMove,
    thunder,
    arriving
  }), [settings.chalkboard, spray, todayMove, thunder, arriving, today]);

  const save = async () => {
    await upsert("briefs", { date: today, ...body, author: you?.name });
    toast("Brief pinned to the house memory.");
  };

  const print = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${esc(body.title)}</title>
      <style>
        body { font-family: Poppins, sans-serif; color: #0d2b1e; padding: 28px; }
        .k { letter-spacing: .32em; text-transform: uppercase; color: #b3955c; font-size: 11px; }
        h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 42px; font-weight: 500; }
        li { line-height: 1.7; }
      </style></head><body>
      <div class="k">Tunyafrika Basecamp</div>
      <h1>${esc(body.title)}</h1>
      <p>${esc(greeting())} from the deck. ${esc(clock.weekday)} in Victoria Falls. ${esc(spray.label)}.</p>
      <p>${esc(body.chalkboard)}</p>
      <div class="k">The river</div><p>${esc(body.river)}</p>
      <div class="k">Movements</div>
      <ul>${todayMove.map((m) => `<li>${esc(m.whenTime)} · ${esc(m.kind)} — ${esc(m.detail)}</li>`).join("") || "<li>None timed.</li>"}</ul>
      <div class="k">Thunder</div>
      <ul>${thunder.map((t) => `<li>${esc(t.title)}</li>`).join("") || "<li>None.</li>"}</ul>
      </body></html>`;
    openPrint(html);
  };

  return (
    <div>
      <div className="ws-page-head">
        <div>
          <Kicker>Thunder Brief</Kicker>
          <h1>The morning page.</h1>
          <p className="ws-lede">One sheet for the huddle before the first pickup. It writes itself from the Pulse, the Manifest and the chalkboard — then you print it or pin it.</p>
        </div>
        <div className="ws-actions" style={{ marginTop: 0 }}>
          <Button kind="ghost" onClick={save}>Pin this brief</Button>
          <Button onClick={print}>Print the page</Button>
        </div>
      </div>

      <div className="ws-panel paper">
        <Kicker>Tunyafrika Basecamp · CAT</Kicker>
        <h2 style={{ color: "#0d2b1e" }}>{body.title}</h2>
        <p>{greeting()}. {spray.label}. Written as if {you?.name?.split(" ")[0]} is standing on the deck.</p>
        {body.chalkboard && <p style={{ fontStyle: "italic" }}>{body.chalkboard}</p>}
        <Kicker>The river</Kicker>
        <p>{body.river}</p>
        <div className="ws-grid-2">
          <div>
            <Kicker>Sell</Kicker>
            <ul>{body.sell.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div>
            <Kicker>Hold back</Kicker>
            <ul>{body.hold.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
        <Kicker>Movements today</Kicker>
        {todayMove.length === 0 && <p>None timed.</p>}
        {todayMove.map((m) => (
          <div className="ws-row" key={m.id}>
            <div>
              <strong>{m.whenTime} · {m.kind}</strong>
              <p>{m.detail}</p>
            </div>
          </div>
        ))}
        <Kicker>Thunder</Kicker>
        {thunder.map((t) => (
          <div className="ws-row" key={t.id}>
            <div>
              <PriorityMark id="thunder" />
              <strong style={{ display: "block", marginTop: 4 }}>{t.title}</strong>
            </div>
          </div>
        ))}
        <Kicker>In the house</Kicker>
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
          <Kicker>Pinned</Kicker>
          <h2>Earlier mornings</h2>
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

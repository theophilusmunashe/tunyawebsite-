import { useState } from "react";
import { JOURNEY_STAGES } from "../data/catalog.js";
import { useWorkspace } from "../store.jsx";
import { Button, CrewName, Empty, Field, Kicker, Modal, Money } from "../ui.jsx";

const blank = () => ({
  guestName: "",
  guestEmail: "",
  pax: "",
  nationality: "",
  product: "",
  dates: "",
  arrive: "",
  depart: "",
  stage: "enquiry",
  value: 0,
  assignedTo: "",
  notes: "",
  days: []
});

export default function Journeys() {
  const { journeys, crew, upsert, remove, toast } = useWorkspace();
  const [open, setOpen] = useState(null);

  const move = async (j, stage) => {
    await upsert("journeys", { ...j, stage });
  };

  const save = async () => {
    await upsert("journeys", open);
    toast(`${open.guestName || "Journey"} is on the board.`);
    setOpen(null);
  };

  return (
    <div>
      <div className="ws-page-head">
        <div>
          <Kicker>Journeys</Kicker>
          <h1>From first sentence to last transfer.</h1>
          <p className="ws-lede">Every Tunyafrika trip lives on this board. Enquiry, quoted, confirmed, in-country, complete — the same river the guest is on, seen from the desk.</p>
        </div>
        <Button onClick={() => setOpen(blank())}>New journey</Button>
      </div>

      {journeys.length === 0 && <Empty>No journeys yet. The first enquiry you pin here is the start of the season.</Empty>}

      <div className="ws-kanban">
        {JOURNEY_STAGES.map((stage) => (
          <div className="ws-col" key={stage.id}>
            <h3>{stage.label} · {journeys.filter((j) => j.stage === stage.id).length}</h3>
            {journeys.filter((j) => j.stage === stage.id).map((j) => (
              <div className="ws-card" key={j.id} onClick={() => setOpen({ ...j })}>
                <strong>{j.guestName}</strong>
                <small>{j.product || "Unshaped"}</small>
                <div style={{ marginTop: 8, fontSize: 12, color: "#e8dcc4" }}>{j.dates || "Dates TBA"}</div>
                <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span><CrewName id={j.assignedTo} crew={crew} /></span>
                  <span style={{ color: "#b3955c" }}><Money value={j.value} /></span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {open && (
        <Modal title={open.guestName || "New journey"} kicker="The board" onClose={() => setOpen(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Guest">
              <input value={open.guestName} onChange={(e) => setOpen({ ...open, guestName: e.target.value })} />
            </Field>
            <Field label="Email">
              <input value={open.guestEmail} onChange={(e) => setOpen({ ...open, guestEmail: e.target.value })} />
            </Field>
            <Field label="Travelling as">
              <input value={open.pax} onChange={(e) => setOpen({ ...open, pax: e.target.value })} />
            </Field>
            <Field label="Nationality">
              <input value={open.nationality} onChange={(e) => setOpen({ ...open, nationality: e.target.value })} />
            </Field>
            <Field label="Product / mood">
              <input value={open.product} onChange={(e) => setOpen({ ...open, product: e.target.value })} placeholder="Weekend Escape, Grand Signature…" />
            </Field>
            <Field label="Stage">
              <select value={open.stage} onChange={(e) => setOpen({ ...open, stage: e.target.value })}>
                {JOURNEY_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Arrive">
              <input type="date" value={open.arrive || ""} onChange={(e) => setOpen({ ...open, arrive: e.target.value, dates: open.depart ? `${e.target.value} → ${open.depart}` : e.target.value })} />
            </Field>
            <Field label="Depart">
              <input type="date" value={open.depart || ""} onChange={(e) => setOpen({ ...open, depart: e.target.value, dates: open.arrive ? `${open.arrive} → ${e.target.value}` : e.target.value })} />
            </Field>
            <Field label="Value USD">
              <input type="number" value={open.value || 0} onChange={(e) => setOpen({ ...open, value: Number(e.target.value) })} />
            </Field>
            <Field label="Lead on desk">
              <select value={open.assignedTo || ""} onChange={(e) => setOpen({ ...open, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {crew.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes the guest should never have to repeat">
            <textarea value={open.notes} onChange={(e) => setOpen({ ...open, notes: e.target.value })} />
          </Field>
          <Kicker>Days on the ground</Kicker>
          {(open.days || []).map((day, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: 8, marginTop: 8 }}>
              <Field label={`Day ${i + 1}`}>
                <input value={day.title} onChange={(e) => {
                  const days = [...open.days];
                  days[i] = { ...days[i], title: e.target.value };
                  setOpen({ ...open, days });
                }} />
              </Field>
              <Field label="Notes">
                <input value={day.notes} onChange={(e) => {
                  const days = [...open.days];
                  days[i] = { ...days[i], notes: e.target.value };
                  setOpen({ ...open, days });
                }} />
              </Field>
              <button type="button" className="ws-btn warn slim" style={{ alignSelf: "end" }} onClick={() => setOpen({ ...open, days: open.days.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <div className="ws-actions">
            <Button kind="ghost" className="slim" onClick={() => setOpen({ ...open, days: [...(open.days || []), { title: "", notes: "" }] })}>Add a day</Button>
          </div>
          <div className="ws-actions">
            {JOURNEY_STAGES.map((s) => (
              <Button key={s.id} kind="ghost" className="slim" onClick={() => move({ ...open, stage: s.id }, s.id)}>{s.label}</Button>
            ))}
          </div>
          <div className="ws-actions">
            <Button onClick={save}>Save journey</Button>
            {open.id && <Button kind="warn" onClick={() => { remove("journeys", open.id); setOpen(null); }}>Remove</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { whatsappHref } from "../lib/notify.js";
import { prettyDate, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Modal, PageHead } from "../ui.jsx";

const KINDS = ["Airport pickup", "Airport drop", "Lodge transfer", "Activity", "Evening", "Border run", "Meet & greet"];

const blank = () => ({
  whenDate: todayISO(),
  whenTime: "10:00",
  kind: "Airport pickup",
  detail: "",
  assignedTo: "",
  journeyId: "",
  guestPhone: ""
});

export default function Manifest() {
  const { movements, journeys, crew, upsert, remove, toast } = useWorkspace();
  const [day, setDay] = useState(todayISO());
  const [form, setForm] = useState(null);

  const rows = useMemo(
    () => movements.filter((m) => m.whenDate === day).sort((a, b) => (a.whenTime || "").localeCompare(b.whenTime || "")),
    [movements, day]
  );

  const save = async () => {
    await upsert("movements", form);
    toast("Saved.");
    setForm(null);
  };

  const pingGuest = (m) => {
    const j = journeys.find((x) => x.id === m.journeyId);
    const text = `Tunyafrika — ${m.kind} today at ${m.whenTime}. ${m.detail}.`;
    const href = whatsappHref(m.guestPhone || "", text);
    if (href) window.open(href, "_blank", "noopener");
    else if (j?.guestEmail) window.location.href = `mailto:${j.guestEmail}?subject=${encodeURIComponent("Your Tunyafrika pickup")}&body=${encodeURIComponent(text)}`;
    else toast("Add a guest phone to message them.");
  };

  return (
    <div>
      <PageHead
        title="Schedule"
        action={<Button onClick={() => setForm(blank())}>Add</Button>}
      />

      <div className="ws-field" style={{ maxWidth: 240, marginBottom: 18 }}>
        <span>Date</span>
        <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>

      {rows.length === 0 && <Empty>Nothing on {prettyDate(day)}.</Empty>}

      <table className="ws-table">
        <thead>
          <tr><th>Time</th><th>Type</th><th>Detail</th><th>Assigned</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id}>
              <td>{m.whenTime}</td>
              <td>{m.kind}</td>
              <td>{m.detail}</td>
              <td>{crew.find((c) => c.id === m.assignedTo)?.name || "—"}</td>
              <td>
                <div className="ws-actions" style={{ marginTop: 0 }}>
                  <Button kind="ghost" className="slim" onClick={() => setForm({ ...m })}>Edit</Button>
                  <Button kind="ghost" className="slim" onClick={() => pingGuest(m)}>Message</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <Modal title="Movement" onClose={() => setForm(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date">
              <input type="date" value={form.whenDate} onChange={(e) => setForm({ ...form, whenDate: e.target.value })} />
            </Field>
            <Field label="Time">
              <input type="time" value={form.whenTime} onChange={(e) => setForm({ ...form, whenTime: e.target.value })} />
            </Field>
            <Field label="Type">
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                {KINDS.map((k) => <option key={k}>{k}</option>)}
              </select>
            </Field>
            <Field label="Assigned">
              <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Choose</option>
                {crew.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Detail">
            <input value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
          </Field>
          <Field label="Booking">
            <select value={form.journeyId || ""} onChange={(e) => setForm({ ...form, journeyId: e.target.value })}>
              <option value="">None</option>
              {journeys.map((j) => <option key={j.id} value={j.id}>{j.guestName}</option>)}
            </select>
          </Field>
          <Field label="Guest WhatsApp">
            <input value={form.guestPhone || ""} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} placeholder="2637…" />
          </Field>
          <div className="ws-actions">
            <Button onClick={save}>Save</Button>
            {form.id && <Button kind="warn" onClick={() => { remove("movements", form.id); setForm(null); }}>Remove</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

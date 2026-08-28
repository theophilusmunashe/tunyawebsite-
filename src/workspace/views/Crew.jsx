import { useState } from "react";
import { uid } from "../lib/ids.js";
import { useWorkspace } from "../store.jsx";
import { Button, Field, Kicker, Modal } from "../ui.jsx";

const blank = () => ({
  initials: "",
  name: "",
  role: "Operations",
  email: "",
  phone: "",
  seat: ""
});

export default function Crew() {
  const { crew, upsert, remove, toast } = useWorkspace();
  const [form, setForm] = useState(null);

  const save = async () => {
    const initials = form.initials || form.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
    await upsert("crew", { ...form, id: form.id || uid("crew"), initials });
    toast("Crew updated. Dispatch will use the new email.");
    setForm(null);
  };

  return (
    <div>
      <div className="ws-page-head">
        <div>
          <Kicker>Crew</Kicker>
          <h1>The faces behind Tunya — at work.</h1>
          <p className="ws-lede">Seats at this desk. Emails here are where Dispatch sends the work. Add a WhatsApp number and a ping can leave with the mail.</p>
        </div>
        <Button onClick={() => setForm(blank())}>Add a seat</Button>
      </div>

      <div className="ws-files">
        {crew.map((c) => (
          <div className="ws-file" key={c.id}>
            <div className="ws-mono" style={{ marginBottom: 10 }}>{c.initials}</div>
            <div className="name">{c.name}</div>
            <p className="ws-lede" style={{ margin: 0 }}>{c.role}{c.seat ? ` · ${c.seat}` : ""}</p>
            <p className="ws-lede" style={{ margin: "8px 0 0", fontSize: 12 }}>{c.email || "No email yet"}</p>
            <div className="ws-actions">
              <Button kind="ghost" className="slim" onClick={() => setForm({ ...c })}>Edit</Button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <Modal title={form.name || "New seat"} kicker="Crew" onClose={() => setForm(null)}>
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Initials">
              <input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value })} />
            </Field>
            <Field label="Seat">
              <input value={form.seat} onChange={(e) => setForm({ ...form, seat: e.target.value })} placeholder="The bridge, the books…" />
            </Field>
          </div>
          <Field label="Role">
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </Field>
          <Field label="Email — where dispatch lands">
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="WhatsApp">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+263 …" />
          </Field>
          <div className="ws-actions">
            <Button onClick={save}>Save seat</Button>
            {form.id && crew.length > 1 && <Button kind="warn" onClick={() => { remove("crew", form.id); setForm(null); }}>Remove</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

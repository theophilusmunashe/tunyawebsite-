import { useState } from "react";
import { uid } from "../lib/ids.js";
import { useWorkspace } from "../store.jsx";
import { Button, Field, Modal, PageHead } from "../ui.jsx";

const blank = () => ({
  initials: "",
  name: "",
  role: "Admin",
  email: "",
  phone: ""
});

export default function Crew() {
  const { crew, upsert, remove, toast } = useWorkspace();
  const [form, setForm] = useState(null);

  const save = async () => {
    const initials = form.initials || form.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
    await upsert("crew", { ...form, id: form.id || uid("crew"), initials, role: "Admin" });
    toast("Saved.");
    setForm(null);
  };

  return (
    <div>
      <PageHead
        title="Team"
        action={<Button onClick={() => setForm(blank())}>Add</Button>}
      />

      <div className="ws-files">
        {crew.map((c) => (
          <div className="ws-file" key={c.id}>
            <div className="ws-mono" style={{ marginBottom: 10 }}>{c.initials}</div>
            <div className="name">{c.name}</div>
            <p className="ws-lede" style={{ margin: 0 }}>Admin</p>
            <p className="ws-lede" style={{ margin: "8px 0 0", fontSize: 12 }}>{c.email || "No email"}</p>
            <div className="ws-actions">
              <Button kind="ghost" className="slim" onClick={() => setForm({ ...c, role: "Admin" })}>Edit</Button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <Modal title={form.name || "New admin"} onClose={() => setForm(null)}>
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Initials">
            <input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value })} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="WhatsApp">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+263 …" />
          </Field>
          <div className="ws-actions">
            <Button onClick={save}>Save</Button>
            {form.id && crew.length > 1 && <Button kind="warn" onClick={() => { remove("crew", form.id); setForm(null); }}>Remove</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

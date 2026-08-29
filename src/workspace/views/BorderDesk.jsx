import { useState } from "react";
import { BORDER_CHECKS } from "../data/catalog.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Modal, PageHead } from "../ui.jsx";

const KAZA = [
  { id: "needed", label: "Needed" },
  { id: "issued", label: "Issued" },
  { id: "not-required", label: "Not required" },
  { id: "check", label: "Check" }
];

const blank = () => ({
  guestName: "",
  nationality: "",
  journeyId: "",
  kaza: "check",
  notes: "",
  checks: Object.fromEntries(BORDER_CHECKS.map((c) => [c.id, false]))
});

export default function BorderDesk() {
  const { visaCases, journeys, upsert, remove, toast } = useWorkspace();
  const [form, setForm] = useState(null);

  const score = (row) => {
    const values = Object.values(row.checks || {});
    if (!values.length) return 0;
    return Math.round((values.filter(Boolean).length / BORDER_CHECKS.length) * 100);
  };

  const save = async () => {
    await upsert("visaCases", form);
    toast("Saved.");
    setForm(null);
  };

  return (
    <div>
      <PageHead
        title="Visas"
        action={<Button onClick={() => setForm(blank())}>New case</Button>}
      />

      {visaCases.length === 0 && <Empty>No visa cases.</Empty>}

      <div className="ws-files">
        {visaCases.map((row) => (
          <div className="ws-file" key={row.id} style={{ cursor: "pointer" }} onClick={() => setForm({ ...row, checks: { ...blank().checks, ...row.checks } })}>
            <div className="ws-kicker">{KAZA.find((k) => k.id === row.kaza)?.label || row.kaza}</div>
            <div className="name">{row.guestName}</div>
            <p className="ws-lede" style={{ margin: 0 }}>{row.nationality}</p>
            <div className="ws-curtain" style={{ marginTop: 12 }}><span style={{ width: `${score(row)}%` }} /></div>
            <p className="ws-lede" style={{ margin: "8px 0 0", fontSize: 12 }}>{score(row)}% ready</p>
          </div>
        ))}
      </div>

      {form && (
        <Modal title={form.guestName || "Visa case"} onClose={() => setForm(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Guest">
              <input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
            </Field>
            <Field label="Nationality">
              <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
            </Field>
            <Field label="Booking">
              <select value={form.journeyId || ""} onChange={(e) => {
                const j = journeys.find((x) => x.id === e.target.value);
                setForm({ ...form, journeyId: e.target.value, guestName: j?.guestName || form.guestName, nationality: j?.nationality || form.nationality });
              }}>
                <option value="">None</option>
                {journeys.map((j) => <option key={j.id} value={j.id}>{j.guestName}</option>)}
              </select>
            </Field>
            <Field label="KAZA UniVisa">
              <select value={form.kaza} onChange={(e) => setForm({ ...form, kaza: e.target.value })}>
                {KAZA.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="ws-checks" style={{ marginTop: 16 }}>
            {BORDER_CHECKS.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  checked={!!form.checks?.[c.id]}
                  onChange={(e) => setForm({ ...form, checks: { ...form.checks, [c.id]: e.target.checked } })}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
          <Field label="Notes">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="ws-actions">
            <Button onClick={save}>Save</Button>
            {form.id && <Button kind="warn" onClick={() => { remove("visaCases", form.id); setForm(null); }}>Remove</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

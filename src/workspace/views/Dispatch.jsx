import { useMemo, useState } from "react";
import { PRIORITIES, TASK_STATUS } from "../data/catalog.js";
import { notifyPerson, taskMessage } from "../lib/notify.js";
import { prettyDate, todayISO } from "../lib/time.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Modal, PageHead, PriorityMark } from "../ui.jsx";

const blank = () => ({
  title: "",
  notes: "",
  priority: "spray",
  status: "open",
  due: todayISO(),
  assignedTo: "",
  journeyId: ""
});

export default function Dispatch() {
  const { tasks, crew, journeys, you, upsert, remove, toast } = useWorkspace();
  const [filter, setFilter] = useState("openish");
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "mine") return t.assignedTo === you?.id && t.status !== "done";
      if (filter === "done") return t.status === "done";
      if (filter === "thunder") return t.priority === "thunder" && t.status !== "done";
      return t.status !== "done";
    });
  }, [tasks, filter, you]);

  const assigneeOf = (id) => crew.find((c) => c.id === id);

  const save = async (send) => {
    if (!form?.title.trim()) return;
    const saved = await upsert("tasks", form);
    if (send && saved.assignedTo) {
      const person = assigneeOf(saved.assignedTo);
      if (!person) {
        toast("Task saved.");
        setForm(null);
        return;
      }
      setBusy(true);
      const subject = `Task: ${saved.title}`;
      const body = taskMessage(saved, person, you);
      const result = await notifyPerson({
        to: person.email,
        toName: person.name,
        phone: person.phone,
        subject,
        body
      });
      setBusy(false);
      if (result.emailed) toast(`Emailed ${person.name}.`);
      else if (result.mailto) {
        window.location.href = result.mailto;
        toast("Task saved. Opening email.");
      } else toast("Task saved. Add an email on Team to notify.");
      if (result.whatsapp) window.open(result.whatsapp, "_blank", "noopener");
    } else {
      toast("Task saved.");
    }
    setForm(null);
  };

  return (
    <div>
      <PageHead
        title="Tasks"
        action={<Button onClick={() => setForm({ ...blank(), assignedTo: you?.id || "" })}>New task</Button>}
      />

      <div className="ws-folders">
        {[
          { id: "openish", label: "Open" },
          { id: "mine", label: "Mine" },
          { id: "thunder", label: "High" },
          { id: "done", label: "Done" }
        ].map((f) => (
          <button key={f.id} type="button" className={filter === f.id ? "is-on" : ""} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {visible.length === 0 && <Empty>No tasks here.</Empty>}

      <table className="ws-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned</th>
            <th>Due</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((task) => (
            <tr key={task.id}>
              <td>
                <PriorityMark id={task.priority} />
                <div style={{ marginTop: 4, fontWeight: 500 }}>{task.title}</div>
              </td>
              <td>{assigneeOf(task.assignedTo)?.name || "—"}</td>
              <td>{prettyDate(task.due)}</td>
              <td>{TASK_STATUS.find((s) => s.id === task.status)?.label || task.status}</td>
              <td>
                <Button kind="ghost" className="slim" onClick={() => setForm({ ...task })}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <Modal title={form.id ? "Edit task" : "New task"} onClose={() => setForm(null)}>
          <Field label="Task">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Notes">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Priority">
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {TASK_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Due">
              <input type="date" value={form.due || ""} onChange={(e) => setForm({ ...form, due: e.target.value })} />
            </Field>
            <Field label="Assign to">
              <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Choose</option>
                {crew.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Booking">
            <select value={form.journeyId || ""} onChange={(e) => setForm({ ...form, journeyId: e.target.value })}>
              <option value="">None</option>
              {journeys.map((j) => <option key={j.id} value={j.id}>{j.guestName}</option>)}
            </select>
          </Field>
          <div className="ws-actions">
            <Button disabled={busy} onClick={() => save(true)}>{busy ? "Sending…" : "Save & notify"}</Button>
            <Button kind="ghost" disabled={busy} onClick={() => save(false)}>Save</Button>
            {form.id && <Button kind="warn" onClick={() => { remove("tasks", form.id); setForm(null); }}>Remove</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

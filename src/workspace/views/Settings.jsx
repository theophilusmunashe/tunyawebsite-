import { useRef } from "react";
import { useWorkspace } from "../store.jsx";
import { Button, Field, Kicker } from "../ui.jsx";

export default function Settings() {
  const { settings, updateSettings, backup, restore, toast } = useWorkspace();
  const fileRef = useRef(null);

  const set = (patch) => updateSettings(patch);

  return (
    <div>
      <div className="ws-page-head">
        <div>
          <Kicker>Settings</Kicker>
          <h1>The house rules.</h1>
          <p className="ws-lede">Letterhead, bank, deposit, and how this desk travels to another machine. Change the house key in <code>.env</code> as <code>VITE_WORKSPACE_KEY</code> before the world can find /admin.</p>
        </div>
      </div>

      <div className="ws-grid-2">
        <div className="ws-panel paper ws-paper-field">
          <Kicker>Letterhead</Kicker>
          <h2 style={{ color: "#0d2b1e" }}>What guests read on a quote</h2>
          <Field label="Company"><input value={settings.company || ""} onChange={(e) => set({ company: e.target.value })} /></Field>
          <Field label="Address"><input value={settings.address1 || ""} onChange={(e) => set({ address1: e.target.value })} /></Field>
          <Field label="Town"><input value={settings.address2 || ""} onChange={(e) => set({ address2: e.target.value })} /></Field>
          <Field label="Email"><input value={settings.email || ""} onChange={(e) => set({ email: e.target.value })} /></Field>
          <Field label="Phone"><input value={settings.phone || ""} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Web"><input value={settings.web || ""} onChange={(e) => set({ web: e.target.value })} /></Field>
        </div>
        <div className="ws-panel paper ws-paper-field">
          <Kicker>The books</Kicker>
          <h2 style={{ color: "#0d2b1e" }}>Money on the page</h2>
          <Field label="Currency"><input value={settings.currency || "USD"} onChange={(e) => set({ currency: e.target.value })} /></Field>
          <Field label="Quote valid (days)"><input type="number" value={settings.quoteDays || 14} onChange={(e) => set({ quoteDays: Number(e.target.value) })} /></Field>
          <Field label="Deposit %"><input type="number" value={settings.depositPercent || 50} onChange={(e) => set({ depositPercent: Number(e.target.value) })} /></Field>
          <Field label="VAT %"><input type="number" value={settings.vatPercent || 0} onChange={(e) => set({ vatPercent: Number(e.target.value) })} /></Field>
          <Field label="Bank"><input value={settings.bankName || ""} onChange={(e) => set({ bankName: e.target.value })} placeholder="Bank name" /></Field>
          <Field label="Account"><input value={settings.bankAccount || ""} onChange={(e) => set({ bankAccount: e.target.value })} /></Field>
          <Field label="Branch / SWIFT"><input value={settings.bankBranch || ""} onChange={(e) => set({ bankBranch: e.target.value })} /></Field>
        </div>
      </div>

      <div className="ws-panel" style={{ marginTop: 16 }}>
        <Kicker>Sharing the cupboard</Kicker>
        <h2>Workspace pack</h2>
        <p className="ws-lede">The Vault, the Ledger, journeys and dispatch live in this browser so the desk works at localhost today. To put the same cupboard on another machine — or on the office PC that will sit on www.tunyafrika.com/admin — export a pack here and restore it there. Anyone with the house key can then open the same files.</p>
        <div className="ws-actions">
          <Button onClick={backup}>Export workspace pack</Button>
          <Button kind="ghost" onClick={() => fileRef.current?.click()}>Restore a pack</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try { await restore(file); } catch (err) { toast(err.message || "Could not restore that pack."); }
            }}
          />
        </div>
        <p className="ws-lede" style={{ marginTop: 18 }}>House key currently expected by this build: set <code>VITE_WORKSPACE_KEY</code>. Default while developing is a phrase you type at the gate — ask the person who opened the project, or check <code>.env</code>. It is not printed here on purpose.</p>
        <p className="ws-lede">Optional real email (not just the mail app): add EmailJS keys to <code>.env</code> as <code>VITE_EMAILJS_SERVICE_ID</code>, <code>VITE_EMAILJS_TEMPLATE_ID</code>, <code>VITE_EMAILJS_PUBLIC_KEY</code>. Template fields: <code>to_email</code>, <code>to_name</code>, <code>subject</code>, <code>message</code>.</p>
      </div>
    </div>
  );
}

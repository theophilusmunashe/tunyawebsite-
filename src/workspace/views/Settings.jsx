import { useRef } from "react";
import { useWorkspace } from "../store.jsx";
import { Button, Field, PageHead } from "../ui.jsx";

export default function Settings() {
  const { settings, updateSettings, backup, restore, toast } = useWorkspace();
  const fileRef = useRef(null);
  const set = (patch) => updateSettings(patch);

  return (
    <div>
      <PageHead title="Settings" />

      <div className="ws-grid-2">
        <div className="ws-panel paper ws-paper-field">
          <div className="ws-kicker">Company</div>
          <Field label="Company"><input value={settings.company || ""} onChange={(e) => set({ company: e.target.value })} /></Field>
          <Field label="Address"><input value={settings.address1 || ""} onChange={(e) => set({ address1: e.target.value })} /></Field>
          <Field label="Town"><input value={settings.address2 || ""} onChange={(e) => set({ address2: e.target.value })} /></Field>
          <Field label="Email"><input value={settings.email || ""} onChange={(e) => set({ email: e.target.value })} /></Field>
          <Field label="Phone"><input value={settings.phone || ""} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Web"><input value={settings.web || ""} onChange={(e) => set({ web: e.target.value })} /></Field>
        </div>
        <div className="ws-panel paper ws-paper-field">
          <div className="ws-kicker">Finance</div>
          <Field label="Currency"><input value={settings.currency || "USD"} onChange={(e) => set({ currency: e.target.value })} /></Field>
          <Field label="Quote valid (days)"><input type="number" value={settings.quoteDays || 14} onChange={(e) => set({ quoteDays: Number(e.target.value) })} /></Field>
          <Field label="Deposit %"><input type="number" value={settings.depositPercent || 50} onChange={(e) => set({ depositPercent: Number(e.target.value) })} /></Field>
          <Field label="VAT %"><input type="number" value={settings.vatPercent || 0} onChange={(e) => set({ vatPercent: Number(e.target.value) })} /></Field>
          <Field label="Bank"><input value={settings.bankName || ""} onChange={(e) => set({ bankName: e.target.value })} /></Field>
          <Field label="Account"><input value={settings.bankAccount || ""} onChange={(e) => set({ bankAccount: e.target.value })} /></Field>
          <Field label="Branch / SWIFT"><input value={settings.bankBranch || ""} onChange={(e) => set({ bankBranch: e.target.value })} /></Field>
        </div>
      </div>

      <div className="ws-panel" style={{ marginTop: 16 }}>
        <div className="ws-kicker">Backup</div>
        <div className="ws-actions">
          <Button onClick={backup}>Export</Button>
          <Button kind="ghost" onClick={() => fileRef.current?.click()}>Import</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try { await restore(file); } catch (err) { toast(err.message || "Could not restore."); }
            }}
          />
        </div>
      </div>
    </div>
  );
}

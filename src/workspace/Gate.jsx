import { useMemo, useState } from "react";
import { useWorkspace } from "./store.jsx";
import { Button } from "./ui.jsx";

export default function Gate() {
  const { crew, signIn } = useWorkspace();
  const [picked, setPicked] = useState(crew[0]?.id || "");
  const [key, setKey] = useState("");
  const [stay, setStay] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const people = useMemo(() => crew || [], [crew]);

  // The password is checked on the server; the browser never knows the right answer.
  const enter = async () => {
    if (busy) return;
    if (!picked) {
      setError("Select a user.");
      return;
    }
    if (!key) {
      setError("Enter your password.");
      return;
    }
    setBusy(true);
    try {
      await signIn(picked, key, stay);
    } catch (err) {
      setError(err.message || "Could not sign in.");
      setKey("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ws-gate">
      <img className="bg" src="/assets/br-falls-aerial2.jpg" alt="" />
      <div className="veil" />
      <div className="ws-gate-card">
        <div className="ws-kicker">Tunyafrika</div>
        <h1>Admin</h1>
        <div className="ws-crew-grid">
          {people.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`ws-crew-pick${picked === c.id ? " is-on" : ""}`}
              onClick={() => setPicked(c.id)}
            >
              <span className="ws-mono">{c.initials}</span>
              <span>
                <strong style={{ display: "block", fontWeight: 500, color: "#faf3e8" }}>{c.name}</strong>
                <span className="role">Admin</span>
              </span>
            </button>
          ))}
        </div>
        <div className="ws-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && enter()}
            placeholder="Password"
          />
        </div>
        <label className="ws-check">
          <input type="checkbox" checked={stay} onChange={(e) => setStay(e.target.checked)} />
          Stay signed in
        </label>
        {error && <p style={{ color: "#e07a4c", fontSize: 13, margin: "12px 0 0" }}>{error}</p>}
        <div className="ws-actions">
          <Button onClick={enter} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          <a href="/" className="ws-btn ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Back to site</a>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useWorkspace, workspaceKey } from "./store.jsx";
import { Button } from "./ui.jsx";

export default function Gate() {
  const { crew, signIn } = useWorkspace();
  const [picked, setPicked] = useState(crew[0]?.id || "");
  const [key, setKey] = useState("");
  const [stay, setStay] = useState(true);
  const [error, setError] = useState("");

  const people = useMemo(() => crew || [], [crew]);

  const enter = () => {
    const expected = workspaceKey();
    if (key.trim() !== expected) {
      setError("Wrong password.");
      return;
    }
    if (!picked) {
      setError("Select a user.");
      return;
    }
    signIn(picked, stay);
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
          <Button onClick={enter}>Sign in</Button>
          <a href="/" className="ws-btn ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Back to site</a>
        </div>
      </div>
    </div>
  );
}

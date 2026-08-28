import { useMemo, useState } from "react";
import { useWorkspace, workspaceKey } from "./store.jsx";
import { Button, Kicker } from "./ui.jsx";

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
      setError("That is not the house key. Ask whoever opened the Basecamp.");
      return;
    }
    if (!picked) {
      setError("Choose your seat at the desk.");
      return;
    }
    signIn(picked, stay);
  };

  return (
    <div className="ws-gate">
      <img className="bg" src="/assets/br-falls-aerial2.jpg" alt="" />
      <div className="veil" />
      <div className="ws-gate-card">
        <Kicker>Tunyafrika Workspace</Kicker>
        <h1>The Basecamp</h1>
        <p className="ws-gate-copy">
          Where the journey is built before the spray. Staff only — the public site stays on the other side of this door.
        </p>
        <Kicker>Who is at the desk</Kicker>
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
                <span className="role">{c.role}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="ws-field">
          <span>House key</span>
          <input
            type="password"
            autoComplete="current-password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && enter()}
            placeholder="The phrase that opens the desk"
          />
        </div>
        <label className="ws-check">
          <input type="checkbox" checked={stay} onChange={(e) => setStay(e.target.checked)} />
          Keep me at the desk on this machine
        </label>
        {error && <p style={{ color: "#e07a4c", fontSize: 13, margin: "12px 0 0" }}>{error}</p>}
        <div className="ws-actions">
          <Button onClick={enter}>Enter the Basecamp</Button>
          <a href="/" className="ws-btn ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Back to the Falls</a>
        </div>
      </div>
    </div>
  );
}

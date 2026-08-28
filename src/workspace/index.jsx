import { WorkspaceProvider, useWorkspace } from "./store.jsx";
import Gate from "./Gate.jsx";
import Shell from "./Shell.jsx";
import "./workspace.css";

function GateOrDesk() {
  const { ready, session } = useWorkspace();
  if (!ready) {
    return (
      <div className="ws-gate">
        <div className="veil" />
        <div className="ws-kicker" style={{ position: "relative" }}>Opening the Basecamp…</div>
      </div>
    );
  }
  if (!session) return <Gate />;
  return <Shell />;
}

export default function WorkspaceApp() {
  return (
    <WorkspaceProvider>
      <GateOrDesk />
    </WorkspaceProvider>
  );
}

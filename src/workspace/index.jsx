import { useEffect } from "react";
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
        <div className="ws-kicker" style={{ position: "relative" }}>Loading…</div>
      </div>
    );
  }
  if (!session) return <Gate />;
  return <Shell />;
}

export default function WorkspaceApp() {
  // Keep the admin out of search results even if someone links to it.
  useEffect(() => {
    document.title = "Admin — Tunyafrika";
    let tag = document.head.querySelector('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "robots");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", "noindex, nofollow");
  }, []);

  return (
    <WorkspaceProvider>
      <GateOrDesk />
    </WorkspaceProvider>
  );
}

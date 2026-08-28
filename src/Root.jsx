import { Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import WorkspaceApp from "./workspace/index.jsx";

export default function Root() {
  return (
    <Routes>
      <Route path="/admin/*" element={<WorkspaceApp />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}

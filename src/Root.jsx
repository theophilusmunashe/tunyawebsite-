import { Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import AccomodationsApp from "./accomodations/AccomodationsApp.jsx";
import ContentApp from "./content-engine/ContentApp.jsx";
import WorkspaceApp from "./workspace/index.jsx";

export default function Root() {
  return (
    <Routes>
      <Route path="/admin/*" element={<WorkspaceApp />} />
      <Route path="/accomodations/*" element={<AccomodationsApp />} />
      <Route path="/content/*" element={<ContentApp />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}

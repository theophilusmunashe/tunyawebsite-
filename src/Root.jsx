import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import AccomodationsApp from "./accomodations/AccomodationsApp.jsx";
import ContentApp from "./content-engine/ContentApp.jsx";

// The admin (PDFs, invoices, IndexedDB) loads only when someone opens /admin,
// so visitors never download it.
const WorkspaceApp = lazy(() => import("./workspace/index.jsx"));

export default function Root() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div style={{ minHeight: "100vh", background: "#04301f" }} />}>
            <WorkspaceApp />
          </Suspense>
        }
      />
      <Route path="/accomodations/*" element={<AccomodationsApp />} />
      <Route path="/content/*" element={<ContentApp />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}

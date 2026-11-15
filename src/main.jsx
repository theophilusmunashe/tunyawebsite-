import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Root from "./Root.jsx";
import { ContentProvider } from "./content/ContentProvider.jsx";
import "./styles.css";
import "./accomodations/accomodations.css";
import "./content-engine/content.css";

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <Root />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);

const container = document.getElementById("root");
// Pages are pre-rendered at build time (see scripts/prerender.mjs): hydrate them
// instead of re-drawing, so the first paint is real HTML for people and search engines.
if (container.firstElementChild) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);

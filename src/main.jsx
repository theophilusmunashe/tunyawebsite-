import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Root from "./Root.jsx";
import { ContentProvider } from "./content/ContentProvider.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <Root />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);

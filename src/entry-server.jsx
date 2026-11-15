import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Root from "./Root.jsx";
import { ContentProvider } from "./content/ContentProvider.jsx";
import { defaults } from "./content/defaults/index.js";
import { headFor, headHtml } from "./seo/meta.js";

/** Renders one page to HTML for the build-time pre-render (scripts/prerender.mjs). */
export function render(url, pageKey) {
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <ContentProvider>
          <Root />
        </ContentProvider>
      </StaticRouter>
    </React.StrictMode>
  );
  return { html, head: headHtml(headFor(pageKey, { content: defaults })) };
}

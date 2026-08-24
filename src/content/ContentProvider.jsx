import { createContext, useContext, useEffect, useState } from "react";
import { client, cmsConfigured } from "../lib/sanity.js";
import { defaults, CONTENT_KEYS } from "./defaults/index.js";
import { mergeContent } from "./merge.js";

const ContentContext = createContext(defaults);

// One document per section, each a singleton keyed by _id in the Studio.
const QUERY = `{${CONTENT_KEYS.map((k) => `"${k}": *[_id == "${k}"][0]`).join(",")}}`;

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    if (!cmsConfigured || !client) return;
    let cancelled = false;

    client
      .fetch(QUERY)
      .then((data) => {
        if (cancelled || !data) return;
        setContent(mergeContent(defaults, stripSanityKeys(data)));
      })
      .catch((err) => {
        // Defaults stay on screen if the CMS is unreachable.
        console.warn("[cms] falling back to bundled content:", err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

/** Removes Sanity bookkeeping fields so they can never overwrite real content. */
function stripSanityKeys(value) {
  if (Array.isArray(value)) return value.map(stripSanityKeys);
  if (value && typeof value === "object") {
    if (value.asset) return value; // keep image objects intact
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_") && k !== "_type") continue;
      out[k] = stripSanityKeys(v);
    }
    return out;
  }
  return value;
}

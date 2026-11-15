import { useEffect, useState } from "react";
import { applyHead, headFor } from "../seo/meta.js";
import { publicUpdates } from "../content-engine/api.js";
import { formatWhen } from "../content-engine/model.js";

export default function ContentUpdates() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await publicUpdates();
        if (alive) setItems(list);
      } catch (err) {
        if (alive) setError(err.message || "Could not load updates.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    applyHead(headFor("content"));
  }, []);

  return (
    <div className="ce-page" data-screen-label="Content updates">
      <section className="ce-hero">
        <div className="ce-hero-copy">
          <img className="ce-hero-logo" src="/assets/logo-cream.png" alt="Tunyafrika" />
          <h1 className="ce-brand">Tunyafrika Updates</h1>
          <p className="ce-lede">Africa travel news and Victoria Falls updates in short notes, always credited to the original source.</p>
        </div>
      </section>

      <section className="ce-shell">
        {loading && <div className="ce-empty">Loading updates…</div>}
        {!loading && error && <div className="ce-empty">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="ce-empty">No updates yet. Check back soon, or follow us on socials for daily news from the Falls.</div>
        )}

        <div className="ce-grid">
          {items.map((item) => (
            <article key={item.id} className="ce-card">
              <div className="ce-kicker">{item.sourceName || "Source"}</div>
              <h2>{item.headline}</h2>
              <p>{item.summary}</p>
              <div className="ce-meta">
                <span>{formatWhen(item.approvedAt || item.publishedAt)}</span>
              </div>
              {item.sourceUrl && (
                <a className="ce-source" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Read original source
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

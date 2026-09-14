import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicListings } from "../accomodations/api.js";
import { priceLabel } from "../accomodations/model.js";

export default function AccomodationsGallery() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await publicListings();
        if (alive) setListings(items);
      } catch (err) {
        if (alive) setError(err.message || "Could not load stays.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = "Accommodations — Tunyafrika Xperiences";
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="acc-page" data-screen-label="Accommodations">
      <section className="acc-hero">
        <div className="acc-hero-copy">
          <div className="acc-kicker">Victoria Falls stays</div>
          <h1>Accommodation gallery</h1>
          <p>Hand-picked lodges, hotels and guesthouses. Browse the look and the rate, then ask us to confirm availability for your dates.</p>
        </div>
      </section>

      <section className="acc-shell">
        {loading && <div className="acc-empty">Loading stays…</div>}
        {!loading && error && <div className="acc-empty">{error}</div>}
        {!loading && !error && listings.length === 0 && (
          <div className="acc-empty">Published stays will appear here once the team adds them in the workspace.</div>
        )}

        <div className="acc-grid">
          {listings.map((listing) => (
            <Link key={listing.id} to={`/accomodations/${listing.id}`} className="acc-card">
              <div className="acc-card-media">
                {listing.coverUrl ? (
                  <img src={listing.coverUrl} alt={listing.title} />
                ) : (
                  <div className="acc-card-fallback">Photos coming soon</div>
                )}
              </div>
              <div className="acc-card-body">
                <div className="acc-kicker">{listing.propertyType || "Stay"}</div>
                <h2>{listing.title}</h2>
                {listing.subtitle && <p className="acc-sub">{listing.subtitle}</p>}
                <div className="acc-price">{priceLabel(listing.pricing)}</div>
                {listing.pricing?.note && <div className="acc-note">{listing.pricing.note}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

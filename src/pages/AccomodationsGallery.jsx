import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicListings } from "../accomodations/api.js";
import { priceLabel } from "../accomodations/model.js";
import { applyHead, headFor } from "../seo/meta.js";

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
    applyHead(headFor("accomodations"));
  }, []);

  return (
    <div className="acc-page" data-screen-label="Accommodations">
      <section className="acc-hero">
        <div className="acc-hero-copy">
          <div className="acc-kicker">Victoria Falls stays</div>
          <h1>Victoria Falls lodges &amp; hotels</h1>
          <p>Lodges, hotels and guesthouses in Victoria Falls that we know well. See the photos and rates, then ask us to check your dates.</p>
        </div>
      </section>

      <section className="acc-shell">
        {loading && <div className="acc-empty">Loading stays…</div>}
        {!loading && error && <div className="acc-empty">{error}</div>}
        {!loading && !error && listings.length === 0 && (
          <div className="acc-empty">We're adding places to stay. Message us on WhatsApp on +263 78 266 9251 and we'll send you options.</div>
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

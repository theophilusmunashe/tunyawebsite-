import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { publicListing, submitEnquiry } from "../accomodations/api.js";
import { priceLabel } from "../accomodations/model.js";

const blankEnquire = () => ({
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  checkIn: "",
  checkOut: "",
  guests: "",
  message: ""
});

export default function AccomodationDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);
  const [form, setForm] = useState(blankEnquire);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setSent(false);
    setForm(blankEnquire());
    (async () => {
      try {
        const item = await publicListing(id);
        if (alive) {
          setListing(item);
          setActive(0);
        }
      } catch (err) {
        if (alive) setError(err.message || "Stay not found.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    if (!listing) return;
    const prev = document.title;
    document.title = `${listing.title} — Tunyafrika Accommodations`;
    return () => { document.title = prev; };
  }, [listing]);

  const images = useMemo(() => listing?.images?.length ? listing.images : (listing?.coverUrl ? [{ id: "cover", url: listing.coverUrl, caption: "" }] : []), [listing]);

  const send = async (e) => {
    e.preventDefault();
    setFormError("");
    const dateOk = (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!dateOk(form.checkIn) || !dateOk(form.checkOut)) {
      setFormError("Use the date pickers for check-in and check-out.");
      return;
    }
    if (form.checkIn && form.checkOut && form.checkOut < form.checkIn) {
      setFormError("Check-out should be on or after check-in.");
      return;
    }
    setSending(true);
    try {
      await submitEnquiry({ listingId: listing.id, ...form });
      setSent(true);
      setForm(blankEnquire());
    } catch (err) {
      setFormError(err.message || "Could not send the enquiry.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="acc-page"><div className="acc-shell"><div className="acc-empty">Loading stay…</div></div></div>;
  }

  if (error || !listing) {
    return (
      <div className="acc-page">
        <div className="acc-shell">
          <div className="acc-empty">{error || "Stay not found."}</div>
          <Link to="/accomodations" className="acc-back">← Back to gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="acc-page" data-screen-label="Accommodation detail">
      <div className="acc-shell acc-detail">
        <Link to="/accomodations" className="acc-back">← Back to gallery</Link>

        <div className="acc-detail-grid">
          <div>
            <div className="acc-gallery-main">
              {images[active] ? (
                <img src={images[active].url} alt={images[active].caption || listing.title} />
              ) : (
                <div className="acc-card-fallback">Photos coming soon</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="acc-thumbs">
                {images.map((img, i) => (
                  <button
                    key={img.id || i}
                    type="button"
                    className={`acc-thumb${i === active ? " is-active" : ""}`}
                    onClick={() => setActive(i)}
                  >
                    <img src={img.url} alt={img.caption || `Photo ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="acc-detail-copy">
            <div className="acc-kicker">{listing.propertyType || "Stay"}</div>
            <h1>{listing.title}</h1>
            {listing.subtitle && <p className="acc-sub">{listing.subtitle}</p>}
            <div className="acc-price big">{priceLabel(listing.pricing)}</div>
            {listing.pricing?.note && <div className="acc-note">{listing.pricing.note}</div>}

            {(listing.capacity?.guests || listing.capacity?.rooms) && (
              <div className="acc-meta">
                {listing.capacity.rooms && <span>{listing.capacity.rooms} rooms</span>}
                {listing.capacity.guests && <span>Up to {listing.capacity.guests} guests</span>}
              </div>
            )}

            {listing.summary && <p className="acc-summary">{listing.summary}</p>}

            {(listing.amenities || []).length > 0 && (
              <div className="acc-amenities">
                <div className="acc-kicker">Includes</div>
                <ul>
                  {listing.amenities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            <div className="acc-enquire">
              <div className="acc-kicker">Availability</div>
              <h2>Enquire availability</h2>
              <p>Tell us your dates. Our team will check with the property and reply — exact location and supplier details stay with Tunyafrika.</p>

              {sent ? (
                <div className="acc-sent">
                  Received. We will confirm availability and get back to you shortly.
                </div>
              ) : (
                <form className="acc-form" onSubmit={send}>
                  <label>
                    <span>Name</span>
                    <input required value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
                  </label>
                  <div className="acc-form-row">
                    <label>
                      <span>Email</span>
                      <input type="email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} />
                    </label>
                    <label>
                      <span>Phone / WhatsApp</span>
                      <input value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} />
                    </label>
                  </div>
                  <div className="acc-form-row">
                    <label>
                      <span>Check-in</span>
                      <input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
                    </label>
                    <label>
                      <span>Check-out</span>
                      <input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
                    </label>
                  </div>
                  <label>
                    <span>Guests</span>
                    <input value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} placeholder="e.g. 2 adults" />
                  </label>
                  <label>
                    <span>Message</span>
                    <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any preferences or questions" />
                  </label>
                  {formError && <div className="acc-form-error">{formError}</div>}
                  <button type="submit" className="acc-cta" disabled={sending}>
                    {sending ? "Sending…" : "Enquire availability"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

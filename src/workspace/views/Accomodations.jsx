import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminBootstrap,
  deleteEnquiry,
  deleteListing,
  deleteListingImage,
  deleteProvider,
  saveEnquiry,
  saveListing,
  saveProvider,
  uploadListingImages
} from "../../accomodations/api.js";
import {
  ENQUIRY_STATUSES,
  LISTING_STATUSES,
  PROPERTY_TYPES,
  amenitiesText,
  blankListing,
  blankProvider,
  parseAmenities,
  priceLabel
} from "../../accomodations/model.js";
import { whatsappHref } from "../lib/notify.js";
import { useWorkspace } from "../store.jsx";
import { Button, Empty, Field, Modal, PageHead } from "../ui.jsx";

function providerLabel(providers, id) {
  return providers.find((p) => p.id === id)?.name || "No provider linked";
}

export default function AccomodationsAdmin() {
  const { toast } = useWorkspace();
  const [tab, setTab] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [listings, setListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [providerForm, setProviderForm] = useState(null);
  const [listingForm, setListingForm] = useState(null);
  const [amenitiesDraft, setAmenitiesDraft] = useState("");
  const [enquiryForm, setEnquiryForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const refresh = useCallback(async () => {
    const data = await adminBootstrap();
    setProviders(data.providers || []);
    setListings(data.listings || []);
    setEnquiries(data.enquiries || []);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await refresh();
      } catch (err) {
        if (alive) toast(err.message || "Could not load accommodations.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [refresh, toast]);

  const newCount = useMemo(() => enquiries.filter((e) => e.status === "new").length, [enquiries]);

  const openListing = (listing) => {
    const next = { ...blankListing(), ...listing, pricing: { ...blankListing().pricing, ...(listing.pricing || {}) }, capacity: { ...blankListing().capacity, ...(listing.capacity || {}) }, location: { ...blankListing().location, ...(listing.location || {}) }, images: [...(listing.images || [])] };
    setListingForm(next);
    setAmenitiesDraft(amenitiesText(next.amenities));
  };

  const persistProvider = async () => {
    try {
      const saved = await saveProvider(providerForm);
      setProviders((list) => {
        const exists = list.some((p) => p.id === saved.id);
        return exists ? list.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...list];
      });
      toast("Provider saved.");
      setProviderForm(null);
    } catch (err) {
      toast(err.message || "Could not save provider.");
    }
  };

  const persistListing = async (patch = {}) => {
    try {
      const payload = {
        ...listingForm,
        ...patch,
        amenities: parseAmenities(amenitiesDraft)
      };
      const saved = await saveListing(payload);
      setListings((list) => {
        const exists = list.some((l) => l.id === saved.id);
        return exists ? list.map((l) => (l.id === saved.id ? saved : l)) : [saved, ...list];
      });
      setListingForm(saved);
      setAmenitiesDraft(amenitiesText(saved.amenities));
      toast(saved.status === "published" ? "Published to the gallery." : "Stay saved.");
      return saved;
    } catch (err) {
      toast(err.message || "Could not save stay.");
      return null;
    }
  };

  const onUpload = async (files) => {
    const list = [...(files || [])].filter((f) => f && (/^image\//i.test(f.type || "") || /\.(jpe?g|png|webp|gif)$/i.test(f.name || "")));
    if (!list.length) {
      toast("Choose JPG, PNG, WEBP or GIF photos.");
      return;
    }
    if (list.length > 30) {
      toast("Upload up to 30 photos at a time.");
      return;
    }
    let listingId = listingForm?.id;
    if (!listingId) {
      const saved = await persistListing();
      if (!saved?.id) return;
      listingId = saved.id;
    }
    await uploadMany(listingId, list);
  };

  const uploadMany = async (listingId, fileList) => {
    const files = [...fileList];
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(`Uploading 0/${files.length}…`);
    try {
      const data = await uploadListingImages(listingId, files, {
        onProgress: (done, total) => setUploadProgress(`Uploading ${done}/${total}…`)
      });
      setListingForm(data.listing);
      setListings((list) => list.map((l) => (l.id === data.listing.id ? data.listing : l)));
      const extra = (data.errors || []).length ? ` ${data.errors.length} skipped.` : "";
      toast(`${data.added} photo${data.added === 1 ? "" : "s"} added.${extra}`);
    } catch (err) {
      toast(err.message || "Could not upload photos.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const removeImage = async (imageId) => {
    try {
      const listing = await deleteListingImage(listingForm.id, imageId);
      setListingForm(listing);
      setListings((list) => list.map((l) => (l.id === listing.id ? listing : l)));
      toast("Photo removed.");
    } catch (err) {
      toast(err.message || "Could not remove photo.");
    }
  };

  const persistEnquiry = async () => {
    try {
      const saved = await saveEnquiry(enquiryForm);
      setEnquiries((list) => list.map((e) => (e.id === saved.id ? saved : e)));
      toast("Enquiry updated.");
      setEnquiryForm(null);
    } catch (err) {
      toast(err.message || "Could not update enquiry.");
    }
  };

  if (loading) {
    return <div><PageHead title="Accommodations" /><Empty>Loading marketplace…</Empty></div>;
  }

  return (
    <div>
      <PageHead
        title="Accommodations"
        action={(
          <div className="ws-actions" style={{ marginTop: 0 }}>
            <Button kind="ghost" className="slim" onClick={() => setProviderForm(blankProvider())}>Add provider</Button>
            <Button className="slim" onClick={() => openListing(blankListing())}>Add stay</Button>
          </div>
        )}
      />

      <div className="ws-stats three">
        <div className="ws-stat"><div className="ws-kicker">New enquiries</div><b>{newCount}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Published</div><b>{listings.filter((l) => l.status === "published").length}</b></div>
        <div className="ws-stat"><div className="ws-kicker">Providers</div><b>{providers.length}</b></div>
      </div>

      <div className="ws-actions" style={{ marginTop: 0, marginBottom: 18 }}>
        {[
          { id: "inbox", label: `Enquiries${newCount ? ` (${newCount})` : ""}` },
          { id: "stays", label: "Stays" },
          { id: "providers", label: "Providers" }
        ].map((item) => (
          <Button key={item.id} kind={tab === item.id ? "gold" : "ghost"} className="slim" onClick={() => setTab(item.id)}>
            {item.label}
          </Button>
        ))}
        <a className="ws-btn slim ghost" href="/accomodations" target="_blank" rel="noopener">Open gallery</a>
      </div>

      {tab === "inbox" && (
        <div className="ws-panel">
          <div className="ws-kicker">Availability enquiries</div>
          {enquiries.length === 0 && <p className="ws-lede">When a guest taps Enquire availability on the gallery, it lands here.</p>}
          {enquiries.map((enquiry) => {
            const listing = listings.find((l) => l.id === enquiry.listingId);
            const provider = providers.find((p) => p.id === (enquiry.providerId || listing?.providerId));
            return (
              <div className="ws-row" key={enquiry.id} style={{ cursor: "pointer" }} onClick={() => setEnquiryForm({ ...enquiry })}>
                <div>
                  <div className="ws-kicker">{enquiry.status.replaceAll("_", " ")}</div>
                  <strong>{enquiry.guestName}</strong>
                  <p>
                    {enquiry.listingTitle || listing?.title || "Stay"}
                    {enquiry.checkIn ? ` · ${enquiry.checkIn}` : ""}
                    {enquiry.checkOut ? ` → ${enquiry.checkOut}` : ""}
                    {provider ? ` · ${provider.name}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "stays" && (
        <div className="ws-panel">
          <div className="ws-kicker">Gallery inventory</div>
          {listings.length === 0 && <p className="ws-lede">Add a stay, upload photos, set the rate, then publish.</p>}
          {listings.map((listing) => (
            <div className="ws-row" key={listing.id} style={{ cursor: "pointer" }} onClick={() => openListing(listing)}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", width: "100%" }}>
                <div style={{ width: 72, height: 54, background: "#0a2418", overflow: "hidden", flex: "0 0 auto" }}>
                  {listing.coverUrl ? <img src={listing.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ws-kicker">{listing.status} · {listing.propertyType}</div>
                  <strong>{listing.title}</strong>
                  <p>{priceLabel(listing.pricing)} · {providerLabel(providers, listing.providerId)} · {(listing.images || []).length} photos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "providers" && (
        <div className="ws-panel">
          <div className="ws-kicker">Service providers</div>
          {providers.length === 0 && <p className="ws-lede">Keep contacts private here — guests never see these details on the gallery.</p>}
          {providers.map((provider) => (
            <div className="ws-row" key={provider.id} style={{ cursor: "pointer" }} onClick={() => setProviderForm({ ...provider })}>
              <div>
                <div className="ws-kicker">{provider.contactName || "Contact"}</div>
                <strong>{provider.name}</strong>
                <p>{[provider.phone, provider.email, provider.whatsapp].filter(Boolean).join(" · ") || "No contact yet"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {providerForm && (
        <Modal title={providerForm.id ? "Edit provider" : "Quick-add provider"} onClose={() => setProviderForm(null)}>
          <p className="ws-lede">Name + one contact is enough to start. Guests never see this card.</p>
          <div className="ws-split">
            <Field label="Business / lodge name">
              <input value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} placeholder="e.g. Misty Falls Lodge" />
            </Field>
            <Field label="Contact person">
              <input value={providerForm.contactName} onChange={(e) => setProviderForm({ ...providerForm, contactName: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input value={providerForm.phone} onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })} />
            </Field>
            <Field label="WhatsApp">
              <input value={providerForm.whatsapp} onChange={(e) => setProviderForm({ ...providerForm, whatsapp: e.target.value })} placeholder="Same as phone is fine" />
            </Field>
            <Field label="Email">
              <input value={providerForm.email} onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })} />
            </Field>
            <Field label="Address / location (private)">
              <input value={providerForm.address} onChange={(e) => setProviderForm({ ...providerForm, address: e.target.value })} />
            </Field>
          </div>
          <Field label="Internal notes">
            <textarea value={providerForm.notes} onChange={(e) => setProviderForm({ ...providerForm, notes: e.target.value })} placeholder="Commission, payment terms, best time to call…" />
          </Field>
          <div className="ws-actions">
            <Button onClick={persistProvider}>Save provider</Button>
            {providerForm.id && (
              <Button kind="warn" onClick={async () => {
                await deleteProvider(providerForm.id);
                setProviders((list) => list.filter((p) => p.id !== providerForm.id));
                setProviderForm(null);
                toast("Provider removed.");
              }}>Remove</Button>
            )}
          </div>
        </Modal>
      )}

      {listingForm && (
        <Modal title={listingForm.id ? listingForm.title || "Edit stay" : "New stay"} onClose={() => setListingForm(null)} dark>
          <div className="ws-split">
            <Field label="Public title">
              <input value={listingForm.title} onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })} placeholder="What guests see" />
            </Field>
            <Field label="Property type">
              <select value={listingForm.propertyType} onChange={(e) => setListingForm({ ...listingForm, propertyType: e.target.value })}>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Subtitle">
              <input value={listingForm.subtitle} onChange={(e) => setListingForm({ ...listingForm, subtitle: e.target.value })} placeholder="Short line under the title" />
            </Field>
            <Field label="Provider (private)">
              <select value={listingForm.providerId} onChange={(e) => setListingForm({ ...listingForm, providerId: e.target.value })}>
                <option value="">Select provider</option>
                {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Rate amount">
              <input type="number" value={listingForm.pricing.amount} onChange={(e) => setListingForm({ ...listingForm, pricing: { ...listingForm.pricing, amount: Number(e.target.value) } })} />
            </Field>
            <Field label="Currency">
              <input value={listingForm.pricing.currency} onChange={(e) => setListingForm({ ...listingForm, pricing: { ...listingForm.pricing, currency: e.target.value } })} />
            </Field>
            <Field label="Unit">
              <input value={listingForm.pricing.unit} onChange={(e) => setListingForm({ ...listingForm, pricing: { ...listingForm.pricing, unit: e.target.value } })} placeholder="per night" />
            </Field>
            <Field label="Rate note (public)">
              <input value={listingForm.pricing.note} onChange={(e) => setListingForm({ ...listingForm, pricing: { ...listingForm.pricing, note: e.target.value } })} placeholder="e.g. breakfast included" />
            </Field>
            <Field label="Rooms">
              <input value={listingForm.capacity.rooms} onChange={(e) => setListingForm({ ...listingForm, capacity: { ...listingForm.capacity, rooms: e.target.value } })} />
            </Field>
            <Field label="Guests">
              <input value={listingForm.capacity.guests} onChange={(e) => setListingForm({ ...listingForm, capacity: { ...listingForm.capacity, guests: e.target.value } })} />
            </Field>
            <Field label="Area (private)">
              <input value={listingForm.location.area} onChange={(e) => setListingForm({ ...listingForm, location: { ...listingForm.location, area: e.target.value } })} placeholder="Not shown to guests" />
            </Field>
            <Field label="Address (private)">
              <input value={listingForm.location.address} onChange={(e) => setListingForm({ ...listingForm, location: { ...listingForm.location, address: e.target.value } })} />
            </Field>
            <Field label="Status">
              <select value={listingForm.status} onChange={(e) => setListingForm({ ...listingForm, status: e.target.value })}>
                {LISTING_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Public summary">
            <textarea value={listingForm.summary} onChange={(e) => setListingForm({ ...listingForm, summary: e.target.value })} />
          </Field>
          <Field label="Amenities (one per line, public)">
            <textarea value={amenitiesDraft} onChange={(e) => setAmenitiesDraft(e.target.value)} placeholder={"Pool\nBreakfast\nAirport transfer"} />
          </Field>
          <Field label="Provider notes (private)">
            <textarea value={listingForm.providerNotes} onChange={(e) => setListingForm({ ...listingForm, providerNotes: e.target.value })} />
          </Field>
          <Field label="Availability notes (private)">
            <textarea value={listingForm.availabilityNote} onChange={(e) => setListingForm({ ...listingForm, availabilityNote: e.target.value })} placeholder="How to confirm rooms with this property" />
          </Field>

          <div className="ws-kicker" style={{ marginTop: 12 }}>Photos</div>
          <p className="ws-lede">Drop many photos at once, or click to select a whole folder of images (up to 30).</p>
          <div
            className={`ws-upload-drop${dragOver ? " is-over" : ""}${uploading ? " is-busy" : ""}`}
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!uploading) onUpload(e.dataTransfer.files);
            }}
          >
            <strong>{uploading ? (uploadProgress || "Uploading…") : "Bulk upload photos"}</strong>
            <span>JPG, PNG, WEBP or GIF · guests see these in the gallery</span>
            <label className="ws-btn slim" style={{ display: "inline-flex", alignItems: "center", cursor: uploading ? "wait" : "pointer", marginTop: 10 }}>
              {uploading ? "Please wait…" : "Choose photos"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                hidden
                disabled={uploading}
                onChange={(e) => {
                  onUpload(e.target.files || []);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10, marginTop: 12 }}>
            {(listingForm.images || []).map((img) => (
              <div key={img.id} style={{ position: "relative", background: "#041910", aspectRatio: "4/3", overflow: "hidden" }}>
                <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button type="button" className="ws-btn warn slim" style={{ position: "absolute", top: 6, right: 6, padding: "2px 8px" }} onClick={() => removeImage(img.id)}>×</button>
                <button type="button" className="ws-btn slim ghost" style={{ position: "absolute", left: 6, bottom: 6, padding: "2px 8px", fontSize: 11 }} onClick={() => setListingForm({ ...listingForm, coverUrl: img.url })}>
                  {listingForm.coverUrl === img.url ? "Cover" : "Set cover"}
                </button>
              </div>
            ))}
          </div>
          {(listingForm.images || []).length > 0 && (
            <p className="ws-lede" style={{ marginTop: 8 }}>{listingForm.images.length} photo{(listingForm.images || []).length === 1 ? "" : "s"} on this stay.</p>
          )}

          <div className="ws-actions">
            <Button onClick={() => persistListing()}>Save</Button>
            <Button onClick={() => persistListing({ status: "published" })}>Publish to gallery</Button>
            {listingForm.status === "published" && (
              <Button kind="ghost" onClick={() => persistListing({ status: "paused" })}>Pause</Button>
            )}
            {listingForm.id && (
              <Button kind="warn" onClick={async () => {
                await deleteListing(listingForm.id);
                setListings((list) => list.filter((l) => l.id !== listingForm.id));
                setListingForm(null);
                toast("Stay removed.");
              }}>Remove</Button>
            )}
            {listingForm.id && listingForm.status === "published" && (
              <a className="ws-btn slim ghost" href={`/accomodations/${listingForm.id}`} target="_blank" rel="noopener">Preview</a>
            )}
          </div>
        </Modal>
      )}

      {enquiryForm && (
        <Modal title="Availability enquiry" onClose={() => setEnquiryForm(null)}>
          {(() => {
            const listing = listings.find((l) => l.id === enquiryForm.listingId);
            const provider = providers.find((p) => p.id === (enquiryForm.providerId || listing?.providerId));
            const wa = provider?.whatsapp || provider?.phone || "";
            const waLink = wa ? whatsappHref(wa, `Hi ${provider?.contactName || ""}, please confirm availability for ${enquiryForm.listingTitle || listing?.title || "the stay"} from ${enquiryForm.checkIn || "?"} to ${enquiryForm.checkOut || "?"} for ${enquiryForm.guests || "guests"}. Guest: ${enquiryForm.guestName}.`.trim()) : "";
            return (
              <>
                <div className="ws-split">
                  <Field label="Guest">
                    <input value={enquiryForm.guestName} readOnly />
                  </Field>
                  <Field label="Status">
                    <select value={enquiryForm.status} onChange={(e) => setEnquiryForm({ ...enquiryForm, status: e.target.value })}>
                      {ENQUIRY_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Email">
                    <input value={enquiryForm.guestEmail || ""} readOnly />
                  </Field>
                  <Field label="Phone">
                    <input value={enquiryForm.guestPhone || ""} readOnly />
                  </Field>
                  <Field label="Check-in">
                    <input value={enquiryForm.checkIn || ""} readOnly />
                  </Field>
                  <Field label="Check-out">
                    <input value={enquiryForm.checkOut || ""} readOnly />
                  </Field>
                </div>
                <Field label="Guests / message">
                  <textarea value={[enquiryForm.guests, enquiryForm.message].filter(Boolean).join("\n\n")} readOnly />
                </Field>

                <div className="ws-panel paper" style={{ marginTop: 12 }}>
                  <div className="ws-kicker">Confirm with provider</div>
                  {provider ? (
                    <>
                      <strong>{provider.name}</strong>
                      <p className="ws-lede" style={{ marginTop: 6 }}>
                        {[provider.contactName, provider.phone, provider.email, provider.whatsapp].filter(Boolean).join(" · ")}
                      </p>
                      {listing?.location?.address && <p className="ws-lede">Location: {listing.location.area ? `${listing.location.area} — ` : ""}{listing.location.address}</p>}
                      {listing?.availabilityNote && <p className="ws-lede">{listing.availabilityNote}</p>}
                      <div className="ws-actions">
                        {waLink && <a className="ws-btn slim" href={waLink} target="_blank" rel="noopener">WhatsApp provider</a>}
                        {provider.email && <a className="ws-btn slim ghost" href={`mailto:${provider.email}?subject=${encodeURIComponent(`Availability — ${enquiryForm.listingTitle || ""}`)}`}>Email provider</a>}
                        {enquiryForm.guestEmail && <a className="ws-btn slim ghost" href={`mailto:${enquiryForm.guestEmail}?subject=${encodeURIComponent(`Your stay enquiry — Tunyafrika`)}`}>Email guest</a>}
                      </div>
                    </>
                  ) : (
                    <p className="ws-lede">Link a provider on the stay so you can confirm availability in one tap.</p>
                  )}
                </div>

                <Field label="Staff notes">
                  <textarea value={enquiryForm.staffNotes || ""} onChange={(e) => setEnquiryForm({ ...enquiryForm, staffNotes: e.target.value })} placeholder="What the provider said, rates held, next step…" />
                </Field>
                <div className="ws-actions">
                  <Button onClick={persistEnquiry}>Save enquiry</Button>
                  <Button kind="ghost" onClick={() => setEnquiryForm({ ...enquiryForm, status: "awaiting_provider" })}>Mark awaiting provider</Button>
                  <Button kind="ghost" onClick={() => setEnquiryForm({ ...enquiryForm, status: "replied" })}>Mark replied</Button>
                  <Button kind="warn" onClick={async () => {
                    await deleteEnquiry(enquiryForm.id);
                    setEnquiries((list) => list.filter((e) => e.id !== enquiryForm.id));
                    setEnquiryForm(null);
                    toast("Enquiry removed.");
                  }}>Remove</Button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

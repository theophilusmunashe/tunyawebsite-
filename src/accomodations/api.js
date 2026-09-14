const ENDPOINT = "/api/accomodations.php";

function workspaceKey() {
  return import.meta.env.VITE_MAIL_KEY || import.meta.env.VITE_WORKSPACE_KEY || "123456";
}

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function publicListings() {
  const res = await fetch(`${ENDPOINT}?action=public_list`, { headers: { Accept: "application/json" } });
  const data = await parse(res);
  return data.listings || [];
}

export async function publicListing(id) {
  const res = await fetch(`${ENDPOINT}?action=public_get&id=${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" }
  });
  const data = await parse(res);
  return data.listing;
}

export async function submitEnquiry(payload) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ action: "enquire", ...payload })
  });
  return parse(res);
}

async function adminPost(action, payload = {}) {
  const key = workspaceKey();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Tunya-Key": key
    },
    body: JSON.stringify({ action, key, ...payload })
  });
  return parse(res);
}

export async function adminBootstrap() {
  return adminPost("admin_bootstrap");
}

export async function saveProvider(provider) {
  const data = await adminPost("save_provider", { provider });
  return data.provider;
}

export async function deleteProvider(id) {
  return adminPost("delete_provider", { id });
}

export async function saveListing(listing) {
  const data = await adminPost("save_listing", { listing });
  return data.listing;
}

export async function deleteListing(id) {
  return adminPost("delete_listing", { id });
}

export async function uploadListingImage(listingId, file, caption = "") {
  const dataBase64 = await fileToDataUrl(file);
  const data = await adminPost("upload_image", {
    listingId,
    filename: file.name || "photo.jpg",
    caption,
    dataBase64
  });
  return data;
}

export async function uploadListingImages(listingId, files, { onProgress } = {}) {
  const list = [...files].filter(Boolean);
  if (!list.length) throw new Error("Add one or more photos.");
  if (list.length > 30) throw new Error("Upload up to 30 photos at a time.");

  // Send in chunks so large phone-photo batches stay under server body limits.
  const chunkSize = 5;
  let listing = null;
  let added = 0;
  const errors = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    const slice = list.slice(i, i + chunkSize);
    const images = [];
    for (const file of slice) {
      images.push({
        filename: file.name || "photo.jpg",
        caption: "",
        dataBase64: await fileToDataUrl(file)
      });
    }
    try {
      const data = await adminPost("upload_images", { listingId, images });
      listing = data.listing;
      added += Number(data.added) || (data.images || []).length;
      if (Array.isArray(data.errors)) errors.push(...data.errors);
    } catch (err) {
      errors.push(err.message || "Chunk failed.");
    }
    if (onProgress) onProgress(Math.min(list.length, i + slice.length), list.length);
  }
  if (!listing || added === 0) {
    throw new Error(errors[0] || "Could not upload photos.");
  }
  return { listing, added, errors };
}

export async function deleteListingImage(listingId, imageId) {
  const data = await adminPost("delete_image", { listingId, imageId });
  return data.listing;
}

export async function saveEnquiry(enquiry) {
  const data = await adminPost("save_enquiry", { enquiry });
  return data.enquiry;
}

export async function deleteEnquiry(id) {
  return adminPost("delete_enquiry", { id });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}

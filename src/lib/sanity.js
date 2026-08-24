import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-10-01";

// Until a project id is supplied the site renders entirely from local defaults,
// so an unconfigured or unreachable CMS can never change or break the page.
export const cmsConfigured = Boolean(projectId);

export const client = cmsConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

/**
 * Resolves either a Sanity image object or a plain local path (e.g. "/assets/x.jpg")
 * to a usable src, falling back to the bundled asset when the CMS has no image.
 */
export function imageSrc(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (value.asset && builder) {
    try {
      return builder.image(value).auto("format").fit("max").width(2000).url();
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/** Object-position helper so editors can re-crop an image without code changes. */
export function imagePosition(value, fallback) {
  if (value && typeof value === "object" && value.hotspot) {
    const { x, y } = value.hotspot;
    return `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`;
  }
  return fallback;
}

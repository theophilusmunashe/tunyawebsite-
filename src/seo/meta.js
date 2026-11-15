/**
 * Search + social metadata for every page. Used twice:
 *   - at build time by scripts/prerender.mjs (baked into each page's HTML), and
 *   - in the browser by applyHead() when someone navigates between pages.
 */
import { SEO_PAGES } from "../content/defaults/seo.js";
import { site } from "../content/defaults/site.js";
import { PAGE_PATHS } from "../routes.js";

export const SITE_URL = "https://www.tunyafrika.com";
export const SITE_NAME = "Tunyafrika Xperiences";

const BREADCRUMB_NAMES = {
  falls: "Victoria Falls",
  xp: "Things to Do",
  stays: "Where to Stay",
  beyond: "Beyond the Falls",
  visas: "Visas & Borders",
  about: "About Us",
  social: "Socials",
  ai: "Ask Tunya",
  plan: "Plan My Trip",
  accomodations: "Accommodations",
  content: "Updates"
};

const OG_IMAGES = {
  home: "/og/home.jpg",
  falls: "/og/falls.jpg",
  xp: "/og/xp.jpg",
  stays: "/og/stays.jpg",
  beyond: "/og/beyond.jpg",
  visas: "/og/visas.jpg",
  about: "/og/about.jpg",
  social: "/og/social.jpg",
  ai: "/og/ai.jpg",
  plan: "/og/plan.jpg",
  accomodations: "/og/accomodations.jpg",
  content: "/og/content.jpg"
};

const abs = (path) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/** The business itself: shown on every page so search engines tie all pages to one local operator. */
export function organizationJsonLd() {
  const f = site.footer;
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${SITE_URL}/#org`,
    name: SITE_NAME,
    alternateName: "Tunyafrika",
    url: `${SITE_URL}/`,
    logo: abs("/assets/logo-cream.png"),
    image: abs("/og/home.jpg"),
    description: SEO_PAGES.home.description,
    telephone: "+263782669251",
    email: f.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: f.addressLine1,
      addressLocality: "Victoria Falls",
      addressRegion: "Matabeleland North",
      addressCountry: "ZW"
    },
    areaServed: ["Victoria Falls", "Zimbabwe", "Botswana", "Zambia", "Namibia", "South Africa"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+263782669251",
      email: f.email,
      contactType: "reservations",
      availableLanguage: ["English"]
    },
    sameAs: f.socials.filter((s) => s.network !== "whatsapp").map((s) => s.href)
  };
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#org` },
    inLanguage: "en"
  };
}

function breadcrumbJsonLd(key) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: BREADCRUMB_NAMES[key] || key, item: `${SITE_URL}${PAGE_PATHS[key]}` }
    ]
  };
}

/**
 * Everything that goes in <head> for a page key.
 * `content` (optional) lets pages add page-specific structured data (e.g. tour packages).
 */
export function headFor(key, { content } = {}) {
  const seo = SEO_PAGES[key] || SEO_PAGES.notFound;
  const isNotFound = !PAGE_PATHS[key];
  const canonical = isNotFound ? null : `${SITE_URL}${PAGE_PATHS[key] === "/" ? "/" : PAGE_PATHS[key]}`;
  const image = abs(OG_IMAGES[key] || OG_IMAGES.home);
  const jsonLd = [organizationJsonLd()];
  if (key === "home") jsonLd.push(websiteJsonLd());
  else if (!isNotFound) jsonLd.push(breadcrumbJsonLd(key));
  if (key === "xp" && content?.xp?.flagship?.items) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Victoria Falls tour packages",
      itemListElement: content.xp.flagship.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristTrip",
          name: item.title,
          description: [item.lede, item.body].filter(Boolean).join(" "),
          image: abs(item.image),
          provider: { "@id": `${SITE_URL}/#org` },
          touristType: item.kicker
        }
      }))
    });
  }
  return {
    title: seo.title,
    description: seo.description,
    canonical,
    robots: isNotFound ? "noindex, follow" : "index, follow, max-image-preview:large",
    image,
    jsonLd
  };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// JSON inside <script> must not be able to close the tag.
const safeJson = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

/** HTML string for build-time injection into <head>. */
export function headHtml(head) {
  const tags = [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    `<meta name="robots" content="${head.robots}" />`,
    head.canonical ? `<link rel="canonical" href="${head.canonical}" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    head.canonical ? `<meta property="og:url" content="${head.canonical}" />` : "",
    `<meta property="og:image" content="${head.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@tunyafrika" />`,
    `<meta name="twitter:title" content="${esc(head.title)}" />`,
    `<meta name="twitter:description" content="${esc(head.description)}" />`,
    `<meta name="twitter:image" content="${head.image}" />`,
    ...head.jsonLd.map((obj) => `<script type="application/ld+json">${safeJson(obj)}</script>`)
  ];
  return tags.filter(Boolean).join("\n    ");
}

function setMeta(attr, name, value) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/** Browser-side: updates <head> after client navigation so shares and tabs stay correct. */
export function applyHead(head) {
  if (typeof document === "undefined") return;
  document.title = head.title;
  setMeta("name", "description", head.description);
  setMeta("name", "robots", head.robots);
  setMeta("property", "og:title", head.title);
  setMeta("property", "og:description", head.description);
  setMeta("property", "og:image", head.image);
  setMeta("name", "twitter:title", head.title);
  setMeta("name", "twitter:description", head.description);
  setMeta("name", "twitter:image", head.image);
  let link = document.head.querySelector('link[rel="canonical"]');
  if (head.canonical) {
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", head.canonical);
    setMeta("property", "og:url", head.canonical);
  } else if (link) {
    link.remove();
  }
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  for (const obj of head.jsonLd) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
}

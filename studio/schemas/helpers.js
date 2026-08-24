/** Small builders so the schema stays readable across eleven page documents. */

export const str = (name, title, opts = {}) => ({ name, title, type: "string", ...opts });
export const text = (name, title, rows = 4) => ({ name, title, type: "text", rows });
export const strList = (name, title) => ({ name, title, type: "array", of: [{ type: "string" }] });
export const textList = (name, title) => ({ name, title, type: "array", of: [{ type: "text", rows: 3 }] });

export const image = (name = "image", title = "Image") => ({
  name,
  title,
  type: "image",
  options: { hotspot: true },
  description: "Leave empty to keep the image currently bundled with the site."
});

export const obj = (name, title, fields, preview) => ({
  name,
  title,
  type: "object",
  fields,
  ...(preview ? { preview } : {})
});

export const list = (name, title, of, opts = {}) => ({
  name,
  title,
  type: "array",
  of: [of],
  ...opts
});

/** Title-only preview so array items are identifiable when collapsed. */
export const titlePreview = (title = "title", subtitle) => ({
  select: subtitle ? { title, subtitle } : { title },
  prepare: (v) => ({ title: v.title || "Untitled", subtitle: v.subtitle })
});

export const ctaType = {
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    str("label", "Button label"),
    str("href", "External URL", { description: "Use for links off-site, e.g. www.tunya.africa" }),
    str("page", "Internal page key", { description: "Use instead of URL to link within the site: home, falls, xp, stays, beyond, visas, about, social, ai, plan" })
  ],
  preview: { select: { title: "label", subtitle: "href" } }
};

export const navItemType = {
  name: "navItem",
  title: "Navigation link",
  type: "object",
  fields: [str("label", "Label"), str("page", "Page key")],
  preview: { select: { title: "label", subtitle: "page" } }
};

export const factType = {
  name: "fact",
  title: "Fact",
  type: "object",
  fields: [str("label", "Label"), text("value", "Value", 2)],
  preview: { select: { title: "label", subtitle: "value" } }
};

export const titleBodyType = {
  name: "titleBody",
  title: "Item",
  type: "object",
  fields: [str("title", "Title"), text("body", "Body", 3)],
  preview: { select: { title: "title", subtitle: "body" } }
};

export const mediaType = {
  name: "media",
  title: "Image",
  type: "object",
  fields: [image(), str("imageAlt", "Alt text")],
  preview: { select: { title: "imageAlt", media: "image" } }
};

export const cardType = {
  name: "card",
  title: "Card",
  type: "object",
  fields: [
    image(),
    str("imageAlt", "Alt text"),
    str("kicker", "Kicker"),
    str("title", "Title"),
    text("body", "Body", 3),
    str("page", "Links to page key")
  ],
  preview: { select: { title: "title", subtitle: "kicker", media: "image" } }
};

export const sharedTypes = [ctaType, navItemType, factType, titleBodyType, mediaType, cardType];

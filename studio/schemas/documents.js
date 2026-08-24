import { str, text, strList, textList, image, obj, list, titlePreview } from "./helpers.js";

const cta = (name, title) => ({ name, title, type: "cta" });
const media = { type: "media" };
const card = { type: "card" };
const fact = { type: "fact" };
const titleBody = { type: "titleBody" };
const navItem = { type: "navItem" };

const page = (name, title, fields) => ({
  name,
  title,
  type: "document",
  fields,
  preview: { prepare: () => ({ title }) }
});

/** Header, footer and anything shared by every page. */
const site = page("site", "Site — header & footer", [
  image("logo", "Logo"),
  str("logoAlt", "Logo alt text"),
  obj("nav", "Header navigation", [
    list("primary", "Primary links", navItem),
    str("menuLabel", "Dropdown label"),
    list("menu", "Dropdown links", navItem),
    cta("meetTunya", "Meet Tunya link"),
    cta("cta", "Header button")
  ]),
  obj("footer", "Footer", [
    str("tagline", "Tagline"),
    text("blurb", "Blurb", 3),
    str("exploreHeading", "Explore heading"),
    list("explore", "Explore links", navItem),
    str("bookHeading", "Book heading"),
    list("book", "Book links", navItem),
    str("bookNote", "Book note"),
    str("contactHeading", "Contact heading"),
    str("phone", "Phone"),
    str("email", "Email"),
    str("addressLine1", "Address line 1"),
    str("addressLine2", "Address line 2"),
    list("socials", "Social links", {
      type: "object",
      name: "socialLink",
      fields: [
        str("network", "Network", { options: { list: ["facebook", "instagram", "x", "tiktok", "whatsapp"] } }),
        str("href", "URL")
      ],
      preview: { select: { title: "network", subtitle: "href" } }
    }),
    str("copyright", "Copyright line")
  ])
]);

const home = page("home", "Home page", [
  obj("hero", "Hero", [
    image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"),
    str("titleLead", "Heading — plain part"),
    str("titleAccent", "Heading — highlighted part"),
    text("body", "Body", 3),
    cta("primaryCta", "Primary button"),
    cta("secondaryCta", "Secondary button")
  ]),
  obj("way", "The Tunyafrika Way", [
    str("kicker", "Kicker"),
    str("titleLead", "Heading — plain part"),
    str("titleAccent", "Heading — highlighted part"),
    textList("paragraphs", "Paragraphs"),
    list("stats", "Statistics", {
      type: "object", name: "stat",
      fields: [str("value", "Figure"), text("label", "Label", 2)],
      preview: { select: { title: "value", subtitle: "label" } }
    })
  ]),
  obj("days", "Four days section", [
    str("kicker", "Kicker"), str("title", "Heading"),
    str("linkLabel", "Link label"), str("linkPage", "Link page key"),
    list("cards", "Cards", card)
  ]),
  obj("tunya", "Meet Tunya band", [
    image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"),
    str("title", "Heading"), text("body", "Body", 3), cta("cta", "Button")
  ]),
  obj("beyondTeaser", "Beyond the Falls teaser", [
    str("kicker", "Kicker"), str("title", "Heading"),
    list("cards", "Destination cards", card), cta("cta", "Button")
  ])
]);

const falls = page("falls", "Victoria Falls page", [
  obj("hero", "Hero", [image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"), text("title", "Heading", 2)]),
  obj("intro", "Introduction", [
    textList("paragraphs", "Paragraphs"),
    list("seasons", "Season guide", {
      type: "object", name: "season",
      fields: [str("period", "Period"), text("note", "Note", 2)],
      preview: { select: { title: "period", subtitle: "note" } }
    })
  ]),
  list("mosaic", "Photo mosaic", media),
  obj("know", "Know before you go", [
    str("kicker", "Kicker"),
    list("items", "Items", titleBody),
    cta("primaryCta", "Primary button"),
    cta("secondaryCta", "Secondary button")
  ])
]);

const xp = page("xp", "Xperiences page", [
  obj("hero", "Hero", [str("kicker", "Kicker"), text("title", "Heading", 2), text("body", "Body", 3)]),
  list("headline", "Headline experiences", card),
  list("secondary", "Secondary experiences", card),
  obj("boma", "The Boma Dinner", [
    image(), str("imageAlt", "Alt text"), str("imagePosition", "Image focus (CSS object-position)"),
    str("kicker", "Kicker"), str("title", "Heading"), text("body", "Body", 4),
    list("gallery", "Gallery", media)
  ]),
  obj("flagship", "Flagship Xperiences", [
    str("kicker", "Kicker"), str("title", "Heading"), text("body", "Body", 3),
    list("items", "Journeys", card)
  ]),
  obj("closing", "Closing band", [text("title", "Heading", 2), cta("cta", "Button")])
]);

const stays = page("stays", "Stays page", [
  obj("hero", "Hero", [image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"), text("title", "Heading", 2)]),
  list("categories", "Stay categories", titleBody),
  list("gallery", "Gallery", {
    type: "object", name: "galleryShot",
    fields: [image(), str("imageAlt", "Alt text"), { name: "wide", title: "Double width", type: "boolean" }],
    preview: { select: { title: "imageAlt", media: "image" } }
  }),
  obj("closing", "Closing band", [text("title", "Heading", 2), cta("cta", "Button")])
]);

const beyond = page("beyond", "Destinations page", [
  obj("hero", "Hero", [str("kicker", "Kicker"), text("title", "Heading", 2), text("body", "Body", 4)]),
  obj("feature", "Feature destination", [
    image(), str("imageAlt", "Alt text"), str("imagePosition", "Image focus (CSS object-position)"),
    str("kicker", "Kicker"), str("title", "Title"), text("body", "Body", 3)
  ]),
  list("countries", "Countries", card),
  obj("closing", "Closing band", [text("title", "Heading", 2), cta("cta", "Button")])
]);

const visas = page("visas", "Visas & Immigration page", [
  obj("hero", "Hero", [
    image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"), text("title", "Heading", 2),
    text("body", "Body", 3), str("reviewed", "Last reviewed note"),
    cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button")
  ]),
  list("nav", "In-page navigation", {
    type: "object", name: "visaNavItem",
    fields: [str("id", "Section id"), str("label", "Label")],
    preview: { select: { title: "label", subtitle: "id" } }
  }),
  obj("essentials", "Before you fly", [
    str("kicker", "Kicker"), str("title", "Heading"), text("body", "Body", 3),
    list("items", "Checklist", {
      type: "object", name: "numberedItem",
      fields: [str("number", "Number"), str("title", "Title"), text("body", "Body", 3)],
      preview: titlePreview("title", "number")
    })
  ]),
  obj("kaza", "KAZA UniVisa", [
    str("kicker", "Kicker"), str("title", "Heading"), text("body", "Body", 4),
    list("facts", "Key facts", fact),
    str("includesTitle", "Inclusions heading"), textList("includes", "Inclusions"),
    str("watchTitle", "Warnings heading"), textList("watch", "Warnings"),
    text("note", "Footnote", 3),
    list("links", "Official links", {
      type: "object", name: "extLink",
      fields: [str("label", "Label"), str("href", "URL")],
      preview: { select: { title: "label", subtitle: "href" } }
    })
  ]),
  obj("countries", "Country by country", [
    str("kicker", "Kicker"), str("title", "Heading"), text("body", "Body", 3),
    list("items", "Countries", {
      type: "object", name: "visaCountry",
      fields: [
        str("name", "Country"), text("tagline", "Tagline", 2),
        list("facts", "Facts", fact), textList("notes", "Notes")
      ],
      preview: titlePreview("name", "tagline")
    })
  ]),
  obj("health", "Health", [str("kicker", "Kicker"), text("title", "Heading", 2), list("items", "Items", titleBody)]),
  obj("children", "Travelling with children", [
    str("kicker", "Kicker"), text("title", "Heading", 2), text("body", "Body", 3), list("items", "Items", titleBody)
  ]),
  obj("emigration", "Emigration & driving in (ZIMRA TIP)", [
    str("kicker", "Kicker"), text("title", "Heading", 2), text("body", "Body", 4),
    cta("cta", "e-TIP portal button"), str("ctaNote", "Button note"),
    list("panels", "Accordion panels", {
      type: "object", name: "tipPanel",
      fields: [str("title", "Panel title"), textList("items", "Bullet points"), textList("steps", "Numbered steps")],
      preview: titlePreview("title")
    }),
    obj("walkthrough", "Portal walkthrough (screenshots)", [
      str("kicker", "Kicker"), text("title", "Heading", 2), text("note", "Disclaimer note", 3),
      list("shots", "Screens", {
        type: "object", name: "etipShot",
        fields: [image(), str("imageAlt", "Alt text"), text("caption", "Caption", 3)],
        preview: { select: { title: "caption", media: "image" } }
      })
    ]),
    obj("downloads", "Document downloads", [
      str("title", "Section label"),
      list("items", "Documents", {
        type: "object", name: "etipDoc",
        fields: [
          str("label", "Document name"),
          str("note", "Small print", { description: "e.g. PDF · ZIMRA · what it covers" }),
          str("href", "File URL", { description: "Path to a file bundled with the site, or a URL to a file uploaded in Sanity's media library." })
        ],
        preview: titlePreview("label", "note")
      })
    ]),
    textList("tips", "Practical tips")
  ]),
  obj("help", "Get help", [
    str("kicker", "Kicker"), text("title", "Heading", 2), text("body", "Body", 4),
    cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button"),
    text("disclaimer", "Disclaimer", 4)
  ])
]);

const about = page("about", "About page", [
  obj("hero", "Hero", [image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"), text("title", "Heading", 2)]),
  obj("who", "Who we are", [str("kicker", "Kicker"), text("title", "Heading", 2), textList("paragraphs", "Paragraphs")]),
  obj("mandate", "Our mandate", [str("kicker", "Kicker"), list("items", "Items", titleBody)]),
  obj("beliefs", "What we believe", [str("kicker", "Kicker"), text("title", "Heading", 2), textList("items", "Beliefs")]),
  obj("team", "The team", [
    str("kicker", "Kicker"), str("title", "Heading"), text("note", "Side note", 2),
    list("members", "Members", {
      type: "object", name: "member",
      fields: [
        str("name", "Full name"), str("role", "Role"),
        str("initials", "Initials", { description: "Shown when no portrait is uploaded" }),
        image("photo", "Portrait")
      ],
      preview: { select: { title: "name", subtitle: "role", media: "photo" } }
    })
  ]),
  obj("closing", "Closing band", [text("title", "Heading", 2), cta("cta", "Button")])
]);

const social = page("social", "Socials page", [
  obj("hero", "Hero", [str("kicker", "Kicker"), text("title", "Heading", 2), text("body", "Body", 3)]),
  list("channels", "Channels", {
    type: "object", name: "channel",
    fields: [
      str("network", "Icon", { options: { list: ["facebook", "instagram", "x", "tiktok", "whatsapp"] } }),
      str("name", "Name"), str("handle", "Handle"), text("body", "Body", 3), str("href", "URL")
    ],
    preview: { select: { title: "name", subtitle: "handle" } }
  }),
  obj("tunyaCard", "Talk to Tunya card", [
    str("kicker", "Kicker"), str("title", "Title"), str("handle", "Handle"), text("body", "Body", 3), str("href", "URL")
  ]),
  obj("feed", "Lately on our feeds", [str("kicker", "Kicker"), list("images", "Images", media)])
]);

const ai = page("ai", "Meet Tunya page", [
  obj("hero", "Hero", [
    str("kicker", "Kicker"), text("title", "Heading", 2), textList("paragraphs", "Paragraphs"), str("badge", "Badge"),
    list("conversation", "Sample conversation", {
      type: "object", name: "bubble",
      fields: [
        str("from", "Speaker", { options: { list: [{ title: "Guest", value: "guest" }, { title: "Tunya", value: "tunya" }] } }),
        text("text", "Message", 3),
        str("width", "Bubble width", { description: "CSS width, e.g. 78%" })
      ],
      preview: { select: { title: "text", subtitle: "from" } }
    })
  ]),
  list("features", "Feature columns", titleBody),
  obj("closing", "Closing band", [image(), str("imageAlt", "Alt text"), text("title", "Heading", 2), cta("cta", "Button")])
]);

const plan = page("plan", "Plan my trip page", [
  obj("hero", "Hero", [image(), str("imageAlt", "Alt text"), str("kicker", "Kicker"), text("title", "Heading", 2)]),
  obj("form", "Enquiry form", [
    list("fields", "Fields", {
      type: "object", name: "formField",
      fields: [str("label", "Label"), str("placeholder", "Placeholder"), str("type", "Input type", { options: { list: ["text", "email", "tel"] } })],
      preview: { select: { title: "label", subtitle: "placeholder" } }
    }),
    str("tripTypeLabel", "Trip type label"),
    strList("tripTypes", "Trip type chips"),
    str("notesLabel", "Notes label"),
    text("notesPlaceholder", "Notes placeholder", 2),
    str("submitLabel", "Submit button label"),
    str("asideNoteLead", "Aside note text"),
    str("asideNoteLink", "Aside note link text")
  ]),
  obj("contact", "Contact panel", [str("kicker", "Kicker"), text("title", "Heading", 2), list("items", "Details", fact)])
]);

export const documents = [site, home, falls, xp, stays, beyond, visas, about, social, ai, plan];

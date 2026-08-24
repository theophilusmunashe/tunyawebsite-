# Tunyafrika Xperiences — React Website

The complete Tunyafrika Xperiences website as a **React + Vite** application. Pixel-identical to the approved design — nothing was changed in the conversion.

Plug and play: unzip, install, run.

---

## 1. Quick start

You need **Node.js 18 or newer** ([nodejs.org](https://nodejs.org)).

```bash
cd tunyafrika-react
npm install
npm run dev
```

The site opens at **http://localhost:5173**.

### Build for production

```bash
npm run build     # outputs a static site into dist/
npm run preview   # serves dist/ locally to check it
```

### Deploy

`npm run build`, then upload the **`dist/`** folder to any static host:

| Host | How |
|---|---|
| Netlify | Drag `dist/` onto Netlify Drop, or connect the repo (build: `npm run build`, publish: `dist`) |
| Vercel | Import the repo — Vite is auto-detected |
| GitHub Pages | Push `dist/` to the `gh-pages` branch |
| cPanel / any web host | Upload the contents of `dist/` to `public_html` |

`vite.config.js` sets `base: "./"`, so the build works from a subfolder too.

---

## 2. Project structure

```
tunyafrika-react/
├── index.html                  ← HTML shell (title, meta, favicon, #root)
├── package.json                ← dependencies and scripts
├── vite.config.js              ← Vite + React plugin config
├── public/
│   ├── assets/                 ← all 36 photographs + the logo (served at /assets/…)
│   │   └── etip/               ← ZIMRA e-TIP portal screens used on the Visas page
│   └── docs/                   ← downloadable PDFs (served at /docs/…)
├── studio/                     ← Sanity Studio (the CMS admin app)
│   ├── sanity.config.js
│   ├── schemas/                ← one schema per page section
│   └── scripts/seed.mjs        ← pushes the current copy + images into Sanity
└── src/
    ├── main.jsx                ← React entry point, wraps the app in ContentProvider
    ├── App.jsx                 ← page router (state-based) + layout
    ├── styles.css              ← fonts, resets, hover/focus states, Visas page UI
    ├── lib/
    │   └── sanity.js           ← CMS client + image URL resolution
    ├── content/
    │   ├── ContentProvider.jsx ← fetches from Sanity, merges over defaults
    │   ├── merge.js            ← deep merge that ignores empty CMS fields
    │   └── defaults/           ← every word and image path on the site
    ├── components/
    │   ├── Header.jsx          ← sticky nav + "Beyond the Falls" dropdown
    │   └── Footer.jsx          ← footer with social icons
    └── pages/
        ├── Home.jsx
        ├── VictoriaFalls.jsx
        ├── Xperiences.jsx
        ├── Stays.jsx
        ├── BeyondTheFalls.jsx
        ├── Visas.jsx
        ├── About.jsx
        ├── Socials.jsx
        ├── MeetTunya.jsx
        └── PlanMyTrip.jsx
```

### Dependencies

- `react` + `react-dom` — the UI library
- `@vitejs/plugin-react` + `vite` (dev only) — the build tool
- `@sanity/client` + `@sanity/image-url` — CMS content and image delivery

No CSS framework, no UI kit, no icon package. All icons are hand-written inline SVG, so nothing else to install and nothing to license.

---

## 3. How the pages work

`App.jsx` keeps the current page in React state and renders the matching component. Every nav item, footer link and CTA calls `go("pageKey")`, which switches the page and scrolls to the top.

| Key | Component | Page |
|---|---|---|
| `home` | `Home.jsx` | Hero, the Tunyafrika way, four-day strip, Tunya feature, Beyond teaser |
| `falls` | `VictoriaFalls.jsx` | The wonder, season guide, gallery, know-before-you-go |
| `xp` | `Xperiences.jsx` | Activities, the Boma Dinner, six Flagship Xperiences |
| `stays` | `Stays.jsx` | Accommodation types + room gallery |
| `beyond` | `BeyondTheFalls.jsx` | Southern Africa: Zimbabwe, Botswana, Zambia, Namibia, South Africa |
| `visas` | `Visas.jsx` | Visas & immigration, KAZA UniVisa, ZIMRA TIP |
| `about` | `About.jsx` | Who we are, mandate, beliefs, the team |
| `social` | `Socials.jsx` | Every social channel as a clickable card |
| `ai` | `MeetTunya.jsx` | The conversational assistant |
| `plan` | `PlanMyTrip.jsx` | Enquiry form + contact details |

**Header behaviour**

- "Beyond the Falls ▾" opens a dropdown: Destinations · Visas & Immigration · About Tunyafrika · Our Footprints on Socials.
- "Meet Tunya" and the gold "Plan My Trip" button open **www.tunya.africa** in a new tab.
- The internal Meet Tunya and Plan My Trip pages are reachable from the footer.

### Adding a page

1. Create `src/pages/MyPage.jsx` exporting a component that takes `{ go }`.
2. Import it in `App.jsx` and add it to the `PAGES` object with a new key.
3. Add a nav item in `Header.jsx` calling `go("myKey")`.

### Switching to real URLs (optional)

The site uses state-based routing, so every page shares one URL. If you want `/stays`, `/about` etc. for SEO and sharing, add React Router:

```bash
npm install react-router-dom
```

then replace the `PAGES` switch in `App.jsx` with `<Routes>` / `<Route>` and change `go(key)` calls to `navigate("/key")`. The page components need no changes.

---

## 4. The CMS (Sanity)

Every word, link and photograph on the site is editable in Sanity. Nothing on the page is a hardcoded string any more — each page reads its content from `src/content/defaults/`, and the CMS overrides it at runtime.

### How content resolves

```
src/content/defaults/*.js   ← the copy shipped with the code (always present)
              ↓  merged under
Sanity documents            ← whatever an editor has changed
              ↓
what the visitor sees
```

`ContentProvider` fetches all eleven documents in a single query and deep-merges them over the defaults. Three rules keep the site safe:

- **No project id?** Nothing is fetched and the bundled copy renders. The site works with no CMS at all.
- **CMS unreachable or query fails?** The bundled copy stays on screen and a warning goes to the console.
- **Empty field in the CMS?** Ignored, so a blank field can never blank out the live site. Images fall back to the bundled `/assets/…` file.

### Connecting your project

1. Create the project at [sanity.io/manage](https://www.sanity.io/manage) and copy the **project id**.
2. In the website root, copy `.env.example` to `.env` and fill it in:

```
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
```

3. Add the site's URLs to **API → CORS origins** in the Sanity dashboard (`http://localhost:5174` for development, plus your live domain).
4. Restart `npm run dev`. The site now reads from Sanity.

### Running the Studio

The Studio is a separate app in `studio/` so it can be deployed and versioned independently.

```bash
cd studio
npm install
```

Create `studio/.env` with:

```
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

Then:

```bash
npm run dev      # Studio at http://localhost:3333
npm run deploy   # hosts it at your-name.sanity.studio
```

### Seeding the current content

Run this once so editors open the Studio and find the live site's words already in place, rather than blank fields. It also uploads all the photographs from `public/assets/` into Sanity.

```bash
cd studio
# needs a token with write access: Sanity dashboard → API → Tokens
SANITY_STUDIO_PROJECT_ID=xxx SANITY_WRITE_TOKEN=yyy npm run seed
```

On Windows PowerShell:

```powershell
$env:SANITY_STUDIO_PROJECT_ID="xxx"; $env:SANITY_WRITE_TOKEN="yyy"; npm run seed
```

It is safe to re-run — each page document is replaced wholesale.

### What editors see

The Studio lists one entry per page. Headings that carry a gold phrase are split into two fields ("plain part" and "highlighted part") so the styling survives editing. Internal links use a **page key** (`home`, `falls`, `xp`, `stays`, `beyond`, `visas`, `about`, `social`, `ai`, `plan`); external links use a URL.

---

## 5. Styling

All layout and colour is **inline styles** on the elements — what you see in the JSX is exactly what renders, so you can edit any spacing or colour in place without hunting through a stylesheet. Words and images are the exception: those come from the content layer (section 4), which keeps the markup readable and everything editable.

`src/styles.css` holds only what inline styles can't express:

- the Google Fonts import (Cormorant Garamond + Poppins)
- body resets and text selection colour
- the `.x1 … .x12` classes, which carry the hover and focus states (button hovers, nav underlines, form field focus)

### The palette

| Colour | Hex | Used for |
|---|---|---|
| Deep green | `#04301f` | Header, footer, dark sections |
| Gold | `#b3955c` | Accents, buttons, kickers, rules |
| Cream | `#faf3e8` | Page background, reversed text |
| Ink | `#0d2b1e` | Body text |
| Night | `#0a1f15` / `#120b04` | The Boma and deep-dark blocks |

A project-wide find-and-replace on a hex updates the whole site.

### Type

- Headings: **Cormorant Garamond** (500 weight, often with a gold `<em>` phrase)
- Body and interface: **Poppins** (300 for copy, 500–600 for labels and buttons)

---

## 6. Images

Every photograph lives in `public/assets/` and is referenced as `/assets/filename.jpg`. Nothing is hot-linked to an external server, so images can never break.

To replace one without the CMS: drop your file into `public/assets/` and change the filename in the matching file under `src/content/defaults/`. With the CMS connected, upload the replacement in the Studio instead — it takes precedence over the bundled file. Keep a similar aspect ratio (landscape for wide cards, portrait for tall ones) — all images use `object-fit: cover`.

Stock photography came from **Pexels** (free for commercial use, no attribution required). Verify any image you keep before large-scale print or paid advertising.

### ZIMRA e-TIP screens and paperwork

The Visas page carries a six-screen walkthrough of the ZIMRA e-TIP portal (`public/assets/etip/`) and a download of ZIMRA's TIP requirements checklist (`public/docs/`). Both were taken from the two official ZIMRA documents supplied for this build.

Two things to know if you ever refresh this material:

- **The screens were curated for privacy.** The source e-TIP guide demonstrates the portal using live staff accounts, and several of its pages show real names, work email addresses, phone, passport, driver's licence and national ID numbers. Only screens free of personal data were published, and the dashboard screen had its header bar cropped to remove the signed-in account name. If you add screens, check them the same way.
- **The e-TIP application guide PDF is deliberately not hosted**, for the same reason — it cannot be published without republishing that personal data. The page links to the live portal instead, which serves its own up-to-date "How to Apply" guide from the landing screen.

The portal changes from time to time, so the walkthrough carries a note telling travellers to treat it as a guide. Both the screens and the download are editable in the Studio under **Visas → Emigration & driving in**.

---

## 7. Before going live

Once the CMS is connected and seeded, items 1, 2 and 4 are all editable in the Studio — no code changes needed.

1. **Social handles** — every link currently points at `@tunyafrika` (Facebook, Instagram, X, TikTok). Confirm the real URLs.
2. **Team portraits** — the five team members show gold monogram placeholders. Upload a portrait against each member and the monogram is replaced automatically.
3. **The enquiry form** — `PlanMyTrip.jsx` is visual only; it does not submit yet. Wire it to your mailer, CRM, or a service like Formspree, or point the button at www.tunya.africa.
4. **Destination imagery** — Namibia and South Africa currently use stock stand-ins. Replace with real Tunyafrika trip photography when available.
5. **Visa content** — the Visas page carries a "last reviewed" date and a disclaimer. Immigration rules move; review the page each quarter and update the date in the Studio.
6. **Analytics / pixel** — add your tracking script to `index.html` before `</head>`.

---

## 8. Contact details used across the site

- WhatsApp / phone: **+263 78 266 9251**
- Email: **enquiries@tunyafrika.com**
- Office: **619 Ngugwuma Road, Victoria Falls, Zimbabwe**
- Assistant: **www.tunya.africa**
- Web: **www.tunyafrika.com**

---

## 9. Troubleshooting

**`npm install` fails** — check `node -v` is 18 or higher.

**Blank page after `npm run dev`** — open the browser console. A missing import path is the usual cause.

**Images missing after deploying to a subfolder** — `base: "./"` in `vite.config.js` handles this; if your host needs an absolute base, change it to `"/your-subfolder/"` and rebuild.

**Fonts look wrong offline** — the Google Fonts import in `styles.css` needs internet. To self-host, download the two families into `public/fonts/` and replace the `@import` with `@font-face` rules.

---

© 2026 Tunyafrika Xperiences · Xpectional Xperiences

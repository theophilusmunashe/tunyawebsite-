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
│   └── assets/                 ← all 36 photographs + the logo (served at /assets/…)
└── src/
    ├── main.jsx                ← React entry point
    ├── App.jsx                 ← page router (state-based) + layout
    ├── styles.css              ← fonts, resets, hover/focus states
    ├── components/
    │   ├── Header.jsx          ← sticky nav + "Beyond the Falls" dropdown
    │   └── Footer.jsx          ← footer with social icons
    └── pages/
        ├── Home.jsx
        ├── VictoriaFalls.jsx
        ├── Xperiences.jsx
        ├── Stays.jsx
        ├── BeyondTheFalls.jsx
        ├── About.jsx
        ├── Socials.jsx
        ├── MeetTunya.jsx
        └── PlanMyTrip.jsx
```

### Dependencies

Only three, all standard:

- `react` + `react-dom` — the UI library
- `@vitejs/plugin-react` + `vite` (dev only) — the build tool

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
| `beyond` | `BeyondTheFalls.jsx` | Chobe, Cape Town, Great Plains, Indian Ocean, Dunes, the North |
| `about` | `About.jsx` | Who we are, mandate, beliefs, the team |
| `social` | `Socials.jsx` | Every social channel as a clickable card |
| `ai` | `MeetTunya.jsx` | The conversational assistant |
| `plan` | `PlanMyTrip.jsx` | Enquiry form + contact details |

**Header behaviour**

- "Beyond the Falls ▾" opens a dropdown: Destinations · About Tunyafrika · Our Footprints on Socials.
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

## 4. Styling

All layout and colour is **inline styles** on the elements — what you see in the JSX is exactly what renders, so you can edit any spacing or colour in place without hunting through a stylesheet.

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

## 5. Images

Every photograph lives in `public/assets/` and is referenced as `/assets/filename.jpg`. Nothing is hot-linked to an external server, so images can never break.

To replace one: drop your file into `public/assets/` and change the filename in the JSX. Keep a similar aspect ratio (landscape for wide cards, portrait for tall ones) — all images use `object-fit: cover`.

Stock photography came from **Pexels** (free for commercial use, no attribution required). Verify any image you keep before large-scale print or paid advertising.

---

## 6. Before going live

1. **Social handles** — every link currently points at `@tunyafrika` (Facebook, Instagram, X, TikTok). Replace the real URLs in `Socials.jsx` and `Footer.jsx`.
2. **Team portraits** — the five team members in `About.jsx` (Theophilus Munashe Maposa, Rudolph Benjamin Volksgyn, Dzikamai Ronald Muchemedzi, Tatenda Blessing Chakwesha, Fungai) show gold monogram placeholders. Swap each monogram block for an `<img src="/assets/…" />`.
3. **The enquiry form** — `PlanMyTrip.jsx` is visual only; it does not submit yet. Wire it to your mailer, CRM, or a service like Formspree, or point the button at www.tunya.africa.
4. **Beyond-the-Falls imagery** — Cape Town, the Dunes, the Indian Ocean and the North use stock stand-ins. Replace with real Tunyafrika trip photography when available.
5. **Analytics / pixel** — add your tracking script to `index.html` before `</head>`.

---

## 7. Contact details used across the site

- WhatsApp / phone: **+263 78 266 9251**
- Email: **enquiries@tunyafrika.com**
- Office: **619 Ngugwuma Road, Victoria Falls, Zimbabwe**
- Assistant: **www.tunya.africa**
- Web: **www.tunyafrika.com**

---

## 8. Troubleshooting

**`npm install` fails** — check `node -v` is 18 or higher.

**Blank page after `npm run dev`** — open the browser console. A missing import path is the usual cause.

**Images missing after deploying to a subfolder** — `base: "./"` in `vite.config.js` handles this; if your host needs an absolute base, change it to `"/your-subfolder/"` and rebuild.

**Fonts look wrong offline** — the Google Fonts import in `styles.css` needs internet. To self-host, download the two families into `public/fonts/` and replace the `@import` with `@font-face` rules.

---

© 2026 Tunyafrika Xperiences · Xpectional Xperiences

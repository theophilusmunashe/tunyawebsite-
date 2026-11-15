import { TUNYA_URL } from "./site.js";

export const home = {
  hero: {
    image: "/assets/br-falls-aerial.jpg",
    imageAlt: "Victoria Falls from the air",
    // Hero film (same footage as Ask Tunya), served by Cloudinary: muted, no audio track, sized per screen.
    video: {
      desktop: "https://res.cloudinary.com/dwx3y9j1d/video/upload/q_auto:low,w_1280,ac_none,vc_h264/v1793800338/hero_ql5jme.mp4",
      mobile: "https://res.cloudinary.com/dwx3y9j1d/video/upload/q_auto:eco,w_720,ac_none,vc_h264/v1793800338/hero_ql5jme.mp4",
      poster: "https://res.cloudinary.com/dwx3y9j1d/video/upload/so_0,q_auto,f_jpg,w_1600/v1793800338/hero_ql5jme.jpg"
    },
    kicker: "Victoria Falls · Zimbabwe",
    title: "Victoria Falls Tours by Locals",
    titleLead: "Victoria Falls Tours ",
    titleAccent: "by Locals",
    tagline: "Theo · Rudolph · Dzika",
    body: "Tours, activities and places to stay in Victoria Falls, planned by a small team who live here. We pick you up, book everything and handle the borders, including a Chobe day trip to Botswana if you want one.",
    primaryCta: { label: "Plan My Trip", href: TUNYA_URL },
    secondaryCta: { label: "See Things To Do", page: "xp" }
  },
  way: {
    kicker: "Who you're dealing with",
    titleLead: "Born here. ",
    titleAccent: "Based here.",
    paragraphs: [
      "We grew up within earshot of the Falls. We know which guide tells the best stories, which lodge has the quiet deck, and which morning the light on the gorge is worth the early start.",
      "You give us your dates. We sort out the rest: airport pickup, activity bookings, border crossings, transfers and dinner reservations. One team looks after you from your first message to your flight home."
    ],
    stats: [
      { value: "253+", label: "Guests we looked after last year." },
      { value: "10+", label: "Countries our guests came from." },
      { value: "6", label: "Trips we run ourselves, not resold from a list." }
    ],
    image: "/assets/home-born-here.jpg",
    imageAlt: "The Tunyafrika team on the ground in Victoria Falls",
    captionKicker: "Victoria Falls",
    caption: "Our team, out in town. Not in a brochure."
  },
  meetDzika: {
    image: "/assets/meet-dzika.jpg",
    imageAlt: "Dzikamai at Victoria Falls",
    kicker: "Meet Dzika",
    title: "Welcome to our Victoria Falls.",
    paragraphs: [
      "I'm Dzikamai, but everyone calls me Dzika. I run operations at Tunyafrika with Theo and Rudolph. We grew up here with the sound of the Falls in our ears. This isn't a place we studied. It's home.",
      "Ask us anything: when the water is highest, how the border works, which lodge is quiet, where to eat tonight. We'll give you a straight answer, even when it's not the one you hoped for. Need a table, a transfer or a pickup? Message us and one of us will sort it."
    ],
    cta: { label: "Meet the Team", page: "about" }
  },
  days: {
    kicker: "Your first visit, day by day",
    title: "Four days in Victoria Falls.",
    linkLabel: "All things to do →",
    linkPage: "xp",
    cards: [
      { kicker: "Day One", title: "Walk the rainforest trail", image: "/assets/br-explore-rainbow.jpg", imageAlt: "The rainforest trail", page: "falls" },
      { kicker: "Day Two", title: "Fly over the Falls", image: "/assets/br-explore-flight.jpg", imageAlt: "Flight of Angels", page: "xp" },
      { kicker: "Day Three", title: "Chobe day trip, Botswana", image: "/assets/ch-eleph-portrait.jpg", imageAlt: "Chobe elephants", page: "beyond" },
      { kicker: "Day Four", title: "Boma dinner by the fire", image: "/assets/br-boma-drummer.jpg", imageAlt: "The Boma dinner", page: "xp" }
    ]
  },
  tunya: {
    image: "/assets/br-tunya-site.jpg",
    imageAlt: "Ask Tunya, our trip-planning assistant",
    kicker: "Ask Tunya",
    title: "Plan at any hour. We take it from there.",
    body: "Ask Tunya is our trip-planning assistant. Ask about activities, lodges, transfers or border rules at two in the morning and get an answer straight away. Then one of us picks it up, checks every detail and confirms your booking.",
    cta: { label: "Ask Tunya", href: TUNYA_URL }
  },
  beyondTeaser: {
    kicker: "Beyond the Falls",
    title: "From Victoria Falls to Botswana and beyond.",
    cards: [
      { title: "South Africa", image: "/assets/w-capetown.jpg", imageAlt: "South Africa", page: "beyond" },
      { title: "Botswana", image: "/assets/w-lions.jpg", imageAlt: "Botswana", page: "beyond" },
      { title: "Namibia", image: "/assets/w-island.jpg", imageAlt: "Namibia", page: "beyond" }
    ],
    cta: { label: "See Destinations", page: "beyond" }
  }
};

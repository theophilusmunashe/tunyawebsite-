import { TUNYA_URL } from "./site.js";

export const social = {
  hero: {
    kicker: "Our Footprints on Socials",
    title: "Follow the thunder wherever you scroll.",
    body: "Daily views of the Falls, wildlife from the riverfront, guest moments and last-minute openings — we post it all. Come say hello on whichever one you live on."
  },
  channels: [
    { network: "facebook", name: "Facebook", handle: "Tunyafrika", body: "Awareness posts, travel tips and everything you need to know before you fly.", href: "https://www.facebook.com/share/1AQtQoLBrE/" },
    { network: "instagram", name: "Tunya", handle: "@tunyafrika_xperience", body: "The gallery — rainbows, elephants, golden hour and guest photographs.", href: "https://www.instagram.com/tunyafrika_xperience" },
    { network: "whatsapp", name: "WhatsApp", handle: "+263 78 266 9251", body: "The fastest way to reach a human on our team. Usually answered within the hour.", href: "https://wa.me/263782669251" },
    { network: "x", name: "X", handle: "@tunyafrika", body: "Water levels, weather, openings and quick answers in real time.", href: "https://x.com/tunyafrika" },
    { network: "tiktok", name: "TikTok", handle: "@tunyafrika.xperie", body: "The bungee jumps, the drum circles, the faces the moment the spray hits.", href: "https://www.tiktok.com/@tunyafrika.xperie" }
  ],
  tunyaCard: {
    kicker: "Skip the queue",
    title: "Talk to Tunya",
    handle: "www.tunya.africa",
    body: "Bookings, availability and answers — instantly, at any hour.",
    href: TUNYA_URL
  },
  feed: {
    kicker: "Lately on our feeds",
    images: [
      { image: "/assets/br-explore-rainbow.jpg", imageAlt: "" },
      { image: "/assets/br-elephant-golden.jpg", imageAlt: "" },
      { image: "/assets/br-boma-dance.jpg", imageAlt: "" },
      { image: "/assets/br-cruise-sunset.jpg", imageAlt: "" }
    ]
  }
};

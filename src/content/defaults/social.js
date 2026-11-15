import { TUNYA_URL } from "./site.js";

export const social = {
  hero: {
    kicker: "Follow us on socials",
    title: "See the Falls every day, wherever you scroll.",
    body: "We post daily views of the Falls, wildlife from the riverfront, guest moments and last-minute openings. Follow us on the app you use most and say hello. It's us on the other end."
  },
  channels: [
    { network: "facebook", name: "Facebook", handle: "Tunyafrika", body: "Travel tips and everything you need to know before you fly to Victoria Falls.", href: "https://www.facebook.com/share/1AQtQoLBrE/" },
    { network: "instagram", name: "Tunya", handle: "@tunyafrika_xperience", body: "Rainbows, elephants, golden hour and photos from our guests.", href: "https://www.instagram.com/tunyafrika_xperience" },
    { network: "whatsapp", name: "WhatsApp", handle: "+263 78 266 9251", body: "The fastest way to reach a real person on our team. We usually reply within the hour.", href: "https://wa.me/263782669251" },
    { network: "x", name: "X", handle: "@tunyafrika", body: "Water levels, weather, openings and quick answers as they happen.", href: "https://x.com/tunyafrika" },
    { network: "tiktok", name: "TikTok", handle: "@tunyafrika.xperie", body: "Bungee jumps, drum circles and faces the moment the spray hits.", href: "https://www.tiktok.com/@tunyafrika.xperie" }
  ],
  tunyaCard: {
    kicker: "Plan any time",
    title: "Ask Tunya",
    handle: "asktunya.vercel.app",
    body: "Our trip-planning assistant answers at any hour. Then our team follows up to confirm your trip.",
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

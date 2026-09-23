import { TUNYA_URL } from "./site.js";

export const xp = {
  hero: {
    kicker: "Xperiences",
    title: "Choose how you want to remember it.",
    body: "Everything below is booked, guided and looked after by us. Mix them freely — most guests build a week from four or five."
  },
  headline: [
    {
      image: "/assets/br-rafting.jpg",
      imageAlt: "White-water rafting",
      kicker: "Adrenaline",
      title: "White-water rafting",
      body: "Nineteen named rapids in the Batoka Gorge — the wildest commercially run water on earth."
    },
    {
      image: "/assets/br-explore-flight.jpg",
      imageAlt: "Flight of Angels",
      kicker: "From the air",
      title: "The Flight of Angels",
      body: "Helicopter or microlight over the full mile — the only way to see the whole of it at once."
    }
  ],
  secondary: [
    { image: "/assets/br-explore-swing.jpg", imageAlt: "The gorge swing", title: "Bungee & gorge swing", body: "111 metres off the 1905 bridge." },
    { image: "/assets/br-explore-cruise.jpg", imageAlt: "Sunset cruise", title: "Zambezi sunset cruise", body: "Hippos, gin and a sun the size of a drum." },
    { image: "/assets/ch-jeep1.jpg", imageAlt: "Game drive", title: "Game drives", body: "Zambezi National Park, or a full day in Chobe." }
  ],
  boma: {
    image: "/assets/br-boma-drummer.jpg",
    imageAlt: "The Boma Dinner",
    imagePosition: "50% 32%",
    kicker: "The one everyone talks about",
    title: "The Boma Dinner",
    body: "Firelight, drums in your chest, a feast under the stars and a face-painting ceremony you'll be talking about for years. Bookings for the year fill early — reserve before you fly.",
    gallery: [
      { image: "/assets/br-boma-dance.jpg", imageAlt: "Boma dancers" },
      { image: "/assets/br-boma-fire.jpg", imageAlt: "Boma firelight" }
    ]
  },
  flagship: {
    kicker: "Flagship Xperiences",
    title: "Six journeys we are known for.",
    body: "Fully arranged, start to finish — transfers, guides, entries and tables included. Tell us which one and we shape it around your dates.",
    items: [
      {
        image: "/assets/br-rafting.jpg",
        imageAlt: "The Adrenaline Run",
        kicker: "Flagship I · 4 days, 3 nights",
        title: "The Adrenaline Run",
        lede: "For the ones who came to feel something.",
        body: "Four days built around the rush. Quads through the bush, a drop into the Batoka Gorge and the Zambezi at full force, then a full day with the elephants of Chobe to bring your heart rate down. It's the Falls at full throttle, and we handle everything in between.",
        days: [
          { title: "Day 1 · Arrive and explore", body: "Airport pickup and transfer to your stay. Victoria Falls town tour: markets, local spots and the lay of the land." },
          { title: "Day 2 · Into the gorge", body: "Your choice: jet boat through the gorge then abseiling, or white-water rafting then zipline across the gorge." },
          { title: "Day 3 · Chobe", body: "Full-day Chobe safari in Botswana: game drive, river cruise and lunch. Border crossing handled by us." },
          { title: "Day 4 · One last ride", body: "Quad biking through the bush, then transfer to the airport." }
        ],
        included: ["Quad biking", "Victoria Falls town tour", "Jet boat and abseiling or white-water rafting and zipline", "Full-day Chobe safari", "Airport transfers"]
      },
      {
        image: "/assets/br-falls-aerial2.jpg",
        imageAlt: "The Angel's View",
        kicker: "Flagship II · 3 days, 2 nights",
        title: "The Angel's View",
        lede: "See it the way the first explorers only imagined.",
        body: "This one is about seeing the Falls from every angle. First from above, on a helicopter flight over the whole mile of falling water. Then up close, walking the rainforest in the spray. Then from the river at sunset. It ends with a long African dinner under the stars.",
        days: [
          { title: "Day 1 · Arrive", body: "Airport pickup and transfer to your stay. Sunset cruise on the upper Zambezi." },
          { title: "Day 2 · From above, then on foot", body: "Flight of Angels helicopter ride over the Falls. Guided tour of the Falls and rainforest. African dinner experience." },
          { title: "Day 3 · Depart", body: "Transfer to the airport." }
        ],
        included: ["Flight of Angels helicopter ride", "Guided tour of the Falls", "Sunset cruise", "African dinner experience", "Airport transfers"]
      },
      {
        image: "/assets/br-explore-swing.jpg",
        imageAlt: "The Weekend Escape",
        kicker: "Flagship III · 3 days, 2 nights",
        title: "The Weekend Escape",
        lede: "Friday you're at your desk. Saturday you're in the spray.",
        body: "The easiest way to say yes to Victoria Falls. See the Falls, get some dust on the quads, watch the sun go down on the Zambezi and eat like royalty. You'll be home by Monday feeling like you've gone for a month.",
        days: [
          { title: "Day 1 · Arrive", body: "Tour of Victoria Falls. Sunset cruise on the Zambezi." },
          { title: "Day 2 · Dust and drums", body: "Quad biking through the bush. African dinner experience." },
          { title: "Day 3 · Slow Sunday", body: "A free morning to rest, then head home." }
        ],
        included: ["Tour of Victoria Falls", "Quad biking", "Sunset cruise", "African dinner experience"]
      },
      {
        image: "/assets/br-elephant-portrait.jpg",
        imageAlt: "The Grand Signature",
        kicker: "Flagship IV · 4 days, 3 nights · Our signature",
        title: "The Grand Signature",
        lede: "Everything we're known for, in one journey.",
        body: "Our most complete Xperience. You'll fly over the Falls, spend a full day with the elephants of Chobe, meet elephants up close and finish on a luxury sunset cruise. Every detail is arranged. This is the one people tell stories about.",
        days: [
          { title: "Day 1 · Arrive in style", body: "Arrival and transfer. Guided Victoria Falls tour." },
          { title: "Day 2 · The sky and the giants", body: "Helicopter flight over the Falls. Elephant experience." },
          { title: "Day 3 · Chobe", body: "Full-day Chobe safari in Botswana. Border crossing handled by us." },
          { title: "Day 4 · The grand finale", body: "Luxury sunset cruise on the Zambezi, then departure." }
        ],
        included: ["Helicopter flight", "Full-day Chobe safari", "Elephant experience", "Victoria Falls tour", "Luxury sunset cruise"]
      },
      {
        image: "/assets/ch-impala.jpg",
        imageAlt: "The Classic Safari",
        kicker: "Flagship V · 4 days, 3 nights",
        title: "The Classic Safari",
        lede: "The Africa you pictured as a child.",
        body: "Game drives at golden hour, crocodiles up close, and a baobab more than a thousand years old. Then the river at dusk and a Boma dinner by the fire. It's the classic safari, done properly.",
        days: [
          { title: "Day 1 · Arrive", body: "Arrival and transfer. Sunset cruise on the Zambezi." },
          { title: "Day 2 · Into the wild", body: "Game drive in Zambezi National Park." },
          { title: "Day 3 · Old giants", body: "Crocodile farm. The Big Tree, a baobab over 1,000 years old. Boma dinner: drums, fire and a feast." },
          { title: "Day 4 · Depart", body: "Transfer out." }
        ],
        included: ["Game drive", "Crocodile farm and the Big Tree", "Sunset cruise", "Boma dinner"]
      },
      {
        image: "/assets/br-elephant-calf.jpg",
        imageAlt: "The Family Basecamp",
        kicker: "Flagship VI · 4 days, 3 nights · Sleeps up to 4",
        title: "The Family Basecamp",
        lede: "Your own place. Their first adventure.",
        body: "A home base for the whole family, with space to spread out and cook your own breakfast. Your days are full of animals, water and wonder: a game drive, crocodiles, a giant baobab, a sunset cruise and a Boma night the kids will never forget.",
        days: [
          { title: "Day 1 · Settle in", body: "Check in to your self-catering stay. Sunset cruise on the Zambezi." },
          { title: "Day 2 · Big animals", body: "Game drive." },
          { title: "Day 3 · Crocs and giants", body: "Crocodile farm and the Big Tree. Boma dinner." },
          { title: "Day 4 · Home", body: "Check out and depart." }
        ],
        included: ["Self-catering stay for up to 4", "Game drive", "Crocodile farm and the Big Tree", "Sunset cruise", "Boma dinner"]
      }
    ]
  },
  closing: {
    title: "Tell us the mood. We'll build the days.",
    cta: { label: "Build My Itinerary", href: TUNYA_URL }
  }
};

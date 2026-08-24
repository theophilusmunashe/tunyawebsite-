import { TUNYA_URL } from "./site.js";

export const ETIP_URL = "https://ecustoms.zimra.co.zw/etip/";

export const visas = {
  hero: {
    image: "/assets/br-explore-bridge.jpg",
    imageAlt: "The Victoria Falls Bridge border crossing",
    kicker: "Visas & Immigration",
    title: "Africa, minus the paperwork.",
    body: "What you need before you fly, and what you need in your hand at the border. We keep this page current — and for guests travelling with us, we do the admin ourselves.",
    reviewed: "Last reviewed August 2026",
    primaryCta: { label: "Ask Us About Your Passport", href: TUNYA_URL },
    secondaryCta: { label: "Apply for a ZIMRA TIP", href: ETIP_URL }
  },
  nav: [
    { id: "essentials", label: "Before You Fly" },
    { id: "kaza", label: "KAZA UniVisa" },
    { id: "countries", label: "Country by Country" },
    { id: "health", label: "Health" },
    { id: "children", label: "Children" },
    { id: "emigration", label: "Emigration & Driving In" },
    { id: "help", label: "Get Help" }
  ],
  essentials: {
    kicker: "Before you fly",
    title: "Six things to get right.",
    body: "Most border trouble is avoidable and starts at home. Run through this list before you pack.",
    items: [
      { number: "01", title: "Six months on your passport", body: "Zimbabwe, Zambia, Botswana, Namibia and South Africa all expect your passport to be valid for at least six months beyond the date you arrive. Renew early — appointments get scarce in peak season." },
      { number: "02", title: "Blank pages, more than you think", body: "Allow three blank pages for every country you enter. A five-country Southern Africa itinerary can swallow a surprising amount of space, and insufficient pages is a legitimate reason to refuse entry." },
      { number: "03", title: "Know your visa category", body: "Every country sorts nationalities into groups: visa-free, visa on arrival, or apply-before-you-travel. Confirm which one your passport falls into on the official portal — it decides whether you can simply land or not." },
      { number: "04", title: "Clean US dollars in cash", body: "Visa fees and border charges are paid in US dollars. Card terminals at land borders fail often. Bring recent, undamaged notes in small denominations; torn or pre-2009 bills are frequently refused." },
      { number: "05", title: "Return ticket and proof of funds", body: "Immigration officers may ask for an onward or return ticket and evidence that you can support yourself. A printed itinerary and a card statement settle the question quickly." },
      { number: "06", title: "Your accommodation address", body: "Arrival forms ask where you are staying. Have the lodge name, address and phone number written down — not buried in an email you cannot open without wifi." }
    ]
  },
  kaza: {
    kicker: "The one visa worth knowing",
    title: "The KAZA UniVisa",
    body: "One fifty-dollar visa covers Zimbabwe and Zambia, with as many crossings between the two as you like. If you plan to see both sides of Victoria Falls — and you should — this is the document you want.",
    facts: [
      { label: "Cost", value: "USD 50" },
      { label: "Validity", value: "30 days from first entry" },
      { label: "Entries", value: "Multiple, Zimbabwe ↔ Zambia" },
      { label: "Eligibility", value: "Around 65 nationalities" }
    ],
    includesTitle: "What it covers",
    includes: [
      "Unlimited crossings between Zimbabwe and Zambia for 30 days — the bridge, the boat, the Zambian side of the Falls.",
      "Day trips into Botswana through the Kazungula border, so a Chobe game drive stays within the visa.",
      "Both airports and both land borders at the Falls: Victoria Falls and Livingstone airports, the Victoria Falls border and Kazungula."
    ],
    watchTitle: "Where people come unstuck",
    watch: [
      "Overnighting in Botswana voids it. Sleep on the Botswana side and you must buy a new UniVisa to come back.",
      "It is not sold everywhere. Harare airport does not issue the UniVisa — arrive at the Falls, Livingstone or Lusaka instead.",
      "Your first entry must match where you applied. Apply on the Zimbabwean portal and you must enter through Zimbabwe first; the same rule applies on the Zambian side.",
      "No extensions. You cannot extend a UniVisa, though you may buy up to three in a calendar year.",
      "Eligibility lists change. Governments revise the qualifying nationalities from time to time — check yours close to departure."
    ],
    note: "Holders of South African and most other SADC passports do not need the UniVisa at all: you are stamped in visa-free for short tourist visits to both countries. It only matters for companions travelling on non-exempt passports.",
    links: [
      { label: "Zimbabwe e-Visa portal", href: "https://www.evisa.gov.zw" },
      { label: "Zambia immigration e-services", href: "https://www.zambiaimmigration.gov.zm/kaza-univisa/" }
    ]
  },
  countries: {
    kicker: "Country by country",
    title: "Southern Africa, passport by passport.",
    body: "Choose a country for the essentials. Requirements below are the common case for tourist visits — your nationality may differ, so confirm before you fly.",
    items: [
      {
        name: "Zimbabwe",
        tagline: "Home ground, and the easiest arrival of the five.",
        facts: [
          { label: "Visa", value: "Category A visa-free · Category B on arrival or e-visa · Category C apply in advance" },
          { label: "Typical fees", value: "USD 30 single entry · USD 45 double · USD 55 multiple" },
          { label: "Passport", value: "Valid 6 months, at least 2 blank pages" },
          { label: "Apply", value: "evisa.gov.zw, or on arrival if your passport is Category B" }
        ],
        notes: [
          "SADC and most Southern African passports are Category A and need no visa.",
          "UK, US, EU, Canadian and Australian passports are usually Category B: you can pay on arrival, but applying online first is faster at the desk.",
          "Complete the Immigration Declaration Form online before you travel to save queueing.",
          "The KAZA UniVisa is available here and is better value if Zambia is also on your itinerary."
        ]
      },
      {
        name: "Zambia",
        tagline: "Across the bridge, and visa-free for more passports than people expect.",
        facts: [
          { label: "Visa", value: "Many nationalities visa-free for tourism; others on arrival or online" },
          { label: "Typical fees", value: "Single entry raised to USD 50 in 2026 — the same price as the UniVisa" },
          { label: "Passport", value: "Valid 6 months, 3 blank pages per entry" },
          { label: "Apply", value: "Zambia Department of Immigration e-services" }
        ],
        notes: [
          "US passport holders, among others, do not require a visa for tourist visits.",
          "Because a single-entry Zambian visa now costs the same as the UniVisa, the UniVisa is almost always the better buy if you are visiting Zimbabwe too.",
          "Carry your passport or a certified copy at all times while in the country."
        ]
      },
      {
        name: "Botswana",
        tagline: "A day trip from the Falls, or a safari in its own right.",
        facts: [
          { label: "Visa", value: "Visa-free for many nationalities for tourist visits" },
          { label: "Passport", value: "Valid 6 months, at least 3 blank pages" },
          { label: "Children", value: "Full birth certificate required for anyone 17 or under" },
          { label: "Vaccination", value: "Yellow fever certificate only if arriving from a risk country" }
        ],
        notes: [
          "A day trip through Kazungula is covered by the KAZA UniVisa; an overnight stay is not and will void it.",
          "Emergency and temporary passports are not always accepted for visa-free entry — travel on a full passport.",
          "Expect to drive through foot-and-mouth control points; fresh meat and dairy may be confiscated."
        ]
      },
      {
        name: "Namibia",
        tagline: "The long west — and the country whose rules changed most recently.",
        facts: [
          { label: "Visa", value: "Required since April 2025 for many previously exempt nationalities" },
          { label: "On arrival", value: "Visa-on-arrival scheme available to many passports, including UK" },
          { label: "Passport", value: "Valid 6 months, at least 3 blank pages" },
          { label: "Children", value: "Unabridged birth certificate showing both parents" }
        ],
        notes: [
          "This is the requirement most likely to catch out returning visitors — Namibia was visa-free for many nationalities until 2025.",
          "Confirm the current fee and whether your passport qualifies for visa on arrival before departure, rather than assuming.",
          "If you transit a South African airport on the way, South Africa's rules for minors apply to you as well."
        ]
      },
      {
        name: "South Africa",
        tagline: "The far south, with the strictest rules on travelling with children.",
        facts: [
          { label: "Visa", value: "Visa-free for many nationalities for stays up to 90 days" },
          { label: "Passport", value: "Valid 6 months, with blank pages for each entry" },
          { label: "Children", value: "Unabridged birth certificate, and consent affidavits where a parent is absent" },
          { label: "Transit", value: "Child document rules apply even if you are only changing planes" }
        ],
        notes: [
          "The child documentation rules are enforced at check-in as well as at the border — airlines will deny boarding.",
          "Allow generous connection times at Johannesburg if you are transiting to another country in the region.",
          "Count your blank pages carefully: a South Africa entry plus onward regional travel uses them quickly."
        ]
      }
    ]
  },
  health: {
    kicker: "Health",
    title: "Vaccinations and the mosquito question.",
    items: [
      { title: "Yellow fever", body: "None of the five countries is a yellow fever risk area. A certificate is required only if you are arriving from, or have transited, a country on the risk list — which includes several East and West African countries. If your route touches one, carry the card." },
      { title: "Malaria", body: "The Zambezi valley, Chobe and the low-veld are malaria areas, with the highest risk in the wet months from November to April. Speak to a travel clinic about prophylaxis six weeks before you fly, and pack repellent with DEET and long sleeves for dusk." },
      { title: "Routine cover", body: "Make sure the standard vaccinations are current — tetanus, measles, hepatitis A and typhoid are the usual recommendations for the region. Your clinic will advise on rabies if you are spending long periods in remote areas." },
      { title: "Insurance and evacuation", body: "Take travel insurance that explicitly covers medical evacuation. Adventure activities at the Falls — rafting, bungee, microlights — are sometimes excluded, so read the wording and declare what you intend to do." }
    ]
  },
  children: {
    kicker: "Travelling with children",
    title: "The paperwork that gets families turned away.",
    body: "Southern Africa takes child protection seriously and enforces documentation at check-in, not just at immigration. If anyone in your party is 17 or under, prepare these in advance.",
    items: [
      { title: "Full birth certificate", body: "Carry an original or certified copy of the unabridged birth certificate showing both parents' details. Abridged or short-form certificates are refused." },
      { title: "When one parent travels", body: "The absent parent must provide a notarised affidavit of consent. Where one parent has sole custody, carry the court order proving it." },
      { title: "When neither parent travels", body: "Unaccompanied minors, or children travelling with grandparents or friends, need consent from both parents plus the guardian's contact details and the child's passport." },
      { title: "Guardians not on the certificate", body: "If you are a legal guardian whose name does not appear on the birth certificate, carry the documentation that proves the relationship." }
    ]
  },
  emigration: {
    kicker: "Emigration & driving in",
    title: "Bringing your own vehicle: the ZIMRA TIP.",
    body: "If you are driving into Zimbabwe rather than flying, your vehicle needs a Temporary Import Permit from the Zimbabwe Revenue Authority. It is issued per entry, applied for online through the ZIMRA e-TIP portal, and presented at the border with a reference number.",
    cta: { label: "Apply on the ZIMRA e-TIP Portal", href: ETIP_URL },
    ctaNote: "Official portal: ecustoms.zimra.co.zw/etip",
    panels: [
      {
        title: "Documents required to process a TIP",
        items: [
          "A valid driver's passport clearly showing the duration of stay in Zimbabwe, as evidenced by the immigration stamp and endorsement.",
          "The registration book of the motor vehicle, and of the trailer if you are pulling one.",
          "Police clearance, required for vehicles from any country other than Mozambique.",
          "An affidavit or letter of authority from the owner if the vehicle is not owner-driven.",
          "A valid work permit or permanent resident permit if the driver is Zimbabwean.",
          "A vehicle that is roadworthy and in good condition."
        ]
      },
      {
        title: "Vehicles eligible for a TIP",
        items: [
          "Light passenger vehicles — sedans, station wagons and motorcycles.",
          "Goods-carrying vehicles with a gross vehicle weight not exceeding five tonnes, such as pick-ups and double cabs.",
          "Passenger-carrying vehicles with a seating capacity not exceeding 15 people including the driver.",
          "Trailers, boat trailers and caravans pulled by any of the vehicles above."
        ]
      },
      {
        title: "Fees and charges payable",
        items: [
          "Road Access Fee — USD 10 each time the vehicle enters the country.",
          "Third party insurance — USD 30 per month, and for each subsequent month the vehicle remains in the country.",
          "Carbon Tax — USD 10 per month, and for each subsequent month the vehicle remains in the country."
        ]
      },
      {
        title: "How to apply on the e-TIP portal",
        steps: [
          "Go to the ZIMRA e-TIP portal and select Register if you do not yet have an account.",
          "Complete the sign-up details, then check your inbox and click the verification link to activate the account.",
          "Sign in with your email address and password to reach the dashboard.",
          "Choose Apply for TIP. Your driver details populate automatically from your profile.",
          "Select your intended ports of entry and exit, then the owner type — yourself, another individual, or a company — and capture the owner's details where they are not your own.",
          "Capture the vehicle details. If you are bringing a trailer, tick Yes and complete the trailer fields.",
          "Declare other goods you are importing temporarily, such as cameras and laptops, then click Submit & Next.",
          "Review the traveller's intended period of stay and the vehicle details the system displays back to you.",
          "Click Check Insurance Status. If the vehicle holds full cover for the whole stay — MIP or COMESA — the system simply lists any additional fees due.",
          "If the cover is partial, the system flags the shortfall and offers a quotation for the remaining days; if there is no valid policy, it offers a quotation for the whole period.",
          "Select a cover period that spans your entire stay, then click Get Quotation and the system calculates the insurance and other fees payable.",
          "Tick the acknowledgement confirming you can pay, then the driver's declaration confirming the information is true, and Submit Application.",
          "Keep the TIP reference number from the border instruction notification — this is what you present to ZIMRA for processing."
        ]
      },
      {
        title: "What you sign for on the declaration",
        items: [
          "Not to sell, pledge or otherwise dispose of the vehicle or goods on the permit while they are in Zimbabwe.",
          "Not to allow them to be used by any resident of Zimbabwe.",
          "To remove them from Zimbabwe when the permit expires, or on your departure, whichever comes first.",
          "ZIMRA states plainly that heavy penalties may be imposed for false declarations or non-compliance."
        ]
      },
      {
        title: "Managing your e-TIP account",
        steps: [
          "The portal's own TIP Requirements and How to Apply icons open the official reference documents in a new window — worth a look before you start.",
          "To change your details, open My Profile from the dashboard and choose Update my Details.",
          "Edit the fields that have changed, then click Save Changes. Your next application populates from the updated profile."
        ]
      }
    ],
    walkthrough: {
      kicker: "Screen by screen",
      title: "What the e-TIP portal actually looks like.",
      note: "Screens from the official ZIMRA e-TIP portal. The portal is updated from time to time, so treat these as a guide rather than gospel.",
      shots: [
        {
          image: "/assets/etip/etip-01-portal.png",
          imageAlt: "ZIMRA e-TIP portal landing page with sign-in panel",
          caption: "The landing page. Register if it is your first application, and note the TIP Requirements and How to Apply icons — they open ZIMRA's own reference documents."
        },
        {
          image: "/assets/etip/etip-02-dashboard.png",
          imageAlt: "e-TIP dashboard showing the side menu",
          caption: "Once you are signed in, the side menu carries Apply for TIP, your application history and your profile."
        },
        {
          image: "/assets/etip/etip-03-owner.png",
          imageAlt: "Vehicle owner details form on the e-TIP portal",
          caption: "If the vehicle is not owner-driven you capture the owner's details here — which is exactly why you need their affidavit or letter of authority."
        },
        {
          image: "/assets/etip/etip-04-vehicle.png",
          imageAlt: "Vehicle details form on the e-TIP portal",
          caption: "The vehicle section wants chassis and registration numbers, make, model, value, engine size, and your dates of entry and exit."
        },
        {
          image: "/assets/etip/etip-05-summary.png",
          imageAlt: "e-TIP application summary showing stay duration and vehicle details",
          caption: "Before you submit, the portal plays back your stay duration, the vehicle and any trailer, along with the TIP reference."
        },
        {
          image: "/assets/etip/etip-06-declaration.png",
          imageAlt: "Driver's declaration and undertaking on the e-TIP portal",
          caption: "The final step is the driver's declaration and undertaking. Tick it, submit, and keep the reference number for the border."
        }
      ]
    },
    downloads: {
      title: "Official ZIMRA paperwork",
      items: [
        {
          label: "TIP Requirements checklist",
          note: "PDF · ZIMRA · documents, eligible vehicles and fees",
          href: "/docs/ZIMRA-TIP-Requirements.pdf"
        }
      ]
    },
    tips: [
      "Apply before you reach the border. The reference number is what turns a two-hour queue into a ten-minute stop.",
      "Insurance is checked automatically against the vehicle. A COMESA or full-cover policy that spans your whole stay avoids extra charges.",
      "The permit is tied to your permitted duration of stay, so extending your trip means dealing with both immigration and ZIMRA.",
      "Declare valuables you are carrying temporarily. Undeclared laptops and camera bodies cause problems on the way out, not the way in."
    ]
  },
  help: {
    kicker: "Get help",
    title: "Send us your passport, we will send back the plan.",
    body: "Tell us which passports are travelling and where you want to go. We will tell you exactly which visas you need, what they cost, where to get them and what to carry — and for guests booked with us, we handle the applications.",
    primaryCta: { label: "Ask Tunya", href: TUNYA_URL },
    secondaryCta: { label: "Plan My Trip", page: "plan" },
    disclaimer: "This page is a guide, not legal advice. Immigration and customs rules change at short notice and the final decision always rests with the officer at the border. Confirm your own requirements with the relevant government portal or with us before you travel."
  }
};

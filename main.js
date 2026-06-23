/* ============================================================
   Flyover Design & Construction — Testimonials Section JS
   Integrated into index.html (light theme, Flyover design system)
   ============================================================ */

// ── Testimonial data ──────────────────────────────────────
const testimonials = [
  {
    name: "U Kyaw Min",
    role: "Property Developer, Yangon",
    quote:
      "Flyover delivered our commercial tower ahead of schedule with exceptional craftsmanship. A true partner from blueprint to handover.",
  },
  {
    name: "Daw Hnin Ei",
    role: "Homeowner, Naypyidaw",
    quote:
      "They turned our dream villa into reality. Every detail considered, every promise kept. The team felt like family by the end.",
  },
  {
    name: "Mr. James Lin",
    role: "Hotel Operator, Mandalay",
    quote:
      "The heritage renovation was masterful — preserving history while elevating function. We could not recommend them more highly.",
  },
  {
    name: "U Aung Thu",
    role: "Restaurant Owner",
    quote:
      "Stunning interior design that completely transformed our space. Bookings doubled within the first month of reopening.",
  },
  {
    name: "Daw Su Su Khin",
    role: "Apartment Resident",
    quote:
      "From the first consultation to final walkthrough, professionalism and care defined every interaction with Flyover.",
  },
  {
    name: "U Zaw Win",
    role: "Industrial Client",
    quote:
      "Their M&E and high-tension expertise is unmatched in Myanmar. On time, on budget, and built to last.",
  },
  {
    name: "Ma Thiri Lwin",
    role: "Boutique Owner, Yangon",
    quote:
      "Flyover understood our brand language instantly. The finished space is a daily compliment to our customers.",
  },
  {
    name: "Mr. Hideo Tanaka",
    role: "Foreign Investor",
    quote:
      "Transparent, fluent, and rigorous. Working with Flyover gave us complete confidence in our Myanmar investment.",
  },
];

// ── SVG helpers (inline, no external dependency) ─────────
function quoteIconSVG() {
  return `<svg class="testi-quote-icon" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true" focusable="false">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
  </svg>`;
}

function starSVG() {
  return `<svg class="testi-star-icon" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`;
}

// ── Card builder ──────────────────────────────────────────
function createCard(testimonial) {
  const figure = document.createElement("figure");
  figure.className = "testi-card";
  figure.setAttribute("role", "group");
  figure.setAttribute("aria-label", `Testimonial from ${testimonial.name}`);

  const starsHTML = Array.from({ length: 5 }).map(() => starSVG()).join("");

  figure.innerHTML = `
    ${quoteIconSVG()}
    <blockquote class="testi-quote-text">"${testimonial.quote}"</blockquote>
    <figcaption class="testi-card-footer">
      <div>
        <div class="testi-author-name">${testimonial.name}</div>
        <div class="testi-author-role">${testimonial.role}</div>
      </div>
      <div class="testi-stars" aria-label="5 out of 5 stars">${starsHTML}</div>
    </figcaption>
  `;

  return figure;
}

// ── Marquee builder ───────────────────────────────────────
// Duplicates items for a seamless infinite loop:
// CSS animates translateX(0 → -50%)
function buildTrack(trackEl, items) {
  const loop = [...items, ...items];
  const fragment = document.createDocumentFragment();
  loop.forEach((t) => fragment.appendChild(createCard(t)));
  trackEl.appendChild(fragment);
}

// ── Init ──────────────────────────────────────────────────
function initTestimonials() {
  const track1 = document.getElementById("track-1");
  const track2 = document.getElementById("track-2");

  if (!track1 || !track2) return; // section not on this page

  buildTrack(track1, testimonials.slice(0, 4)); // forward
  buildTrack(track2, testimonials.slice(4, 8)); // reverse
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTestimonials);
} else {
  initTestimonials();
}

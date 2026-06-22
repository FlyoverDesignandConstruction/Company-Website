/* ============================================================
   FLYOVER DESIGN & CONSTRUCTION — main.js  (v2 — Enhanced)
   ============================================================ */

(function () {
  "use strict";
  let lastFocusedElement = null;

  // ── SET FOOTER YEAR ────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── STICKY HEADER SCROLL ───────────────────────────────────
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ── MOBILE MENU TOGGLE ─────────────────────────────────────
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav    = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => mainNav.classList.remove("open"));
    });
  }

  // ── PROJECT FILTER ─────────────────────────────────────────
  const filterBtns   = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("#projects-grid .project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const tag = card.getAttribute("data-tag");
        const show = filter === "All" || tag === filter;
        card.style.display = show ? "" : "none";
        if (show) {
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          requestAnimationFrame(() => {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        }
      });
    });
  });

  // ── SMOOTH SCROLL ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerH   = header ? header.offsetHeight : 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });

  // ── CONTACT FORM SUBMIT ────────────────────────────────────
  const form = document.getElementById("contact-form-el");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let msg = form.querySelector(".form-success");
      if (!msg) {
        msg = document.createElement("p");
        msg.className = "form-success";
        msg.textContent = "✓ Message sent! We'll be in touch shortly.";
        form.appendChild(msg);
      }
      msg.style.display = "block";
      form.reset();
      setTimeout(() => { msg.style.display = "none"; }, 5000);
    });
  }

  // ── PARALLAX HERO & MISSION ────────────────────────────────
  const heroBg    = document.querySelector(".hero .hero-bg");
  const missionBg = document.querySelector(".mission-section .mission-bg");

  function parallax() {
    const sy = window.scrollY;
    if (heroBg) {
      heroBg.style.transform = `translateY(${sy * 0.28}px)`;
    }
    if (missionBg) {
      const missionTop = missionBg.closest(".mission-section").getBoundingClientRect().top;
      const offset     = (missionTop - window.innerHeight / 2) * 0.2;
      missionBg.style.transform = `translateY(${offset}px)`;
    }
  }
  window.addEventListener("scroll", parallax, { passive: true });
  parallax();

  // ── COUNT-UP ANIMATION ─────────────────────────────────────
  function animateCountUp(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll(".stat-num[data-count]");
  let statsDone  = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsDone) {
        statsDone = true;
        statNums.forEach((el) => animateCountUp(el));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector(".stats-row");
  if (statsRow) statsObserver.observe(statsRow);

  // ── SCROLL-REVEAL (fade + stagger) ─────────────────────────
  const revealTargets = document.querySelectorAll(
    ".process-card, .service-card, .project-card, .mission-card, .why-item, .reveal"
  );

  revealTargets.forEach((el) => {
    el.style.opacity   = "0";
    el.style.transform = "translateY(22px)";
    el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = "1";
          entry.target.style.transform = "translateY(0)";
        }, (i % 6) * 75);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach((el) => revealObserver.observe(el));

  // ── ACTIVE NAV LINK ON SCROLL ──────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === "#" + id;
            link.classList.toggle("active-link", isActive);
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => navObserver.observe(s));

  // ── RIPPLE EFFECT ON CTA BUTTON ───────────────────────────
  document.querySelectorAll(".btn-shimmer, .btn-accent, .btn-primary").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect    = btn.getBoundingClientRect();
      const size    = Math.max(rect.width, rect.height);
      const x       = e.clientX - rect.left - size / 2;
      const y       = e.clientY - rect.top  - size / 2;
      const ripple  = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // ── SERVICE CARD "LEARN MORE" INJECTION ────────────────────
  document.querySelectorAll(".service-img").forEach((imgWrap) => {
    const lm = document.createElement("span");
    lm.className = "service-learn-more";
    lm.innerHTML = `View Service <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    imgWrap.appendChild(lm);
  });

})();

// ── POPUP MANAGEMENT ──────────────────────────────────────────
(function () {
  let lastFocusedElement = null;

  function openPopup(popup, opener) {
    if (!popup) return;
    lastFocusedElement = opener || document.activeElement;
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    opener?.setAttribute("aria-expanded", "true");
    popup.querySelector("[data-popup-close], .overview-popup__close")?.focus();
  }

  function closePopup(popup) {
    if (!popup) return;
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    const opener = document.querySelector("[data-popup-open][aria-expanded='true']");
    if (opener) opener.setAttribute("aria-expanded", "false");
    if (lastFocusedElement?.focus) lastFocusedElement.focus();
  }

  document.querySelectorAll("[data-popup-open]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const id = trigger.dataset.popupOpen || trigger.getAttribute("aria-controls");
      openPopup(document.getElementById(id), trigger);
    });
  });

  document.querySelectorAll("[data-popup-close]").forEach((btn) => {
    btn.addEventListener("click", () => closePopup(btn.closest("[role='dialog']")));
  });

  document.querySelectorAll("[role='dialog']:not(#articleModal)").forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closePopup(dialog);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const open = document.querySelector("[role='dialog'].is-open:not(#articleModal)");
      if (open) closePopup(open);
    }
  });

  const allArticles = [
  {
    id: 1,
    category: 'Company News',
    date: 'January 15, 2026',
    author: 'Flyover Editorial',
    title: 'Flyover Completes Landmark Commercial Tower in Yangon',
    excerpt: 'We are proud to announce the successful completion of a 12-story commercial office tower in the heart of Yangon, setting a new benchmark for modern architecture in Myanmar.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    alt: 'Modern commercial office tower building exterior in Yangon Myanmar',
    readTime: '3 min read',
    content: `
      <p>Flyover Design &amp; Construction Co., Ltd. is proud to announce the successful completion of the Thanlwin Commercial Tower — a landmark 12-story office complex situated in the bustling commercial district of downtown Yangon.</p>
      <h4>A New Benchmark for Myanmar Architecture</h4>
      <p>The tower represents a significant milestone for the firm and for modern architecture in Myanmar. Designed with a focus on functionality, sustainability, and visual presence, the building features floor-to-ceiling glazing, a double-skin facade for thermal performance, and flexible open-plan floor plates that accommodate a range of tenants from tech startups to multinational corporations.</p>
      <p>The project spanned 28 months from groundbreaking to handover. Our integrated design-build model allowed structural, MEP, and interior teams to coordinate in real time, reducing rework and delivering the project on schedule and within budget.</p>
      <h4>Key Project Highlights</h4>
      <ul>
        <li>12 stories, 18,400 sqm total gross floor area</li>
        <li>Class A office spaces across floors 3–11</li>
        <li>Ground-floor retail arcade and landscaped forecourt</li>
        <li>Rooftop terrace with panoramic city views</li>
        <li>4-level basement car park with 220 bays</li>
        <li>CCTV, BMS, and smart access control integration</li>
      </ul>
      <h4>What's Next</h4>
      <p>The Thanlwin Commercial Tower is now open for tenant fit-out and will officially welcome its first occupants in Q2 2026. We extend our deepest gratitude to the client, our consultants, sub-contractors, and the entire Flyover team for bringing this vision to life.</p>
    `
  },
  {
    id: 2,
    category: 'Design Insights',
    date: 'December 28, 2025',
    author: 'Aung Thu, Design Lead',
    title: "Sustainable Architecture: Building for Myanmar's Future",
    excerpt: "Explore how Flyover Design & Construction is integrating sustainable building practices, eco-friendly materials, and energy-efficient designs into our latest projects across Myanmar.",
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    alt: 'Sustainable green architecture building with eco-friendly design elements',
    readTime: '5 min read',
    content: `
      <p>Sustainability is no longer an optional add-on for construction projects — it is increasingly a client requirement, a regulatory expectation, and above all, the right thing to do. At Flyover, we have spent the last two years embedding sustainable principles into every phase of our design-build process.</p>
      <h4>Passive Design First</h4>
      <p>Before specifying any mechanical system, our design team evaluates passive strategies: building orientation, window-to-wall ratios, shading devices, and natural ventilation paths. In Myanmar's tropical climate, a well-oriented building can reduce cooling loads by 25–35% compared to a poorly sited one.</p>
      <h4>Materials with Lower Embodied Carbon</h4>
      <p>We have been steadily increasing our use of locally sourced materials to cut transportation emissions. Brickwork from regional kilns, timber certified by responsible forestry schemes, and recycled aggregate in non-structural concrete are now standard specifications on eligible projects.</p>
      <ul>
        <li>Local brick and masonry: reduces transport carbon by up to 60%</li>
        <li>Fly-ash blended cement: cuts clinker demand and CO₂</li>
        <li>Recycled steel from regional mills where structural grades permit</li>
      </ul>
      <h4>Water &amp; Energy</h4>
      <p>Rainwater harvesting systems are now included in all new commercial projects above 3,000 sqm. Combined with low-flow fixtures, this has reduced potable water consumption on delivered buildings by an average of 40%.</p>
      <p>We believe Myanmar's construction industry stands at an inflection point. The choices made in the next decade will shape the built environment — and the carbon footprint — of cities like Yangon and Naypyidaw for generations. We are committed to leading that change.</p>
    `
  },
  {
    id: 3,
    category: 'Industry Update',
    date: 'December 10, 2025',
    author: 'Ei Phyu, Interior Studio',
    title: "Interior Design Trends Shaping Myanmar's Spaces in 2026",
    excerpt: "From biophilic design to minimalist aesthetics, discover the top interior design trends our team is incorporating into residential and commercial projects this year.",
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    alt: 'Modern interior design with minimalist aesthetics and natural elements',
    readTime: '4 min read',
    content: `
      <p>Myanmar's interior design landscape is shifting. Clients who once prioritised ornate finishes and heavy wooden furniture are increasingly drawn to cleaner, calmer environments that reflect global sensibilities while remaining rooted in local craft traditions.</p>
      <h4>1. Biophilic Integration</h4>
      <p>The desire to bring the outside in has never been stronger. We are specifying living walls, interior planting at scale, and natural stone features more than ever. In a country with such rich botanical diversity, this is one trend that feels genuinely local rather than imported.</p>
      <h4>2. Warm Minimalism</h4>
      <p>Pure white minimalism has given way to warmer, more textured interpretations — think limewash plaster walls, teak and bamboo accents, terracotta tile flooring, and muted clay palette lighting.</p>
      <h4>3. Flexible, Multi-Modal Spaces</h4>
      <p>Post-pandemic, commercial clients in particular want spaces that transition between focus work, collaboration, and social functions without physical reconfiguration. Moveable partitions, acoustic pods, and modular furniture systems are now a standard part of our commercial interior offering.</p>
      <h4>4. Craftsmanship as Feature</h4>
      <p>Myanmar has extraordinary artisanal craft traditions — lacquerware, hand-woven textiles, silver and bronze work. We have been working with local craftspeople to commission bespoke pieces that become signature elements of a space.</p>
    `
  },
  {
    id: 4,
    category: 'Project Spotlight',
    date: 'November 22, 2025',
    author: 'Zin Mar, Project Lead',
    title: 'Heritage Hotel Renovation: Preserving History, Embracing Modernity',
    excerpt: "A behind-the-scenes look at our award-winning Heritage Hotel Renovation project in Mandalay — blending historical preservation with contemporary comfort and functionality.",
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    alt: 'Heritage hotel renovation project showing historical architecture with modern updates',
    readTime: '6 min read',
    content: `
      <p>When the owners of a colonial-era guesthouse in Mandalay approached Flyover with a brief to "make it feel like now without losing what it is," we knew we were in for one of the most demanding — and rewarding — projects of recent years. The result, completed in September 2025, has since won a regional Heritage Conservation Award.</p>
      <h4>The Challenge</h4>
      <p>The building, originally constructed in 1931, had been sympathetically maintained but never modernised. The brief was to add 18 new rooms, a spa, a rooftop bar, and contemporary bathrooms throughout, without disturbing the original teak structure, colonial facade, or the mature garden.</p>
      <h4>Our Approach</h4>
      <p>We began with a full structural survey and materials audit. Wherever original teak joinery, terrazzo floors, or decorative plasterwork remained in serviceable condition, we restored rather than replaced. Where damage was too severe, we sourced period-matched materials including hand-made clay roof tiles produced to the original dimensions by a local kiln in Sagaing.</p>
      <h4>Selected Results</h4>
      <ul>
        <li>100% of original teak structural members retained</li>
        <li>Original 1930s terrazzo floors restored across 1,200 sqm</li>
        <li>18 new guest rooms added in a sympathetic extension</li>
        <li>Rooftop bar with views over Mandalay Hill</li>
        <li>Award: ASEAN Heritage Architecture Prize, Conservation Category, 2025</li>
      </ul>
    `
  },
  {
    id: 5,
    category: 'Tips & Guides',
    date: 'November 5, 2025',
    author: 'Flyover Editorial',
    title: 'How to Choose the Right Architectural Firm for Your Dream Home',
    excerpt: "Building your dream home is one of the most significant investments you will make. Here are the key factors to consider when selecting an architectural and construction partner.",
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    alt: 'Architectural blueprints and design plans for residential home construction',
    readTime: '7 min read',
    content: `
      <p>Choosing an architect and builder for your home is one of the most consequential decisions you will make. The right partner will translate your vision into a home that fits your life; the wrong one can mean years of frustration and budget overruns. Here is what to look for.</p>
      <h4>1. Portfolio Fit, Not Just Portfolio Size</h4>
      <p>A firm with fifty completed luxury villas may not be the right choice for a compact urban townhouse. Look for projects in their portfolio that resemble yours in scale, brief, and budget.</p>
      <h4>2. Integration of Design and Construction</h4>
      <p>An integrated design-build firm carries responsibility for both — meaning fewer disputes, faster decisions, and a single point of accountability. For most clients building their first home, this integration is invaluable.</p>
      <h4>3. Transparency on Fees and Costs</h4>
      <p>Be cautious of firms that cannot give you a clear fee structure up front. Reputable firms will be transparent about their fee basis, what it includes, and how cost control works across the project lifecycle.</p>
      <h4>4. Communication Style</h4>
      <p>You will work with your architect for 12–36 months. Their technical competence matters enormously, but so does their ability to explain complex decisions clearly and listen to your priorities.</p>
      <h4>5. References from Past Clients</h4>
      <p>Always ask for two or three client references, and actually call them. Ask not just whether they were happy with the result, but whether the process was what they expected and whether costs were managed well.</p>
    `
  },
  {
    id: 6,
    category: 'Company News',
    date: 'October 18, 2025',
    author: 'Flyover Editorial',
    title: 'Flyover Expands Operations to Mandalay with New Regional Office',
    excerpt: "We are excited to announce the opening of our third regional office in Mandalay, strengthening our ability to serve clients across Upper Myanmar with the same excellence and dedication.",
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    alt: 'Modern office space interior of Flyover new Mandalay regional office',
    readTime: '3 min read',
    content: `
      <p>Flyover Design &amp; Construction Co., Ltd. is pleased to announce the opening of our Mandalay Regional Office, marking our third permanent location following our headquarters in Naypyidaw and our Yangon studio.</p>
      <h4>Why Mandalay?</h4>
      <p>Mandalay is Myanmar's second-largest city and the economic heartland of Upper Myanmar. Over the past three years, we have completed seven significant projects in the region — including the Heritage Hotel Renovation, two residential estates, and a commercial mixed-use development.</p>
      <h4>The New Office</h4>
      <p>Our Mandalay studio occupies 380 sqm on the third floor of a commercial building in the 26th Street business district. It houses a design studio, a client meeting suite, a material library, and a project coordination area for on-site project managers.</p>
      <h4>Our Mandalay Team</h4>
      <p>The office is headed by Senior Project Director Ko Kyaw Zin Latt, who has managed construction projects in Upper Myanmar for over a decade. He is joined by two architects, a structural engineer, an interior designer, and a project administrator. We intend to grow the team to twelve by end of 2026.</p>
    `
  }
];

const categoryColors = {
  'Company News':      'linear-gradient(135deg,#0071bc,#1a3a7e)',
  'Design Insights':   'linear-gradient(135deg,#D4AF37,#b8941f)',
  'Industry Update':   'linear-gradient(135deg,#06b6d4,#0891b2)',
  'Project Spotlight': 'linear-gradient(135deg,#7c3aed,#5b21b6)',
  'Tips & Guides':     'linear-gradient(135deg,#059669,#047857)'
};

const arrowSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
</svg>`;

// Build grid cards (all articles except featured id=1)
const grid = document.getElementById('grid-posts');
if (grid) {
  const gridItems = allArticles.filter(a => a.id !== 1);
  gridItems.forEach(item => {
    const bg = categoryColors[item.category] || categoryColors['Company News'];
    const article = document.createElement('article');
    article.className = 'post-card';
    article.innerHTML = `
      <div class="post-img-wrap">
        <img src="${item.img}" alt="${item.alt}" loading="lazy" />
        <div class="post-img-overlay"></div>
      </div>
      <div class="post-body">
        <div class="meta-row">
          <span class="badge" style="background:${bg};">${item.category}</span>
          <span class="read-time">${item.readTime}</span>
        </div>
        <h3 class="card-title-sm">${item.title}</h3>
        <p class="card-excerpt-sm">${item.excerpt}</p>
        <div class="post-footer">
          <span class="card-date">${item.date}</span>
          <button class="read-more-sm" data-id="${item.id}">Read More ${arrowSVG}</button>
        </div>
      </div>`;
    grid.appendChild(article);
  });
}

// ── ARTICLE MODAL LOGIC ──────────────────────────────────────────
(function () {
  const overlay      = document.getElementById('articleModal');
  if (!overlay) return;

  const modalImg     = document.getElementById('modalImg');
  const modalBadge   = document.getElementById('modalBadge');
  const modalReadTime= document.getElementById('modalReadTime');
  const modalTitle   = document.getElementById('modalTitle');
  const modalDate    = document.getElementById('modalDate');
  const modalAuthor  = document.getElementById('modalAuthor');
  const modalArticle = document.getElementById('modalArticle');
  const modalClose   = document.getElementById('modalClose');
  const modalCtaBtn  = document.getElementById('modalCtaBtn');
  const copyLinkBtn  = document.getElementById('modalCopyLink');

  function openArticleModal(id) {
    const post = allArticles.find(a => a.id === id);
    if (!post) return;
    const bg = categoryColors[post.category] || categoryColors['Company News'];

    modalImg.src               = post.img;
    modalImg.alt               = post.alt;
    modalBadge.textContent     = post.category;
    modalBadge.style.background = bg;
    modalReadTime.textContent  = post.readTime;
    modalTitle.textContent     = post.title;
    modalDate.textContent      = post.date;
    modalAuthor.textContent    = post.author;
    modalArticle.innerHTML     = post.content;

    overlay.classList.add('is-open');
    document.body.classList.add('modal-open');
    overlay.querySelector('.modal-body').scrollTop = 0;
    modalClose.focus();
  }

  function closeArticleModal() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  // Featured card — click anywhere on it OR its Read More button
  const featuredCard = document.getElementById('featured-card');
  if (featuredCard) {
    featuredCard.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-id]');
      if (btn) {
        e.preventDefault();
        openArticleModal(Number(btn.dataset.id));
      }
    });
  }

  // Grid card Read More buttons
  const gridEl = document.getElementById('grid-posts');
  if (gridEl) {
    gridEl.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-id]');
      if (btn) openArticleModal(Number(btn.dataset.id));
    });
  }

  // Close button
  modalClose.addEventListener('click', closeArticleModal);

  // Click outside panel closes modal
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeArticleModal();
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeArticleModal();
  });

  // CTA button closes modal before navigating
  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', closeArticleModal);
  }

  // Copy link button
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const orig = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => { copyLinkBtn.innerHTML = orig; }, 1800);
      });
    });
  }
})();

})();

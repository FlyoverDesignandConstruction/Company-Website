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

  document.querySelectorAll("[role='dialog']").forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closePopup(dialog);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const open = document.querySelector("[role='dialog'].is-open");
      if (open) closePopup(open);
    }
  });

  const newsItems = [
  {
    id: 2,
    category: 'Design Insights',
    date: 'December 28, 2025',
    title: "Sustainable Architecture: Building for Myanmar's Future",
    excerpt: "Explore how Flyover Design & Construction is integrating sustainable building practices, eco-friendly materials, and energy-efficient designs into our latest projects across Myanmar.",
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    alt: 'Sustainable green architecture building with eco-friendly design elements',
    readTime: '5 min read'
  },
  {
    id: 3,
    category: 'Industry Update',
    date: 'December 10, 2025',
    title: "Interior Design Trends Shaping Myanmar's Spaces in 2026",
    excerpt: "From biophilic design to minimalist aesthetics, discover the top interior design trends our team is incorporating into residential and commercial projects this year.",
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    alt: 'Modern interior design with minimalist aesthetics and natural elements',
    readTime: '4 min read'
  },
  {
    id: 4,
    category: 'Project Spotlight',
    date: 'November 22, 2025',
    title: 'Heritage Hotel Renovation: Preserving History, Embracing Modernity',
    excerpt: "A behind-the-scenes look at our award-winning Heritage Hotel Renovation project in Mandalay — blending historical preservation with contemporary comfort and functionality.",
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    alt: 'Heritage hotel renovation project showing historical architecture with modern updates',
    readTime: '6 min read'
  },
  {
    id: 5,
    category: 'Tips & Guides',
    date: 'November 5, 2025',
    title: 'How to Choose the Right Architectural Firm for Your Dream Home',
    excerpt: "Building your dream home is one of the most significant investments you will make. Here are the key factors to consider when selecting an architectural and construction partner.",
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    alt: 'Architectural blueprints and design plans for residential home construction',
    readTime: '7 min read'
  },
  {
    id: 6,
    category: 'Company News',
    date: 'October 18, 2025',
    title: 'Flyover Expands Operations to Mandalay with New Regional Office',
    excerpt: "We are excited to announce the opening of our third regional office in Mandalay, strengthening our ability to serve clients across Upper Myanmar with the same excellence and dedication.",
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    alt: 'Modern office space interior of Flyover new Mandalay regional office',
    readTime: '3 min read'
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

const grid = document.getElementById('grid-posts');

newsItems.forEach(item => {
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
      </div>
      <h3 class="card-title-sm">${item.title}</h3>
      <p class="card-excerpt-sm">${item.excerpt}</p>
      <div class="post-footer">
        <span class="card-date">${item.date}</span>
      </div>
    </div>`;
  grid.appendChild(article);
});

})();
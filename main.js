/* ============================================================
   FLYOVER DESIGN & CONSTRUCTION — main.js
   Converted from React/Tailwind TSX source
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
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ── MOBILE MENU TOGGLE ─────────────────────────────────────
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
      });
    });
  }

  // ── PROJECT FILTER ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("#projects-grid .project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/hide cards with smooth transition
      projectCards.forEach((card) => {
        const tag = card.getAttribute("data-tag");
        if (filter === "All" || tag === filter) {
          card.style.display = "";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 80;
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

      // Show a success message
      let msg = form.querySelector(".form-success");
      if (!msg) {
        msg = document.createElement("p");
        msg.className = "form-success";
        msg.textContent = "✓ Message sent successfully! We'll be in touch shortly.";
        form.appendChild(msg);
      }
      msg.style.display = "block";
      form.reset();

      // Hide after 5 seconds
      setTimeout(() => {
        msg.style.display = "none";
      }, 5000);
    });
  }

  // ── INTERSECTION OBSERVER — fade-in cards on scroll ────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const fadeTargets = document.querySelectorAll(
    ".process-card, .service-card, .project-card, .mission-card, .why-item"
  );

  // Set initial state
  fadeTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, (i % 4) * 80);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeTargets.forEach((el) => observer.observe(el));

  // ── ACTIVE NAV LINK ON SCROLL 
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === "#" + id) {
              link.style.color = "#fff";
              link.style.fontWeight = "600";
            } else {
              link.style.color = "";
              link.style.fontWeight = "";
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => navObserver.observe(s));
})();

function openPopup(popup, opener) {
  if (!popup) {
    return;
  }

  lastFocusedElement = opener || document.activeElement;
  popup.classList.add("is-open");
  popup.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  opener?.setAttribute("aria-expanded", "true");
  popup.querySelector("[data-popup-close], [data-close-overview], .overview-popup__close")?.focus();
}

function closePopup(popup) {
  if (!popup) {
    return;
  }

  popup.classList.remove("is-open");
  popup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  const opener = document.querySelector("[data-popup-open][aria-expanded=\"true\"]");
  if (opener) {
    opener.setAttribute("aria-expanded", "false");
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

const popupTriggers = document.querySelectorAll("[data-popup-open]");
const popupCloseButtons = document.querySelectorAll("[data-popup-close]");
const popupDialogs = document.querySelectorAll("[role='dialog']");

popupTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const popupId = trigger.dataset.popupOpen || trigger.getAttribute("aria-controls");
    openPopup(document.getElementById(popupId), trigger);
  });
});

popupCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closePopup(button.closest("[role='dialog']"));
  });
});

popupDialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closePopup(dialog);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openDialog = document.querySelector("[role='dialog'].is-open");
    if (openDialog) {
      closePopup(openDialog);
    }
  }
});
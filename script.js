// Year
document.getElementById("y").textContent = new Date().getFullYear();

// Reveal on scroll
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });
els.forEach(el => io.observe(el));

// FAQ accordion
document.querySelectorAll(".faq__q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const a = btn.nextElementSibling;
    const open = btn.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".faq__q").forEach(b => b.setAttribute("aria-expanded", "false"));
    document.querySelectorAll(".faq__a").forEach(x => x.classList.remove("is-open"));

    if (!open) {
      btn.setAttribute("aria-expanded", "true");
      a.classList.add("is-open");
    }
  });
});

// Mobile menu
const burger = document.querySelector(".nav__burger");
const mobile = document.querySelector("[data-mobile]");

if (burger && mobile) {
  burger.addEventListener("click", () => {
    const open = mobile.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  mobile.addEventListener("click", (e) => {
    if (e.target === mobile) {
      mobile.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Close on link click
  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobile.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const calModal = document.getElementById("calModal");
  if (!calModal) {
    console.warn("Calendly modal not found: #calModal");
    return;
  }

  const openBtns = document.querySelectorAll("[data-open-cal]");
  if (!openBtns.length) {
    console.warn("No open buttons found: [data-open-cal]");
  }

  const openCalModal = () => {
    calModal.classList.add("is-open");
    calModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeCalModal = () => {
    calModal.classList.remove("is-open");
    calModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCalModal();
    });
  });

  calModal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeCalModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && calModal.classList.contains("is-open")) {
      closeCalModal();
    }
  });
});

// ===== Calendly Popup (reliable) =====
const CALENDLY_URL = "https://calendly.com/holland-digital-ywaf/30min";

function loadCalendly() {
  return new Promise((resolve) => {
    if (window.Calendly) return resolve(true);

    const existing = document.querySelector('script[data-calendly="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.dataset.calendly = "true";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

document.querySelectorAll(".js-calendly").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const ok = await loadCalendly();
    if (ok && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, "_blank", "noopener");
    }
  });
});

/* ===================================================
   Eco Messe Chiba 2026 — Common Premium Scripts
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // ── Mobile Menu Toggle ──
  const menuBtn = document.querySelector(".menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isVisible = mobileMenu.style.display === "block";
      mobileMenu.style.display = isVisible ? "none" : "block";
      menuBtn.innerHTML = isVisible ? "☰" : "✕";
    });
  }

  // ── Back to Top Button Visibility ──
  const backToTop = document.querySelector(".back-to-top");
  window.addEventListener("scroll", () => {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Scroll Reveal Animations ──
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // ── FAQ Accordion Toggle ──
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((q) => {
    q.addEventListener("click", () => {
      const answer = q.nextElementSibling;
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";
      
      // Close all others
      document.querySelectorAll(".faq-answer").forEach((ans) => {
        ans.style.maxHeight = "0px";
      });
      document.querySelectorAll(".faq-question").forEach((btn) => {
        btn.querySelector(".toggle-icon").textContent = "+";
      });

      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        q.querySelector(".toggle-icon").textContent = "−";
      } else {
        answer.style.maxHeight = "0px";
        q.querySelector(".toggle-icon").textContent = "+";
      }
    });
  });

  // ── Active Navigation State Indicator ──
  const path = window.location.pathname;
  document.querySelectorAll(".desktop-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (path.includes(href) && href !== "#" && href !== "/") {
      link.style.color = "var(--primary-light)";
    }
  });

});

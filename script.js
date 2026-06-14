/**
 * CAIO MOREIRA CANCELA — PORTFOLIO
 * script.js
 *
 * Features:
 *  1. Dark / Light mode toggle  (saved to LocalStorage)
 *  2. SPA navigation            (Home ↔ Portfolio without page reload)
 *  3. Mobile hamburger menu
 *  4. Portfolio filter tabs
 *  5. Scroll-reveal animations
 */

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
const THEME_KEY = 'cmc-portfolio-theme';
const html       = document.documentElement;
const themeBtn   = document.getElementById('theme-toggle');
const themeIcon  = document.getElementById('theme-icon');

/**
 * Apply a theme ('dark' | 'light') and persist it.
 */
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-moon';
    themeBtn.setAttribute('aria-label', 'Ativar modo claro');
  } else {
    themeIcon.className = 'fa-solid fa-sun';
    themeBtn.setAttribute('aria-label', 'Ativar modo escuro');
  }
}

/** Initialise: read saved preference or default to dark. */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
}

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


/* ============================================================
   2. SPA NAVIGATION
   ============================================================ */
const pages = {
  home:      document.getElementById('page-home'),
  portfolio: document.getElementById('page-portfolio'),
};

/**
 * Navigate to a named page and update nav-link active states.
 * @param {string} target - 'home' | 'portfolio'
 */
function navigateTo(target) {
  // Guard against unknown pages
  if (!pages[target]) return;

  // Show / hide pages
  Object.entries(pages).forEach(([name, el]) => {
    if (name === target) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // Update nav-link active class
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === target);
  });

  // Close mobile menu when navigating
  closeMenu();

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger reveal for newly shown elements
  scheduleReveal();
}

/**
 * Attach navigation to every element that has data-page="...".
 * Works for <a>, <button>, and any other element.
 */
function bindNavLinks() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.dataset.page;
      navigateTo(target);
    });
  });
}


/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeMenu();
  }
});


/* ============================================================
   4. PORTFOLIO FILTER TABS
   ============================================================ */
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards       = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}


/* ============================================================
   5. SCROLL-REVEAL ANIMATION
   ============================================================ */
let revealObserver;

/**
 * Attach an IntersectionObserver to every .reveal element that
 * hasn't been made visible yet.
 */
function scheduleReveal() {
  // Disconnect existing observer to avoid duplicates
  if (revealObserver) revealObserver.disconnect();

  const elements = document.querySelectorAll(
    '.skill-card, .timeline-item, .project-card, .stat-item, .stats-strip, .contact-cta'
  );

  elements.forEach(el => {
    el.classList.add('reveal');
    el.classList.remove('visible');
  });

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => revealObserver.observe(el));
}


/* ============================================================
   6. HEADER SCROLL SHADOW
   ============================================================ */
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  bindNavLinks();
  initFilter();
  scheduleReveal();

  // Start on home page
  navigateTo('home');
});

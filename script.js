/* =========================================================
   Kota Radja Dinteloord — interface behaviour
   ========================================================= */

(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const year = document.getElementById("copyright-year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Footer year ---------- */
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header on scroll ---------- */
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 28);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Opening status (Europe/Amsterdam) ---------- */
  const statusPill = document.getElementById("open-status");
  const statusText = document.getElementById("open-status-text");
  const liveStatus = document.getElementById("live-status");
  const liveStatusText = document.getElementById("live-status-text");

  const weekdayNumber = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function getAmsterdamTime() {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Amsterdam",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());

      const values = {};
      for (const part of parts) {
        if (part.type !== "literal") values[part.type] = part.value;
      }

      return {
        day: weekdayNumber[values.weekday],
        minutes: Number(values.hour) * 60 + Number(values.minute)
      };
    } catch (error) {
      const now = new Date();
      return {
        day: now.getDay(),
        minutes: now.getHours() * 60 + now.getMinutes()
      };
    }
  }

  function updateOpeningStatus() {
    const { day, minutes } = getAmsterdamTime();
    const serviceDay = day !== 1;
    const opensAt = 16 * 60;
    const closesAt = 20 * 60 + 30;

    let message;
    let state;

    if (!serviceDay) {
      message = "Vandaag gesloten · feestdagen uitgezonderd";
      state = "closed";
    } else if (minutes < opensAt) {
      message = "Vandaag geopend vanaf 16:00";
      state = "later";
    } else if (minutes < closesAt) {
      message = "Nu geopend · tot 20:30";
      state = "open";
    } else {
      message = day === 0
        ? "Vandaag gesloten · dinsdag weer open"
        : "Vandaag gesloten · morgen weer open";
      state = "closed";
    }

    if (statusText && statusText.textContent !== message) statusText.textContent = message;
    if (liveStatusText && liveStatusText.textContent !== message) liveStatusText.textContent = message;

    [statusPill, liveStatus].forEach((element) => {
      if (!element) return;
      element.classList.toggle("is-open", state === "open");
      element.classList.toggle("is-closed", state === "closed");
    });

    document.querySelectorAll(".hours-table tr[data-day]").forEach((row) => {
      row.classList.toggle("is-today", Number(row.dataset.day) === day);
    });
  }

  updateOpeningStatus();
  window.setInterval(updateOpeningStatus, 60 * 1000);

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- Scroll spy ---------- */
  const navLinks = Array.from(document.querySelectorAll(".primary-nav a"));
  const spySections = Array.from(document.querySelectorAll("main section[id], footer[id]"));

  if ("IntersectionObserver" in window && navLinks.length && spySections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", active);
            if (active) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    spySections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileNavLinks = Array.from(document.querySelectorAll(".mobile-nav a"));
  const backgroundRegions = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer")
  ].filter(Boolean);
  let navOpen = false;
  let previouslyFocused = null;

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => element.getClientRects().length > 0);
  }

  function openMobileMenu() {
    if (!mobileMenu || !navToggle || navOpen) return;
    navOpen = true;
    previouslyFocused = document.activeElement;
    mobileMenu.classList.add("is-open");
    mobileMenu.removeAttribute("inert");
    mobileMenu.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Menu sluiten");
    backgroundRegions.forEach((region) => region.setAttribute("inert", ""));
    body.classList.add("nav-open");
    window.setTimeout(() => mobileMenuClose?.focus(), 80);
  }

  function closeMobileMenu(returnFocus = true) {
    if (!mobileMenu || !navToggle || !navOpen) return;
    navOpen = false;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("inert", "");
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menu openen");
    backgroundRegions.forEach((region) => region.removeAttribute("inert"));
    body.classList.remove("nav-open");

    if (returnFocus) {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      } else {
        navToggle.focus();
      }
    }
  }

  navToggle?.addEventListener("click", openMobileMenu);
  mobileMenuClose?.addEventListener("click", () => closeMobileMenu());

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => closeMobileMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (!navOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu();
      return;
    }

    if (event.key !== "Tab" || !mobileMenu) return;

    const focusable = getFocusable(mobileMenu);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  let lastViewportWidth = window.innerWidth;
  window.addEventListener(
    "resize",
    () => {
      lastViewportWidth = window.innerWidth;
      if (lastViewportWidth > 980 && navOpen) closeMobileMenu(false);
    },
    { passive: true }
  );

  /* ---------- Menu dialog ---------- */
  const dialog = document.getElementById("menu-dialog");
  const openMenuLinks = Array.from(document.querySelectorAll("[data-menu-open]"));
  const dialogCloseButtons = Array.from(
    document.querySelectorAll(".dialog-close, .dialog-foot-close")
  );
  const tabs = Array.from(document.querySelectorAll(".menu-tab"));
  const panels = Array.from(document.querySelectorAll(".menu-page"));
  let dialogTrigger = null;

  function setActiveTab(index, focusTab = false) {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.setAttribute("tabindex", active ? "0" : "-1");
      if (active && focusTab) tab.focus();
    });

    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === index;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  function openMenuDialog(event) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    dialogTrigger = event.currentTarget;

    if (!dialog.open) {
      dialog.showModal();
      body.classList.add("menu-open");
      setActiveTab(0);
    }
  }

  function closeMenuDialog() {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  openMenuLinks.forEach((link) => {
    link.addEventListener("click", openMenuDialog);
  });

  dialogCloseButtons.forEach((button) => {
    button.addEventListener("click", closeMenuDialog);
  });

  if (dialog) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeMenuDialog();
    });

    dialog.addEventListener("close", () => {
      body.classList.remove("menu-open");
      if (dialogTrigger instanceof HTMLElement) dialogTrigger.focus();
    });

    dialog.addEventListener("cancel", () => {
      body.classList.remove("menu-open");
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setActiveTab(index));

    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        setActiveTab(nextIndex, true);
      }
    });
  });

  /* ---------- Anchor focus without changing the URL hash twice ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", () => {
      if (navOpen) closeMobileMenu(false);
    });
  });
})();

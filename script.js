(() => {
  "use strict";

  /* =========================================================
     ARNAB & SRIJITA — INVITATION SCRIPT

     Invitation modes (the 3 links):
       index.html?invite=both       Biye + Boubhaat
       index.html?invite=biye       Biye only
       index.html?invite=boubhat    Boubhaat only

     Language (Bengali is the default):
       index.html?lang=en           English
       index.html?lang=bn           Bengali
       Both can be combined: index.html?invite=biye&lang=en#rsvp
  ========================================================= */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  const body = document.body;

  /* =========================================================
     MODE
  ========================================================= */

  const params = new URLSearchParams(window.location.search);
  const requestedMode = (params.get("invite") || "both").toLowerCase();

  let mode = "both";

  if (requestedMode === "biye") {
    mode = "bi-only";
  }

  if (requestedMode === "boubhat" || requestedMode === "reception") {
    mode = "reception-only";
  }

  body.classList.add(`mode-${mode}`);

  // Use the dedicated reception cover artwork for ?invite=boubhat.
  if (mode === "reception-only") {
    const coverImage = document.querySelector(".cover-bg-image");
    if (coverImage) {
      coverImage.src = "assets/cover-card-reception.png";
      coverImage.alt = "Reception invitation — Srijita & Arnab, Kolkata";
      coverImage.setAttribute(
        "data-en-alt",
        "Reception invitation — Srijita & Arnab, Kolkata",
      );
      coverImage.setAttribute(
        "data-bn-alt",
        "বৌভাতের আমন্ত্রণ — সৃজিতা ও অর্ণব, কলকাতা",
      );
    }
  }

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const loader = $("#loader");
  const envelope = $("#envelope");
  const cover = $("#cover");
  const site = $("#site");
  const enterButton = $("#enterBtn");
  const nav = $("#nav");
  const menuButton = $("#menuBtn");
  const navLinks = $("#navLinks");

  const rsvpModal = $("#rsvpModal");
  const modalClose = $("#modalClose");
  const modalBackdrop = $(".modal-backdrop");
  const rsvpForm = $("#rsvpForm");
  const rsvpTitle = $("#rsvpTitle");
  const rsvpAttend = $("#rsvpAttend");
  const rsvpAttendWrap = $("#rsvpAttendWrap");
  const rsvpGuests = $("#rsvpGuests");
  const rsvpGuestsWrap = $("#rsvpGuestsWrap");
  const rsvpMessage = $("#rsvpMessage");
  const rsvpMsgLabel = $("#rsvpMsgLabel");
  const rsvpThanks = $("#rsvpThanks");
  const rsvpCalendar = $("#rsvpCalendar");
  const calendarWeddingRow = $("#calendarWedding");
  const calendarReceptionRow = $("#calendarReception");
  const rsvpDoneButton = $("#rsvpDone");
  const toast = $("#toast");

  /* =========================================================
     LOADING
  ========================================================= */

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader?.classList.add("hide");
    }, 550);

    body.classList.add("locked");
  });

  /* =========================================================
     OPEN INVITATION  (intro — unchanged)
  ========================================================= */

  envelope?.addEventListener("click", () => {
    envelope.classList.add("open");
    cover.style.display = "none";

    // The intro-screen language pill is done; the top bar has its own.
    body.classList.add("site-open");
    closeLangMenus();
  });

  enterButton?.addEventListener("click", () => {
    cover?.classList.add("exit");

    site?.classList.add("show");
    body.classList.add("site-open");
    closeLangMenus();

    body.classList.remove("locked");

    // Allow the cover transition to finish.
    setTimeout(() => {
      if (cover) {
        cover.style.display = "none";
      }
    }, 1100);
  });

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  menuButton?.addEventListener("click", () => {
    const opened = navLinks?.classList.toggle("open");

    if (menuButton) {
      menuButton.textContent = opened ? "×" : "☰";
    }
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("open");

      if (menuButton) {
        menuButton.textContent = "☰";
      }
    });
  });

  /* =========================================================
     LANGUAGE  (Bengali = default / current design, English = translated)

     Every translated element carries its text in data attributes:
       data-bn="..."  the Bengali wording      (the default language)
       data-en="..."  the English wording
     An element that has only one of the two keeps whatever is written
     inside it as the other language. "<br>" in a value = line break.
     (Same idea for aria-label: data-bn-aria, and image alt: data-en-alt /
     data-bn-alt.) Both versions are remembered at start-up, so switching
     back and forth is lossless.

     Priority: ?lang=en|bn in the link  >  the guest's last choice
     (saved in this browser)  >  Bengali.
  ========================================================= */

  const LANG_KEY = "srijitaArnabLang";
  const TITLES = {
    bn: "অর্ণব ও সৃজিতা — শুভ বিবাহ",
    en: "Arnab & Srijita — Wedding Invitation",
  };
  const LANG_LABEL = { bn: "বাংলা", en: "English" };

  const translatable = $$("[data-en],[data-bn]").map((el) => {
    const plain =
      el.tagName === "OPTION" ||
      el.namespaceURI !== "http://www.w3.org/1999/xhtml";
    const original = plain ? el.textContent : el.innerHTML;

    return {
      el,
      plain,
      current: original,
      bn: el.hasAttribute("data-bn") ? el.getAttribute("data-bn") : original,
      en: el.hasAttribute("data-en") ? el.getAttribute("data-en") : original,
    };
  });

  // Titles are wrapped by ambient.js in an <fx-ink> box (gold shimmer);
  // write into that box so the shimmer survives a language switch.
  function setContent(item, value) {
    if (item.plain) {
      item.el.textContent = value;
      return;
    }

    const ink = item.el.querySelector(":scope > fx-ink");
    (ink || item.el).innerHTML = value;
  }

  const altTargets = $$("[data-en-alt],[data-bn-alt]").map((el) => {
    const original = el.getAttribute("alt") || "";

    return {
      el,
      bn: el.hasAttribute("data-bn-alt")
        ? el.getAttribute("data-bn-alt")
        : original,
      en: el.hasAttribute("data-en-alt")
        ? el.getAttribute("data-en-alt")
        : original,
    };
  });

  const ariaTargets = $$("[data-bn-aria],[data-en-aria]").map((el) => {
    const original = el.getAttribute("aria-label") || "";

    return {
      el,
      bn: el.hasAttribute("data-bn-aria")
        ? el.getAttribute("data-bn-aria")
        : original,
      en: el.hasAttribute("data-en-aria")
        ? el.getAttribute("data-en-aria")
        : original,
    };
  });

  /* Text that is written by script (RSVP pop-up, toasts). */
  const I18N = {
    en: {
      rsvpTitle: "RSVP",
      messageTitle: "Message",
      msgLabelOptional: "A MESSAGE FOR US (OPTIONAL)",
      msgLabelRequired: "YOUR MESSAGE FOR US",
      needName: "Please enter your name.",
      needMessage: "Please write your message.",
      needResponse: "Please select your response.",
      thanks: (name) => `Thank you, ${name} ♥`,
      welcomeBack: (name) => `Welcome back, ${name} ♥`,
    },
    bn: {
      rsvpTitle: "উপস্থিতি",
      messageTitle: "বার্তা",
      msgLabelOptional: "আমাদের জন্য একটি বার্তা (ঐচ্ছিক)",
      msgLabelRequired: "আমাদের জন্য আপনার বার্তা",
      needName: "অনুগ্রহ করে আপনার নাম লিখুন।",
      needMessage: "অনুগ্রহ করে আপনার বার্তা লিখুন।",
      needResponse: "অনুগ্রহ করে আপনার উত্তর বেছে নিন।",
      thanks: (name) => `ধন্যবাদ, ${name} ♥`,
      welcomeBack: (name) => `আবার স্বাগতম, ${name} ♥`,
    },
  };

  function t(key, ...args) {
    const value = I18N[currentLang][key];

    return typeof value === "function" ? value(...args) : value;
  }

  // Assigned further down, once the calendar data exists.
  let refreshCalendarLanguage = () => {};

  function readLangParam() {
    const value = (params.get("lang") || "").toLowerCase();

    if (["en", "eng", "english"].includes(value)) return "en";
    if (["bn", "bangla", "bengali"].includes(value)) return "bn";

    return "";
  }

  function initialLang() {
    const fromLink = readLangParam();

    if (fromLink) return fromLink;

    try {
      const saved = localStorage.getItem(LANG_KEY);

      if (saved === "en" || saved === "bn") return saved;
    } catch (error) {
      /* storage blocked — fall through to the default */
    }

    return "bn";
  }

  let currentLang = "bn";

  function applyLanguage(lang, { persist = false } = {}) {
    if (lang !== "en" && lang !== "bn") return;

    // Keep the guest looking at the same spot while text re-flows.
    let anchor = null;

    if (site?.classList.contains("show") && window.scrollY > 0) {
      const marker = window.scrollY + window.innerHeight * 0.35;

      pageSections.forEach((section) => {
        if (window.getComputedStyle(section).display === "none") return;

        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (marker >= top && marker < top + height) {
          anchor = { section, ratio: (marker - top) / height };
        }
      });
    }

    currentLang = lang;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.title = TITLES[lang];

    translatable.forEach((item) => {
      const value = lang === "en" ? item.en : item.bn;

      if (value === item.current) return;

      setContent(item, value);
      item.current = value;
    });

    altTargets.forEach((item) => {
      item.el.setAttribute("alt", lang === "en" ? item.en : item.bn);
    });

    ariaTargets.forEach((item) => {
      item.el.setAttribute("aria-label", lang === "en" ? item.en : item.bn);
    });

    refreshCalendarLanguage();

    $$(".lang").forEach((widget) => {
      const label = $(".lang-cur", widget);

      if (label) label.textContent = LANG_LABEL[lang];

      $$(".lang-opt", widget).forEach((option) => {
        option.setAttribute(
          "aria-selected",
          option.dataset.lang === lang ? "true" : "false",
        );
      });
    });

    if (anchor) {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";

      const { section, ratio } = anchor;
      window.scrollTo(
        0,
        section.offsetTop +
          ratio * section.offsetHeight -
          window.innerHeight * 0.35,
      );

      root.style.scrollBehavior = previousBehavior;
    }

    updateActiveNav();

    if (persist) {
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch (error) {
        /* ignore */
      }

      // Make the link shareable: ?lang=en is added, Bengali (default) is not.
      // The ?invite= mode and the #hash are left exactly as they were.
      try {
        const url = new URL(window.location.href);

        if (lang === "en") {
          url.searchParams.set("lang", "en");
        } else {
          url.searchParams.delete("lang");
        }

        window.history.replaceState(null, "", url.toString());
      } catch (error) {
        /* e.g. some file:// contexts — harmless */
      }
    }
  }

  /* ---------- the dropdown ---------- */

  function closeLangMenus(exceptWidget) {
    $$(".lang").forEach((widget) => {
      if (widget === exceptWidget) return;

      const menu = $(".lang-menu", widget);
      const trigger = $(".lang-btn", widget);

      if (menu) menu.hidden = true;
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      widget.classList.remove("open");
    });
  }

  $$(".lang").forEach((widget) => {
    const trigger = $(".lang-btn", widget);
    const menu = $(".lang-menu", widget);
    const options = $$(".lang-opt", widget);

    function openMenu() {
      closeLangMenus(widget);

      // Don't stack the mobile page menu under the language menu.
      navLinks?.classList.remove("open");
      if (menuButton) menuButton.textContent = "☰";

      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      widget.classList.add("open");

      const selected = options.find(
        (option) => option.dataset.lang === currentLang,
      );
      (selected || options[0]).focus();
    }

    function closeMenu(returnFocus) {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      widget.classList.remove("open");

      if (returnFocus) trigger.focus();
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();

      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu(false);
      }
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMenu();
      }
    });

    options.forEach((option, index) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        applyLanguage(option.dataset.lang, { persist: true });
        closeMenu(true);
      });

      option.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          options[(index + 1) % options.length].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          options[(index - 1 + options.length) % options.length].focus();
        } else if (event.key === "Home") {
          event.preventDefault();
          options[0].focus();
        } else if (event.key === "End") {
          event.preventDefault();
          options[options.length - 1].focus();
        } else if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeMenu(true);
        } else if (event.key === "Tab") {
          closeMenu(false);
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".lang")) closeLangMenus();
  });

  window.addEventListener("scroll", () => closeLangMenus(), { passive: true });

  menuButton?.addEventListener("click", () => closeLangMenus());

  /* =========================================================
     NAVBAR
  ========================================================= */

  function updateNavbar() {
    nav?.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* =========================================================
     SCROLL REVEALS
  ========================================================= */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  $$(".reveal, .reveal-left, .reveal-right").forEach((element) => {
    revealObserver.observe(element);
  });

  /* =========================================================
     ACTIVE NAV
  ========================================================= */

  const pageSections = $$("main section[id]");

  function updateActiveNav() {
    const marker = window.scrollY + window.innerHeight * 0.35;

    let current = "";

    pageSections.forEach((section) => {
      if (window.getComputedStyle(section).display === "none") {
        return;
      }

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (marker >= top && marker < bottom) {
        current = section.id;
      }
    });

    $$(".nav-links a").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav);
  updateActiveNav();

  /* =========================================================
     LANGUAGE — first paint
  ========================================================= */

  applyLanguage(initialLang());

  /* =========================================================
     HASH SUPPORT
     Correct:   ?invite=biye#rsvp
     Not:       #rsvp?invite=biye
  ========================================================= */

  window.addEventListener("load", () => {
    const hash = window.location.hash;

    if (!hash) {
      return;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    enterButton?.addEventListener(
      "click",
      () => {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 800);
      },
      { once: true },
    );
  });

  /* =========================================================
     RSVP MODAL
  ========================================================= */

  // Which RSVP options exist depends on the invitation link.
  function configureAttendOptions() {
    if (!rsvpAttend) {
      return;
    }

    $$("option", rsvpAttend).forEach((option) => {
      const value = option.value;

      if (mode === "bi-only" && (value === "boubhaat" || value === "both")) {
        option.remove();
      }

      if (mode === "reception-only" && (value === "biye" || value === "both")) {
        option.remove();
      }
    });
  }

  configureAttendOptions();

  let rsvpIntent = "rsvp"; // "rsvp" | "message"

  function openRsvp(choice) {
    if (!rsvpModal) {
      return;
    }

    resetRsvpModalView();

    rsvpIntent = choice === "message" ? "message" : "rsvp";

    if (rsvpIntent === "message") {
      if (rsvpTitle) rsvpTitle.textContent = t("messageTitle");
      if (rsvpMsgLabel) rsvpMsgLabel.textContent = t("msgLabelRequired");
      if (rsvpMessage) rsvpMessage.required = true;
      if (rsvpAttendWrap) rsvpAttendWrap.hidden = true;
      if (rsvpGuestsWrap) rsvpGuestsWrap.hidden = true;
      if (rsvpAttend) rsvpAttend.required = false;
    } else {
      if (rsvpTitle) rsvpTitle.textContent = t("rsvpTitle");
      if (rsvpMsgLabel) rsvpMsgLabel.textContent = t("msgLabelOptional");
      if (rsvpMessage) rsvpMessage.required = false;
      if (rsvpAttendWrap) rsvpAttendWrap.hidden = false;
      if (rsvpGuestsWrap) rsvpGuestsWrap.hidden = false;
      if (rsvpAttend) {
        rsvpAttend.required = true;

        // Pre-select what the guest tapped on the page.
        if (choice && $(`option[value="${choice}"]`, rsvpAttend)) {
          rsvpAttend.value = choice;
        }
      }
    }

    rsvpModal.classList.add("show");
    rsvpModal.setAttribute("aria-hidden", "false");
    body.classList.add("locked");

    setTimeout(() => {
      $("#rsvpName")?.focus();
    }, 200);
  }

  function closeRsvp() {
    if (!rsvpModal) {
      return;
    }

    rsvpModal.classList.remove("show");
    rsvpModal.setAttribute("aria-hidden", "true");
    body.classList.remove("locked");
  }

  function closeAndResetRsvp() {
    closeRsvp();

    setTimeout(resetRsvpModalView, 350);
  }

  $$("[data-rsvp]").forEach((button) => {
    button.addEventListener("click", () => {
      openRsvp(button.dataset.rsvp);
    });
  });

  modalClose?.addEventListener("click", closeAndResetRsvp);
  modalBackdrop?.addEventListener("click", closeAndResetRsvp);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAndResetRsvp();
    }
  });

  // Hide the guest count when someone can't come.
  rsvpAttend?.addEventListener("change", () => {
    if (rsvpGuestsWrap && rsvpIntent === "rsvp") {
      rsvpGuestsWrap.hidden = rsvpAttend.value === "no";
    }
  });

  /* =========================================================
     ADD TO CALENDAR

     Times are fixed in IST (UTC+5:30) and expressed below already
     converted to UTC, since calendar links/ICS files expect UTC "Z"
     timestamps.
  ========================================================= */

  const CALENDAR_EVENTS = {
    wedding: {
      title: "Srijita & Arnab — Biye (Wedding)",
      location:
        "The Select House (Shooting Bari), 251 S.N. Ghosh Avenue, Ramchandrapur, Elachi, Narendrapur, Kolkata, West Bengal 700103",
      description:
        "Join Srijita & Arnab as they tie the knot. Thursday 11 February 2027, from 5:30 PM, at The Select House (Shooting Bari), Narendrapur, Kolkata.",
      // 11 Feb 2027, 5:30 PM – 11:30 PM IST
      startUTC: "20270211T120000Z",
      endUTC: "20270211T180000Z",
      bn: {
        title: "সৃজিতা ও অর্ণব — বিয়ে (শুভ পরিণয়)",
        description:
          "সৃজিতা ও অর্ণবের শুভ বিবাহ। বৃহস্পতিবার ১১ ফেব্রুয়ারি ২০২৭, সন্ধ্যা ৫টা ৩০ মিনিট থেকে, দ্য সিলেক্ট হাউস (শুটিং বাড়ি), নরেন্দ্রপুর, কলকাতা।",
      },
    },
    reception: {
      title: "Arnab & Srijita — Boubhaat (Reception)",
      location:
        "Singhi Palace, Orchestra Co-Operative Housing Society, Gariahat Road, near Pantaloons, Dover Terrace, Ballygunge, Kolkata, West Bengal 700019",
      description:
        "Celebrate the Boubhaat of Arnab & Srijita. Saturday 13 February 2027, from 6 PM, with dinner, at Singhi Palace, Gariahat, Kolkata.",
      // 13 Feb 2027, 6:00 PM – 11:00 PM IST (end time assumed)
      startUTC: "20270213T123000Z",
      endUTC: "20270213T173000Z",
      bn: {
        title: "অর্ণব ও সৃজিতা — বৌভাত (শুভ বৌভাত)",
        description:
          "অর্ণব ও সৃজিতার বৌভাত। শনিবার ১৩ ফেব্রুয়ারি ২০২৭, সন্ধ্যা ৬টা থেকে, প্রীতিভোজসহ, সিংহী প্যালেস, গড়িয়াহাট, কলকাতা।",
      },
    },
  };

  // The event in the guest's current language (address stays as written,
  // so map apps can find it).
  function localisedEvent(event) {
    return currentLang === "bn" && event.bn ? { ...event, ...event.bn } : event;
  }

  function googleCalendarUrl(event) {
    const query = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${event.startUTC}/${event.endUTC}`,
      details: event.description,
      location: event.location,
    });

    return `https://calendar.google.com/calendar/render?${query.toString()}`;
  }

  function icsEscape(value) {
    return String(value).replace(/([,;])/g, "\\$1");
  }

  function downloadIcsFile(event, filename) {
    const stamp =
      new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const uid = `${filename}-${Date.now()}@srijita-arnab-wedding`;

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Srijita & Arnab Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${event.startUTC}`,
      `DTEND:${event.endUTC}`,
      `SUMMARY:${icsEscape(event.title)}`,
      `LOCATION:${icsEscape(event.location)}`,
      `DESCRIPTION:${icsEscape(event.description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const calGoogleWedding = $("#calGoogleWedding");
  const calIcsWedding = $("#calIcsWedding");
  const calGoogleReception = $("#calGoogleReception");
  const calIcsReception = $("#calIcsReception");

  refreshCalendarLanguage = () => {
    if (calGoogleWedding) {
      calGoogleWedding.href = googleCalendarUrl(
        localisedEvent(CALENDAR_EVENTS.wedding),
      );
    }

    if (calGoogleReception) {
      calGoogleReception.href = googleCalendarUrl(
        localisedEvent(CALENDAR_EVENTS.reception),
      );
    }
  };

  refreshCalendarLanguage();

  calIcsWedding?.addEventListener("click", () => {
    downloadIcsFile(
      localisedEvent(CALENDAR_EVENTS.wedding),
      "srijita-arnab-biye",
    );
  });

  calIcsReception?.addEventListener("click", () => {
    downloadIcsFile(
      localisedEvent(CALENDAR_EVENTS.reception),
      "srijita-arnab-boubhaat",
    );
  });

  /* =========================================================
     RSVP FORM
  ========================================================= */

  function resetRsvpModalView() {
    rsvpForm?.reset();

    if (rsvpForm) rsvpForm.hidden = false;
    if (rsvpThanks) rsvpThanks.hidden = true;
    if (rsvpCalendar) rsvpCalendar.hidden = true;
    if (rsvpAttendWrap) rsvpAttendWrap.hidden = false;
    if (rsvpGuestsWrap) rsvpGuestsWrap.hidden = false;
  }

  rsvpDoneButton?.addEventListener("click", closeAndResetRsvp);

  rsvpForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#rsvpName")?.value.trim() || "";
    const attending = rsvpAttend?.value || "";
    const guests = rsvpGuests?.value || "1";
    const message = rsvpMessage?.value.trim() || "";
    const isMessage = rsvpIntent === "message";

    if (!name) {
      showToast(t("needName"));
      return;
    }

    if (isMessage && !message) {
      showToast(t("needMessage"));
      return;
    }

    if (!isMessage && !attending) {
      showToast(t("needResponse"));
      return;
    }

    const data = {
      name,
      attending: isMessage ? "message" : attending,
      guests: isMessage || attending === "no" ? "" : guests,
      message,
      submittedAt: new Date().toISOString(),
    };

    // Demo only. This does not transmit data to anyone.
    try {
      localStorage.setItem("srijitaArnabWeddingRSVP", JSON.stringify(data));
    } catch (error) {
      console.warn("Unable to save RSVP.", error);
    }

    if (rsvpForm) rsvpForm.hidden = true;
    if (rsvpThanks) rsvpThanks.hidden = false;

    const comingBiye = attending === "biye" || attending === "both";
    const comingBoubhaat = attending === "boubhaat" || attending === "both";

    if (calendarWeddingRow) calendarWeddingRow.hidden = !comingBiye;
    if (calendarReceptionRow) calendarReceptionRow.hidden = !comingBoubhaat;
    if (rsvpCalendar) rsvpCalendar.hidden = !(comingBiye || comingBoubhaat);

    showToast(t("thanks", name));

    if (!(comingBiye || comingBoubhaat)) {
      setTimeout(closeAndResetRsvp, 3200);
    }
  });

  /* =========================================================
     TOAST
  ========================================================= */

  let toastTimer;

  function showToast(message) {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  /* =========================================================
     SAVED RSVP
  ========================================================= */

  try {
    const saved = localStorage.getItem("srijitaArnabWeddingRSVP");

    if (saved) {
      const data = JSON.parse(saved);

      if (data?.name) {
        setTimeout(() => {
          showToast(t("welcomeBack", data.name));
        }, 2400);
      }
    }
  } catch (error) {
    console.warn("Unable to restore saved RSVP.", error);
  }

  console.log("Invitation mode:", mode);
})();

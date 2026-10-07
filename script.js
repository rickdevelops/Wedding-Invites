(() => {
  "use strict";

  /* =========================================================
     ARNAB & SRIJITA — INVITATION SCRIPT

     Invitation modes (the 3 links):
       index.html?invite=both       Biye + Boubhaat
       index.html?invite=biye       Biye only
       index.html?invite=boubhat    Boubhaat only
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
  });

  enterButton?.addEventListener("click", () => {
    cover?.classList.add("exit");

    site?.classList.add("show");

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
      if (rsvpTitle) rsvpTitle.textContent = "Message";
      if (rsvpMsgLabel) rsvpMsgLabel.textContent = "YOUR MESSAGE FOR US";
      if (rsvpMessage) rsvpMessage.required = true;
      if (rsvpAttendWrap) rsvpAttendWrap.hidden = true;
      if (rsvpGuestsWrap) rsvpGuestsWrap.hidden = true;
      if (rsvpAttend) rsvpAttend.required = false;
    } else {
      if (rsvpTitle) rsvpTitle.textContent = "RSVP";
      if (rsvpMsgLabel)
        rsvpMsgLabel.textContent = "A MESSAGE FOR US (OPTIONAL)";
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
    },
  };

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

  if (calGoogleWedding) {
    calGoogleWedding.href = googleCalendarUrl(CALENDAR_EVENTS.wedding);
  }

  calIcsWedding?.addEventListener("click", () => {
    downloadIcsFile(CALENDAR_EVENTS.wedding, "srijita-arnab-biye");
  });

  if (calGoogleReception) {
    calGoogleReception.href = googleCalendarUrl(CALENDAR_EVENTS.reception);
  }

  calIcsReception?.addEventListener("click", () => {
    downloadIcsFile(CALENDAR_EVENTS.reception, "srijita-arnab-boubhaat");
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
      showToast("Please enter your name.");
      return;
    }

    if (isMessage && !message) {
      showToast("Please write your message.");
      return;
    }

    if (!isMessage && !attending) {
      showToast("Please select your response.");
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

    showToast(`Thank you, ${name} ♥`);

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
          showToast(`Welcome back, ${data.name} ♥`);
        }, 2400);
      }
    }
  } catch (error) {
    console.warn("Unable to restore saved RSVP.", error);
  }

  console.log("Invitation mode:", mode);
})();

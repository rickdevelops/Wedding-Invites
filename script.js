(() => {
  "use strict";

  /* =========================================================
     SRIJITA & ARNAB — FINAL JS

     Invitation modes:
       ?invite=both
       ?invite=biye
       ?invite=boubhat
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

  const cover = $("#cover");

  const site = $("#site");

  const enterButton = $("#enterBtn");

  const nav = $("#nav");

  const menuButton = $("#menuBtn");

  const navLinks = $("#navLinks");

  const travelPlane = $("#travelPlane");

  const rsvpButton = $("#rsvpBtn");

  const rsvpModal = $("#rsvpModal");

  const modalClose = $("#modalClose");

  const modalBackdrop = $(".modal-backdrop");

  const rsvpForm = $("#rsvpForm");

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
     OPEN INVITATION
  ========================================================= */

  enterButton?.addEventListener("click", () => {
    cover?.classList.add("exit");

    site?.classList.add("show");

    body.classList.remove("locked");

    /*
     * Allow the cover transition to finish.
     */
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
    if (!nav) {
      return;
    }

    nav.classList.toggle("scrolled", window.scrollY > 40);
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
    {
      threshold: 0.12,
    },
  );

  $$(".reveal, .reveal-left, .reveal-right").forEach((element) => {
    revealObserver.observe(element);
  });

  /* =========================================================
     UTILITY
  ========================================================= */

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function easeInOut(value) {
    return value * value * (3 - 2 * value);
  }

  /* =========================================================
     NEW ZEALAND → KOLKATA TRAVEL

     ONE PLANE
     TWO PENGUINS

     The plane is intentionally vertical:
       New Zealand
           ↓
           ↓
           ↓
         Kolkata

     The whole travel unit descends through the story.
  ========================================================= */

  let flightFrame = false;

  function updateTravelPlane() {
    if (!travelPlane) {
      return;
    }

    const story = $("#story");

    const arrival = $(".arrival");

    if (!story || !arrival) {
      return;
    }

    /*
     * Start near the New Zealand split scene.
     */
    const start = story.offsetTop + window.innerHeight * 0.03;

    /*
     * End near the Kolkata arrival, or at the end of the story when
     * reception mode hides the arrival section.
     */
    const end = arrival.offsetParent
      ? arrival.offsetTop + window.innerHeight * 0.45
      : story.offsetTop + story.offsetHeight;

    const progress = clamp(
      (window.scrollY - start) / Math.max(1, end - start),
      0,
      1,
    );

    const eased = easeInOut(progress);

    /*
     * Vertical movement:
       starts above screen
       ends below screen
    */
    const startY = -270;

    const endY = window.innerHeight + 160;

    const y = startY + (endY - startY) * eased;

    /*
     * Tiny horizontal flutter.
     *
     * The journey stays vertical.
     */
    const x = Math.sin(eased * Math.PI * 5) * 8;

    /*
     * Small natural tilt.
     */
    const rotation = Math.sin(eased * Math.PI * 4) * 2.5;

    /*
     * Slight size change.
     */
    const scale = 0.75 + Math.sin(eased * Math.PI) * 0.12;

    /*
     * Fade.
     */
    const fadeIn = clamp(progress / 0.1, 0, 1);

    const fadeOut = clamp((1 - progress) / 0.1, 0, 1);

    const opacity = fadeIn * fadeOut;

    travelPlane.style.opacity = String(opacity);

    travelPlane.style.transform = `
      translate3d(
        calc(-50% + ${x}px),
        ${y}px,
        0
      )
      rotate(
        ${rotation}deg
      )
      scale(
        ${scale}
      )
    `;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (flightFrame) {
        return;
      }

      flightFrame = true;

      requestAnimationFrame(() => {
        updateTravelPlane();

        flightFrame = false;
      });
    },
    {
      passive: true,
    },
  );

  window.addEventListener("resize", updateTravelPlane);

  updateTravelPlane();

  /* =========================================================
     COUNTDOWN
  ========================================================= */

  const weddingDate = new Date("2027-02-11T19:00:00+05:30").getTime();

  function pad(number, length = 2) {
    return String(Math.max(0, number)).padStart(length, "0");
  }

  function updateCountdown() {
    if (mode === "reception-only") {
      return;
    }

    const diff = Math.max(0, weddingDate - Date.now());

    const days = Math.floor(diff / 86400000);

    const hours = Math.floor((diff % 86400000) / 3600000);

    const minutes = Math.floor((diff % 3600000) / 60000);

    const seconds = Math.floor((diff % 60000) / 1000);

    const daysElement = $("#days");

    const hoursElement = $("#hours");

    const minutesElement = $("#minutes");

    const secondsElement = $("#seconds");

    if (daysElement) {
      daysElement.textContent = pad(days, 3);
    }

    if (hoursElement) {
      hoursElement.textContent = pad(hours);
    }

    if (minutesElement) {
      minutesElement.textContent = pad(minutes);
    }

    if (secondsElement) {
      secondsElement.textContent = pad(seconds);
    }
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);

  /* =========================================================
     ACTIVE NAV
  ========================================================= */

  const pageSections = $$("section[id]");

  function updateActiveNav() {
    const marker = window.scrollY + 130;

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
      const href = link.getAttribute("href");

      link.style.color = href === `#${current}` ? "#c59b57" : "";
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  updateActiveNav();

  /* =========================================================
     HASH SUPPORT
     Correct:

       ?invite=biye#rsvp

     Not:

       #rsvp?invite=biye
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
          target.scrollIntoView({
            behavior: "smooth",
          });
        }, 800);
      },
      {
        once: true,
      },
    );
  });

  /* =========================================================
     RSVP MODAL
  ========================================================= */

  function openRsvp() {
    if (!rsvpModal) {
      return;
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

  rsvpButton?.addEventListener("click", openRsvp);

  modalClose?.addEventListener("click", closeAndResetRsvp);

  modalBackdrop?.addEventListener("click", closeAndResetRsvp);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAndResetRsvp();
    }
  });

  /* =========================================================
     ADD TO CALENDAR

     Times are fixed in IST (UTC+5:30) and expressed below already
     converted to UTC, since calendar links/ICS files are timezone-
     agnostic and expect UTC "Z" timestamps.
  ========================================================= */

  const CALENDAR_EVENTS = {
    wedding: {
      title: "Srijita & Arnab — Wedding",
      location:
        "Select House (The Shooting Bari), 251 S.N. Ghosh Avenue, Ramchandrapur, Elachi, Narendrapur, Kolkata, West Bengal 700103",
      description:
        "Join Srijita & Arnab as they tie the knot. Thursday 11 February 2027, 7 PM onwards, at Select House (The Shooting Bari), Kolkata.",
      // 11 Feb 2027, 7:00 PM – 11:30 PM IST
      startUTC: "20270211T133000Z",
      endUTC: "20270211T180000Z",
    },
    reception: {
      title: "Srijita & Arnab — Reception (Bou Bhat)",
      location:
        "Singhi Palace, Orchestra Co-Operative Housing Society, Gariahat Road, near Pantaloons, Dover Terrace, Ballygunge, Kolkata, West Bengal 700019",
      description:
        "Celebrate the reception of Srijita & Arnab. Saturday 13 February 2027, evening, at Singhi Palace, Kolkata.",
      // 13 Feb 2027, 7:00 PM – 11:00 PM IST (time assumed; adjust if confirmed)
      startUTC: "20270213T133000Z",
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
    downloadIcsFile(CALENDAR_EVENTS.wedding, "srijita-arnab-wedding");
  });

  if (calGoogleReception) {
    calGoogleReception.href = googleCalendarUrl(CALENDAR_EVENTS.reception);
  }

  calIcsReception?.addEventListener("click", () => {
    downloadIcsFile(CALENDAR_EVENTS.reception, "srijita-arnab-reception");
  });

  // Only show the event(s) relevant to this invitation mode.
  if (mode === "bi-only" && calendarReceptionRow) {
    calendarReceptionRow.hidden = true;
  }

  if (mode === "reception-only" && calendarWeddingRow) {
    calendarWeddingRow.hidden = true;
  }

  /* =========================================================
     RSVP FORM
  ========================================================= */

  function resetRsvpModalView() {
    rsvpForm.reset();

    rsvpForm.hidden = false;

    if (rsvpThanks) {
      rsvpThanks.hidden = true;
    }

    if (rsvpCalendar) {
      rsvpCalendar.hidden = true;
    }
  }

  rsvpDoneButton?.addEventListener("click", closeAndResetRsvp);

  rsvpForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#rsvpName")?.value.trim() || "";

    const attending = $("#rsvpAttend")?.value || "";

    const guests = $("#rsvpGuests")?.value || "1";

    if (!name) {
      showToast("Please enter your name.");

      return;
    }

    if (!attending) {
      showToast("Please select your response.");

      return;
    }

    const data = {
      name,
      attending,
      guests,

      submittedAt: new Date().toISOString(),
    };

    /*
     * Demo only.
     * This does not transmit data to you.
     */
    try {
      localStorage.setItem("srijitaArnabWeddingRSVP", JSON.stringify(data));
    } catch (error) {
      console.warn("Unable to save RSVP.", error);
    }

    rsvpForm.hidden = true;

    if (rsvpThanks) {
      rsvpThanks.hidden = false;
    }

    const attendingYes = attending === "yes";

    if (rsvpCalendar) {
      rsvpCalendar.hidden = !attendingYes;
    }

    showToast(`Thank you, ${name} ♥`);

    if (!attendingYes) {
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

  /* =========================================================
     DEBUG
  ========================================================= */

  console.log(
    "%cSRIJITA ♥ ARNAB",
    `
      font-size:24px;
      color:#6f102d;
      font-family:Georgia,serif;
    `,
  );

  console.log("Invitation mode:", mode);

  console.log("Biye:", "11 February 2027 · 7 PM onwards");

  console.log("Bou Bhat:", "13 February 2027 · Singhi Palace");

  console.log("Arnab:", "Hamilton, New Zealand");

  console.log("Srijita:", "Wellington, New Zealand");
})();

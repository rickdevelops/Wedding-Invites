/* =========================================================
   AMBIENT MOTION — soothing, endlessly looping life for the artwork

   What it does (all optional, all pure decoration):
     1. WATER   the river in each picture gently ripples and glitters.
                The real pixels of the artwork are re-drawn with a slow,
                perspective-aware wave, so reflections and boats sway.
     2. FLAMES  every diya breathes with a soft, uneven glow.
     3. SUN     the setting sun has a slow, warm halo.
     4. LEAVES  the hanging garlands, jasmine strands and flowers sway
                very gently, as if a breeze is passing through. Like the
                water, it re-draws the artwork's own pixels (the top of
                each strand stays put, the tips move most).
     5. EXTRAS  the little hanging strands on Arnab's page and the palm
                trees on the Kolkata map sway softly too.
     6. BIRDS   the gulls over the river bob and flap a little, as if
                gliding on the spot.
     7. TITLES  every heading gets the slow gold shimmer.

   Everything loops seamlessly (all waves are whole-number multiples
   of one base period, so nothing "jumps" when it restarts), only runs
   while on screen, pauses in a hidden tab, and is switched off for
   visitors who ask their device for reduced motion.

   To tune: edit SCENES below. Coordinates are in pixels of the
   original artwork file (assets/design/<name>.jpg).
   water : [x0, y0, x1, y1, strength]   (strength 1 = default ripple)
   flames: [x, y, size]                 (size = glow radius in px)
   sun   : [x, y, size]
   birds : [x, y, width, height]        (centre of the bird + a little room)
   sway  : [left, top, right, bottom, strength, anchor]
           edges are fractions (0-1) of the artwork's width / height,
           strength = how many artwork pixels the free end swings (3-6 is
           gentle), anchor = "top" for hanging strands, "bottom" for
           foliage growing up from below. An optional 7th number (0-1)
           is for a patch that starts part-way down a strand: how far
           along the strand its top edge already is.
========================================================= */
(() => {
  "use strict";

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  // add ?motion=on to the address to see the animation even if the device
  // is set to "reduce motion" (handy for checking it works)
  const force = /[?&]motion=on\b/.test(window.location.search);
  if (force) document.documentElement.classList.add("fx-force");
  if (mq.matches && !force) return;

  const SCENES = {
    "intro.jpg": {
      w: 941, h: 1562,
      water: [[440, 1010, 880, 1100, 1], [252, 1010, 440, 1054, 0.8]],
      flames: [[928, 1410, 30]],
      sun: [[385, 902, 70]],
      sway: [[0, 0, 0.09, 0.17, 4, "top"], [0.8, 0, 0.99, 0.17, 4, "top"], [0.9, 0.62, 1, 0.88, 4, "top"]],
    },
    "prelude.jpg": {
      w: 1024, h: 1460,
      water: [[490, 1218, 1020, 1296, 1], [700, 1296, 1010, 1336, 1.1]],
      flames: [[77, 1022, 34]],
      sun: [[822, 1123, 70]],
      sway: [[0.46, 0, 0.84, 0.19, 5, "top"], [0.78, 0.53, 1, 0.74, 4, "top"], [0.1, 0.59, 0.33, 0.8, 4, "bottom"]],
    },
    "srijita.jpg": {
      w: 941, h: 1550,
      water: [[372, 1010, 792, 1096, 1]],
      flames: [[854, 1028, 22], [889, 1026, 30]],
      sun: [[550, 944, 70]],
      sway: [[0.04, 0, 0.12, 0.22, 4, "top"], [0.13, 0.07, 0.29, 0.42, 5, "top"], [0.9, 0, 1, 0.13, 4, "top"], [0.62, 0.16, 0.78, 0.32, 3, "top"]],
    },
    "arnab.jpg": {
      w: 941, h: 1592,
      water: [[456, 776, 632, 884, 1]],
      flames: [[934, 397, 28], [28, 1323, 26], [107, 1415, 44]],
      sun: [[615, 663, 70]],
      sway: [[0, 0, 0.11, 0.32, 5, "top"], [0.56, 0, 0.76, 0.28, 5, "top"], [0.38, 0, 0.58, 0.11, 3, "top"], [0.783, 0.2462, 0.82, 0.2984, 4, "top"], [0.847, 0.3015, 0.899, 0.3706, 5, "top", 0.4]],
    },
    "biye.jpg": {
      w: 941, h: 1600,
      water: [[690, 1426, 934, 1500, 1]],
      flames: [[50, 1008, 28], [103, 1126, 30]],
      sun: [[920, 1305, 60]],
      sway: [[0, 0, 0.08, 0.21, 4, "top"], [0, 0.3, 0.08, 0.48, 4, "top"], [0.68, 0, 0.91, 0.29, 5, "top"], [0.82, 0.57, 0.99, 0.74, 4, "top"], [0.16, 0.79, 0.26, 0.93, 4, "top"], [0.903, 0.145, 1, 0.275, 3.5, "bottom"]],
    },
    "boubhaat.jpg": {
      w: 941, h: 1596,
      water: [[668, 1404, 934, 1486, 1]],
      flames: [[72, 1135, 26], [55, 1150, 20]],
      sun: [[833, 1301, 60]],
      sway: [[0, 0, 0.08, 0.47, 5, "top"], [0.19, 0, 0.31, 0.21, 4, "top"], [0.66, 0, 0.78, 0.16, 4, "top"], [0.78, 0, 0.89, 0.29, 5, "top"], [0.8, 0.49, 0.88, 0.73, 4, "top"], [0.05, 0.55, 0.25, 0.71, 3, "top"], [0.06, 0.79, 0.22, 0.98, 4, "top"], [0.898, 0.168, 0.995, 0.2945, 3.5, "bottom"]],
      birds: [[862, 1178, 44, 32], [830, 1191, 40, 30], [887, 1207, 48, 34]],
    },
    "river.jpg": {
      w: 941, h: 170,
      water: [[345, 114, 650, 150, 0.8]],
      flames: [[40, 40, 18]],
      sun: [],
    },
  };

  const PERIOD = 14; // seconds for one full seamless loop of the water
  const TAU = Math.PI * 2;
  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  /* ---------- tiny seeded random so glints are the same on every load ---------- */
  const rng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const waters = []; // every live water canvas

  // one soft, tapered glint (transparent -> gold -> transparent), reused everywhere
  const glintSprite = (() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 6;
    const g = c.getContext("2d");
    const hg = g.createLinearGradient(0, 0, 64, 0);
    hg.addColorStop(0, "rgba(255,214,150,0)");
    hg.addColorStop(0.5, "rgba(255,226,170,1)");
    hg.addColorStop(1, "rgba(255,214,150,0)");
    g.fillStyle = hg;
    const vg = g.createLinearGradient(0, 0, 0, 6);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(0.5, "rgba(0,0,0,1)");
    vg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillRect(0, 0, 64, 6);
    g.globalCompositeOperation = "destination-in";
    g.fillStyle = vg;
    g.fillRect(0, 0, 64, 6);
    return c;
  })();

  /* =========================================================
     MATCH THE PICTURE'S OWN FADE
     The artwork melts into the wine background at its top, bottom and
     (on wide screens) sides. A moving patch that sits in that zone must fade
     the same way, or it would look brighter than the picture around it.
     So every patch gets, besides its own soft edges, a copy of the picture's
     fade, lined up to the same spot. Re-done on resize.
  ========================================================= */
  const splitLayers = (v) => {
    const out = [];
    let depth = 0, cur = "";
    for (const ch of v) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const OWN_H = "linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%)";
  const OWN_V = "linear-gradient(180deg, transparent 0, #000 14%, #000 86%, transparent 100%)";
  function matchFade(w) {
    const cs = getComputedStyle(w.img);
    const raw = cs.maskImage && cs.maskImage !== "none" ? cs.maskImage : cs.webkitMaskImage;
    const layers = raw && raw !== "none" ? splitLayers(raw) : [];
    const sw = w.scene.w, sh = w.scene.h;
    const size = (sw / w.rw) * 100 + "% " + (sh / w.rh) * 100 + "%";
    const pos =
      (w.rw >= sw ? 0 : (w.x0 / (sw - w.rw)) * 100) + "% " +
      (w.rh >= sh ? 0 : (w.y0 / (sh - w.rh)) * 100) + "%";
    const all = [OWN_H, OWN_V, ...layers];
    const n = all.length;
    const rep = (v) => Array(n).fill(v).join(", ");
    const sizes = ["100% 100%", "100% 100%", ...layers.map(() => size)].join(", ");
    const poss = ["0 0", "0 0", ...layers.map(() => pos)].join(", ");
    const st = w.cv.style;
    st.webkitMaskImage = st.maskImage = all.join(", ");
    st.webkitMaskSize = st.maskSize = sizes;
    st.webkitMaskPosition = st.maskPosition = poss;
    st.webkitMaskRepeat = st.maskRepeat = rep("no-repeat");
    st.webkitMaskComposite = rep("source-in");
    st.maskComposite = rep("intersect");
  }
  let fadeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => waters.forEach(matchFade), 200);
  });

  /* =========================================================
     WATER
  ========================================================= */
  function makeWater(img, scene, spec, index) {
    const [x0, y0, x1, y1, k] = spec;
    const rw = x1 - x0;
    const rh = y1 - y0;
    const cv = document.createElement("canvas");
    cv.className = "fx-water";
    cv.setAttribute("aria-hidden", "true");
    cv.width = rw;
    cv.height = rh;
    cv.style.left = (x0 / scene.w) * 100 + "%";
    cv.style.top = (y0 / scene.h) * 100 + "%";
    cv.style.width = (rw / scene.w) * 100 + "%";
    cv.style.height = (rh / scene.h) * 100 + "%";
    img.parentNode.insertBefore(cv, img.nextSibling);

    const ctx = cv.getContext("2d");
    const rand = rng(1000 + index * 77 + Math.round(x0));
    const glints = [];
    const count = Math.max(10, Math.round((rw * rh) / 700));
    for (let i = 0; i < count; i++) {
      glints.push({
        x: rand() * rw,
        y: rh * (0.12 + rand() * 0.8),
        len: 8 + rand() * 26,
        ph: rand(),
        sp: 1 + Math.floor(rand() * 3), // whole numbers => seamless loop
      });
    }

    const w = {
      cv, ctx, img, rw, rh, x0, y0, k, glints, scene,
      visible: false,
      ready: false,
    };
    waters.push(w);
    matchFade(w);
    return w;
  }

  function drawWater(w, t) {
    const { ctx, img, rw, rh, x0, y0, k } = w;
    const ph = (t % PERIOD) / PERIOD; // 0..1, loops seamlessly
    ctx.clearRect(0, 0, rw, rh);
    // wider source so shifted rows never run out of picture
    const pad = 6;
    const sxMin = Math.max(0, x0 - pad);
    for (let y = 0; y < rh; y++) {
      const u = y / (rh - 1); // 0 far .. 1 near
      const env = smooth(0, 0.16, u) * (1 - smooth(0.84, 1, u));
      const amp = (2.4 + 5.2 * u) * k * env;
      const a =
        Math.sin(TAU * (2.6 * Math.pow(u + 0.12, 1.5) * 3 - ph)) * 0.6 +
        Math.sin(TAU * (3.6 * u + 2 * ph) + 1.3) * 0.4;
      let dx = a * amp;
      let sx = x0 + dx;
      if (sx < sxMin) sx = sxMin;
      // a slow vertical swell too, so the whole surface visibly heaves
      const dy = Math.sin(TAU * (3.2 * u - ph)) * 1.5 * k * env;
      ctx.drawImage(img, sx, y0 + y + dy, rw, 1, 0, y, rw, 1);
    }

    // soft golden glints that fade in and out, never pop
    ctx.globalCompositeOperation = "lighter";
    for (const g of w.glints) {
      const s = Math.sin(TAU * (g.sp * ph + g.ph));
      const al = Math.max(0, s) * 0.7;
      if (al < 0.02) continue;
      const drift = Math.sin(TAU * (ph + g.ph)) * 8;
      ctx.globalAlpha = al;
      ctx.drawImage(glintSprite, g.x + drift, g.y - 1.5, g.len * 1.6, 4);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  /* =========================================================
     SWAY  (garlands, jasmine strands, leaves)
     Each patch redraws a strip of the artwork one row at a time, shifting
     every row sideways a little more the further it is from the anchor.
     A slow travelling wave plus a quicker, smaller flutter on top gives
     the feeling of a soft breeze. Whole-number multiples of one period
     keep it seamless, and every patch has its own phase so strands never
     swing in step.
  ========================================================= */
  function makeSway(img, scene, spec, index) {
    const [fx0, fy0, fx1, fy1, amp, anchor, bias = 0] = spec;
    const x0 = Math.round(fx0 * scene.w);
    const y0 = Math.round(fy0 * scene.h);
    const rw = Math.round(fx1 * scene.w) - x0;
    const rh = Math.round(fy1 * scene.h) - y0;
    const cv = document.createElement("canvas");
    cv.className = "fx-water fx-sway";
    cv.setAttribute("aria-hidden", "true");
    cv.width = rw;
    cv.height = rh;
    cv.style.left = (x0 / scene.w) * 100 + "%";
    cv.style.top = (y0 / scene.h) * 100 + "%";
    cv.style.width = (rw / scene.w) * 100 + "%";
    cv.style.height = (rh / scene.h) * 100 + "%";
    img.parentNode.insertBefore(cv, img.nextSibling);
    const rand = rng(5000 + index * 131 + x0 + y0);
    const w = {
      kind: "sway",
      cv, ctx: cv.getContext("2d"), img, rw, rh, x0, y0, amp, anchor, bias, scene,
      p: rand(),
      rowH: rh > 260 ? 2 : 1,
      visible: false,
      ready: false,
    };
    waters.push(w);
    matchFade(w);
    return w;
  }

  function drawSway(w, t) {
    const { ctx, img, rw, rh, x0, y0, amp, anchor, bias, p, rowH } = w;
    const ph = (t % PERIOD) / PERIOD;
    const maxX = Math.max(0, (img.naturalWidth || x0 + rw) - rw);
    ctx.clearRect(0, 0, rw, rh);
    for (let y = 0; y < rh; y += rowH) {
      let u = y / (rh - 1);
      if (anchor === "bottom") u = 1 - u;
      u = bias + u * (1 - bias); // patch that starts part-way down a strand
      const wgt = Math.pow(u, 1.35); // anchored end stays put
      const a =
        Math.sin(TAU * (2 * ph + p - u * 0.28)) * 0.72 +
        Math.sin(TAU * (3 * ph + p * 2.3 + u * 0.9)) * 0.28;
      let sx = x0 + a * amp * wgt;
      if (sx < 0) sx = 0;
      if (sx > maxX) sx = maxX;
      const dy = Math.sin(TAU * (2 * ph + p + 0.25)) * 0.35 * amp * wgt;
      ctx.drawImage(img, sx, y0 + y + dy, rw, rowH, 0, y, rw, rowH);
    }
  }

  /* =========================================================
     BIRDS  (a small patch round each gull, re-drawn with a slow bob,
     a tiny tilt and a soft flap: the wings open and close a few percent)
  ========================================================= */
  function makeBird(img, scene, spec, index) {
    const [cx, cy, bw, bh] = spec;
    const x0 = Math.round(cx - bw / 2);
    const y0 = Math.round(cy - bh / 2);
    const cv = document.createElement("canvas");
    cv.className = "fx-water fx-sway";
    cv.setAttribute("aria-hidden", "true");
    cv.width = bw;
    cv.height = bh;
    cv.style.left = (x0 / scene.w) * 100 + "%";
    cv.style.top = (y0 / scene.h) * 100 + "%";
    cv.style.width = (bw / scene.w) * 100 + "%";
    cv.style.height = (bh / scene.h) * 100 + "%";
    img.parentNode.insertBefore(cv, img.nextSibling);
    const rand = rng(8000 + index * 211);
    const w = {
      kind: "bird",
      cv, ctx: cv.getContext("2d"), img, rw: bw, rh: bh, x0, y0, scene,
      p: rand(),
      sp: 3 + (index % 2), // flaps per loop (whole numbers keep the loop seamless)
      visible: false,
      ready: false,
    };
    waters.push(w);
    matchFade(w);
    return w;
  }

  function drawBird(w, t) {
    const { ctx, img, rw, rh, x0, y0, p, sp } = w;
    const ph = (t % PERIOD) / PERIOD;
    ctx.clearRect(0, 0, rw, rh);
    const dx = Math.sin(TAU * (ph + p)) * 3;
    const dy = Math.sin(TAU * (2 * ph + p)) * 2.2;
    const flap = 1 + Math.sin(TAU * (sp * ph + p)) * 0.07;
    const tilt = Math.sin(TAU * (ph + p + 0.25)) * 0.035;
    ctx.save();
    ctx.translate(rw / 2 + dx, rh / 2 + dy);
    ctx.rotate(tilt);
    ctx.scale(1, flap);
    ctx.drawImage(img, x0, y0, rw, rh, -rw / 2, -rh / 2, rw, rh);
    ctx.restore();
  }

  /* =========================================================
     FLAMES + SUN  (CSS-animated glows; JS only places them)
  ========================================================= */
  function addGlow(img, scene, kind, spec, i) {
    const [x, y, r] = spec;
    const el = document.createElement("i");
    el.className = "fx-glow fx-" + kind;
    el.setAttribute("aria-hidden", "true");
    el.style.left = (x / scene.w) * 100 + "%";
    el.style.top = (y / scene.h) * 100 + "%";
    const grow = kind === "flame" ? 2.2 : kind === "sun" ? 2.6 : 1;
    el.style.width = ((r * 2 * grow) / scene.w) * 100 + "%";
    // negative delay so neighbouring flames never flicker in step
    el.style.animationDelay = -(i * 1.37 + x * 0.003) + "s";
    img.parentNode.insertBefore(el, img.nextSibling);
    if (kind === "sun") {
      const rays = document.createElement("i");
      rays.className = "fx-rays";
      rays.setAttribute("aria-hidden", "true");
      rays.style.left = el.style.left;
      rays.style.top = el.style.top;
      rays.style.width = ((r * 8) / scene.w) * 100 + "%";
      img.parentNode.insertBefore(rays, img.nextSibling);
    }
  }

  /* =========================================================
     BUILD
  ========================================================= */
  function build(img) {
    const name = (img.getAttribute("src") || "").split("/").pop();
    const scene = SCENES[name];
    if (!scene) return;
    if (img.closest(".cq-in")) {
      // the river strip shares its box with a caption on phones, so give
      // the picture its own frame to measure the water against
      const frame = document.createElement("div");
      frame.className = "fx-frame";
      img.parentNode.insertBefore(frame, img);
      frame.appendChild(img);
    }
    let idx = 0;
    (scene.water || []).forEach((spec, i) => {
      const w = makeWater(img, scene, spec, idx++ + i);
      const start = () => {
        w.ready = true;
        drawWater(w, 0);
      };
      if (img.complete && img.naturalWidth) start();
      else img.addEventListener("load", start, { once: true });
      io.observe(w.cv);
    });
    (scene.sway || []).forEach((spec, i) => {
      const w = makeSway(img, scene, spec, i);
      const start = () => {
        w.ready = true;
        drawSway(w, 0);
      };
      if (img.complete && img.naturalWidth) start();
      else img.addEventListener("load", start, { once: true });
      io.observe(w.cv);
    });
    (scene.birds || []).forEach((spec, i) => {
      const w = makeBird(img, scene, spec, i);
      const start = () => {
        w.ready = true;
        drawBird(w, 0);
      };
      if (img.complete && img.naturalWidth) start();
      else img.addEventListener("load", start, { once: true });
      io.observe(w.cv);
    });
    (scene.flames || []).forEach((s, i) => addGlow(img, scene, "flame", s, i));
    (scene.sun || []).forEach((s, i) => addGlow(img, scene, "sun", s, i));
  }

  /* =========================================================
     DRIFTING LIGHT — a few slow golden motes over the opening picture
  ========================================================= */
  const homeStage = document.querySelector("#home .stage");
  if (homeStage) {
    const rand = rng(42);
    const layer = document.createElement("div");
    layer.className = "fx-motes";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 14; i++) {
      const m = document.createElement("i");
      const size = 3 + rand() * 5;
      m.style.left = 4 + rand() * 92 + "%";
      m.style.top = 52 + rand() * 40 + "%";
      m.style.width = m.style.height = size + "px";
      m.style.setProperty("--rise", 14 + rand() * 16 + "cqw");
      m.style.setProperty("--sway", (rand() < 0.5 ? -1 : 1) * (2 + rand() * 4) + "cqw");
      m.style.animationDuration = 16 + rand() * 12 + "s";
      m.style.animationDelay = -rand() * 28 + "s";
      layer.appendChild(m);
    }
    const bg = homeStage.querySelector("img.plate-bg");
    bg.parentNode.insertBefore(layer, bg.nextSibling);
  }

  /* =========================================================
     PETALS — jasmine and rose petals drifting down each picture
  ========================================================= */
  const small = window.innerWidth < 700;
  document.querySelectorAll(".plate .stage").forEach((stage, si) => {
    const rand = rng(900 + si * 31);
    const layer = document.createElement("div");
    layer.className = "fx-petals";
    layer.setAttribute("aria-hidden", "true");
    const n = small ? 6 : 10;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "fx-petal " + (rand() < 0.62 ? "jas" : "rose");
      const size = 9 + rand() * 11;
      p.style.left = 2 + rand() * 94 + "%";
      p.style.width = size + "px";
      p.style.height = size * 1.45 + "px";
      p.style.setProperty("--sway", (rand() < 0.5 ? -1 : 1) * (18 + rand() * 40) + "px");
      p.style.setProperty("--spin", (rand() < 0.5 ? -1 : 1) * (200 + rand() * 360) + "deg");
      const dur = 17 + rand() * 14;
      p.style.animationDuration = dur + "s, " + dur / 2.4 + "s";
      p.style.animationDelay = -rand() * dur + "s, " + -rand() * 10 + "s";
      layer.appendChild(p);
    }
    stage.insertBefore(layer, stage.firstChild);
  });

  /* =========================================================
     HEADINGS — the same slow gold shimmer on every title
     (the words are wrapped in one box that is taller than the line, so the
     tall swashes of the script lettering are never cut off; see ambient.css)
  ========================================================= */
  const TITLES = [
    ".col .c-title",
    ".tx-sri-title",
    ".tx-arn-title",
    ".culture-title h2",
    ".culture-vedic h3",
    ".rsvp-inner h2",
    ".rsvp-note h3",
    ".footer h2",
  ].join(",");
  document.querySelectorAll(TITLES).forEach((h, i) => {
    // a custom tag, not a <span>: the stylesheet has many "h2 span" rules
    // (small ornaments etc.) that must not apply to this wrapper
    const ink = document.createElement("fx-ink");
    ink.className = "fx-ink";
    while (h.firstChild) ink.appendChild(h.firstChild);
    h.appendChild(ink);
    // spread the shimmers out so the headings never glint all at once
    ink.style.animationDelay = -((i * 2.3) % 7) + "s";
  });
  // the wedding / reception card titles are re-written by the language
  // switch, so they take the class directly instead of a wrapper
  document.querySelectorAll(".inv-title").forEach((h, i) => {
    h.classList.add("fx-title");
    h.style.animationDelay = -(1.5 + i * 3.1) + "s";
  });

  /* ---------- only animate what is on screen ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const w = waters.find((x) => x.cv === e.target);
        if (w) w.visible = e.isIntersecting;
      });
    },
    { rootMargin: "80px" },
  );

  const imgs = [
    ...document.querySelectorAll("img.plate-bg"),
    ...document.querySelectorAll(".cq-in img"),
  ];
  imgs.forEach(build);

  /* ---------- one shared, throttled animation loop ---------- */
  const FPS = window.innerWidth < 700 ? 24 : 30;
  const step = 1000 / FPS;
  let last = 0;
  const t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || (mq.matches && !force)) return;
    if (now - last < step) return;
    last = now;
    const t = (now - t0) / 1000;
    for (const w of waters) {
      if (w.visible && w.ready) (w.kind === "sway" ? drawSway : w.kind === "bird" ? drawBird : drawWater)(w, t);
    }
  }
  requestAnimationFrame(frame);

  // if the visitor switches on reduced motion later, freeze everything
  mq.addEventListener &&
    mq.addEventListener("change", () => {
      document.documentElement.classList.toggle("fx-off", mq.matches);
    });
})();

# Arnab & Srijita — Wedding Invitation

Static site (HTML + CSS + JS). No build step. Open `index.html`, or double-click
`start-local.bat` on Windows to serve it at http://127.0.0.1:5500.

## The 3 invitation links (unchanged)

| Link | Shows |
|---|---|
| `index.html?invite=both` (default) | Biye + Boubhaat |
| `index.html?invite=biye` | Biye only |
| `index.html?invite=boubhat` | Boubhaat only (uses `cover-card-reception.png`) |

Put the query **before** any hash: `?invite=biye#rsvp`.

## Page order

Envelope → Cover (both unchanged) → Home → Our Story → Srijita → Arnab →
Our Culture → Biye → Boubhaat → RSVP

## Section dividers

Every section starts with `<div class="sec-edge">` (gold hairlines + ❖), and each
artwork fades into the same deep wine (`--edge-bg`) at its top/bottom edge. Tune the
look in `style.css` → "SECTION TRANSITIONS" (`--edge` = fade length, `--band` = divider
height). Sections hidden by `?invite=` modes hide their own divider automatically.

## Desktop width

On screens ≥700px the artwork fills the width up to `--wide` (1440px, in `style.css` →
"DESKTOP — full-width artwork"); wider screens get a blurred backdrop of the same picture
at the sides. All overlay text is in `cqw`, so it scales with the picture. Text blocks
fade up as they scroll into view (`.reveal`).

## Phones (< 700px)

Artwork is never zoomed or cropped on phones. Home shows the whole picture with its
short text on the parchment. Story / Srijita / Arnab / Biye / Boubhaat are built as
`top slice of the art` → `paper card with the text` → `bottom slice of the art`
(markup: `.art-top`, the card (`.col` / `.inv`), `.art-bot`). The card grows with the
text, so any length / any screen width works. Biye and Boubhaat keep their flower
borders from `assets/design/band-*.jpg`; the card paper is `assets/design/paper.jpg`.

Tune a plate in `style.css` → "PHONES": `--a` = where the top slice ends, `--b` = where
the bottom slice starts (fractions of the picture height). Screens ≥ 700px are unchanged.
If you edit text in a plate's top section, edit the second copy inside `.art-bot` too
(it is the same caption, aria-hidden).

## How to change text

Every word that used to be baked into the client's images is now live HTML in
`index.html`, in the same section order as above. Search for the words you want
to change. Section ids: `#home #story #srijita #arnab #culture #biye #boubhaat #rsvp`.

* **Home / Story / Srijita / Arnab** – text sits in a `.col` block (title, sub,
  paragraphs) inside the section. Edit the text freely; the column flows, so
  longer/shorter text will not overlap.
* **Biye / Boubhaat cards** – all inside `<div class="inv bengali">`. Each line
  break is a `<br />`. Dates, times and venues are in the `.inv-info` row.
  The venue is a small sketch map + an "Open in Google Maps" button (see Venue map below).
* **Our Culture** – the 8 rituals are `<li class="ritual">` items (title, English
  name, description). Add/remove items freely; the grid reflows.
* **RSVP** – heading, intro line (one variant per invitation link:
  `.for-both`, `.for-biye`, `.for-boubhat`), the two notes.
* **Stamps / postcard captions** – `.stamp` blocks and `.script` captions with
  classes like `tx-pre-stamp-a`.

## Where things are

```
index.html               all content
style.css                styles (intro CSS at top is untouched)
script.js                modes, intro, nav, RSVP modal, add-to-calendar
assets/cover-card*.png, invitation-flower-*.png   intro (unchanged)
assets/design/*.jpg      client artwork with the text removed (one per section)
assets/design/culture/*  culture-section artwork (couple, ritual tiles, river strip)
```

Positions of the overlay text are in `style.css` ("generated overlay positions"
and "generated flowing columns") as percentages of the picture, so the text
scales with the artwork.

## Calendar times (edit in `script.js` → `CALENDAR_EVENTS`)

Biye: Thu 11 Feb 2027, from 5:30 PM IST. Boubhaat: Sat 13 Feb 2027, from 6:00 PM IST.
End times are placeholders.

## RSVP

Demo only: the response is saved in the visitor's own browser (`localStorage`);
nothing is sent anywhere. Hook `rsvpForm`'s submit handler in `script.js` to a
form service/backend to receive real responses.

## Venue map (Biye + Boubhaat)

Each venue shows a small sketch map (venue pin in the centre, landmarks around it)
with an **OPEN IN GOOGLE MAPS** button; the map and the button both open Google Maps.
Markup: `<div class="venue-map">` in `index.html` (one per invitation); styles at the end
of `style.css`. The maps are hand-drawn inline SVGs, so they are **schematic, not to scale**
(the card says so). To change a landmark, edit its `<text class="vm-lm">` label and its
marker position inside the `<svg class="vm-svg">`. To use a real screenshot/photo of the
map instead, replace the `<svg class="vm-svg">…</svg>` with
`<img class="vm-svg" src="assets/map-biye.jpg" alt="" style="object-fit:cover">`.
The Google Maps links are the `href`s on the `.vm-card` and `.vm-btn` anchors.
On screens >= 700px the Biye/Boubhaat text scale (`--u`) was reduced slightly
(0.95 -> 0.85, 0.8 -> 0.74) to make room for the map.

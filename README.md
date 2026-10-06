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
Biye → Boubhaat → Our Culture → RSVP

## Section dividers

Every section starts with `<div class="sec-edge">` (gold hairlines + ❖), and each
artwork fades into the same deep wine (`--edge-bg`) at its top/bottom edge. Tune the
look in `style.css` → "SECTION TRANSITIONS" (`--edge` = fade length, `--band` = divider
height). Sections hidden by `?invite=` modes hide their own divider automatically.

## How to change text

Every word that used to be baked into the client's images is now live HTML in
`index.html`, in the same section order as above. Search for the words you want
to change. Section ids: `#home #story #srijita #arnab #biye #boubhaat #culture #rsvp`.

* **Home / Story / Srijita / Arnab** – text sits in a `.col` block (title, sub,
  paragraphs) inside the section. Edit the text freely; the column flows, so
  longer/shorter text will not overlap.
* **Biye / Boubhaat cards** – all inside `<div class="inv bengali">`. Each line
  break is a `<br />`. Dates, times and venues are in the `.inv-info` row.
  Venue blocks link to Google Maps.
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

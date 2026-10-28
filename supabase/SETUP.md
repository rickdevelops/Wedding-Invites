# RSVP -> database -> email

**What goes where**
* The website (everything except `supabase/`) is plain static files: **commit & push and
  GitHub Pages serves it.** Nothing else is needed for the form and the database entry.
* The email part runs **inside Supabase**, not on GitHub Pages. It is set up **once** with the
  steps below (and re-deployed only if you change `supabase/functions/rsvp-email/index.ts`).

Never commit real keys or secrets to this repo. The only key in the site code is the
Supabase *publishable* key, which is meant to be public (the table only allows INSERT).

## One-time setup (Terminal, inside this project folder)

```bash
# 1. log in and link (the project ref is keejwiquaxpqxnbodkin)
npx supabase login
npx supabase link --project-ref keejwiquaxpqxnbodkin

# 2. store the secrets in Supabase (NOT in any file)
#    NOTIFY_TO must be the email address your Resend account was created with
npx supabase secrets set RESEND_API_KEY=re_your_key NOTIFY_TO=you@example.com WEBHOOK_SECRET=a-long-random-text

# 3. deploy the email function
npx supabase functions deploy rsvp-email --no-verify-jwt
```

Step 3 must print a "Deployed Function rsvp-email" message. Check it also shows in
Dashboard -> Edge Functions.

## Database (Dashboard -> SQL Editor)
Open `supabase/setup.sql`, replace `PASTE_YOUR_WEBHOOK_SECRET_HERE` with the same
`WEBHOOK_SECRET` text as above, paste into a new query and **Run**. (Don't save the edited
file back into the repo.)

## Test
Submit an RSVP on the live site. An email should arrive in a few seconds.

## If no email arrives
Run `supabase/debug.sql` in the SQL Editor. The `status_code` column tells you exactly
what is wrong (200 / 401 / 404 / 500 / 502 are explained inside that file). Function logs:
Dashboard -> Edge Functions -> rsvp-email -> Logs.

## Good to know
* Resend's free plan: 3,000 emails/month, 100/day. Without a verified domain it can only
  deliver to your own Resend account email, which is what we want here.
* If a guest's connection fails the form stays open with an error; no "thank you" is shown.
* A hidden spam-trap field silently drops bot submissions.
* If a key ever gets exposed: delete it in Resend, create a new one and run the
  `secrets set` command again.

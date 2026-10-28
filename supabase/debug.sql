-- WHY DIDN'T THE EMAIL ARRIVE?   Run in the SQL Editor after submitting a test RSVP.
-- Shows what the function answered to the database trigger (newest first).

select
  id,
  created,
  status_code,
  left(content, 200) as answer,
  error_msg
from net._http_response
order by created desc
limit 10;

-- How to read status_code:
--   200  function ran and Resend accepted the mail -> check spam / Resend dashboard "Emails"
--   401  WEBHOOK_SECRET in the SQL differs from the one set with `supabase secrets set`
--   404  the function is not deployed (run the deploy command again)
--   502  the function ran but Resend refused (see Edge Functions -> rsvp-email -> Logs;
--        usually NOTIFY_TO is not the same address your Resend account was created with)
--   500  the function crashed (a secret is missing, e.g. RESEND_API_KEY or NOTIFY_TO)
--   (no rows at all) the trigger isn't installed: run supabase/setup.sql again
--
-- Also confirm the trigger exists:
select tgname, tgenabled from pg_trigger where tgname = 'rsvp_email_trigger';

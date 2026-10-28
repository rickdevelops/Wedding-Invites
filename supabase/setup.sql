-- =====================================================================
-- ONE-TIME DATABASE SETUP  (safe to run again any time)
-- Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- BEFORE RUNNING: replace PASTE_YOUR_WEBHOOK_SECRET_HERE (near the bottom)
-- with the same text you used for  WEBHOOK_SECRET  in `supabase secrets set`.
-- (Do not commit your real secret to GitHub - only put it in the SQL editor.)
-- =====================================================================

-- 1) Table ------------------------------------------------------------
create table if not exists public.rsvps (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text        not null check (char_length(name) between 1 and 120),
  attending   text        not null check (attending in ('biye','boubhaat','both','no','message')),
  guests      int                  check (guests between 1 and 10),
  message     text                 check (char_length(message) <= 1500),
  invite_mode text,
  lang        text
);

-- 2) Security: visitors may only ADD rows -----------------------------
alter table public.rsvps enable row level security;

drop policy if exists "guests can add an rsvp" on public.rsvps;
create policy "guests can add an rsvp"
  on public.rsvps
  for insert
  to anon
  with check (true);

-- 3) Email trigger: every new row calls the rsvp-email function -------
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_rsvp_email()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url     := 'https://keejwiquaxpqxnbodkin.supabase.co/functions/v1/rsvp-email',
    headers := jsonb_build_object(
      'Content-Type',     'application/json',
      'x-webhook-secret', 'PASTE_YOUR_WEBHOOK_SECRET_HERE'
    ),
    body    := jsonb_build_object(
      'type',   'INSERT',
      'table',  'rsvps',
      'record', to_jsonb(new)
    )
  );
  return new;   -- never blocks or fails the guest's RSVP
exception when others then
  return new;
end;
$$;

drop trigger if exists rsvp_email_trigger on public.rsvps;
create trigger rsvp_email_trigger
  after insert on public.rsvps
  for each row execute function public.notify_rsvp_email();

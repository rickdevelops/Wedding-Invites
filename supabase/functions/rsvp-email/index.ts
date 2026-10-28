// Supabase Edge Function: emails you whenever a new row lands in `rsvps`.
// Triggered by a Database Webhook (INSERT on public.rsvps).
// Email is sent through Resend (free: 3,000 emails/month, 100/day).

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? ""; // e.g. you@gmail.com (comma-separate for several)
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "Wedding RSVP <onboarding@resend.dev>";
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";

const LABELS: Record<string, string> = {
  biye: "Joining the Wedding (Biye, 11 Feb)",
  boubhaat: "Joining the Reception (Boubhaat, 13 Feb)",
  both: "Joining BOTH (Biye + Boubhaat)",
  no: "Regretfully cannot come",
  message: "Sent a message only",
};

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

Deno.serve(async (req) => {
  if (!RESEND_API_KEY || !NOTIFY_TO) {
    console.error("Missing secret: RESEND_API_KEY and NOTIFY_TO must both be set.");
    return new Response("missing secrets", { status: 500 });
  }

  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    console.error("Rejected: x-webhook-secret does not match WEBHOOK_SECRET.");
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  if (payload.type !== "INSERT" || !payload.record) {
    return new Response("ignored", { status: 200 });
  }

  const r = payload.record;
  const status = LABELS[r.attending] ?? r.attending;
  const when = new Date(r.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rows: [string, string][] = [
    ["Name", esc(r.name)],
    ["Response", esc(status)],
    ...(r.guests ? [["Guests", esc(r.guests)] as [string, string]] : []),
    ...(r.message ? [["Message", esc(r.message).replace(/\n/g, "<br>")] as [string, string]] : []),
    ["Invite link", esc(r.invite_mode ?? "-")],
    ["Language", esc(r.lang ?? "-")],
    ["Received", `${esc(when)} IST`],
  ];

  const html = `
  <div style="font-family:Georgia,serif;max-width:520px;margin:auto;border:1px solid #e6d3a3;border-radius:10px;overflow:hidden">
    <div style="background:#6f102d;color:#f3dfa2;padding:16px 20px;font-size:18px">❖ New RSVP — Arnab &amp; Srijita</div>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${rows.map(([k, v]) =>
        `<tr><td style="padding:10px 20px;color:#8a6d3b;width:110px;vertical-align:top;border-bottom:1px solid #f1e7cc">${k}</td>
             <td style="padding:10px 20px;border-bottom:1px solid #f1e7cc">${v}</td></tr>`).join("")}
    </table>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_TO.split(",").map((s) => s.trim()),
      subject: `RSVP: ${r.name} — ${status}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return new Response("email failed", { status: 502 });
  }
  console.log("Email sent for RSVP from", r.name);
  return new Response("sent", { status: 200 });
});

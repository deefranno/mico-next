# Form submissions — setup

Contact & admissions form submissions now (a) save as entries in WP admin and
(b) email you. Nothing is ever silently lost.

## 1. Create the sending mailbox (cPanel)

cPanel → **Email Accounts** → create e.g. `noreply@websage.lat`. Note the
password — you'll need it for SMTP in step 3.

## 2. Install the handler

Upload `mico-form-handler.php` to `wp-content/mu-plugins/` (same folder as the
revalidate plugin). Then edit the constants at the top:

- `MICO_FORM_NOTIFY_TO`   → `duanefranklyn@gmail.com` (change anytime — one line)
- `MICO_FORM_NOTIFY_FROM` → `noreply@websage.lat` (the mailbox from step 1)
- `MICO_FORM_ALLOW_ORIGIN`→ `https://astro.websage.lat` (already set)

## 3. Make WordPress send reliably (FluentSMTP)

Default cPanel mail often lands in Gmail spam. Fix it:

1. Install the free **FluentSMTP** plugin.
2. Add a connection → **Other SMTP** → host `mail.websage.lat` (or your cPanel
   mail host), port 465 (SSL) or 587 (TLS), username `noreply@websage.lat`,
   the mailbox password. Set the "From" to `noreply@websage.lat`.
3. Use FluentSMTP's **Email Test** tab to send a test to your Gmail. Confirm it
   arrives in the inbox (not spam).

## 4. Point the frontend at the endpoint

On Railway → Variables:

```
NEXT_PUBLIC_WP_FORM_ENDPOINT = https://themico.websage.lat/wp-json/mico/v1/submit
```

Redeploy (or push). Because it's `NEXT_PUBLIC_`, it's baked into the browser
bundle at build time — a change requires a rebuild.

## 5. Test end-to-end

1. On `astro.websage.lat/contact`, submit a test message.
2. Check **WP admin → Form Submissions** — your entry should be there.
3. Check your Gmail for the notification.
4. Repeat on `/admissions`.

## What's built in

- **Saved entries:** WP admin → *Form Submissions* (a list; click one to see all
  fields). Survives even if email fails.
- **Email:** plain-text notification to `MICO_FORM_NOTIFY_TO`, Reply-To set to
  the submitter so you can reply directly.
- **Spam protection:** honeypot field (hidden; bots fill it and get silently
  dropped) + email validation + rate limit (5 submissions / 10 min per IP).
- **CORS:** only `astro.websage.lat` is allowed to POST.

## Changing the destination email later

Edit `MICO_FORM_NOTIFY_TO` in `mico-form-handler.php`. For multiple recipients,
use a comma-separated string. No frontend change needed.

## If spam ever gets through

The honeypot handles typical bots. If you later see spam, add Cloudflare
Turnstile (you already run Cloudflare) — ask and I'll wire it in. Not needed
unless it becomes a problem.

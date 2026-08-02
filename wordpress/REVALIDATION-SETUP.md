# Instant updates — on-demand revalidation setup

Edit content in WordPress → it appears on `astro.websage.lat` within seconds,
no redeploy. Three pieces: a secret, a Railway variable, and a WP snippet.

## 1. Pick a secret

Generate a long random string (any password generator, or run
`openssl rand -hex 32`). You'll use the SAME value in both places below.

## 2. Add it to Railway

Railway → your service → **Variables** → New Variable:

```
REVALIDATE_SECRET = <your-random-string>
```

Save; Railway redeploys. This must be live before the webhook works.

## 3. Install the WordPress snippet

1. In your WP install (cPanel File Manager or SFTP), go to `wp-content/`.
2. If there's no `mu-plugins` folder, create one: `wp-content/mu-plugins/`.
3. Upload `mico-headless-revalidate.php` into it.
4. Edit the file and set:
   - `MICO_REVALIDATE_URL` → `https://astro.websage.lat/api/revalidate` (already set)
   - `MICO_REVALIDATE_SECRET` → the SAME string you used in step 1

`mu-plugins` = "must-use"; it activates automatically, nothing to toggle.

## 4. Test it

- **Manual check:** open in a browser (replace the secret):
  `https://astro.websage.lat/api/revalidate?secret=<your-string>`
  You should get `{"revalidated":true,...}`. A wrong/blank secret returns 401.
- **Real check:** edit a post title in WP, hit Update, wait ~5–10 seconds,
  reload the post on `astro`. The change should be there.

## How it works

- Frontend fetches are tagged (`wp-posts`, `wp-pages`) in `lib/wp.ts`.
- On save/publish/delete, the WP snippet POSTs to `/api/revalidate` with the
  secret + the slug/type.
- The route calls `revalidateTag()` + `revalidatePath()`, so just the affected
  content is refreshed on the next request — fast, no full rebuild.
- A 24h time-based fallback still runs, so even if a webhook is ever missed,
  content self-heals within a day.

## Notes / gotchas

- The request is **non-blocking** — it won't slow down the WP editor.
- If WordPress is behind Cloudflare, make sure outbound requests from WP to
  `astro.websage.lat` aren't blocked. Usually fine.
- Homepage (`/`) is always refreshed on any change, since its news grid can be
  affected by any post edit.
- This does NOT cover ACF field edits on the 3 bespoke pages by default — those
  fire `save_post` on the page too, so they're covered as long as the field data
  rides on the page save (it does).

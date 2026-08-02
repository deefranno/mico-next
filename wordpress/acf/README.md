# Mico — ACF setup (WordPress side)

These three JSON files make the Homepage, Admissions, and Contact pages editable
from WordPress. Import them into ACF, then the `astro.websage.lat` frontend reads
the fields over the REST API. **Every field has a default** — until someone edits
it in WP, the site shows the exact text it shows now.

## 1. Install plugins (WordPress admin → Plugins → Add New)

1. **Advanced Custom Fields** (free) — the fields themselves.
2. **ACF to REST API** (free) — exposes ACF fields on the WP REST API.
   Without this, the fields save in WP but the headless frontend can't see them.

> Note: `show_in_rest` is already set in each JSON. Modern ACF (6.x) can surface
> fields under a `acf` key on the REST response on its own for some field types,
> but the **ACF to REST API** plugin guarantees it for all of them. Install it.

## 2. Import the field groups

WordPress admin → **ACF → Tools → Import Field Groups**. Import each file:

- `homepage-fields.json`  → already targets the site's **front page**.
- `admissions-fields.json` → see step 3 (needs your page ID).
- `contact-fields.json`    → see step 3 (needs your page ID).

## 3. Point Admissions & Contact at the right pages

The Admissions and Contact groups have a placeholder location
(`__ADMISSIONS_PAGE_ID__` / `__CONTACT_PAGE_ID__`). After importing, open each
group in **ACF → Field Groups**, scroll to **Location Rules**, and set:

- Mico Admissions Content → *Post Type is equal to Page* → *Page is equal to* **your Admissions page**
- Mico Contact Content → *Page is equal to* **your Contact page**

(Homepage already targets "Front Page" — no change needed, as long as your
homepage is set under Settings → Reading → "A static page".)

## 4. Fill in content (optional, any time)

Edit the Homepage / Admissions / Contact page in WP and you'll see the labeled
fields. Fill any you want to change; leave the rest blank to keep defaults.

## 5. How the frontend reads them

The frontend fetches, e.g.:

```
GET https://themico.websage.lat/wp-json/wp/v2/pages/<ID>?_fields=acf
GET https://themico.websage.lat/wp-json/acf/v3/pages/<ID>   (ACF to REST API)
```

The Next.js code (next step, on the frontend) maps each field to the page,
falling back to the built-in default when a field is empty. Content refreshes on
`astro` within the hour (ISR), or immediately on a redeploy.

## Field reference (what each group controls)

**Homepage** — hero headline/body/button/image · curiosity heading + 2 paragraphs
+ image · "waiting" heading/body/image · 3 stat number+label pairs · research
banner kicker/heading/body/image · CTA heading/image.

**Admissions** — hero title/subtitle/image · intro heading/body · form-box
heading/subheading.

**Contact** — hero title/image · sidebar heading · campus address lines · phone ·
email · office hours · form-box heading · optional Google Map embed URL.

> Free-ACF note: repeating things (the 3 stats, the 4 CTA buttons, the news grid)
> are handled as flat fields or stay code-driven, because ACF *repeater* fields
> are Pro-only. If you later move to ACF Pro, these can become cleaner repeaters.

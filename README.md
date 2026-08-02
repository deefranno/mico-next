# Mico University — Next.js Frontend

Statically-generated Next.js (App Router) frontend that renders the exact Mico
University design and pulls posts/pages from a WordPress backend via the WP REST
API at `https://themico.websage.lat/wp-json/wp/v2/`.

## Quick start

```bash
npm install
cp .env.example .env.local     # adjust WP_API_BASE if needed
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
```

## How it works

- **Static generation.** Every route is generated at build time. Post and page
  routes use `generateStaticParams()` to pre-render one static page per WP
  entry. `revalidate = 3600` enables ISR — pages refresh in the background at
  most once an hour without a rebuild.
- **Data layer (`lib/wp.ts`).** All REST calls go through `safeFetch`, which
  never throws: on a non-2xx response or network failure it logs the error and
  returns a safe fallback (usually `[]`). This keeps the build from crashing
  when the backend is unavailable.
- **Fallbacks.**
  - Homepage *Latest News* uses live WP posts, falling back to the original
    static news items if the API returns nothing.
  - Missing post/page slugs render the styled `not-found.tsx` (404).
  - Render/data errors surface the styled `error.tsx` boundary with a retry.
- **Design fidelity.** Header, footer, hero, forms, and section markup are
  reproduced verbatim from the source `.dc.html` files (inline styles, fonts,
  colors, spacing preserved). The DC template placeholders (`image-slot`,
  `sc-if`, `sc-for`, `{{ }}`) were resolved into real React.

## Routes / layouts

| Route              | Source                         | Content                                  |
|--------------------|--------------------------------|------------------------------------------|
| `/`                | `app/page.tsx`                 | Homepage; Latest News from WP posts      |
| `/admissions`      | `app/admissions/page.tsx`      | Bespoke design + interactive apply form  |
| `/contact`         | `app/contact/page.tsx`         | Bespoke design + interactive contact form|
| `/posts/[slug]`    | `app/posts/[slug]/page.tsx`    | Single WP post, article layout           |
| `/[slug]`          | `app/[slug]/page.tsx`          | Any other WP page, generic layout        |

`admissions`, `contact`, and `posts` are reserved so the catch-all `/[slug]`
never shadows the bespoke routes.

## Project structure

```
mico-next/
├── app/
│   ├── layout.tsx              # Root layout (fonts, base styles)
│   ├── page.tsx                # Homepage (exact design + WP news)
│   ├── loading.tsx             # Global loading fallback
│   ├── error.tsx               # Global error boundary + retry
│   ├── not-found.tsx           # Styled 404
│   ├── admissions/page.tsx     # Bespoke admissions layout
│   ├── contact/page.tsx        # Bespoke contact layout
│   ├── posts/[slug]/page.tsx   # Dynamic single-post layout (SSG)
│   └── [slug]/page.tsx         # Dynamic WP-page layout (SSG)
├── components/
│   ├── SiteHeader.tsx          # Top bar + gold nav (verbatim design)
│   ├── SiteFooter.tsx          # Footer (verbatim design)
│   ├── PageHero.tsx            # Breadcrumb hero banner
│   ├── WPContent.tsx           # Renders WP content.rendered HTML
│   ├── AdmissionsForm.tsx      # Client form
│   └── ContactForm.tsx         # Client form
├── lib/
│   ├── wp.ts                   # WP REST client, error handling, fallbacks
│   └── types.ts                # WP entity + view-model types
├── public/
│   ├── assets/                 # mico-crest.jpeg, hero-campus.webp
│   └── overhead-ms1ovn97-9ha2.webp
├── styles/globals.css          # Base rules + .wp-content typography
├── next.config.js
├── tsconfig.json
├── package.json
└── .env.example
```

## Configuration

`WP_API_BASE` (env) sets the REST base; defaults to the Mico endpoint. No
trailing slash. To sanitize untrusted WP HTML, add `isomorphic-dompurify` and
sanitize inside `components/WPContent.tsx`.

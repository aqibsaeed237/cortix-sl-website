# Cortix SL — marketing site (sl.techcortix.com)

Next.js 16 (App Router) + Tailwind v4 + Motion. Static page with ISR (60s) so the
founding-member counter from the TechCortix API stays live.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, og:url, sitemap | `https://sl.techcortix.com` |
| `API_URL` / `NEXT_PUBLIC_API_URL` | TechCortix backend | `https://api.techcortix.com` |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Play Store fallback | package `com.techcortix.cortix_sl` |
| `NEXT_PUBLIC_APP_STORE_URL` | App Store link (else iOS waitlist) | — |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics (cookieless) | off |
| `NEXT_PUBLIC_GA_ID` | GA4 (`G-…`; needs a consent banner for EU/UK) | off |

Contact details, store URLs and privacy/terms URLs are also editable in the admin
`app_config` (served by `GET /public/landing`) and override the defaults.

## Where things live

- `app/tokens.css` — design tokens (colors, shadows, layout, motion); `app/globals.css` maps them to Tailwind.
- `i18n/` — locale config + `dictionaries/en.ts` (all copy). See `i18n/config.ts` for adding Urdu/Arabic (RTL-ready).
- `lib/product.ts` — product facts (limits, currencies, plan matrix) sourced from the app/backend code.
- `lib/pricing.ts` — Pro prices per currency; the currency switcher and yearly toggle appear once prices are filled in.
- `lib/testimonials.ts` — permissioned quotes only; section hidden while empty.
- `components/sections/*` — page sections; client components only where interaction needs it.
- `app/privacy`, `app/terms` — drafts; get legal review before setting `privacy_url` / `terms_url` in admin.

## Analytics events

`cta_click`, `store_click`, `waitlist_submit`, `waitlist_signup`, `demo_used`, `pricing_change`, `contact_click`, `theme_toggle` — see `lib/analytics.ts`.

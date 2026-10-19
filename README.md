# Cortix SL — marketing site (sl.techcortix.com)

Next.js 16 (App Router) + Tailwind v4 + Motion. Static page with ISR (60s) so the
founding-member counter from the TechCortix API stays live.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## State — verified 2026-10-10

| | |
| --- | --- |
| Framework | Next **16.2.9** (App Router, Turbopack), Tailwind 4, Motion |
| Branch | `master`, clean, nothing unpushed |
| `npm run build` | **passes** |
| `npx eslint app components lib` | passes (`npx next lint` is gone in this version — do not reach for it) |
| Tests | **None.** No test runner in this repo; the build and eslint are the only gates |
| CI | **None.** No `.github/workflows` here |
| Deploy | Vercel. The site is live at `sl.techcortix.com` |

## What is missing

- **The two deep-link association files are still placeholders.** Re-checked on
  the date above: `public/.well-known/assetlinks.json` still says
  `REPLACE_WITH_PLAY_APP_SIGNING_SHA256` and `apple-app-site-association` still
  says `REPLACE_WITH_…`. **This is the single highest-impact gap in the product**,
  not just in this repo: until both are filled and deployed, invite links and
  password-reset links do not open the app for anyone. Use the Play **App
  Signing** key, not the upload key.
- **No CI and no tests.** A build that breaks is caught by whoever next runs
  `npm run build`. Ten lines of workflow would make it a push-time check.
- **The GA4 consent banner is still a decision, not a fix.** `components/Analytics.tsx`
  loads GA4 with no consent gate; Plausible is cookieless and fine. Needed before
  EU/UK traffic, and it has a real conversion cost, which is why it is being
  decided rather than quietly added.
- **`app/privacy` and `app/terms` are drafts** and have had no legal review. Do not
  set `privacy_url` / `terms_url` in the admin `app_config` until they have.
- **Prices live in two places.** `lib/pricing.ts` here and the Pro prices in the
  app; nothing checks the two agree.
- **The referral landing page has never been exercised end to end.** `/r/<code>`
  ships, but the loop it belongs to (invite → Play Store → install attribution)
  depends on the backend migrations that are not applied yet.

## What is next — developer TODO

1. **Fill the two `.well-known` files** and deploy. The folder's own
   `public/.well-known/README.md` has where each value comes from and the `curl`
   and `adb` commands to verify a deploy. Nothing else in this repo matters as
   much.
2. **Add a CI workflow**: `npm ci && npm run build && npx eslint app components lib`
   on push and PR.
3. **Decide the GA4 banner.** If GA4 stays on for EU/UK, build the gate; if it
   goes off, delete the `NEXT_PUBLIC_GA_ID` path and keep Plausible.
4. **Get the legal pages reviewed**, then point `app_config` at them.
5. **Verify the referral loop** once the backend migrations are applied: a real
   `/r/<code>` visit, through the Play Store, to a credited install.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, og:url, sitemap | `https://sl.techcortix.com` |
| `API_URL` / `NEXT_PUBLIC_API_URL` | TechCortix backend | `https://api.techcortix.com` |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Play Store fallback | package `com.techcortix.cortix_sl` |
| `NEXT_PUBLIC_APP_STORE_URL` | App Store link (else iOS waitlist) | — |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics (cookieless) | off |
| `NEXT_PUBLIC_GA_ID` | GA4 (`G-…`; needs a consent banner for EU/UK) | off |
| `TRUSTED_PROXY_HOPS` | How many proxies in front of this app may be trusted in `X-Forwarded-For`, read by `lib/clientIp.ts`. `1` is correct on Vercel; raising it without a matching number of real proxies lets a client spoof its own IP | `1` |

Contact details, store URLs and privacy/terms URLs are also editable in the admin
`app_config` (served by `GET /public/landing`) and override the defaults.

## Deep links

`public/.well-known/` holds the Android App Link and iOS Universal Link
association files, and **both still contain `REPLACE_WITH_…` placeholders**. Until
they are filled and deployed, invite and password-reset links do not open the app
— they fall through to the browser. `public/.well-known/README.md` says where each
value comes from and has the `curl` and `adb` commands to verify a deploy.

Note the iOS bundle id and the Android package genuinely differ:
`com.techcortix.cortixSl` (camel case, no underscore) against
`com.techcortix.cortix_sl`.

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

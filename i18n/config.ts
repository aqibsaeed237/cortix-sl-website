/**
 * i18n configuration.
 *
 * English ships today. To add Urdu/Arabic:
 *   1. Add the locale to `locales` and create `dictionaries/<locale>.ts`
 *      typed as `Dictionary` (TypeScript will flag missing keys).
 *   2. Move `app/page.tsx` → `app/[lang]/page.tsx`, add `generateStaticParams`
 *      from `locales`, and add a `proxy.ts` that negotiates Accept-Language
 *      (see node_modules/next/dist/docs/01-app/02-guides/internationalization.md).
 *   3. Emit hreflang via `alternates.languages` in metadata (lib/seo.ts).
 *
 * Components already use logical CSS (ms-/me-/ps-/pe-/start/end, text-start),
 * so `dir="rtl"` on <html> flips layouts without per-component changes.
 */

export const locales = ["en"] as const; // TODO(i18n): add "ur", "ar"
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const RTL = new Set<string>(["ar", "ur"]);

export function dirFor(locale: string): "rtl" | "ltr" {
  return RTL.has(locale) ? "rtl" : "ltr";
}

/** BCP-47 tags for <html lang> and Intl formatting. */
export const htmlLang: Record<string, string> = {
  en: "en",
  ur: "ur-PK",
  ar: "ar",
};

/** Replace `{name}` placeholders. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

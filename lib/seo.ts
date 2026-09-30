/** Central SEO config for the Cortix SL marketing site. */

import { APP_CURRENCIES } from "./product";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sl.techcortix.com"
).replace(/\/$/, "");

export const siteName = "Cortix SL";
export const companyName = "Tech Cortix";
export const companyUrl = "https://techcortix.com";

export const seoKeywords = [
  "AI expense tracker",
  "expense tracker app",
  "receipt scanner app",
  "OCR receipt scan",
  "voice expense entry",
  "budget tracker app",
  "personal finance app",
  "spending tracker",
  "split bills app",
  "expense tracker Pakistan",
  "PKR expense tracker",
  "expense tracker UAE",
  "AED expense tracker",
  "Cortix SL",
  "Tech Cortix",
] as const;

export type FaqItem = { q: string; a: string };

/** Serialize JSON-LD safely (escape `<` per Next.js guidance). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function jsonLdSoftwareApplication(opts: {
  description: string;
  playStoreUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Android",
    url: siteUrl,
    installUrl: opts.playStoreUrl,
    downloadUrl: opts.playStoreUrl,
    image: `${siteUrl}/opengraph-image`,
    description: opts.description,
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      name: "Free plan",
      price: "0",
      priceCurrency: "PKR",
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    featureList: [
      "Receipt scanning (OCR)",
      "Voice and AI text expense entry",
      "Ask AI about your spending",
      "Budgets and spending alerts",
      "Analytics and category breakdown",
      "Split bills",
      "CSV, Excel and PDF export",
      `Display currencies: ${APP_CURRENCIES.join(", ")}`,
    ],
  };
}

export function jsonLdOrganization(opts: { email: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: companyName,
    url: companyUrl,
    logo: `${siteUrl}/icon.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: opts.email,
      availableLanguage: ["English", "Urdu"],
    },
    // TODO(seo): add official social profiles (LinkedIn, X, Instagram…)
    sameAs: [] as string[],
  };
}

export function jsonLdWebSite(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function jsonLdFaq(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

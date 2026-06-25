/** Central SEO config for Cortix SL marketing site */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://cortix.app";

export const siteName = "Cortix SL";
export const companyName = "Tech Cortix";

export const seoKeywords = [
  "expense tracker app",
  "AI expense tracker",
  "receipt scanner app",
  "OCR receipt scan",
  "voice expense entry",
  "budget tracker app",
  "PKR expense tracker",
  "expense tracker Pakistan",
  "personal finance app",
  "small business expense tracking",
  "spending tracker",
  "receipt to expense app",
  "smart analytics expenses",
  "export expense reports",
  "Cortix SL",
  "Tech Cortix",
  "founding member expense app",
  "ledger app",
  "spend management app",
] as const;

export const defaultTitle =
  "Cortix SL — AI Expense Tracker App | OCR Receipt Scan & Budget Alerts";

export const defaultDescription =
  "Cortix SL is an AI-powered expense tracker for Pakistan and beyond. Scan receipts with OCR, add expenses by voice, set budgets, get smart analytics, and export CSV/PDF reports. Free & Pro plans.";

export const ogImage = `${siteUrl}/og-image.png`;

export function jsonLdSoftwareApplication() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Android, iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
    },
    description: defaultDescription,
    keywords: seoKeywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: companyName,
      url: siteUrl,
    },
    featureList: [
      "OCR receipt scanning",
      "Voice expense entry",
      "AI search",
      "Budget alerts",
      "Expense analytics",
      "CSV Excel PDF export",
    ],
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    sameAs: [] as string[],
  };
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

import { Footer } from "@/components/Footer";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Navbar } from "@/components/Navbar";
import { Compare } from "@/components/sections/Compare";
import { Demo } from "@/components/sections/Demo";
import { FactsBar } from "@/components/sections/FactsBar";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Feedback } from "@/components/sections/Feedback";
import { FeedbackCta } from "@/components/sections/FeedbackCta";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Screens } from "@/components/sections/Screens";
import { Security } from "@/components/sections/Security";
import { Steps } from "@/components/sections/Steps";
import { Waitlist } from "@/components/sections/Waitlist";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { defaultLocale, fmt } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLanding } from "@/lib/landing";
import { FREE_LIMITS } from "@/lib/product";
import {
  jsonLdFaq,
  jsonLdOrganization,
  jsonLdSoftwareApplication,
  jsonLdString,
  jsonLdWebSite,
} from "@/lib/seo";

// Static page, founding counter refreshed in the background every 60s (ISR).
export const revalidate = 60;

export default async function Home() {
  const t = getDictionary(defaultLocale);
  const landing = await getLanding();
  const c = landing.contact;

  const privacyHref = c.privacy_url || "/privacy";
  const termsHref = c.terms_url || "/terms";

  const faqItems = t.faq.items.map((i) => ({
    q: i.q,
    a: fmt(i.a, {
      entries: FREE_LIMITS.entriesPerMonth,
      limit: landing.founding_limit,
      months: landing.founding_months,
    }),
  }));

  const jsonLd = [
    jsonLdSoftwareApplication({ description: t.meta.description, playStoreUrl: c.play_store_url }),
    jsonLdOrganization({ email: c.email }),
    jsonLdWebSite(t.meta.description),
    jsonLdFaq(faqItems),
  ];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(block) }} />
      ))}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-accent-fg"
      >
        {t.skipToContent}
      </a>

      <Navbar labels={t.nav} playStoreUrl={c.play_store_url} />

      <main id="main">
        <Hero t={t} landing={landing} />
        <FactsBar t={t} landing={landing} />
        <Features t={t} />
        <Demo t={t} />
        <Screens t={t} />
        <Steps t={t} />
        <Compare t={t} />
        <Pricing t={t} landing={landing} />
        <Feedback t={t} />
        <FeedbackCta t={t} />
        <Security t={t} privacyHref={privacyHref} />
        <Faq eyebrow={t.faq.eyebrow} title={t.faq.title} items={faqItems} />
        <Waitlist t={t} landing={landing} />
        <FinalCta t={t} landing={landing} />
      </main>

      <Footer t={t} landing={landing} privacyHref={privacyHref} termsHref={termsHref} />
      <MobileCtaBar playStoreUrl={c.play_store_url} labels={t.mobileCta} />
      <RevealObserver />
    </>
  );
}

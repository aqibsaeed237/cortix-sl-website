import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLanding } from "@/lib/landing";

export const metadata: Metadata = {
  title: "Send feedback",
  description:
    "Share bugs, feature ideas, pricing thoughts and suggestions for Cortix SL. We read every message.",
  alternates: { canonical: "/feedback" },
};

export default async function FeedbackPage() {
  const t = getDictionary(defaultLocale);
  const landing = await getLanding();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
        <div className="container-page flex h-(--nav-h) items-center justify-between">
          <Link href="/" className="rounded-lg" aria-label="Cortix SL home">
            <Logo byline={t.nav.byline} />
          </Link>
          <ThemeToggle toDarkLabel={t.nav.themeToDark} toLightLabel={t.nav.themeToLight} />
        </div>
      </header>
      <main id="main" className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden /> Back to home
          </Link>
          <h1 className="text-h2 font-semibold text-fg">{t.feedbackForm.title}</h1>
          <p className="mt-3 text-[15px] text-muted">{t.feedbackForm.body}</p>
          <div className="mt-10">
            <FeedbackForm t={t.feedbackForm} />
          </div>
        </div>
      </main>
      <Footer t={t} landing={landing} privacyHref="/privacy" termsHref="/terms" onHome={false} />
    </>
  );
}

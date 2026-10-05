import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLanding } from "@/lib/landing";
import { Footer } from "./Footer";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./ui/Logo";

export async function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
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
        <article className="mx-auto max-w-3xl">
          <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden /> Back to home
          </Link>
          <h1 className="text-h2 font-semibold text-fg">{title}</h1>
          <p className="mt-3 text-sm text-subtle">Last updated: {updated}</p>
          <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_li]:ms-5 [&_li]:list-disc [&_li]:ps-1 [&_strong]:text-fg [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </main>
      <Footer t={t} landing={landing} privacyHref="/privacy" termsHref="/terms" onHome={false} />
    </>
  );
}

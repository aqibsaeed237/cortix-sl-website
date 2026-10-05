import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { Reveal } from "../ui/Reveal";

/** Always-visible CTA so visitors can submit product feedback. */
export function FeedbackCta({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="feedback-cta-title" className="section-y">
      <div className="container-page">
        <Reveal className="glass rounded-2xl px-6 py-10 md:flex md:items-center md:justify-between md:gap-10 md:px-10">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold tracking-wide text-accent">{t.feedback.eyebrow}</p>
            <h2 id="feedback-cta-title" className="text-h2 font-semibold text-fg text-balance">
              {t.feedback.ctaTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.feedback.ctaBody}</p>
          </div>
          <div className="mt-6 shrink-0 md:mt-0">
            <Link href="/feedback" className="btn btn-primary btn-lg">
              {t.feedback.ctaButton}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

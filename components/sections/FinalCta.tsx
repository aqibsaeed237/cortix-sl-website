import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Landing } from "@/lib/landing";
import { TrackedLink } from "../ui/TrackedLink";

export function FinalCta({ t, landing }: { t: Dictionary; landing: Landing }) {
  const c = t.finalCta;
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:var(--gradient-hero)]" />
      <div className="container-page section-y relative text-center">
        <h2 id="final-cta-title" className="text-display mx-auto max-w-3xl font-semibold text-balance">
          <span className="text-gradient">{c.title}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lead text-muted">{c.body}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href={landing.contact.play_store_url}
            behavior="play"
            event="store_click"
            eventProps={{ store: "play", location: "final_cta" }}
            className="btn btn-primary btn-lg"
          >
            {c.primary}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </TrackedLink>
          <TrackedLink
            href="#get-app"
            behavior="waitlist"
            event="cta_click"
            eventProps={{ location: "final_cta", target: "ios_waitlist" }}
            className="btn btn-secondary btn-lg"
          >
            {c.secondary}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

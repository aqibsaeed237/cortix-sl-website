import type { Dictionary } from "@/i18n/dictionaries/en";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";

export function Steps({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="steps-title" className="section-y border-t border-line cv-auto">
      <div className="container-page">
        <SectionHeader id="steps-title" eyebrow={t.steps.eyebrow} title={t.steps.title} />
        <ol className="grid gap-4 md:grid-cols-3">
          {t.steps.items.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.08} className="glass rounded-xl p-7">
              <span className="mb-5 flex size-10 items-center justify-center rounded-full border border-accent/40 font-mono text-sm font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 font-semibold text-fg">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

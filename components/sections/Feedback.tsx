import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { TESTIMONIALS } from "@/lib/testimonials";
import { Reveal } from "../ui/Reveal";
import { SectionHeader } from "../ui/SectionHeader";

/** Renders nothing until real, permissioned quotes exist in lib/testimonials.ts. */
export function Feedback({ t }: { t: Dictionary }) {
  const items = TESTIMONIALS.filter((x) => x.consent);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="feedback-title" className="section-y">
      <div className="container-page">
        <SectionHeader id="feedback-title" eyebrow={t.feedback.eyebrow} title={t.feedback.title} />
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((x, i) => (
            <Reveal as="li" key={x.name} delay={i * 0.06} className="glass flex flex-col rounded-xl p-7">
              <blockquote className="flex-1 text-[15px] leading-relaxed text-fg">“{x.quote}”</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Image src={x.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-fg">{x.name}</p>
                  <p className="text-sm text-muted">{x.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

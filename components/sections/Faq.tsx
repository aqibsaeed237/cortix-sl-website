import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/seo";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * Native <details>/<summary> accordion: keyboard and screen-reader
 * accessible with zero JS, and the answers stay in the HTML for search.
 */
export function Faq({ eyebrow, title, items }: { eyebrow: string; title: string; items: FaqItem[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y cv-auto">
      <div className="container-page">
        <SectionHeader id="faq-title" eyebrow={eyebrow} title={title} />
        <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.q} name="faq" className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-start text-base font-medium text-fg marker:hidden md:text-lg [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  className="size-5 shrink-0 text-subtle transition-transform duration-200 group-open:rotate-45 group-open:text-accent"
                  aria-hidden
                />
              </summary>
              <p className="-mt-1 pe-10 pb-6 text-[15px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

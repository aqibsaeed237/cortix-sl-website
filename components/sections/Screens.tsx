import addExpense from "@/public/screenshots/add-expense.png";
import aiSearch from "@/public/screenshots/ai-search.png";
import analytics from "@/public/screenshots/analytics.png";
import budget from "@/public/screenshots/budget.png";
import exportScreen from "@/public/screenshots/export.png";
import home from "@/public/screenshots/home.png";
import report from "@/public/screenshots/report.png";
import splitBills from "@/public/screenshots/split-balances.png";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeader } from "../ui/SectionHeader";
import { ScreensCarousel } from "./ScreensCarousel";

const SOURCES = { home, addExpense, aiSearch, analytics, budget, splitBills, report, export: exportScreen };

export function Screens({ t }: { t: Dictionary }) {
  const s = t.screens;
  const slides = s.items.map((i) => ({
    src: SOURCES[i.key as keyof typeof SOURCES],
    label: i.label,
    alt: i.alt,
  }));
  return (
    <section aria-labelledby="screens-title" className="section-y overflow-hidden cv-auto">
      <div className="container-page">
        <SectionHeader id="screens-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ScreensCarousel slides={slides} labels={s} />
      </div>
    </section>
  );
}

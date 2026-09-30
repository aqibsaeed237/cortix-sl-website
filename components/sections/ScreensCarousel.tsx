"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { src: StaticImageData; label: string; alt: string };

/**
 * WAI-ARIA carousel pattern: region + roledescription, labelled slides,
 * prev/next buttons, native scroll-snap (swipe/trackpad/keyboard scroll),
 * no auto-rotation. Images lazy-load at ≤ 2× their 220px render width.
 */
export function ScreensCarousel({
  slides,
  labels,
}: {
  slides: Slide[];
  labels: { prev: string; next: string; carouselLabel: string; slideOf: string };
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + 20 : 1;
    const x = Math.abs(el.scrollLeft); // RTL scrollLeft is negative
    setIndex(Math.min(slides.length - 1, Math.round(x / step)));
    setAtStart(x < 4);
    setAtEnd(x + el.clientWidth >= el.scrollWidth - 4);
  }, [slides.length]);

  useEffect(() => {
    onScroll();
    const el = track.current;
    el?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  function go(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.carouselLabel}>
      <div
        ref={track}
        className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-(--gutter) px-(--gutter) pb-4"
      >
        {slides.map((s, i) => (
          <div
            key={s.label}
            role="group"
            aria-roledescription="slide"
            aria-label={`${labels.slideOf.replace("{n}", String(i + 1)).replace("{total}", String(slides.length))}: ${s.label}`}
            className="w-[220px] shrink-0 snap-start"
          >
            <figure>
              <div className="overflow-hidden rounded-[28px] border border-line bg-black shadow-md">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={220}
                  height={490}
                  placeholder="blur"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm font-medium text-muted">{s.label}</figcaption>
            </figure>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label={labels.prev}
          className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:bg-surface-hover disabled:opacity-40"
        >
          <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
        </button>
        <p className="min-w-16 text-center text-sm tabular-nums text-subtle" aria-live="polite">
          {index + 1} / {slides.length}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={atEnd}
          aria-label={labels.next}
          className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:bg-surface-hover disabled:opacity-40"
        >
          <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}

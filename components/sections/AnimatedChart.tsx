"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";

const BARS = [38, 62, 45, 80, 54, 92, 68];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Weekly spend bars that grow in when scrolled into view (decorative). */
export function AnimatedChart() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="mt-5 flex h-28 items-end gap-2" aria-hidden>
          {BARS.map((h, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <m.div
                className={`w-full rounded-t-[4px] ${i === 5 ? "bg-accent" : "bg-accent/35"}`}
                style={{ height: `${h}%`, originY: 1 }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="text-[10px] text-subtle">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

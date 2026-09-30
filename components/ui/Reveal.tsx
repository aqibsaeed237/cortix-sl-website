import type { ReactNode } from "react";

/**
 * Scroll-reveal without per-element JS: server-rendered markup with a
 * `.reveal` class; one IntersectionObserver (RevealObserver) adds
 * `.is-visible`. Visible by default without JS or with reduced motion
 * (see globals.css). Use below the fold only — never on the LCP element.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = as;
  return (
    <Comp
      data-reveal
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Comp>
  );
}

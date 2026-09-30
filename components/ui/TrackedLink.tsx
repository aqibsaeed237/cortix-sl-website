"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/analytics";
import { openPlayStore, scrollToGetApp } from "@/lib/storeLinks";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> & {
  href: string;
  event: string;
  eventProps?: Record<string, string>;
  /** "play" opens the Play Store app on Android; "waitlist" scrolls + focuses the iOS form. */
  behavior?: "play" | "waitlist";
  children: ReactNode;
};

/** Anchor that records an analytics event; works as a normal link without JS. */
export function TrackedLink({ href, event, eventProps = {}, behavior, children, ...rest }: Props) {
  const external = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
  return (
    <a
      href={href}
      {...(external && href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        if (behavior === "play") {
          e.preventDefault();
          openPlayStore(href);
        } else if (behavior === "waitlist") {
          e.preventDefault();
          scrollToGetApp();
        }
      }}
    >
      {children}
    </a>
  );
}

"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/analytics";
import { openPlayStore, scrollToGetApp } from "@/lib/storeLinks";
import { websitePlayUrl } from "@/lib/utm";

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
  // A Play link carries its placement into Play Console; `location` is already
  // the placement this link reports to analytics, so the two stay in step.
  const placement = eventProps.location ?? "site";
  const resolvedHref = behavior === "play" ? websitePlayUrl(href, placement) : href;
  return (
    <a
      href={resolvedHref}
      {...(external && href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        if (behavior === "play") {
          e.preventDefault();
          openPlayStore(href, placement);
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

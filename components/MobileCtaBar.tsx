"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { openPlayStore, scrollToGetApp } from "@/lib/storeLinks";
import { websitePlayUrl } from "@/lib/utm";

/**
 * Sticky bottom CTA on phones. Appears once the hero CTA scrolls out of view
 * and hides again when the waitlist or final CTA is on screen (no double CTAs).
 */
export function MobileCtaBar({
  playStoreUrl,
  labels,
}: {
  playStoreUrl: string;
  labels: { primary: string; secondary: string };
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const blockers = ["get-app", "final-cta"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!hero) return;

    let heroOut = false;
    const blocking = new Set<Element>();
    const update = () => setVisible(heroOut && blocking.size === 0);

    const heroObs = new IntersectionObserver(([entry]) => {
      heroOut = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const blockObs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) blocking.add(e.target);
        else blocking.delete(e.target);
      }
      update();
    });
    heroObs.observe(hero);
    blockers.forEach((b) => blockObs.observe(b));
    return () => {
      heroObs.disconnect();
      blockObs.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/85 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <a
          href={websitePlayUrl(playStoreUrl, "mobile_bar")}
          className="btn btn-primary flex-1"
          onClick={(e) => {
            e.preventDefault();
            track("store_click", { store: "play", location: "mobile_bar" });
            openPlayStore(playStoreUrl, "mobile_bar");
          }}
        >
          {labels.primary}
        </a>
        <a
          href="#get-app"
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            track("cta_click", { location: "mobile_bar", target: "ios_waitlist" });
            scrollToGetApp();
          }}
        >
          {labels.secondary}
        </a>
      </div>
    </div>
  );
}

"use client";

import { Smartphone } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  GET_APP_SECTION_ID,
  openPlayStore,
  playStoreLink,
  resolveAppStoreUrl,
  scrollToGetApp,
} from "@/lib/storeLinks";

type Labels = {
  playLabel: string;
  appStoreLabel: string;
  iosSoon: string;
  iosSoonLabel: string;
};

type StoreBadgesProps = {
  appStoreUrl?: string;
  playStoreUrl?: string;
  height?: number;
  location: string;
  labels: Labels;
};

const badgeClass =
  "inline-block rounded-[10px] leading-none transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97]";

export function StoreBadges({
  appStoreUrl,
  playStoreUrl,
  height = 48,
  location,
  labels,
}: StoreBadgesProps) {
  const width = Math.round(height * (155 / 46));
  const play = playStoreLink(playStoreUrl, location);
  const appStore = resolveAppStoreUrl(appStoreUrl);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={play.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.playLabel}
        className={badgeClass}
        onClick={(e) => {
          e.preventDefault();
          track("store_click", { store: "play", location });
          openPlayStore(play.href, location);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- official SVG badge */}
        <img src="/badges/google-play.svg" alt="" width={width} height={height} draggable={false} />
      </a>

      {appStore ? (
        <a
          href={appStore}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.appStoreLabel}
          className={badgeClass}
          onClick={() => track("store_click", { store: "app_store", location })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- official SVG badge */}
          <img src="/badges/app-store.svg" alt="" width={width} height={height} draggable={false} />
        </a>
      ) : (
        // No App Store listing yet: don't show Apple's "Download" badge
        // (misleading + against Apple's badge guidelines). Link to the waitlist.
        <a
          href={`#${GET_APP_SECTION_ID}`}
          style={{ height, minWidth: width }}
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line-strong px-4 text-sm font-medium text-muted transition-colors hover:border-subtle hover:text-fg"
          onClick={(e) => {
            e.preventDefault();
            track("store_click", { store: "ios_waitlist", location });
            scrollToGetApp();
          }}
        >
          <Smartphone className="size-4" aria-hidden />
          {labels.iosSoon}
          <span className="sr-only"> — {labels.iosSoonLabel}</span>
        </a>
      )}
    </div>
  );
}

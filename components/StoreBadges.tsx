"use client";

import type { CSSProperties, FocusEvent, MouseEvent } from "react";
import {
  appStoreLink,
  openPlayStore,
  playStoreLink,
  scrollToGetApp,
} from "@/lib/storeLinks";

type StoreBadgesProps = {
  appStoreUrl?: string;
  playStoreUrl?: string;
  height?: number;
};

const badgeLinkStyle: CSSProperties = {
  display: "inline-block",
  lineHeight: 0,
  cursor: "pointer",
  borderRadius: 8,
  transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
  outline: "none",
};

function onBadgeEnter(e: MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.22)";
}

function onBadgeLeave(e: MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "none";
}

function onBadgeFocus(e: FocusEvent<HTMLAnchorElement>) {
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.55)";
}

function onBadgeBlur(e: FocusEvent<HTMLAnchorElement>) {
  e.currentTarget.style.boxShadow = "none";
}

function BadgeImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG badges render reliably with <img>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      draggable={false}
      style={{ display: "block", width, height, pointerEvents: "none" }}
    />
  );
}

export function StoreBadges({
  appStoreUrl,
  playStoreUrl,
  height = 44,
}: StoreBadgesProps) {
  const width = Math.round(height * (155 / 46));
  const play = playStoreLink(playStoreUrl);
  const app = appStoreLink(appStoreUrl);

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <a
        href={app.href}
        target={app.external ? "_blank" : undefined}
        rel={app.external ? "noopener noreferrer" : undefined}
        title={app.label}
        aria-label={app.label}
        style={badgeLinkStyle}
        onMouseEnter={onBadgeEnter}
        onMouseLeave={onBadgeLeave}
        onFocus={onBadgeFocus}
        onBlur={onBadgeBlur}
        onClick={(e) => {
          if (!app.external) {
            e.preventDefault();
            scrollToGetApp();
          }
        }}
      >
        <BadgeImage
          src="/badges/app-store.svg"
          alt="Download on the App Store"
          width={width}
          height={height}
        />
      </a>

      <a
        href={play.href}
        target="_blank"
        rel="noopener noreferrer"
        title={play.label}
        aria-label={play.label}
        style={badgeLinkStyle}
        onMouseEnter={onBadgeEnter}
        onMouseLeave={onBadgeLeave}
        onFocus={onBadgeFocus}
        onBlur={onBadgeBlur}
        onClick={(e) => {
          e.preventDefault();
          openPlayStore(play.href);
        }}
      >
        <BadgeImage
          src="/badges/google-play.svg"
          alt="Get it on Google Play"
          width={width}
          height={height}
        />
      </a>
    </div>
  );
}

/** Single Google Play badge (e.g. after waitlist success). */
export function PlayStoreBadge({
  playStoreUrl,
  height = 40,
}: {
  playStoreUrl?: string;
  height?: number;
}) {
  const width = Math.round(height * (155 / 46));
  const play = playStoreLink(playStoreUrl);

  return (
    <a
      href={play.href}
      target="_blank"
      rel="noopener noreferrer"
      title={play.label}
      aria-label={play.label}
      style={badgeLinkStyle}
      onMouseEnter={onBadgeEnter}
      onMouseLeave={onBadgeLeave}
      onFocus={onBadgeFocus}
      onBlur={onBadgeBlur}
      onClick={(e) => {
        e.preventDefault();
        openPlayStore(play.href);
      }}
    >
      <BadgeImage
        src="/badges/google-play.svg"
        alt="Get it on Google Play"
        width={width}
        height={height}
      />
    </a>
  );
}

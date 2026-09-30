"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { openPlayStore } from "@/lib/storeLinks";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./ui/Logo";

type NavLabels = {
  features: string;
  demo: string;
  pricing: string;
  faq: string;
  getApp: string;
  openMenu: string;
  closeMenu: string;
  themeToDark: string;
  themeToLight: string;
  byline: string;
};

export function Navbar({ labels, playStoreUrl }: { labels: NavLabels; playStoreUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "#features", label: labels.features },
    { href: "#demo", label: labels.demo },
    { href: "#pricing", label: labels.pricing },
    { href: "#faq", label: labels.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const getApp = (location: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track("store_click", { store: "play", location });
    openPlayStore(playStoreUrl);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-line bg-bg/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="container-page flex h-(--nav-h) items-center justify-between gap-4">
        <a href="#top" className="rounded-lg" aria-label="Cortix SL — back to top">
          <Logo byline={labels.byline} />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle toDarkLabel={labels.themeToDark} toLightLabel={labels.themeToLight} />
          <a
            href={playStoreUrl}
            onClick={getApp("nav")}
            className="btn btn-primary ms-1 hidden !min-h-10 text-sm sm:inline-flex"
          >
            {labels.getApp}
          </a>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="container-page pb-4 md:hidden">
        <ul className="glass rounded-lg p-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-md px-4 text-base font-medium text-fg hover:bg-surface-hover"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="p-2">
            <a href={playStoreUrl} onClick={getApp("nav_mobile")} className="btn btn-primary w-full">
              {labels.getApp}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

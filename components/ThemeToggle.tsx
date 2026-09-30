"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function ThemeToggle({
  toDarkLabel,
  toLightLabel,
}: {
  toDarkLabel: string;
  toLightLabel: string;
}) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked — theme still applies for this visit */
    }
    listeners.forEach((l) => l());
    track("theme_toggle", { theme: next });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "dark" ? toDarkLabel : toLightLabel}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-fg"
    >
      {theme === "dark" ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}

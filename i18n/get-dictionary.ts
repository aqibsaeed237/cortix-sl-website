import "server-only";
import type { Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

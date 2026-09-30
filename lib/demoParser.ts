/**
 * Tiny in-browser expense parser for the landing-page demo only.
 * The real app sends text to the backend, which uses Google Gemini.
 */

import { DEFAULT_CATEGORIES } from "./product";

export type DemoCategory = (typeof DEFAULT_CATEGORIES)[number];

export type ParsedExpense = {
  amount: number;
  currency: string;
  merchant: string | null;
  category: DemoCategory;
};

const CURRENCY_TOKENS: [RegExp, string][] = [
  [/\$|\busd\b|\bdollars?\b/i, "USD"],
  [/£|\bgbp\b|\bpounds?\b/i, "GBP"],
  [/€|\beur\b|\beuros?\b/i, "EUR"],
  [/\baed\b|\bdirhams?\b|\bdhs?\b/i, "AED"],
  [/\bsar\b|\briyals?\b/i, "SAR"],
  [/₹|\binr\b/i, "INR"],
  [/\bcad\b/i, "CAD"],
  [/\baud\b/i, "AUD"],
  [/\bpkr\b|\brs\.?|\brupees?\b/i, "PKR"],
];

const CATEGORY_KEYWORDS: [DemoCategory, RegExp][] = [
  ["Food & Dining", /\b(kfc|mcdonald|pizza|burger|lunch|dinner|breakfast|coffee|cafe|restaurant|food|groceries|grocery|carrefour|lulu|tesco|imtiaz|chai|biryani|meal|snack)\b/i],
  ["Transport", /\b(uber|careem|bykea|taxi|cab|fuel|petrol|diesel|metro|bus|train|parking|toll|indrive)\b/i],
  ["Shopping", /\b(amazon|daraz|noon|clothes|shoes|mall|shopping|zara|khaadi|outfitters)\b/i],
  ["Bills & Utilities", /\b(electricity|gas|water|internet|wifi|bill|rent|mobile|phone|k-electric|lesco|dewa|ptcl)\b/i],
  ["Entertainment", /\b(netflix|spotify|cinema|movie|youtube|game|concert|disney|prime)\b/i],
  ["Health", /\b(pharmacy|doctor|medicine|hospital|clinic|gym|dentist)\b/i],
  ["Travel", /\b(flight|airport|hotel|airbnb|emirates|pia|booking|visa|trip)\b/i],
  ["Education", /\b(course|book|books|tuition|school|udemy|coursera|university|fees)\b/i],
];

export function parseExpense(input: string, fallbackCurrency = "PKR"): ParsedExpense | null {
  const text = input.trim();
  if (!text) return null;

  const num = text.match(/(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?\s*(k)?\b/i);
  if (!num) return null;
  let amount = Number(num[1].replace(/,/g, "") + (num[2] ? `.${num[2]}` : ""));
  if (num[3]) amount *= 1000;
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const currency = CURRENCY_TOKENS.find(([re]) => re.test(text))?.[1] ?? fallbackCurrency;
  const category = CATEGORY_KEYWORDS.find(([, re]) => re.test(text))?.[0] ?? "Other";

  // Merchant: word(s) after "at"/"from"/"to", or a known brand keyword.
  const at = text.match(/\b(?:at|from|@)\s+([A-Za-z][\w&'.-]*(?:\s+[A-Z][\w&'.-]*)*)/);
  const brand = text.match(/\b(kfc|uber|careem|netflix|spotify|amazon|daraz|carrefour|starbucks|mcdonald'?s)\b/i);
  const merchantRaw = at?.[1] ?? brand?.[1] ?? null;
  const merchant = merchantRaw
    ? merchantRaw.length <= 4
      ? merchantRaw.toUpperCase()
      : merchantRaw.charAt(0).toUpperCase() + merchantRaw.slice(1)
    : null;

  return { amount, currency, merchant, category };
}

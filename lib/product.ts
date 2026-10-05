/**
 * Product facts shown on the marketing site.
 *
 * Every value here is taken from the shipping code, not marketing guesses.
 * Source of truth is noted next to each block — update both together.
 */

/** cortix-sl/lib/utils/currency_config.dart — display currencies in the app. */
export const APP_CURRENCIES = [
  "PKR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "INR",
  "CAD",
  "AUD",
] as const;

/** cortix-sl/lib/core/constants/default_categories.dart */
export const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Bills & Utilities",
  "Entertainment",
  "Health",
  "Travel",
  "Education",
  "Other",
] as const;

/** cortix-sl-backend/app/core/constants.py */
export const FREE_LIMITS = {
  entriesPerMonth: 50,
  splitGroups: 2,
  membersPerGroup: 5,
} as const;

/**
 * Founding defaults — used only when the live API is unreachable.
 * Live values come from GET /public/landing (founding_limit / founding_months).
 * cortix-sl-backend/app/core/config.py: FOUNDING_MEMBER_LIMIT=100, _MONTHS=12
 */
export const FOUNDING_DEFAULTS = {
  limit: 100,
  months: 12,
} as const;

/** Platforms. iOS has no App Store listing yet (app_store_url is empty). */
export const PLATFORMS = {
  android: true,
  ios: false,
} as const;

/** Upgrades to Pro are activated manually by the team (support.py upgrade_message). */
export const UPGRADE_IS_MANUAL = true;

/**
 * Feature matrix. `free`/`pro`/`founding` mirror the backend feature_flags
 * (init_schema.sql, split_bills.sql) and access_service.py (founding == Pro).
 */
export type PlanCell = boolean | string;

export type ComparisonRow = {
  feature: string;
  free: PlanCell;
  pro: PlanCell;
  founding: PlanCell;
};

export const PLAN_COMPARISON: ComparisonRow[] = [
  {
    feature: "Expense entries",
    free: `${FREE_LIMITS.entriesPerMonth} / month`,
    pro: "Unlimited",
    founding: "Unlimited",
  },
  { feature: "Manual entry & 9 smart categories", free: true, pro: true, founding: true },
  { feature: "Budgets, alerts & month-end forecast", free: true, pro: true, founding: true },
  { feature: "Recurring bills", free: true, pro: true, founding: true },
  { feature: "Paste a bank SMS and confirm each row", free: true, pro: true, founding: true },
  { feature: "Analytics (daily → yearly)", free: true, pro: true, founding: true },
  { feature: "Keyword search", free: true, pro: true, founding: true },
  { feature: "9 display currencies, light & dark mode", free: true, pro: true, founding: true },
  {
    feature: "Split bills",
    free: `${FREE_LIMITS.splitGroups} groups · ${FREE_LIMITS.membersPerGroup} people`,
    pro: "Unlimited groups",
    founding: "Unlimited groups",
  },
  { feature: "Receipt scan (OCR)", free: false, pro: true, founding: true },
  { feature: "Voice & AI text entry", free: false, pro: true, founding: true },
  { feature: "Ask AI about your spending", free: false, pro: true, founding: true },
  { feature: "AI bill splitting", free: false, pro: true, founding: true },
  { feature: "Export to CSV, Excel & PDF", free: false, pro: true, founding: true },
];

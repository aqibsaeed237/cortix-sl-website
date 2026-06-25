"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchLandingData,
  formatFetchError,
  formatUserCount,
  isValidEmail,
  submitWaitlist,
} from "@/lib/api";
import type { LandingData, WaitlistResult } from "@/lib/types";

const POLL_MS = 30_000;

const FALLBACK: LandingData = {
  founding_limit: 100,
  founding_claimed: 0,
  founding_remaining: 100,
  founding_months: 12,
  total_users: 0,
  waitlist_count: 0,
  spots_available: true,
  contact: {
    company_name: "Tech Cortix",
    product_name: "Cortix SL",
    email: "contact@techcortix.com",
    phone: "+923116124245",
    whatsapp: "+923116124245",
    app_store_url: "",
    play_store_url: "https://play.google.com/store/apps/details?id=com.techcortix.cortix_sl",
    privacy_url: "",
    terms_url: "",
  },
};

export function useLandingData() {
  const [data, setData] = useState<LandingData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchLandingData();
      setData(next);
      setError(null);
    } catch (err) {
      setError(formatFetchError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  const joinWaitlist = useCallback(
    async (email: string): Promise<WaitlistResult> => {
      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address.");
      }
      try {
        const result = await submitWaitlist(email);
        await refresh();
        return result;
      } catch (err) {
        throw new Error(formatFetchError(err));
      }
    },
    [refresh],
  );

  const signupLabel = formatUserCount(
    Math.max(data.total_users, data.waitlist_count),
  );

  return {
    data,
    loading,
    error,
    refresh,
    joinWaitlist,
    signupLabel,
  };
}

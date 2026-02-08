"use client";

import { useEffect, useState } from "react";

interface OilTopHolderData {
  solValue: number | null;
  usdValue: number | null;
  topHolderBalance: number | null; // OIL token amount
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch the SOL value of the top OIL token holder (OIL Reserve metric).
 * @param refetchIntervalMs - Refetch interval in ms (default 2 min)
 */
export function useOilTopHolder(
  refetchIntervalMs = 120_000
): OilTopHolderData {
  const [data, setData] = useState<OilTopHolderData>({
    solValue: null,
    usdValue: null,
    topHolderBalance: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/oil-top-holder");
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error ?? `HTTP ${response.status}`);
        }

        if (isMounted) {
          setData({
            solValue: json.solValue ?? null,
            usdValue: json.usdValue ?? null,
            topHolderBalance: json.topHolderBalance ?? null,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error("[useOilTopHolder] Error:", err);
        if (isMounted) {
          setData({
            solValue: null,
            usdValue: null,
            topHolderBalance: null,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, refetchIntervalMs);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [refetchIntervalMs]);

  return data;
}

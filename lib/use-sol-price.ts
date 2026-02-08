"use client";

import { useEffect, useState } from "react";

interface SolPriceData {
  price: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and cache SOL price from the API.
 * @param refetchIntervalMs - Refetch interval in ms (default 60s)
 */
export function useSolPrice(refetchIntervalMs = 60_000): SolPriceData {
  const [data, setData] = useState<SolPriceData>({
    price: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchPrice = async () => {
      try {
        const response = await fetch("/api/sol-price");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        if (isMounted) {
          setData({ price: json.price, loading: false, error: null });
        }
      } catch (err) {
        console.error("[useSolPrice] Error:", err);
        if (isMounted) {
          setData({
            price: null,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    };

    // Initial fetch
    fetchPrice();

    intervalId = setInterval(fetchPrice, refetchIntervalMs);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [refetchIntervalMs]);

  return data;
}

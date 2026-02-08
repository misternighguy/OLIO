"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const REFETCH_INTERVAL_MS = 15_000;

export interface SolBalanceData {
  balance: number | null;
  loading: boolean;
  error: string | null;
}

export function useSolBalance(
  refetchIntervalMs = REFETCH_INTERVAL_MS,
): SolBalanceData {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || !connected) {
      setBalance(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchBalance() {
      if (!publicKey) return;
      try {
        setLoading(true);
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) {
          setBalance(lamports / LAMPORTS_PER_SOL);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch SOL balance:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch balance");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBalance();
    const id = setInterval(fetchBalance, refetchIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [publicKey, connected, connection, refetchIntervalMs]);

  return { balance, loading, error };
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey as toUmiPublicKey } from "@metaplex-foundation/umi";
import type { Umi } from "@metaplex-foundation/umi";

const LAMPORTS_PER_SOL = 1_000_000_000;
const REFETCH_INTERVAL_MS = 15_000;
const MAINNET_RPC = "https://api.mainnet-beta.solana.com";

export interface SolBalanceData {
  /** SOL balance (human-readable, e.g. 1.5) or null when unknown */
  balance: number | null;
  loading: boolean;
  error: string | null;
}

export function useSolBalance(
  refetchIntervalMs = REFETCH_INTERVAL_MS,
): SolBalanceData {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const umiRef = useRef<Umi | null>(null);

  // Lazily create the Umi instance once
  if (!umiRef.current) {
    umiRef.current = createUmi(MAINNET_RPC);
  }

  useEffect(() => {
    if (!publicKey || !umiRef.current) {
      setBalance(null);
      setError(null);
      setLoading(false);
      return;
    }

    const umi = umiRef.current;
    const key = toUmiPublicKey(publicKey.toBase58());
    let cancelled = false;

    async function fetchBalance() {
      if (!umi) return;
      try {
        setLoading(true);
        const solAmount = await umi.rpc.getBalance(key);
        if (!cancelled) {
          setBalance(Number(solAmount.basisPoints) / LAMPORTS_PER_SOL);
          setError(null);
        }
      } catch (err) {
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
  }, [publicKey, refetchIntervalMs]);

  return { balance, loading, error };
}

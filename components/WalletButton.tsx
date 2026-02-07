"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useMemo } from "react";

export function WalletButton() {
  const { publicKey, wallet, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const truncatedAddress = useMemo(() => {
    if (!base58) return null;
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
  }, [base58]);

  const handleClick = useCallback(() => {
    if (publicKey) {
      // If connected, disconnect
      disconnect();
    } else {
      // If not connected, open modal
      setVisible(true);
    }
  }, [publicKey, disconnect, setVisible]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={connecting}
      className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-medium text-black transition-all hover:bg-[var(--accent-muted)] active:scale-[0.98] disabled:opacity-50 sm:px-4 sm:text-sm flex items-center gap-2"
    >
      {connecting ? (
        <span>Connecting...</span>
      ) : publicKey ? (
        <>
          {wallet?.adapter.icon && (
            <img
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              className="h-4 w-4"
            />
          )}
          <span className="hidden sm:inline">{truncatedAddress}</span>
          <span className="sm:hidden">{truncatedAddress}</span>
        </>
      ) : (
        <>
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </>
      )}
    </button>
  );
}

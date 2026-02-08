import { NextResponse } from "next/server";

/** OIL token mint address on Solana. Override via OIL_TOKEN_MINT env. */
const DEFAULT_OIL_MINT = "91D9BXEGYsqjPGWNmzhSesvnz76L8nz4pSTY4FY6surg";
/** Public RPC; official api.mainnet-beta.solana.com rate-limits server requests */
const SOLANA_RPC =
  process.env.SOLANA_RPC_URL ?? "https://solana-rpc.publicnode.com";

interface TokenAccountInfo {
  address: string;
  amount: string;
  decimals: number;
  uiAmount: number | null;
  uiAmountString: string | null;
}

/**
 * GET /api/oil-top-holder
 * Returns the SOL value of the top OIL token holder (OIL Reserve metric).
 * Uses: Solana RPC getTokenLargestAccounts + DexScreener for OIL and SOL prices.
 */
export async function GET() {
  const oilMint = process.env.OIL_TOKEN_MINT ?? DEFAULT_OIL_MINT;

  try {
    // 1. Get top holder's OIL balance via Solana RPC
    const rpcRes = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenLargestAccounts",
        params: [oilMint],
      }),
      next: { revalidate: 120 },
    });

    if (!rpcRes.ok) {
      console.error("[OIL Top Holder] RPC error:", await rpcRes.text());
      return NextResponse.json(
        { error: "Failed to fetch token holders from Solana RPC" },
        { status: 502 }
      );
    }

    const rpcJson = await rpcRes.json();
    if (rpcJson.error) {
      console.error("[OIL Top Holder] RPC response error:", rpcJson.error);
      return NextResponse.json(
        { error: rpcJson.error.message ?? "Solana RPC error" },
        { status: 502 }
      );
    }

    const accounts: TokenAccountInfo[] = rpcJson.result?.value ?? [];
    const topHolder = accounts[0];
    if (!topHolder?.uiAmountString) {
      return NextResponse.json(
        { error: "No top holder data found for OIL token" },
        { status: 404 }
      );
    }

    const topHolderBalance = parseFloat(topHolder.uiAmountString);
    if (Number.isNaN(topHolderBalance) || topHolderBalance <= 0) {
      return NextResponse.json(
        { error: "Invalid top holder balance" },
        { status: 500 }
      );
    }

    // 2. Get OIL price (USD) from DexScreener
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${oilMint}`,
      { next: { revalidate: 60 } }
    );

    if (!dexRes.ok) {
      console.error("[OIL Top Holder] DexScreener error:", await dexRes.text());
      return NextResponse.json(
        { error: "Failed to fetch OIL price from DexScreener" },
        { status: 502 }
      );
    }

    const dexData = await dexRes.json();
    const pairs = dexData?.pairs ?? [];
    const solanaPair = pairs.find(
      (p: { chainId?: string }) => p.chainId === "solana"
    );
    if (!solanaPair?.priceUsd) {
      return NextResponse.json(
        { error: "OIL price not found on DexScreener" },
        { status: 404 }
      );
    }

    const oilPriceUsd = parseFloat(solanaPair.priceUsd);
    if (Number.isNaN(oilPriceUsd) || oilPriceUsd <= 0) {
      return NextResponse.json(
        { error: "Invalid OIL price data" },
        { status: 500 }
      );
    }

    // 3. Get SOL price (USD) from DexScreener
    const solRes = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112",
      { next: { revalidate: 60 } }
    );

    if (!solRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch SOL price" },
        { status: 502 }
      );
    }

    const solData = await solRes.json();
    const solPairs = solData?.pairs ?? [];
    const solPair = solPairs.find(
      (p: { chainId?: string; baseToken?: { symbol?: string } }) =>
        p.chainId === "solana" && p.baseToken?.symbol === "SOL"
    );
    const solPriceUsd = solPair?.priceUsd
      ? parseFloat(solPair.priceUsd)
      : 0;

    if (Number.isNaN(solPriceUsd) || solPriceUsd <= 0) {
      return NextResponse.json(
        { error: "Invalid SOL price data" },
        { status: 500 }
      );
    }

    // 4. Compute SOL value: (topHolderBalance * oilPriceUsd) / solPriceUsd
    const usdValue = topHolderBalance * oilPriceUsd;
    const solValue = usdValue / solPriceUsd;

    return NextResponse.json({
      solValue,
      usdValue,
      topHolderBalance,
      oilPriceUsd,
    });
  } catch (error) {
    console.error("[OIL Top Holder] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const WRAPPED_SOL = "So11111111111111111111111111111111111111112";
const DEXSCREENER_URL = `https://api.dexscreener.com/latest/dex/tokens/${WRAPPED_SOL}`;

/**
 * GET /api/sol-price
 * Fetches current SOL price in USD from DexScreener API (no API key required).
 * Returns { price: number } or { error: string }
 */
export async function GET() {
  try {
    const response = await fetch(DEXSCREENER_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[SOL Price API] DexScreener error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch SOL price from DexScreener" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const pairs = data?.pairs ?? [];
    const solPair = pairs.find(
      (p: { chainId: string; baseToken?: { symbol: string } }) =>
        p.chainId === "solana" && p.baseToken?.symbol === "SOL"
    );
    if (!solPair?.priceUsd) {
      return NextResponse.json(
        { error: "SOL price not found in DexScreener response" },
        { status: 500 }
      );
    }

    const price = parseFloat(solPair.priceUsd);
    if (Number.isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ price });
  } catch (error) {
    console.error("[SOL Price API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

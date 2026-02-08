import { NextResponse } from "next/server";
import {
  getOutcome,
  getPayout,
  rollMotherlode,
  type RiskLevel,
  type OutcomeType,
} from "@/lib/outcome-logic";

interface DrillRequest {
  cost: number;
  riskLevel: RiskLevel;
  motherlodePool: number;
  betUSD: number;
  motherlodePoolUSD: number;
}

interface DrillResponse {
  outcome: OutcomeType;
  payout: number;
}

/**
 * POST /api/drill
 * Server-side outcome determination.
 * Request: { cost, riskLevel, motherlodePool, betUSD, motherlodePoolUSD }
 * Response: { outcome, payout }
 */
export async function POST(request: Request) {
  try {
    const body: DrillRequest = await request.json();
    const { cost, riskLevel, motherlodePool, betUSD, motherlodePoolUSD } = body;

    // Validate inputs
    if (typeof cost !== "number" || cost <= 0) {
      return NextResponse.json(
        { error: "Invalid cost" },
        { status: 400 }
      );
    }

    if (!["strategic", "targeted", "random"].includes(riskLevel)) {
      return NextResponse.json(
        { error: "Invalid riskLevel" },
        { status: 400 }
      );
    }

    if (typeof motherlodePool !== "number" || motherlodePool < 0) {
      return NextResponse.json(
        { error: "Invalid motherlodePool" },
        { status: 400 }
      );
    }

    if (typeof betUSD !== "number" || betUSD <= 0) {
      return NextResponse.json(
        { error: "Invalid betUSD" },
        { status: 400 }
      );
    }

    if (typeof motherlodePoolUSD !== "number" || motherlodePoolUSD <= 0) {
      return NextResponse.json(
        { error: "Invalid motherlodePoolUSD" },
        { status: 400 }
      );
    }

    // Determine main outcome
    let outcome = getOutcome(riskLevel);

    // Roll for motherlode if main outcome was dry
    if (outcome === "dry" && rollMotherlode(betUSD, motherlodePoolUSD)) {
      outcome = "motherlode";
    }

    // Calculate payout
    const payout = getPayout(cost, outcome, riskLevel, motherlodePool);

    const response: DrillResponse = { outcome, payout };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[Drill API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

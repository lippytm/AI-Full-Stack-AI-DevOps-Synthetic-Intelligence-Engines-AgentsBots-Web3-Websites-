import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ai-web3-site",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
    features: {
      aiChat: true,
      portfolio: true,
      analytics: true,
      walletConnect: true,
    },
    chains: ["mainnet", "polygon", "arbitrum", "optimism", "base"],
  });
}

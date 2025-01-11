import { NextResponse } from "next/server";
import { analyzeClaim, categorizeClaimTrustScore } from "@/utils/nlp";

// This is a mock database of scientific data. In a real application, this would be fetched from a database or external API.
const scientificData = [
  "Viewing sunlight within 30-60 minutes of waking can help regulate cortisol levels.",
  "Non-sleep deep rest (NSDR) techniques have been shown to improve learning and recovery in some studies.",
  "Sulforaphane, found in cruciferous vegetables, has demonstrated anti-cancer properties in laboratory studies.",
];

export async function POST(request: Request) {
  try {
    const { claims } = await request.json();

    const verifiedClaims = claims.map((claim: string) => {
      const similarity = analyzeClaim(claim, scientificData);
      const trustScore = categorizeClaimTrustScore(similarity);

      return {
        claim,
        status:
          trustScore === "High"
            ? "Verified"
            : trustScore === "Medium"
            ? "Questionable"
            : "Debunked",
        confidence: similarity * 100, // Convert to percentage
        sources: ["https://example.com/study1", "https://example.com/study2"], // Mock sources
      };
    });

    return NextResponse.json(verifiedClaims);
  } catch (error) {
    console.error("Error verifying claims:", error);
    return NextResponse.json(
      { error: "Failed to verify claims" },
      { status: 500 }
    );
  }
}

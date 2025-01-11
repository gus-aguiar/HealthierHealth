import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        influencer: true,
        sources: true,
      },
    });
    return NextResponse.json(claims);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching claims" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { influencerId, claims, journals } = await request.json();

    const createdClaims = await prisma.claim.createMany({
      data: claims.map((claim: any) => ({
        influencerId,
        content: claim.claim,
        category: claim.category,
        trustScore: claim.trustScore,
        status: claim.isVerified ? "verified" : "unverified",
        date: new Date(),
        analysis: JSON.stringify({
          sentiment: claim.sentiment,
          entities: claim.entities,
          verificationSources: claim.verificationSources,
          journals: journals, // Add this line to store the journals used
        }),
      })),
    });

    return NextResponse.json({
      message: "Claims processed and stored successfully",
      count: createdClaims.count,
    });
  } catch (error) {
    console.error("Error processing claims:", error);
    return NextResponse.json(
      { error: "Error creating claims" },
      { status: 500 }
    );
  }
}

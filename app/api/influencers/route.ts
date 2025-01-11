import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log("Fetching influencers...");
  try {
    const influencers = await prisma.influencer.findMany({
      include: {
        topics: true,
        claims: {
          include: {
            sources: true,
          },
        },
      },
    });
    console.log(`Found ${influencers.length} influencers`);
    return NextResponse.json(influencers);
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json(
      { error: "Error fetching influencers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const influencer = await prisma.influencer.create({
      data: json,
      include: {
        topics: true,
      },
    });
    return NextResponse.json(influencer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating influencer" },
      { status: 500 }
    );
  }
}

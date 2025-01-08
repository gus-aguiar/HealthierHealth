import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
    return NextResponse.json(influencers);
  } catch (error) {
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

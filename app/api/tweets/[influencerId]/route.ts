import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { influencerId: string } }
) {
  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        influencerId: params.influencerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 most recent tweets
    });

    return NextResponse.json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      { error: "Error fetching tweets" },
      { status: 500 }
    );
  }
}

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
    const json = await request.json();
    const claim = await prisma.claim.create({
      data: json,
      include: {
        sources: true,
      },
    });
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating claim" },
      { status: 500 }
    );
  }
}

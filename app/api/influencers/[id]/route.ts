import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const influencer = await prisma.influencer.findUnique({
      where: {
        id: params.id,
      },
      include: {
        topics: true,
        claims: {
          include: {
            sources: true,
          },
        },
        tweets: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Limit to 10 most recent tweets
        },
      },
    });
    return NextResponse.json(influencer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching influencer" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const json = await request.json();
    const influencer = await prisma.influencer.update({
      where: {
        id: params.id,
      },
      data: json,
      include: {
        topics: true,
      },
    });
    return NextResponse.json(influencer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating influencer" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.influencer.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Influencer deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting influencer" },
      { status: 500 }
    );
  }
}

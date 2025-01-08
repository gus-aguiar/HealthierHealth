import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const claim = await prisma.claim.findUnique({
      where: {
        id: params.id,
      },
      include: {
        influencer: true,
        sources: true,
      },
    });
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching claim" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const json = await request.json();
    const claim = await prisma.claim.update({
      where: {
        id: params.id,
      },
      data: json,
      include: {
        sources: true,
      },
    });
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating claim" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.claim.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ message: "Claim deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting claim" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const researchTask = await prisma.researchTask.create({
      data: {
        researchType: body.researchType,
        timeRange: body.timeRange,
        influencerName: body.influencerName || null,
        claimsToAnalyze: body.claimsToAnalyze,
        productsToFind: body.productsToFind,
        includeRevenue: body.includeRevenue,
        verifyScientific: body.verifyScientific,
        selectedJournals: body.selectedJournals,
        notes: body.notes || null,
        status: "pending",
      },
    });

    return NextResponse.json({
      taskId: researchTask.id,
      message: "Research task started successfully",
    });
  } catch (error) {
    console.error("Error starting research task:", error);
    return NextResponse.json(
      { error: "Failed to start research task" },
      { status: 500 }
    );
  }
}

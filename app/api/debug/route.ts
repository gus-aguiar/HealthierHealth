import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
    hasNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
    env: process.env.NODE_ENV,
  });
}

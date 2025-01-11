import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockTweets } from "@/data/mockTweets";
import { processClaims } from "@/utils/nlp";

const MOCKED_USERNAMES = [
  "john_doe",
  "suzie_q",
  "dr_health_guru",
  "fitness_fanatic",
  "wellness_wizard",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));

    // Fetch tweets (using mock data for specific usernames)
    let tweets = [];
    if (MOCKED_USERNAMES.includes(body.twitterUsername)) {
      tweets = mockTweets[body.twitterUsername].slice(0, body.tweetLimit);
    } else {
      console.log(
        `No mock data for ${body.twitterUsername}, using empty array`
      );
    }
    console.log("Fetched tweets:", JSON.stringify(tweets, null, 2));

    // Save tweets to the database
    const savedTweets = await Promise.all(
      tweets.map((tweet) =>
        prisma.tweet.create({
          data: {
            tweetId: tweet.id,
            content: tweet.text,
            createdAt: new Date(tweet.created_at),
            influencerId: body.influencerId,
          },
        })
      )
    );
    console.log("Saved tweets:", JSON.stringify(savedTweets, null, 2));

    // Process claims from tweets
    const tweetContent = tweets.map((tweet: any) => tweet.text).join(" ");
    console.log("Tweet content to process:", tweetContent);

    const processedClaims = await processClaims(
      tweetContent,
      body.selectedJournals
    );
    console.log("Processed claims:", JSON.stringify(processedClaims, null, 2));

    // Calculate average trust score
    const totalTrustScore = processedClaims.reduce(
      (sum, claim) => sum + claim.trustScore,
      0
    );
    const averageTrustScore =
      processedClaims.length > 0 ? totalTrustScore / processedClaims.length : 0;

    // Update influencer's trust score
    await prisma.influencer.update({
      where: { id: body.influencerId },
      data: { trustScore: averageTrustScore },
    });

    // Store processed claims
    const createdClaims = await prisma.claim.createMany({
      data: processedClaims.map((claim) => ({
        influencerId: body.influencerId,
        content: claim.claim,
        category: claim.category,
        trustScore: claim.trustScore,
        status: claim.isVerified ? "verified" : "unverified",
        date: new Date(),
        analysis: JSON.stringify({
          sentiment: claim.sentiment,
          entities: claim.entities,
          verificationSources: claim.verificationSources,
        }),
      })),
    });
    console.log("Created claims:", JSON.stringify(createdClaims, null, 2));

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
        status: "completed",
      },
    });
    console.log(
      "Created research task:",
      JSON.stringify(researchTask, null, 2)
    );

    return NextResponse.json({
      taskId: researchTask.id,
      message: "Research task completed successfully",
      tweetsFetched: tweets.length,
      claimsProcessed: processedClaims.length,
      averageTrustScore: averageTrustScore,
    });
  } catch (error) {
    console.error("Error starting research task:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

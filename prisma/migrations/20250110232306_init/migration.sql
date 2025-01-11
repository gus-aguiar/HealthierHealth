-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "category" TEXT NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL,
    "followers" INTEGER NOT NULL,
    "yearlyRevenue" DOUBLE PRECISION,
    "products" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Influencer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysis" TEXT,
    "influencerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchTask" (
    "id" TEXT NOT NULL,
    "researchType" TEXT NOT NULL,
    "timeRange" TEXT,
    "influencerName" TEXT,
    "claimsToAnalyze" INTEGER NOT NULL,
    "productsToFind" INTEGER NOT NULL,
    "includeRevenue" BOOLEAN NOT NULL,
    "verifyScientific" BOOLEAN NOT NULL,
    "selectedJournals" TEXT[],
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "influencerId" TEXT NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InfluencerToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InfluencerToTopic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE INDEX "Claim_influencerId_idx" ON "Claim"("influencerId");

-- CreateIndex
CREATE INDEX "Source_claimId_idx" ON "Source"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweetId_key" ON "Tweet"("tweetId");

-- CreateIndex
CREATE INDEX "Tweet_influencerId_idx" ON "Tweet"("influencerId");

-- CreateIndex
CREATE INDEX "_InfluencerToTopic_B_index" ON "_InfluencerToTopic"("B");

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InfluencerToTopic" ADD CONSTRAINT "_InfluencerToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Influencer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InfluencerToTopic" ADD CONSTRAINT "_InfluencerToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

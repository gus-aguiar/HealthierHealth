import { prisma } from "./prisma";

export async function getInfluencer(id: string) {
  const influencer = await prisma.influencer.findUnique({
    where: { id },
    include: {
      topics: true,
      claims: {
        include: {
          sources: true,
        },
      },
      tweets: true,
    },
  });

  console.log("Fetched influencer:", JSON.stringify(influencer, null, 2));

  return influencer;
}

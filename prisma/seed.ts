import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateTweetId(): string {
  return Math.random().toString(36).substring(2, 15);
}

async function main() {
  const influencers = [
    {
      name: "Andrew Huberman",
      avatar: "/images/andrew-huberman.jpg",
      bio: "Stanford Professor of Neurobiology and Ophthalmology, focusing on neural development, brain plasticity, and neural regeneration.",
      category: "Neuroscience",
      trustScore: 89.75,
      followers: 4200000,
      yearlyRevenue: 5000000,
      products: 1,
      topics: [
        "Neuroscience",
        "Sleep",
        "Performance",
        "Hormones",
        "Stress Management",
        "Exercise Science",
        "Light Exposure",
        "Circadian Biology",
      ],
      claims: [
        {
          content:
            "Viewing sunlight within 30-60 minutes of waking enhances cortisol release",
          status: "verified",
          trustScore: 92.5,
          category: "Sleep",
          analysis: JSON.stringify({
            sentiment: "Positive",
            entities: ["sunlight", "cortisol", "waking"],
            verificationSources: [
              "https://pubmed.ncbi.nlm.nih.gov/12970330/",
              "https://www.nature.com/articles/s41598-019-54906-4",
            ],
          }),
          sources: [
            {
              url: "https://pubmed.ncbi.nlm.nih.gov/12970330/",
              title: "Morning Cortisol Levels in Relation to Light Exposure",
            },
            {
              url: "https://www.nature.com/articles/s41598-019-54906-4",
              title: "Effects of Light on Human Circadian Rhythms",
            },
          ],
        },
        {
          content:
            "Non-sleep deep rest (NSDR) protocols can accelerate learning and recovery",
          status: "verified",
          trustScore: 88.25,
          category: "Performance",
          analysis: JSON.stringify({
            sentiment: "Positive",
            entities: ["NSDR", "learning", "recovery"],
            verificationSources: [
              "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.624665/full",
            ],
          }),
          sources: [
            {
              url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.624665/full",
              title: "The Role of Rest in Learning and Memory Consolidation",
            },
          ],
        },
      ],
      tweets: [
        {
          tweetId: generateTweetId(),
          content:
            "New podcast episode: The Science of Sleep - How to Optimize Your Rest and Recovery",
          createdAt: new Date("2023-05-01T10:00:00Z"),
        },
        {
          tweetId: generateTweetId(),
          content:
            "Tip: Expose yourself to sunlight within 30-60 minutes of waking to regulate your circadian rhythm.",
          createdAt: new Date("2023-05-02T08:30:00Z"),
        },
        {
          tweetId: generateTweetId(),
          content:
            "Join me for a live Q&A on the benefits of Non-Sleep Deep Rest (NSDR) tomorrow at 2 PM PST!",
          createdAt: new Date("2023-05-03T15:00:00Z"),
        },
      ],
    },
    {
      name: "Dr. Rhonda Patrick",
      avatar: "/images/rhonda-patrick.jpg",
      bio: "Biochemist specializing in the impact of micronutrients on metabolic health, aging, and longevity.",
      category: "Nutrition",
      trustScore: 91.2,
      followers: 980000,
      yearlyRevenue: 2000000,
      products: 2,
      topics: [
        "Nutrition",
        "Longevity",
        "Metabolism",
        "Genetics",
        "Micronutrients",
        "Exercise",
      ],
      claims: [
        {
          content:
            "Sulforaphane from cruciferous vegetables may have anti-cancer properties",
          status: "verified",
          trustScore: 94.75,
          category: "Nutrition",
          analysis: JSON.stringify({
            sentiment: "Positive",
            entities: ["sulforaphane", "cruciferous vegetables", "cancer"],
            verificationSources: [
              "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7409551/",
            ],
          }),
          sources: [
            {
              url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7409551/",
              title: "Sulforaphane and Cancer",
            },
          ],
        },
        {
          content:
            "Regular sauna use may reduce the risk of cardiovascular disease",
          status: "verified",
          trustScore: 87.5,
          category: "Longevity",
          analysis: JSON.stringify({
            sentiment: "Positive",
            entities: ["sauna", "cardiovascular disease"],
            verificationSources: ["https://pubmed.ncbi.nlm.nih.gov/25705824/"],
          }),
          sources: [
            {
              url: "https://pubmed.ncbi.nlm.nih.gov/25705824/",
              title:
                "Association Between Sauna Bathing and Fatal Cardiovascular and All-Cause Mortality Events",
            },
          ],
        },
      ],
      tweets: [
        {
          tweetId: generateTweetId(),
          content:
            "New research suggests that sulforaphane, found in broccoli sprouts, may have potent anti-cancer properties. Read more in my latest article!",
          createdAt: new Date("2023-05-01T11:30:00Z"),
        },
        {
          tweetId: generateTweetId(),
          content:
            "Reminder: Omega-3 fatty acids are crucial for brain health. Consider adding fatty fish or algae-based supplements to your diet.",
          createdAt: new Date("2023-05-02T09:45:00Z"),
        },
        {
          tweetId: generateTweetId(),
          content:
            "Excited to announce my upcoming webinar on the role of micronutrients in longevity. Save the date: May 15th!",
          createdAt: new Date("2023-05-03T14:15:00Z"),
        },
      ],
    },
  ];

  for (const influencer of influencers) {
    const { topics, claims, tweets, ...influencerData } = influencer;
    const createdInfluencer = await prisma.influencer.create({
      data: {
        ...influencerData,
        topics: {
          create: topics.map((name) => ({ name })),
        },
        claims: {
          create: claims.map((claim) => {
            const { sources, ...claimData } = claim;
            return {
              ...claimData,
              sources: {
                create: sources,
              },
            };
          }),
        },
        tweets: {
          create: tweets,
        },
      },
    });
    console.log(`Created influencer: ${createdInfluencer.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

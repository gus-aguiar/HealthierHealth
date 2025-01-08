import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const influencers = [
    {
      name: "Andrew Huberman",
      avatar: "/images/andrew-huberman.jpg",
      bio: "Stanford Professor of Neurobiology and Ophthalmology, focusing on neural development, brain plasticity, and neural regeneration.",
      category: "Neuroscience",
      trustScore: 89,
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
          trustScore: 92,
          category: "Sleep",
          analysis:
            "Multiple studies confirm morning light exposure affects cortisol rhythms. Timing window supported by research.",
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
          trustScore: 88,
          category: "Performance",
          analysis:
            "Research supports the effectiveness of structured rest protocols in cognitive enhancement.",
          sources: [
            {
              url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.624665/full",
              title: "The Role of Rest in Learning and Memory Consolidation",
            },
          ],
        },
      ],
    },
    {
      name: "Dr. Rhonda Patrick",
      avatar: "/images/rhonda-patrick.jpg",
      bio: "Biochemist specializing in the impact of micronutrients on metabolic health, aging, and longevity.",
      category: "Nutrition",
      trustScore: 91,
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
          trustScore: 94,
          category: "Nutrition",
          analysis:
            "Numerous studies support the potential anti-cancer effects of sulforaphane, particularly from broccoli sprouts.",
          sources: [
            {
              url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7409551/",
              title: "Sulforaphane and Cancer",
            },
          ],
        },
      ],
    },
  ];

  for (const influencer of influencers) {
    const { topics, claims, ...influencerData } = influencer;
    const createdInfluencer = await prisma.influencer.create({
      data: {
        ...influencerData,
        topics: {
          create: topics.map((name) => ({ name })),
        },
        claims: {
          create: claims.map((claim) => ({
            ...claim,
            sources: {
              create: claim.sources,
            },
          })),
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

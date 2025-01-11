import axios from "axios";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error(
    "PERPLEXITY_API_KEY não está definida. Verifique suas variáveis de ambiente."
  );
}

// Add the missing exports that the verifyClaims route needs
export function analyzeClaim(claim: string, scientificData: string[]): number {
  // Simple similarity check (in production, you'd want a more sophisticated algorithm)
  const normalizedClaim = claim.toLowerCase();
  let maxSimilarity = 0;

  for (const data of scientificData) {
    const normalizedData = data.toLowerCase();
    const similarity = calculateSimilarity(normalizedClaim, normalizedData);
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }

  return maxSimilarity;
}

export function categorizeClaimTrustScore(
  similarity: number
): "High" | "Medium" | "Low" {
  if (similarity >= 0.7) return "High";
  if (similarity >= 0.4) return "Medium";
  return "Low";
}

// Helper function to calculate text similarity
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.split(" "));
  const words2 = new Set(text2.split(" "));
  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

const perplexityClient = axios.create({
  baseURL: "https://api.perplexity.ai",
  headers: {
    Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
    "Content-Type": "application/json",
  },
});

interface AnalyzedClaim {
  claim: string;
  category: string;
  trustScore: number;
  sentiment: string;
  entities: string[];
  verificationSources: string[];
  isVerified: boolean;
}

export async function processClaims(
  content: string,
  journals: string[]
): Promise<AnalyzedClaim[]> {
  try {
    console.log("Processing claims with content:", content);
    console.log("Selected journals:", journals);

    const response = await perplexityClient.post("/chat/completions", {
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: `You are an AI trained to extract and analyze health claims from text. For each claim, provide the claim itself, its category (e.g., nutrition, exercise, mental health), a trust score (0-100), sentiment (positive, negative, neutral), relevant health entities mentioned, and potential verification sources. Focus on finding evidence from the following scientific journals: ${journals.join(
            ", "
          )}.`,
        },
        {
          role: "user",
          content: `Extract and analyze health claims from the following content: ${content}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.2,
      top_p: 0.9,
      search_domain_filter: ["perplexity.ai"],
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "month",
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
    });

    console.log(
      "Perplexity API response:",
      JSON.stringify(response.data, null, 2)
    );

    const assistantMessage = response.data.choices[0].message.content;
    console.log("Assistant message:", assistantMessage);

    // Parse the assistant's message to extract claims
    const claims = assistantMessage.split("### Claim").slice(1);

    const analyzedClaims: AnalyzedClaim[] = claims.map((claimText) => {
      const lines = claimText.trim().split("\n");
      const claim = lines[0].trim();
      const category =
        lines
          .find((l) => l.startsWith("**Category:**"))
          ?.split(":")[1]
          .trim() || "";
      const trustScoreMatch = lines
        .find((l) => l.startsWith("**Trust Score:**"))
        ?.match(/(\d+)/);
      const trustScore = trustScoreMatch ? parseInt(trustScoreMatch[1]) : 0;
      const sentiment =
        lines
          .find((l) => l.startsWith("**Sentiment:**"))
          ?.split(":")[1]
          .trim() || "";
      const entities =
        lines
          .find((l) => l.startsWith("**Relevant Health Entities Mentioned:**"))
          ?.split(":")[1]
          .trim()
          .split(", ") || [];
      const verificationSources =
        lines
          .find((l) => l.startsWith("**Potential Verification Sources:**"))
          ?.split(":")[1]
          .trim()
          .split(/,\s*/)
          .filter((source) => source && source !== "**") || [];

      return {
        claim,
        category,
        trustScore,
        sentiment,
        entities,
        verificationSources,
        isVerified: trustScore > 70,
      };
    });

    console.log("Analyzed claims:", JSON.stringify(analyzedClaims, null, 2));

    return analyzedClaims;
  } catch (error) {
    console.error("Error in processClaims:", error);
    throw new Error("Failed to process claims");
  }
}

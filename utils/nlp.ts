import axios from "axios";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error(
    "PERPLEXITY_API_KEY não está definida. Verifique suas variáveis de ambiente."
  );
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

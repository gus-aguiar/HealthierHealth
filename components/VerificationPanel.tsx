"use client";
import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dashboard } from "./DashBoard";

interface Claim {
  claim: string;
  status: "Verified" | "Questionable" | "Debunked";
  confidence: number;
  sources: string[];
}

export function VerificationPanel() {
  const [influencer, setInfluencer] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (influencerName: string) => {
    setInfluencer(influencerName);
    setLoading(true);
    setError(null);

    try {
      // Fetch influencer content
      const contentResponse = await fetch("/api/fetchInfluencerContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ influencerName }),
      });

      if (!contentResponse.ok) {
        throw new Error("Failed to fetch influencer content");
      }

      const contentData = await contentResponse.json();

      // Extract claims from content
      const extractedClaims = extractClaims(contentData);

      // Verify claims
      const verificationResponse = await fetch("/api/verifyClaims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claims: extractedClaims }),
      });

      if (!verificationResponse.ok) {
        throw new Error("Failed to verify claims");
      }

      const verifiedClaims = await verificationResponse.json();
      setClaims(verifiedClaims);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          Verify Influencer Claims
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SearchBar onSearch={handleSearch} />
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        {influencer && !loading && !error && (
          <h2 className="text-xl font-semibold mb-4">
            Results for {influencer}
          </h2>
        )}
        <Dashboard results={claims} />
      </CardContent>
    </Card>
  );
}

function extractClaims(content: any): string[] {
  // This is a simplified version. In a real-world scenario, you'd use more sophisticated NLP techniques.
  const claims: string[] = [];
  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (typeof item.text === "string") {
        const sentences = item.text.split(/[.!?]+/);
        sentences.forEach((sentence) => {
          if (
            sentence.toLowerCase().includes("health") ||
            sentence.toLowerCase().includes("medical")
          ) {
            claims.push(sentence.trim());
          }
        });
      }
    });
  }
  return claims;
}

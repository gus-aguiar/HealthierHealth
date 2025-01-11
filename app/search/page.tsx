"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Leaderboard } from "@/components/leaderboard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchInfluencers() {
      try {
        const response = await fetch(
          `/api/influencers?q=${encodeURIComponent(query || "")}`
        );
        if (!response.ok) {
          throw new Error("Failed to search influencers");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      searchInfluencers();
    }
  }, [query]);

  if (loading) {
    return <div>Searching...</div>;
  }

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <Leaderboard influencers={results} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}

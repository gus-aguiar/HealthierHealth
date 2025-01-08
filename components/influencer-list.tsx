"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  category: string;
  trustScore: number;
  followers: number;
  claims: any[];
}

export function InfluencersList() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfluencers() {
      try {
        const response = await fetch("/api/influencers");
        if (!response.ok) {
          throw new Error("Failed to fetch influencers");
        }
        const data = await response.json();
        setInfluencers(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInfluencers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Trust Score</TableHead>
            <TableHead>Followers</TableHead>
            <TableHead>Verified Claims</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.map((influencer) => (
            <TableRow key={influencer.id}>
              <TableCell className="font-medium">{influencer.name}</TableCell>
              <TableCell>{influencer.category}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    influencer.trustScore >= 90 ? "default" : "secondary"
                  }
                >
                  {influencer.trustScore}%
                </Badge>
              </TableCell>
              <TableCell>{influencer.followers.toLocaleString()}</TableCell>
              <TableCell>
                {
                  influencer.claims.filter((c) => c.status === "verified")
                    .length
                }
              </TableCell>
              <TableCell>
                <Button asChild variant="outline">
                  <Link href={`/influencer/${influencer.id}`}>
                    View Profile
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

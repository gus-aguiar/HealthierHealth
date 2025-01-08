"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Users2,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Types for our data
interface Influencer {
  rank: number;
  name: string;
  avatar: string;
  category: string;
  trustScore: number;
  trend: "up" | "down";
  followers: string;
  verifiedClaims: number;
}

const categories = ["All", "Nutrition", "Fitness", "Medicine", "Mental Health"];

const influencers: Influencer[] = [
  {
    rank: 1,
    name: "Dr. Peter Attia",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Medicine",
    trustScore: 94,
    trend: "up",
    followers: "1.2M+",
    verifiedClaims: 203,
  },
  {
    rank: 2,
    name: "Dr. Rhonda Patrick",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nutrition",
    trustScore: 91,
    trend: "up",
    followers: "980K+",
    verifiedClaims: 156,
  },
  {
    rank: 3,
    name: "Dr. Chris Palmer",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Mental_health",
    trustScore: 90,
    trend: "up",
    followers: "180K+",
    verifiedClaims: 76,
  },
  {
    rank: 4,
    name: "Andrew Huberman",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Neuroscience",
    trustScore: 89,
    trend: "up",
    followers: "4.2M+",
    verifiedClaims: 127,
  },
  {
    rank: 5,
    name: "Dr. Dominic D'Agostino",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nutrition",
    trustScore: 89,
    trend: "down",
    followers: "290K+",
    verifiedClaims: 112,
  },
  {
    rank: 6,
    name: "Dr. Gabrielle Lyon",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Medicine",
    trustScore: 88,
    trend: "up",
    followers: "380K+",
    verifiedClaims: 84,
  },
  {
    rank: 7,
    name: "Dr. David Sinclair",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Longevity",
    trustScore: 87,
    trend: "up",
    followers: "1.1M+",
    verifiedClaims: 145,
  },
];

export function Leaderboard({ className }: { className?: string }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredInfluencers = influencers.filter(
    (influencer) =>
      selectedCategory === "All" || influencer.category === selectedCategory
  );

  const metrics = {
    activeInfluencers: "1,234",
    claimsVerified: "25,431",
    averageTrustScore: "85.7%",
  };

  return (
    <div className={`w-full space-y-6 ${className || ""}`}>
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Influencer Trust Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Real-time rankings of health influencers based on scientific accuracy,
          credibility, and transparency. Updated daily using AI-powered
          analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full p-3 bg-primary/10">
              <Users2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {metrics.activeInfluencers}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Influencers
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full p-3 bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.claimsVerified}</div>
              <div className="text-sm text-muted-foreground">
                Claims Verified
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full p-3 bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {metrics.averageTrustScore}
              </div>
              <div className="text-sm text-muted-foreground">
                Average Trust Score
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="text-sm"
        >
          Highest First
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">RANK</TableHead>
            <TableHead>INFLUENCER</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>TRUST SCORE</TableHead>
            <TableHead>TREND</TableHead>
            <TableHead>FOLLOWERS</TableHead>
            <TableHead className="text-right">VERIFIED CLAIMS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInfluencers.map((influencer) => (
            <TableRow key={influencer.rank}>
              <TableCell className="font-medium">#{influencer.rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={influencer.avatar}
                    alt={influencer.name}
                    className="rounded-full w-10 h-10"
                  />
                  <span>{influencer.name}</span>
                </div>
              </TableCell>
              <TableCell>{influencer.category}</TableCell>
              <TableCell>
                <span
                  className={`${
                    influencer.trustScore >= 90
                      ? "text-emerald-500"
                      : "text-yellow-500"
                  }`}
                >
                  {influencer.trustScore}%
                </span>
              </TableCell>
              <TableCell>
                {influencer.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>{influencer.followers}</TableCell>
              <TableCell className="text-right">
                {influencer.verifiedClaims}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

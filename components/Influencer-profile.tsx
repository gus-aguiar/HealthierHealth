"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface Claim {
  id: string;
  status: "verified" | "questionable" | "debunked";
  date: string;
  content: string;
  trustScore: number;
  analysis: string;
}

const topics = [
  "Neuroscience",
  "Sleep",
  "Performance",
  "Hormones",
  "Stress Management",
  "Exercise Science",
  "Light Exposure",
  "Circadian Biology",
];

const categories = [
  "All Categories",
  "Sleep",
  "Performance",
  "Hormones",
  "Nutrition",
  "Exercise",
  "Stress",
  "Cognition",
  "Motivation",
  "Recovery",
  "Mental Health",
];

const claims: Claim[] = [
  {
    id: "1",
    status: "verified",
    date: "14/01/2024",
    content:
      "Viewing sunlight within 30-60 minutes of waking enhances cortisol release",
    trustScore: 92,
    analysis:
      "Multiple studies confirm morning light exposure affects cortisol rhythms. Timing window supported by research.",
  },
  {
    id: "2",
    status: "verified",
    date: "09/12/2023",
    content:
      "Non-sleep deep rest (NSDR) protocols can accelerate learning and recovery",
    trustScore: 88,
    analysis:
      "Research supports the effectiveness of structured rest protocols in cognitive enhancement.",
  },
];

export function InfluencerProfile({ slug }: { slug: string }) {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8 pb-8">
      <div className="flex gap-6">
        <img
          src="/placeholder.svg?height=120&width=120"
          alt="Andrew Huberman"
          className="rounded-full w-28 h-28"
        />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Andrew Huberman</h1>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Stanford Professor of Neurobiology and Ophthalmology, focusing on
            neural development, brain plasticity, and neural regeneration. Host
            of the Huberman Lab Podcast, translating neuroscience into practical
            tools for everyday life. Known for evidence-based approaches to
            performance, sleep, stress management, and brain optimization.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Trust Score
              </p>
              <p className="text-2xl font-bold">89%</p>
              <p className="text-xs text-muted-foreground">
                Based on 127 verified claims
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Yearly Revenue
              </p>
              <p className="text-2xl font-bold">$5.0M</p>
              <p className="text-xs text-muted-foreground">
                Estimated earnings
              </p>
            </div>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Products
              </p>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">
                Recommended products
              </p>
            </div>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Followers
              </p>
              <p className="text-2xl font-bold">4.2M+</p>
              <p className="text-xs text-muted-foreground">Total following</p>
            </div>
            <Users className="h-4 w-4 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims">
        <TabsList>
          <TabsTrigger value="claims">Claims Analysis</TabsTrigger>
          <TabsTrigger value="products">Recommended Products</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>
        <TabsContent value="claims" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Verification Status</h3>
                <div className="flex gap-2">
                  {["All Statuses", "Verified", "Questionable", "Debunked"].map(
                    (status) => (
                      <Button
                        key={status}
                        variant={activeStatus === status ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveStatus(status)}
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select defaultValue="date">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="trust">Trust Score</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {claims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            claim.status === "verified"
                              ? "default"
                              : "destructive"
                          }
                          className="capitalize"
                        >
                          {claim.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {claim.date}
                        </span>
                      </div>
                      <p className="font-medium">{claim.content}</p>
                      <div className="pt-4">
                        <p className="text-sm font-medium">AI Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          {claim.analysis}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {claim.trustScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Trust Score
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Product recommendations will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monetization">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Monetization details will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

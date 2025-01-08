"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const journals = [
  "PubMed Central",
  "Nature",
  "Science",
  "Cell",
  "The Lancet",
  "New England Journal of Medicine",
  "JAMA Network",
];

export function ResearchConfig() {
  const [timeRange, setTimeRange] = useState("last-month");
  const [selectedJournals, setSelectedJournals] = useState<string[]>(journals);
  const [includeRevenue, setIncludeRevenue] = useState(true);
  const [verifyScientific, setVerifyScientific] = useState(true);
  const [researchType, setResearchType] = useState<"specific" | "discover">(
    "specific"
  );
  const [influencerName, setInfluencerName] = useState("");
  const [claimsToAnalyze, setClaimsToAnalyze] = useState("50");
  const [productsToFind, setProductsToFind] = useState("10");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAllJournals = () => {
    setSelectedJournals(journals);
  };

  const handleDeselectAllJournals = () => {
    setSelectedJournals([]);
  };

  const toggleJournal = (journal: string) => {
    setSelectedJournals((prev) =>
      prev.includes(journal)
        ? prev.filter((j) => j !== journal)
        : [...prev, journal]
    );
  };

  const handleStartResearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/start-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          researchType,
          timeRange,
          influencerName,
          claimsToAnalyze: parseInt(claimsToAnalyze),
          productsToFind: parseInt(productsToFind),
          includeRevenue,
          verifyScientific,
          selectedJournals,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start research");
      }

      toast({
        title: "Research Started",
        description: `Research task ${data.taskId} has been initiated.`,
      });
    } catch (error) {
      console.error("Error starting research:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start research. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Research Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            variant={researchType === "specific" ? "default" : "outline"}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setResearchType("specific")}
          >
            <span className="font-semibold">Specific Influencer</span>
            <span className="text-sm text-muted-foreground">
              Research a known health influencer by name
            </span>
          </Button>
          <Button
            variant={researchType === "discover" ? "default" : "outline"}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setResearchType("discover")}
          >
            <span className="font-semibold">Discover New</span>
            <span className="text-sm text-muted-foreground">
              Find and analyze new health influencers
            </span>
          </Button>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Time Range</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: "last-week", label: "Last Week" },
              { value: "last-month", label: "Last Month" },
              { value: "last-year", label: "Last Year" },
              { value: "all-time", label: "All Time" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? "default" : "outline"}
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Influencer Name</h3>
          <Input
            placeholder="Enter influencer name"
            value={influencerName}
            onChange={(e) => setInfluencerName(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Claims to Analyze Per Influencer
          </h3>
          <Input
            type="number"
            value={claimsToAnalyze}
            onChange={(e) => setClaimsToAnalyze(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Recommended: 50-100 claims for comprehensive analysis
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Products to Find Per Influencer
          </h3>
          <Input
            type="number"
            value={productsToFind}
            onChange={(e) => setProductsToFind(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Set to 0 to skip product research
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">Include Revenue Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Analyze monetization methods and estimate earnings
              </p>
            </div>
            <Switch
              checked={includeRevenue}
              onCheckedChange={setIncludeRevenue}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">
                Verify with Scientific Journals
              </h3>
              <p className="text-sm text-muted-foreground">
                Cross-reference claims with scientific literature
              </p>
            </div>
            <Switch
              checked={verifyScientific}
              onCheckedChange={setVerifyScientific}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Scientific Journals</h3>
            <div className="space-x-2">
              <Button
                variant="link"
                className="text-xs"
                onClick={handleSelectAllJournals}
              >
                Select All
              </Button>
              <Button
                variant="link"
                className="text-xs"
                onClick={handleDeselectAllJournals}
              >
                Deselect All
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {journals.map((journal) => (
              <Button
                key={journal}
                variant="outline"
                className={`justify-between h-auto py-3 ${
                  selectedJournals.includes(journal) ? "border-primary" : ""
                }`}
                onClick={() => toggleJournal(journal)}
              >
                {journal}
                <div
                  className={`w-4 h-4 rounded-full border ${
                    selectedJournals.includes(journal)
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedJournals.includes(journal) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-primary-foreground"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Notes for Research Assistant
          </h3>
          <Textarea
            placeholder="Add any specific instructions or focus areas..."
            className="min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleStartResearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Research...
            </>
          ) : (
            "Start Research"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

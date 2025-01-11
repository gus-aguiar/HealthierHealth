"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ErrorModal } from "@/components/error-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const journals = [
  "PubMed Central",
  "Nature",
  "Science",
  "Cell",
  "The Lancet",
  "New England Journal of Medicine",
  "JAMA Network",
];

const MOCKED_USERNAMES = [
  "john_doe",
  "suzie_q",
  "dr_health_guru",
  "fitness_fanatic",
  "wellness_wizard",
];

export function ResearchConfig() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
  const [twitterUsername, setTwitterUsername] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tweetLimit, setTweetLimit] = useState("10");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "You are now logged in.",
          variant: "default",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!twitterUsername || !influencerName) {
      toast({
        title: "Error",
        description: "Please enter both influencer name and Twitter username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Create or update the influencer
      const influencerResponse = await fetch("/api/influencers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: influencerName,
          category: "Health",
          trustScore: 0,
          followers: 0,
        }),
      });

      if (!influencerResponse.ok) {
        throw new Error("Failed to create/update influencer");
      }

      const influencer = await influencerResponse.json();

      // Step 2: Start the research task
      const researchResponse = await fetch("/api/start-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          researchType,
          influencerName,
          claimsToAnalyze: parseInt(claimsToAnalyze),
          productsToFind: parseInt(productsToFind),
          includeRevenue,
          verifyScientific,
          selectedJournals,
          notes,
          twitterUsername,
          tweetLimit: parseInt(tweetLimit),
          influencerId: influencer.id,
        }),
      });

      if (!researchResponse.ok) {
        const errorData = await researchResponse.json();
        throw new Error(errorData.error || "Failed to start research task");
      }

      const researchData = await researchResponse.json();

      toast({
        title: "Research Started",
        description: `Research task ${researchData.taskId} has been initiated. Fetched ${researchData.tweetsFetched} tweets and processed ${researchData.claimsProcessed} claims.`,
      });

      // Update notes with research information
      setNotes(
        (prev) =>
          `${prev}Analyzing tweets from @${twitterUsername} (Mocked Data)\nNumber of tweets: ${researchData.tweetsFetched}\nProcessed claims: ${researchData.claimsProcessed}`
      );
    } catch (error) {
      console.error("Error starting research:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login to Research Config</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Research Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Due to Twitter's API limitations, we are currently using mocked data
            for tweets to demonstrate the app's functionality. To see the app
            working, please use one of the following usernames: "john_doe",
            "suzie_q", "dr_health_guru", "fitness_fanatic", "wellness_wizard",
          </AlertDescription>
        </Alert>
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
          <h3 className="text-sm font-medium mb-2">Influencer Name</h3>
          <Input
            placeholder="Enter influencer name"
            value={influencerName}
            onChange={(e) => setInfluencerName(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Twitter Username</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Twitter username"
              value={twitterUsername}
              onChange={(e) => setTwitterUsername(e.target.value)}
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="Tweet limit"
              value={tweetLimit}
              onChange={(e) => setTweetLimit(e.target.value)}
              className="w-24"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the Twitter username to analyze their recent health-related
            tweets
          </p>
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
          <h3 className="text-sm font-medium mb-2">Notes</h3>
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
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errorMessage={errorMessage}
      />
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Tweet {
  id: string;
  tweetId: string;
  content: string;
  createdAt: Date;
}

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  category: string;
  trustScore: number;
  followers: number;
  yearlyRevenue: number | null;
  products: number;
  topics: { name: string }[];
  claims: Claim[];
  tweets: Tweet[];
}

interface Claim {
  id: string;
  content: string;
  status: string;
  trustScore: number;
  date: Date;
  analysis: string;
  category: string;
}

export function InfluencerProfile({ influencer }: { influencer: Influencer }) {
  console.log("Influencer in component:", JSON.stringify(influencer, null, 2));
  return (
    <div className="space-y-8 pb-8">
      <div className="flex gap-6">
        <img
          src={influencer.avatar || "/placeholder.svg?height=120&width=120"}
          alt={influencer.name}
          className="rounded-full w-28 h-28"
        />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{influencer.name}</h1>
          <div className="flex flex-wrap gap-2">
            {influencer.topics.map((topic) => (
              <Badge key={topic.name} variant="secondary" className="text-xs">
                {topic.name}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground max-w-3xl">{influencer.bio}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Trust Score
              </p>
              <p className="text-2xl font-bold">
                {influencer.trustScore.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Based on {influencer.claims.length} claims
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Yearly Revenue
              </p>
              <p className="text-2xl font-bold">
                ${influencer.yearlyRevenue?.toLocaleString() || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Estimated earnings
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Products
              </p>
              <p className="text-2xl font-bold">{influencer.products}</p>
              <p className="text-xs text-muted-foreground">
                Recommended products
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Followers
              </p>
              <p className="text-2xl font-bold">
                {influencer.followers.toLocaleString()}+
              </p>
              <p className="text-xs text-muted-foreground">Total following</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims">
        <TabsList>
          <TabsTrigger value="claims">Claims Analysis</TabsTrigger>
          <TabsTrigger value="tweets">Recent Tweets</TabsTrigger>
          <TabsTrigger value="products">Recommended Products</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>
        <TabsContent value="claims" className="space-y-4">
          {influencer.claims.map((claim) => {
            const analysis = JSON.parse(claim.analysis);
            return (
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
                          {new Date(claim.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium">{claim.content}</p>
                      <div className="pt-4 space-y-2">
                        <p className="text-sm font-medium">AI Analysis</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-semibold">Category:</span>{" "}
                            {claim.category}
                          </div>
                          <div>
                            <span className="font-semibold">Sentiment:</span>{" "}
                            {analysis.sentiment.replace("**", "")}
                          </div>
                          <div>
                            <span className="font-semibold">Entities:</span>{" "}
                            {analysis.entities.join(", ").replace("**", "")}
                          </div>
                        </div>
                        {analysis.verificationSources &&
                          analysis.verificationSources.length > 0 && (
                            <div>
                              <span className="font-semibold">
                                Verification Sources:
                              </span>
                              <ul className="list-disc pl-5 text-sm">
                                {analysis.verificationSources.map(
                                  (source: string, index: number) => (
                                    <li key={index}>
                                      <a
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        {source}
                                      </a>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {claim.trustScore.toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Trust Score
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="tweets" className="space-y-4">
          {influencer.tweets && influencer.tweets.length > 0 ? (
            influencer.tweets.map((tweet) => (
              <Card key={tweet.id}>
                <CardContent className="p-6">
                  <p className="font-medium">{tweet.content}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(tweet.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6">
                <p>No recent tweets found.</p>
              </CardContent>
            </Card>
          )}
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerifiedClaim {
  claim: string;
  status: "Verified" | "Questionable" | "Debunked";
  confidence: number;
  sources: string[];
}

export function ClaimVerifier() {
  const [claim, setClaim] = useState("");
  const [verifiedClaims, setVerifiedClaims] = useState<VerifiedClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!claim.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/verifyClaims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claims: [claim] }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify claim");
      }

      const result = await response.json();
      setVerifiedClaims(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a health claim to verify"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleVerify} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Claim"}
        </Button>
      </div>
      {verifiedClaims.map((verifiedClaim, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              <strong>Claim:</strong> {verifiedClaim.claim}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <Badge
                variant={
                  verifiedClaim.status === "Verified"
                    ? "default"
                    : verifiedClaim.status === "Questionable"
                    ? "warning"
                    : "destructive"
                }
              >
                {verifiedClaim.status}
              </Badge>
            </p>
            <p className="mb-2">
              <strong>Confidence:</strong> {verifiedClaim.confidence}%
            </p>
            <div>
              <strong>Sources:</strong>
              <ul className="list-disc pl-5">
                {verifiedClaim.sources.map((source, i) => (
                  <li key={i}>
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

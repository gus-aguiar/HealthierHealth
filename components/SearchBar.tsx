"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (influencerName: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [influencerName, setInfluencerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (influencerName.trim()) {
      onSearch(influencerName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={influencerName}
        onChange={(e) => setInfluencerName(e.target.value)}
        placeholder="Enter influencer name"
        className="flex-grow"
      />
      <Button type="submit" className="bg-primary hover:bg-primary/90">
        Verify
      </Button>
    </form>
  );
}

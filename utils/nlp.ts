import natural from "natural";

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

export function analyzeClaim(claim: string, scientificData: string[]): number {
  const tfidf = new TfIdf();

  // Add the claim to the TF-IDF model
  tfidf.addDocument(tokenizer.tokenize(claim.toLowerCase()));

  // Add each piece of scientific data to the TF-IDF model
  scientificData.forEach((data) => {
    tfidf.addDocument(tokenizer.tokenize(data.toLowerCase()));
  });

  // Calculate the similarity between the claim and each piece of scientific data
  const similarities = scientificData.map((_, index) => {
    return tfidf.tfidf(tokenizer.tokenize(claim.toLowerCase()), index + 1);
  });

  // Return the average similarity score
  return similarities.reduce((a, b) => a + b, 0) / similarities.length;
}

export function categorizeClaimTrustScore(similarity: number): string {
  if (similarity > 0.7) {
    return "High";
  } else if (similarity > 0.4) {
    return "Medium";
  } else {
    return "Low";
  }
}

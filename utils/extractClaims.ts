import { PerplexityResponse } from '../types/perplexity'

export function extractClaims(content: PerplexityResponse): string[] {
  // This is a placeholder function. In a real-world scenario, you would implement
  // more sophisticated NLP techniques to extract health claims from the content.
  const claims: string[] = []

  content.forEach(item => {
    if (item.text) {
      // Simple example: split text into sentences and consider each a potential claim
      const sentences = item.text.split(/[.!?]+/)
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes('health') || sentence.toLowerCase().includes('medical')) {
          claims.push(sentence.trim())
        }
      })
    }
  })

  return claims
}


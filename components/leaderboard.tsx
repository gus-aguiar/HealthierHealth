'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Influencer {
  id: string
  name: string
  avatar: string
  category: string
  trustScore: number
  followers: number
  claims: any[]
}

export function Leaderboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInfluencers() {
      try {
        const response = await fetch('/api/influencers')
        if (!response.ok) {
          throw new Error('Failed to fetch influencers')
        }
        const data = await response.json()
        setInfluencers(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInfluencers()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-4xl font-bold mb-2">Influencer Trust Leaderboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">RANK</TableHead>
            <TableHead>INFLUENCER</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>TRUST SCORE</TableHead>
            <TableHead>FOLLOWERS</TableHead>
            <TableHead className="text-right">VERIFIED CLAIMS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.map((influencer, index) => (
            <TableRow key={influencer.id}>
              <TableCell className="font-medium">#{index + 1}</TableCell>
              <TableCell>
                <Link href={`/influencer/${influencer.id}`} className="flex items-center gap-2 hover:underline">
                  <img
                    src={influencer.avatar || '/placeholder.svg'}
                    alt={influencer.name}
                    className="rounded-full w-10 h-10"
                  />
                  <span>{influencer.name}</span>
                </Link>
              </TableCell>
              <TableCell>{influencer.category}</TableCell>
              <TableCell>
                <Badge variant={influencer.trustScore >= 90 ? "default" : "secondary"}>
                  {influencer.trustScore}%
                </Badge>
              </TableCell>
              <TableCell>{influencer.followers.toLocaleString()}</TableCell>
              <TableCell className="text-right">{influencer.claims.filter(c => c.status === 'verified').length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


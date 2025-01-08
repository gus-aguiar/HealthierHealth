import { prisma } from './prisma'

export async function getInfluencer(id: string) {
  return prisma.influencer.findUnique({
    where: { id },
    include: {
      topics: true,
      claims: {
        include: {
          sources: true
        }
      }
    }
  })
}


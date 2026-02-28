import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_prisma'

const RV_INCLUDE = { features: { include: { feature: true } } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { type, minSleeps, maxLength } = req.query
    const where: Record<string, unknown> = { status: 'APPROVED' }
    if (type) where.type = type
    if (minSleeps) where.sleeps = { gte: Number(minSleeps) }
    if (maxLength) where.lengthFt = { lte: Number(maxLength) }
    const rvs = await prisma.rV.findMany({ where, include: RV_INCLUDE, orderBy: { brand: 'asc' } })
    res.json(rvs)
  } catch {
    res.status(500).json({ error: 'Failed to fetch RVs' })
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_prisma'

const RV_INCLUDE = { features: { include: { feature: true } } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const submissions = await prisma.rV.findMany({
      where: { status: 'PENDING' },
      include: RV_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })
    res.json(submissions)
  } catch {
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_prisma'

const RV_INCLUDE = { features: { include: { feature: true } } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const id = Number(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
  try {
    const rv = await prisma.rV.findUnique({ where: { id }, include: RV_INCLUDE })
    if (!rv) return res.status(404).json({ error: 'RV not found' })
    res.json(rv)
  } catch {
    res.status(500).json({ error: 'Failed to fetch RV' })
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from './_prisma'
import { scoreAndRank } from '../server/src/lib/matcher'
import type { Preferences } from '../server/src/lib/matcher'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const prefs: Preferences = req.body
    if (!prefs) return res.status(400).json({ error: 'Preferences required' })
    const rvs = await prisma.rV.findMany({
      where: { status: 'APPROVED' },
      include: { features: { include: { feature: true } } },
    })
    const results = scoreAndRank(rvs, prefs)
    res.json(results)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Matching failed' })
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_prisma'

const RV_INCLUDE = { features: { include: { feature: true } } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { action } = req.body as { action?: string }
    const id = Number(req.query.id)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
    if (!['approve', 'reject'].includes(action ?? '')) {
      return res.status(400).json({ error: 'action must be "approve" or "reject"' })
    }
    const rv = await prisma.rV.update({
      where: { id },
      data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' },
      include: RV_INCLUDE,
    })
    res.json(rv)
  } catch {
    res.status(500).json({ error: 'Failed to update submission' })
  }
}

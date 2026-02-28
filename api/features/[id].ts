import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

  if (req.method === 'PATCH') {
    const { key, label, category } = req.body as { key?: string; label?: string; category?: string }
    const data: Record<string, string> = {}
    if (label) data.label = label.trim()
    if (category) data.category = category.trim()
    if (key) data.key = key.trim().toLowerCase().replace(/\s+/g, '_')
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }
    try {
      const feature = await prisma.feature.update({ where: { id }, data })
      res.json(feature)
    } catch {
      res.status(409).json({ error: 'Update failed — key may already exist' })
    }
    return
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.rVFeature.deleteMany({ where: { featureId: id } })
      await prisma.feature.delete({ where: { id } })
      res.json({ ok: true })
    } catch {
      res.status(404).json({ error: 'Feature not found' })
    }
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

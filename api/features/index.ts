import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const features = await prisma.feature.findMany({ orderBy: [{ category: 'asc' }, { label: 'asc' }] })
      res.json(features)
    } catch {
      res.status(500).json({ error: 'Failed to fetch features' })
    }
    return
  }

  if (req.method === 'POST') {
    const { key, label, category } = req.body as { key?: string; label?: string; category?: string }
    if (!key || !label || !category) {
      return res.status(400).json({ error: 'key, label, and category are required' })
    }
    const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_')
    try {
      const feature = await prisma.feature.create({
        data: { key: cleanKey, label: label.trim(), category: category.trim() },
      })
      res.status(201).json(feature)
    } catch {
      res.status(409).json({ error: `Key "${cleanKey}" already exists` })
    }
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/features
router.get('/', async (_req: Request, res: Response) => {
  try {
    const features = await prisma.feature.findMany({ orderBy: [{ category: 'asc' }, { label: 'asc' }] })
    res.json(features)
  } catch {
    res.status(500).json({ error: 'Failed to fetch features' })
  }
})

// POST /api/features
router.post('/', async (req: Request, res: Response) => {
  const { key, label, category } = req.body as { key?: string; label?: string; category?: string }
  if (!key || !label || !category) {
    res.status(400).json({ error: 'key, label, and category are required' })
    return
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
})

// PATCH /api/features/:id
router.patch('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  const { key, label, category } = req.body as { key?: string; label?: string; category?: string }
  const data: Record<string, string> = {}
  if (label) data.label = label.trim()
  if (category) data.category = category.trim()
  if (key) data.key = key.trim().toLowerCase().replace(/\s+/g, '_')
  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: 'Nothing to update' })
    return
  }
  try {
    const feature = await prisma.feature.update({ where: { id }, data })
    res.json(feature)
  } catch {
    res.status(409).json({ error: 'Update failed — key may already exist' })
  }
})

// DELETE /api/features/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  try {
    // Remove join records first, then the feature
    await prisma.rVFeature.deleteMany({ where: { featureId: id } })
    await prisma.feature.delete({ where: { id } })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Feature not found' })
  }
})

export default router

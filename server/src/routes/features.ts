import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/features
router.get('/', async (_req: Request, res: Response) => {
  try {
    const features = await prisma.feature.findMany({ orderBy: { label: 'asc' } })
    res.json(features)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch features' })
  }
})

export default router

import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

const RV_INCLUDE = {
  features: {
    include: {
      feature: true,
    },
  },
}

// GET /api/rvs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, minSleeps, maxLength } = req.query

    const where: Record<string, unknown> = { status: 'APPROVED' }
    if (type) where.type = type
    if (minSleeps) where.sleeps = { gte: Number(minSleeps) }
    if (maxLength) where.lengthFt = { lte: Number(maxLength) }

    const rvs = await prisma.rV.findMany({
      where,
      include: RV_INCLUDE,
      orderBy: { brand: 'asc' },
    })
    res.json(rvs)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch RVs' })
  }
})

// GET /api/rvs/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rv = await prisma.rV.findUnique({
      where: { id: Number(req.params.id) },
      include: RV_INCLUDE,
    })
    if (!rv) return res.status(404).json({ error: 'RV not found' })
    res.json(rv)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch RV' })
  }
})

export default router

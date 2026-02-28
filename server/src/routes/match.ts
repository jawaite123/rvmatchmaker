import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { scoreAndRank, Preferences } from '../lib/matcher'

const router = Router()
const prisma = new PrismaClient()

// POST /api/match
router.post('/', async (req: Request, res: Response) => {
  try {
    const prefs: Preferences = req.body

    if (!prefs) {
      return res.status(400).json({ error: 'Preferences required' })
    }

    const rvs = await prisma.rV.findMany({
      where: { status: 'APPROVED' },
      include: {
        features: {
          include: { feature: true },
        },
      },
    })

    const results = scoreAndRank(rvs, prefs)
    res.json(results)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Matching failed' })
  }
})

export default router

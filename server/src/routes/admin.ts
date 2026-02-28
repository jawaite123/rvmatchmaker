import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

const RV_INCLUDE = {
  features: {
    include: { feature: true },
  },
}

// GET /api/admin/submissions
router.get('/submissions', async (_req: Request, res: Response) => {
  try {
    const submissions = await prisma.rV.findMany({
      where: { status: 'PENDING' },
      include: RV_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })
    res.json(submissions)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

// PATCH /api/admin/submissions/:id
router.patch('/submissions/:id', async (req: Request, res: Response) => {
  try {
    const { action } = req.body // "approve" | "reject"
    const id = Number(req.params.id)

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'action must be "approve" or "reject"' })
    }

    const rv = await prisma.rV.update({
      where: { id },
      data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED' },
      include: RV_INCLUDE,
    })

    res.json(rv)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update submission' })
  }
})

export default router

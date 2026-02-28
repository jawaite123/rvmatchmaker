import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// POST /api/submit
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      brand,
      model,
      year,
      type,
      lengthFt,
      sleeps,
      slides,
      weightLbs,
      msrp,
      floorplanType,
      description,
      imageUrl,
      submittedBy,
      featureKeys,
    } = req.body

    if (!brand || !model || !year || !type || !lengthFt || !sleeps || !floorplanType) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Look up feature IDs
    let featureConnections: { featureId: number }[] = []
    if (featureKeys && featureKeys.length > 0) {
      const features = await prisma.feature.findMany({
        where: { key: { in: featureKeys } },
      })
      featureConnections = features.map((f) => ({ featureId: f.id }))
    }

    const rv = await prisma.rV.create({
      data: {
        brand,
        model,
        year: Number(year),
        type,
        lengthFt: Number(lengthFt),
        sleeps: Number(sleeps),
        slides: Number(slides) || 0,
        weightLbs: weightLbs ? Number(weightLbs) : null,
        msrp: msrp ? Number(msrp) : null,
        floorplanType,
        description,
        imageUrl,
        submittedBy,
        status: 'PENDING',
        features: {
          create: featureConnections,
        },
      },
      include: {
        features: { include: { feature: true } },
      },
    })

    res.status(201).json({ message: 'Submission received! It will be reviewed before going live.', rv })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Submission failed' })
  }
})

export default router

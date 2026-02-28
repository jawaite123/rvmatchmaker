import express from 'express'
import cors from 'cors'
import rvsRouter from './routes/rvs'
import matchRouter from './routes/match'
import submitRouter from './routes/submit'
import adminRouter from './routes/admin'
import featuresRouter from './routes/features'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/rvs', rvsRouter)
app.use('/api/match', matchRouter)
app.use('/api/submit', submitRouter)
app.use('/api/admin', adminRouter)
app.use('/api/features', featuresRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

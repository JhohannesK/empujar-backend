import express, { Request, Response, NextFunction, Express } from 'express'
import dotenv from 'dotenv'
import fileRoutes from './routes/fileRoutes'
import { PrismaClient } from '@prisma/client'

dotenv.config()
const app: Express = express()
app.use(express.json())

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!')
})

app.use('/files', fileRoutes)


export default app
import express, { Request, Response, NextFunction, Express } from 'express'
import dotenv from 'dotenv'
import fileRoutes from './routes/fileRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()
const app: Express = express()
app.use(express.json())

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!')
})

app.use('/files', fileRoutes)
app.use('/auth', authRoutes)


export default app
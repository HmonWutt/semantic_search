import { Router } from 'express'
import { seed } from '../controllers/seed.controller.js'

export const seedRouter = Router()

seedRouter.post('/', seed)   // POST /api/seed

import { Router } from 'express'
import { listTags } from '../controllers/tag.controller.js'

export const tagRouter = Router()

tagRouter.get('/', listTags)

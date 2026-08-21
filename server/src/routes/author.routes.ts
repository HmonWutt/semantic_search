import { Router } from 'express'
import { listAuthors, listAuthorQuotes } from '../controllers/author.controller.js'

export const authorRouter = Router()

authorRouter.get('/', listAuthors)
authorRouter.get('/:name/quotes', listAuthorQuotes)   

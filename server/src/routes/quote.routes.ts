import { Router } from 'express'
import {
  listQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  searchQuotes,
  suggestQuotes,
} from '../controllers/quote.controller.js'

export const quoteRouter = Router()

quoteRouter.get('/', listQuotes)            // GET    /api/quotes?author=<id>&tag=<id>
quoteRouter.get('/search', searchQuotes)    // GET    /api/quotes/search?q=...     (custom: semantic)
quoteRouter.get('/suggest', suggestQuotes)  // GET    /api/quotes/suggest?prefix=... (custom: autocomplete)
quoteRouter.get('/:id', getQuote)           // GET    /api/quotes/:id
quoteRouter.post('/', createQuote)          // POST   /api/quotes
quoteRouter.put('/:id', updateQuote)        // PUT    /api/quotes/:id
quoteRouter.delete('/:id', deleteQuote)     // DELETE /api/quotes/:id


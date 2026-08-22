import type { Request, Response } from 'express'
import { Author } from '../models/author.js'
import { Quote } from '../models/quote.js'
import { ApiError } from '../middleware/error.js'

/** GET /api/authors */
export const listAuthors = (async (_req: Request, res: Response) => {
  const authors = await Author.find().lean()
  res.json(authors)
})
/** GET /api/authors/:name/quotes - relational: all quotes by this author. */
export const listAuthorQuotes = (async (req: Request, res: Response) => {
  const author = await Author.findByNameCaseInsensitive(String(req.params.name))
  if (!author) throw new ApiError(404, 'Author not found')
  const quotes = await Quote.find({ authorId: author._id }).populate('authorId tagIds').lean()
  res.json(quotes)
})


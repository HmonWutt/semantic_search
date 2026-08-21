import type { Request, Response } from 'express'
import { Quote, type QuoteT } from '../models/quote.js'
import { Author } from '../models/author.js'
import { Tag } from '../models/tag.js'
import { createQuoteSchema, updateQuoteSchema } from '../validation.js'
import { embed, cosine } from '../embed.js'
import { asyncHandler } from '../middleware/async.js'
import { ApiError } from '../middleware/error.js'
import { trie } from '../trie.js'


/** GET /api/quotes?author=<id>&tag=<id> - list, optional filters, author + tags joined. */
export const listQuotes = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {}
  if (typeof req.query.author === 'string') filter.authorId = req.query.author
  if (typeof req.query.tag === 'string') filter.tagIds = req.query.tag
  const quotes = await Quote.find(filter).populate('authorId tagIds').lean()
  res.json(quotes)
})

/** GET /api/quotes/:id */
export const getQuote = asyncHandler(async (req: Request, res: Response) => {
  const q = await Quote.findById(req.params.id).populate('authorId tagIds').lean()
  if (!q) throw new ApiError(404, 'Quote not found')
  res.json(q)
})

/** POST /api/quotes - create; embeds the text so semantic search includes it. */
export const createQuote = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createQuoteSchema.parse(req.body)
  // Referential integrity: authorId must point at a real author.
  if (!(await Author.exists({ _id: parsed.authorId }))) {
    throw new ApiError(400, 'authorId does not reference an existing author')
  }
  if (parsed.tagIds.length > 0) {
    const existing = await Tag.countDocuments({ _id: { $in: parsed.tagIds } })
    if (existing !== parsed.tagIds.length) {
      throw new ApiError(400, 'one or more tagIds do not reference existing tags')
    }
  }
  const [vector] = await embed([parsed.text])
  const created = await Quote.create({ ...parsed, vector }) as unknown as QuoteT
  trie.insert(parsed.text)
  const populated = await Quote.findById(created._id).populate('authorId tagIds').lean()
  res.status(201).json(populated)
})

/** PUT /api/quotes/:id - update; re-embeds if text changed. */
export const updateQuote = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateQuoteSchema.parse(req.body)
  const existing = await Quote.findById(req.params.id)
  if (!existing) throw new ApiError(404, 'Quote not found')
  if (parsed.authorId && !(await Author.exists({ _id: parsed.authorId }))) {
    throw new ApiError(400, 'authorId does not reference an existing author')
  }
  if (parsed.tagIds && parsed.tagIds.length > 0) {
    const count = await Tag.countDocuments({ _id: { $in: parsed.tagIds } })
    if (count !== parsed.tagIds.length) throw new ApiError(400, 'one or more tagIds do not reference existing tags')
  }
  if (parsed.text && parsed.text !== existing.text) {
    const [vector] = await embed([parsed.text])
    existing.set({ ...parsed, vector })
    trie.insert(parsed.text)
  } else {
    existing.set(parsed)
  }
  await existing.save()
  const populated = await Quote.findById(existing._id).populate('authorId tagIds').lean()
  res.json(populated)
})

/** DELETE /api/quotes/:id */
export const deleteQuote = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await Quote.findByIdAndDelete(req.params.id)
  if (!deleted) throw new ApiError(404, 'Quote not found')
  res.json({ deleted: true, id: req.params.id })
})

/** GET /api/search?q=... - semantic search: embed query, cosine vs all quote vectors, top-5. */
export const searchQuotes = asyncHandler(async (req: Request, res: Response) => {
  const q = String(req.query.q ?? '').trim()
  if (!q) return res.json([])
  const [qv] = await embed([q])
  const quotes = (await Quote.find().populate('authorId tagIds').lean()) as QuoteT[]
  const scored = quotes
    .map((d) => ({
      _id: d._id,
      text: d.text,
      authorId: d.authorId,
      tagIds: d.tagIds,
      source: d.source,
      score: cosine(d.vector ?? [], qv),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
  res.json(scored)
})

/** GET /api/suggest?prefix=... - trie prefix autocomplete over quote texts. */
export const suggestQuotes = asyncHandler(async (req: Request, res: Response) => {
  res.json(trie.suggest(String(req.query.prefix ?? '').trim(), 8))
})


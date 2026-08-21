import type { Request, Response } from 'express'
import { Tag } from '../models/tag.js'
import { asyncHandler } from '../middleware/async.js'

/** GET /api/tags - list all tags. */
export const listTags = asyncHandler(async (_req: Request, res: Response) => {
  const tags = await Tag.find().lean()
  res.json(tags)
})

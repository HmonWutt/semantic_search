import type { Request, Response } from 'express'
import { Tag } from '../models/tag.js'

/** GET /api/tags - list all tags. */
export const listTags = (async (_req: Request, res: Response) => {
  const tags = await Tag.find().lean()
  res.json(tags)
})

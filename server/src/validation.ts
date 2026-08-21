import { z } from 'zod'

/** POST /api/quotes - create a new quote. text + authorId required; tagIds + source optional. */
export const createQuoteSchema = z.object({
  text: z.string().min(5, 'text must be at least 5 characters').trim(),
  authorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'authorId must be a valid ObjectId'),
  tagIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional().default([]),
  source: z.string().trim().optional().default(''),
})

/** PUT /api/quotes/:id - update a quote. All fields optional except text */
export const updateQuoteSchema = z
  .object({
    text: z.string().min(5).trim(),
    authorId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    tagIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    source: z.string().trim().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'at least one field must be provided' })

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>

import type { Request, Response } from 'express'
import { Author, Tag, Quote } from '../models/index.js'
import { embed } from '../embed.js'
import { trie } from '../trie.js'
import { seedAuthors, seedTagNames, seedQuotes } from '../seedData.js'
import { asyncHandler } from '../middleware/async.js'

/** POST /api/seed - wipe and rebuild authors, tags, quotes with refs + embeddings. */
export const seed = asyncHandler(async (_req: Request, res: Response) => {
  await Promise.all([Quote.deleteMany({}), Author.deleteMany({}), Tag.deleteMany({})])

  // 1. authors
  const authorDocs = await Author.insertMany(seedAuthors)
  const authorByName = new Map(authorDocs.map((a) => [a.name, a._id]))

  // 2. tags
  const tagDocs = await Tag.insertMany(seedTagNames.map((name) => ({ name })))
  const tagByName = new Map(tagDocs.map((t) => [t.name, t._id]))

  // 3. quotes — resolve names to ObjectIds, embed texts in one batch
  const texts = seedQuotes.map((sq) => sq.text)
  const vectors = await embed(texts)
  const quoteDocs = await Quote.insertMany(
    seedQuotes.map((sq, i) => ({
      text: sq.text,
      authorId: authorByName.get(sq.author),
      tagIds: sq.tags.map((t) => tagByName.get(t)).filter(Boolean),
      source: sq.source ?? '',
      vector: vectors[i],
    }))
  )

  // 4. rebuild the autocomplete trie from quote texts
  for (const sq of seedQuotes) trie.insert(sq.text)

  res.json({
    inserted: { authors: authorDocs.length, tags: tagDocs.length, quotes: quoteDocs.length },
    dims: vectors[0]?.length,
  })
})

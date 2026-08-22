import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { Quote } from './models/quote.js'
import { trie } from './trie.js'
import { quoteRouter } from './routes/quote.routes.js'
import { authorRouter } from './routes/author.routes.js'
import { tagRouter } from './routes/tag.routes.js'
import { seedRouter } from './routes/seed.routes.js'
import { notFound, errorHandler } from './middleware/error.js'
const PORT = Number(process.env.PORT ?? 4000)

async function getMongoUri(): Promise<string> {
  if (process.env.MONGO_URI) return process.env.MONGO_URI
  // Zero-setup dev path: a real mongod in memory (ephemeral data).
  // Production: set MONGO_URI to an Atlas connection string in .env.
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const mongod = await MongoMemoryServer.create()
  console.log('MONGO_URI not set → using in-memory mongod (ephemeral data)')
  return mongod.getUri('quote-library')
}

async function main() {
  const app = express()
  app.use(express.json())

  await mongoose.connect(await getMongoUri())
  console.log('mongo connected')

  // Rebuild the autocomplete trie from existing quote texts at startup.
  for (const q of await Quote.find().select('text').lean()) {
    for (const word of q.text.split(' ')) {
      trie.insert(word)
    }
  }

  app.use('/api/quotes', quoteRouter)
  app.use('/api/authors', authorRouter)
  app.use('/api/tags', tagRouter)
  app.use('/api/seed', seedRouter)
  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use(notFound)
  app.use(errorHandler)
  app.listen(PORT, () => console.log(`server :${PORT}`))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

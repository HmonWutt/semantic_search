import path from 'node:path'
import { FlagEmbedding, EmbeddingModel } from 'fastembed'

// Initialised once on first use; the model file (~30-40MB) loads from
// ./models into RAM. If ./models is populated, no network is needed.
let modelPromise: Promise<FlagEmbedding> | null = null

function getModel() {
  modelPromise ??= FlagEmbedding.init({
    model: EmbeddingModel.BGESmallENV15,
    cacheDir: path.resolve('./models'),
  })
  return modelPromise
}

export async function embed(texts: string[]): Promise<number[][]> {
  const model = await getModel()
  const out: number[][] = []
  for await (const batch of model.embed(texts)) {
    for (const vec of batch) out.push(Array.from(vec))
  }
  return out
}

/** Dot product == cosine similarity because fastembed vectors are unit-length. */
export function cosine(a: number[], b: number[]): number {
  let d = 0
  for (let i = 0; i < a.length; i++) d += a[i] * b[i]
  return d
}

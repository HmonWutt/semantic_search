import mongoose, { type InferSchemaType } from 'mongoose'

const schema = new mongoose.Schema(
  {
    text: { type: String, required: true, minlength: 5, trim: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    source: { type: String, default: '' },   // custom domain field: book/work where the quote appears
    vector: { type: [Number], default: [] },   // embedding for semantic search
  },
  { collection: 'quotes', timestamps: true }
)

export type QuoteT = InferSchemaType<typeof schema> & { _id: mongoose.Types.ObjectId }
export const Quote = mongoose.model('Quote', schema)

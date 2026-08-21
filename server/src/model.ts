import mongoose, { type InferSchemaType } from 'mongoose'

const docSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    vector: { type: [Number], required: true },
    meta: { type: Object, default: {} },
  },
  { collection: 'quotes' }
)

export type DocT = InferSchemaType<typeof docSchema> & { _id: mongoose.Types.ObjectId }
export const Doc = mongoose.model('Doc', docSchema)

import mongoose, { type InferSchemaType } from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 2, trim: true },
  born: { type: Number, min: -800, max: 2100 },   // year; negatives = BCE
  died: { type: Number, min: -800, max: 2100 },
  nationality: { type: String, default: 'Unknown' },
})

export type AuthorT = InferSchemaType<typeof schema> & { _id: mongoose.Types.ObjectId }
export const Author = mongoose.model('Author', schema)

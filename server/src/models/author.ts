import mongoose, { type InferSchemaType } from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 2, trim: true },
  born: { type: Number, min: -800, max: 2100 },   // year; negatives = BCE
  died: { type: Number, min: -800, max: 2100 },
  nationality: { type: String, default: 'Unknown' },
})

schema.statics.findByNameCaseInsensitive = function (name: string) {
  const lower = name.toLowerCase()
  return this.find({}).lean().then((docs: AuthorT[]) =>
    docs.find((d) => d.name.toLowerCase() === lower) ?? null
  )
}

export type AuthorT = InferSchemaType<typeof schema> & { _id: mongoose.Types.ObjectId }
export interface AuthorModel extends mongoose.Model<AuthorT> {
  findByNameCaseInsensitive(name: string): Promise<AuthorT | null>
}
export const Author = mongoose.model<AuthorT, AuthorModel>('Author', schema)

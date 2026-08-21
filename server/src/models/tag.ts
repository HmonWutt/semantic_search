import mongoose, { type InferSchemaType } from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ['persistence', 'friendship', 'success', 'failure', 'learning',
      'courage', 'adversity', 'loyalty', 'work', 'wisdom', 'adaptability'],
  },
  description: { type: String, default: '' },
})

export type TagT = InferSchemaType<typeof schema> & { _id: mongoose.Types.ObjectId }
export const Tag = mongoose.model('Tag', schema)

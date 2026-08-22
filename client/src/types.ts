export interface Author {
  _id: string
  name: string
  born?: number
  died?: number
  nationality: string
}

export interface Tag {
  _id: string
  name: string
  description?: string
}

export interface Quote {
  _id: string
  text: string
  authorId: Author | string
  tagIds: (Tag | string)[]
  source?: string
  score?: number
  createdAt?: string
  updatedAt?: string
}

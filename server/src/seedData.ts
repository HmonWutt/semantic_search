export interface SeedAuthor {
  name: string
  born?: number
  died?: number
  nationality: string
}

export interface SeedQuote {
  text: string
  author: string        // resolved to authorId at seed time
  tags: string[]         // resolved to tagIds at seed time
  source?: string        // custom domain field: book/work where the quote appears
}

export const seedAuthors: SeedAuthor[] = [
  { name: 'Calvin Coolidge', born: 1872, died: 1933, nationality: 'American' },
  { name: 'Steve Jobs', born: 1955, died: 2011, nationality: 'American' },
  { name: 'Albert Einstein', born: 1879, died: 1955, nationality: 'German' },
  { name: 'Charles Darwin', born: 1809, died: 1882, nationality: 'British' },
  { name: 'Elbert Hubbard', born: 1856, died: 1915, nationality: 'American' },
  { name: 'Lao Tzu', born: -604, died: -531, nationality: 'Chinese' },
  { name: 'Winston Churchill', born: 1874, died: 1965, nationality: 'British' },
  { name: 'Morihei Ueshiba', born: 1883, died: 1969, nationality: 'Japanese' },
  { name: 'Henry Ford', born: 1863, died: 1947, nationality: 'American' },
  { name: 'C.S. Lewis', born: 1898, died: 1963, nationality: 'British' },
  { name: 'Thomas Edison', born: 1847, died: 1931, nationality: 'American' },
  { name: 'Socrates', born: -470, died: -399, nationality: 'Greek' },
  { name: 'Benjamin Franklin', born: 1706, died: 1790, nationality: 'American' },
  { name: 'Oscar Wilde', born: 1854, died: 1900, nationality: 'Irish' },
  { name: 'Julie Andrews', born: 1935, nationality: 'British' },
  { name: 'Zig Ziglar', born: 1926, died: 2012, nationality: 'American' },
  { name: 'Leonardo da Vinci', born: 1452, died: 1519, nationality: 'Italian' },
]

export const seedTagNames: string[] = [
  'persistence', 'friendship', 'success', 'failure', 'learning',
  'courage', 'adversity', 'loyalty', 'work', 'wisdom', 'adaptability',
]

export const seedQuotes: SeedQuote[] = [
  { text: 'Nothing in this world can take the place of persistence.', author: 'Calvin Coolidge', tags: ['persistence', 'work'] },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', tags: ['work', 'success'], source: 'Stanford commencement, 2005' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', tags: ['adversity', 'wisdom'] },
  { text: 'It is not the strongest of the species that survives, but the most adaptable.', author: 'Charles Darwin', tags: ['adaptability', 'wisdom'] },
  { text: 'A friend is someone who knows all about you and still loves you.', author: 'Elbert Hubbard', tags: ['friendship', 'loyalty'] },
  { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', tags: ['persistence', 'courage'], source: 'Tao Te Ching' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', tags: ['success', 'failure', 'courage'] },
  { text: 'Loyalty and devotion lead to bravery.', author: 'Morihei Ueshiba', tags: ['loyalty', 'courage'] },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Lao Tzu', tags: ['persistence', 'wisdom'] },
  { text: 'Whether you think you can or you think you can’t, you’re right.', author: 'Henry Ford', tags: ['wisdom', 'success'] },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis', tags: ['adversity', 'courage'] },
  { text: 'I have not failed. I’ve just found 10,000 ways that won’t work.', author: 'Thomas Edison', tags: ['failure', 'persistence'] },
  { text: 'Wisdom begins in wonder.', author: 'Socrates', tags: ['wisdom', 'learning'] },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin', tags: ['learning', 'work'] },
  { text: 'True friends stab you in the front.', author: 'Oscar Wilde', tags: ['friendship', 'loyalty'] },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', tags: ['wisdom', 'learning'] },
  { text: 'Perseverance is failing 19 times and succeeding the 20th.', author: 'Julie Andrews', tags: ['persistence', 'failure', 'success'] },
  { text: 'Difficult roads often lead to beautiful destinations.', author: 'Zig Ziglar', tags: ['adversity', 'courage'] },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci', tags: ['learning', 'wisdom'] },
]


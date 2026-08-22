import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import QuoteList from './components/QuoteList'
import type { Author, Quote, Tag } from './types'
import { listAuthors } from './api'

export default function App() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [editing, setEditing] = useState<Quote | null>(null)

  const refreshMeta = async () => {
    setAuthors(await listAuthors())
  }

  useEffect(() => { refreshMeta() }, [refreshKey])

  return (
    <main>
      <SearchBar />
      <section>
        <QuoteList authors={authors} tags={tags} refreshKey={refreshKey} onEdit={setEditing} />
      </section>
    </main>
  )
}

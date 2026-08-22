import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import QuoteList from './components/QuoteList'
import QuoteForm from './components/QuoteForm'
import type { Author, Quote, Tag } from './types'
import { listAuthors, listTags, seedDb } from './api'

export default function App() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [editing, setEditing] = useState<Quote | null>(null)

  const refreshMeta = async () => {
    setAuthors(await listAuthors())
    setTags(await listTags())
  }

  useEffect(() => { refreshMeta() }, [refreshKey])

  const seed = async () => {
    await seedDb(); setRefreshKey(k => k + 1)
    alert('Wiped and reseeded DB')
  }

  const onSaved = () => { setEditing(null); setRefreshKey(k => k + 1) }
  return (
    <main>
      <button className="seed" onClick={seed}>Seed DB</button>
      <SearchBar />
      <section>
        <QuoteList authors={authors} tags={tags} refreshKey={refreshKey} onEdit={setEditing} />
      </section>

      <section>
        <QuoteForm authors={authors} tags={tags} editing={editing} onSaved={onSaved} onCancel={() => setEditing(null)} />
      </section>
    </main>
  )
}

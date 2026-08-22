import { useEffect, useState } from 'react'
import type { Author, Quote, Tag } from '../types'
import { deleteQuote, listQuotes } from '../api'

interface Props {
  authors: Author[]
  tags: Tag[]
  refreshKey: number
  onEdit: (q: Quote) => void
}

/** Table of quotes with inline edit/delete + auto-refresh (setInterval, cleaned up on unmount). */
export default function QuoteList({ authors, tags, refreshKey, onEdit }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try { setQuotes(await listQuotes()); setError(null) }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load') }
    finally { setLoading(false) }
  }

  // Initial + manual refresh (when refreshKey changes after create/update/delete).
  useEffect(() => { load() }, [refreshKey])

  // Auto-refresh every 10s; cleanup clears the interval on unmount.
  useEffect(() => {
    const id = setInterval(load, 10_000)
    return () => clearInterval(id)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quote?')) return
    try { await deleteQuote(id); load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Delete failed') }
  }

  const authorName = (q: Quote) => (typeof q.authorId === 'object' ? q.authorId.name : '?')
  const tagNames = (q: Quote) => (q.tagIds as Tag[]).map(t => t.name).join(', ')

  if (loading && quotes.length === 0) return <p className="muted">Loading quotes…</p>
  if (error) return <div className="error">{error}</div>

  return (
    <table className="table">
      <thead>
        <tr><th>Quote</th><th>Author</th><th>Tags</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {quotes.map(q => (
          <tr key={q._id}>
            <td className="quote-cell">“{q.text}”{q.source && <span className="src"> · {q.source}</span>}</td>
            <td>{authorName(q)}</td>
            <td className="tags">{tagNames(q)}</td>
            <td className="actions">
              <button onClick={() => onEdit(q)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(q._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

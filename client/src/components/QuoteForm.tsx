import { useState } from 'react'
import type { Author, Quote, Tag } from '../types'
import { createQuote, updateQuote } from '../api'

interface Props {
  authors: Author[]
  tags: Tag[]
  editing: Quote | null
  onSaved: () => void
  onCancel: () => void
}

const empty = { text: '', authorId: '', tagIds: [] as string[], source: '' }

/** Form for creating or editing a quote. Controlled inputs throughout. */
export default function QuoteForm({ authors, tags, editing, onSaved, onCancel }: Props) {
  const [form, setForm] = useState(() => editing
    ? { text: editing.text, authorId: String(editing.authorId), tagIds: (editing.tagIds as Tag[]).map(t => t._id), source: editing.source ?? '' }
    : empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      if (editing) {
        await updateQuote(editing._id, form)
      } else {
        await createQuote(form)
      }
      setForm(empty); onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h3>{editing ? 'Edit quote' : 'New quote'}</h3>
      {error && <div className="error">{error}</div>}
      <textarea
        placeholder="Quote text..."
        value={form.text}
        onChange={e => set('text', e.target.value)}
        rows={3} required minLength={5}
      />
      <select value={form.authorId} onChange={e => set('authorId', e.target.value)} required>
        <option value="" disabled>Select author…</option>
        {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
      </select>
      <select multiple value={form.tagIds} onChange={e => set('tagIds', [...e.target.selectedOptions].map(o => o.value))} size={6}>
        {tags.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
      </select>
      <input placeholder="Source (optional)" value={form.source} onChange={e => set('source', e.target.value)} />
      <div className="form-actions">
        <button type="submit" disabled={loading}>{loading ? 'Saving....' : (editing ? 'Update' : 'Create')}</button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

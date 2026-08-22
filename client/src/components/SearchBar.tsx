
import { useEffect, useRef, useState } from 'react'
import type { Quote } from '../types'
import { searchQuotes, suggestQuotes } from '../api'

/** Semantic search + trie autocomplete. Two fetches in parallel per debounced keystroke. **/
export default function SearchBar() {
  const [q, setQ] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<Quote[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(async () => {
      const query = q.trim()
      if (!query) { setSuggestions([]); setResults([]); return }
      setLoading(true)
      try {
        const autoComplete = await suggestQuotes(query)
        const semanticMatches = await searchQuotes(query)
        setSuggestions(autoComplete)
        setResults(semanticMatches)
      } catch (error) {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="search-section">
      <h3>Semantic search + Autocomplete</h3>
      <div className="searchbox" ref={boxRef}>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Try: friends standing by you through hard times"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="dropdown">
            {suggestions.map(s => (
              <li key={s} onClick={() => { setQ(s); setShowSuggestions(false) }}>{s}</li>
            ))}
          </ul>
        )}
      </div>
      {loading && <p className="muted small">Searching....</p>}
      <div className="results">
        {results.map(r => (
          <div key={r._id} className="card">
            <p>"{r.text}"</p>
            {typeof r.authorId === 'object' && <span className="muted small">-- {r.authorId.name}</span>}
            <div className="bar"><div className="fill" style={{ width: `${Math.max(0, Math.min(1, r.score ?? 0)) * 100}%` }} /></div>
            <span className="muted small">{(r.score ?? 0).toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

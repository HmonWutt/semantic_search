import type { Quote, Author, Tag } from './types'

const baseURL = '/api'

async function json<T>(url: string, reqConfig?: RequestInit): Promise<T> {
  const r = await fetch(url, reqConfig)
  if (!r.ok) {
    let msg = `${r.status} ${r.statusText}`
    try { const j = await r.json(); msg = j.error ?? msg } catch { /* ignore */ }
    throw new Error(msg)
  }
  return r.json() as Promise<T>
}

// ---- Semantic search + autocomplete ----
export const searchQuotes = (q: string) => json<Quote[]>(`${baseURL}/quotes/search?q=${encodeURIComponent(q)}`)
export const suggestQuotes = (prefix: string) => json<string[]>(`${baseURL}/quotes/suggest?prefix=${encodeURIComponent(prefix)}`)

// ---- Quotes ----
export const listQuotes = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString()
  return json<Quote[]>(`${baseURL}/quotes${qs ? `?${qs}` : ''}`)
}
export const createQuote = (body: { text: string; authorId: string; tagIds: string[]; source?: string }) =>
  json<Quote>(`${baseURL}/quotes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
export const updateQuote = async (id: string, body: Partial<{ text: string; authorId: string; tagIds: string[]; source: string }>) =>
  json<Quote>(`${baseURL}/quotes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
export const deleteQuote = async (id: string) => { await json<{ deleted: boolean }>(`${baseURL}/quotes/${id}`, { method: 'DELETE' }) }

// ---- Authors & tags (for the form) ----
export const listAuthors = () => json<Author[]>(`${baseURL}/authors`)
export const listTags = () => json<Tag[]>(`${baseURL}/tags`)


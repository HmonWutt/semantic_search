import type { Quote } from './types'

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


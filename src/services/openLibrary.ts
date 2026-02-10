import type { Book } from '../types'

const API_BASE = 'https://openlibrary.org/api/books'

interface OpenLibraryAuthor {
  name?: string
  url?: string
}

interface OpenLibraryCover {
  small?: string
  medium?: string
  large?: string
}

interface OpenLibraryPublisher {
  name?: string
}

interface OpenLibraryEntry {
  title?: string
  authors?: OpenLibraryAuthor[]
  publishers?: OpenLibraryPublisher[]
  number_of_pages?: number
  publish_date?: string
  cover?: OpenLibraryCover
  isbn?: string[]
}

interface OpenLibraryResponse {
  [key: string]: OpenLibraryEntry | undefined
}

function extractYear(dateStr: string | undefined): number | undefined {
  if (!dateStr || typeof dateStr !== 'string') return undefined
  const match = dateStr.match(/\d{4}/)
  return match ? parseInt(match[0], 10) : undefined
}

export function normalizeOpenLibraryEntry(raw: OpenLibraryEntry, isbn: string): Book {
  const authors = (raw.authors ?? [])
    .map((a) => a?.name?.trim())
    .filter((name): name is string => Boolean(name))

  const publisher = raw.publishers?.[0]?.name?.trim()

  let coverUrl: string | undefined
  const c = raw.cover
  if (c?.medium) coverUrl = c.medium
  else if (c?.large) coverUrl = c.large
  else if (c?.small) coverUrl = c.small

  const isbn13 = raw.isbn?.find((id) => id.length === 13)
  const isbn10 = raw.isbn?.find((id) => id.length === 10) ?? (isbn.length === 10 ? isbn : undefined)

  return {
    title: raw.title?.trim() ?? 'Unknown Title',
    authors: authors.length > 0 ? authors : ['Unknown Author'],
    source: 'openlibrary',
    isbn: isbn10,
    isbn13: isbn13,
    coverUrl,
    publisher: publisher || undefined,
    publishYear: extractYear(raw.publish_date),
    numberOfPages: typeof raw.number_of_pages === 'number' && raw.number_of_pages > 0
      ? raw.number_of_pages
      : undefined,
  }
}

export async function fetchBookByIsbn(isbn: string): Promise<Book> {
  const key = `ISBN:${isbn}`
  const url = `${API_BASE}?bibkeys=${encodeURIComponent(key)}&format=json&jscmd=data`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch book: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as OpenLibraryResponse
  const entry = data[key]
  if (!entry) {
    throw new Error('Book not found for this ISBN')
  }
  return normalizeOpenLibraryEntry(entry, isbn)
}

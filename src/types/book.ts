export type BookSource = 'openlibrary' | 'manual'

/**
 * Normalized book metadata (from Open Library or manual entry).
 */
export interface Book {
  title: string
  authors: string[]
  source?: BookSource
  isbn?: string
  isbn13?: string
  coverUrl?: string
  publisher?: string
  publishYear?: number
  numberOfPages?: number
}

export type BookStatus = 'planning' | 'reading' | 'finished'

/**
 * User's book entry with progress and status.
 */
export interface UserBook {
  id: string
  book: Book
  status: BookStatus
  currentPage: number
  addedAt: string // ISO date
  updatedAt: string // ISO date
}

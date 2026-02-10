import type { UserBook } from '../types'

const STORAGE_KEY = 'booktrail-library'

function readAll(): UserBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is UserBook =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as UserBook).id === 'string' &&
        typeof (item as UserBook).book === 'object' &&
        typeof (item as UserBook).status === 'string' &&
        typeof (item as UserBook).currentPage === 'number' &&
        typeof (item as UserBook).addedAt === 'string' &&
        typeof (item as UserBook).updatedAt === 'string'
    )
  } catch {
    return []
  }
}

function writeAll(books: UserBook[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export function getAllUserBooks(): UserBook[] {
  return readAll()
}

export function getUserBook(id: string): UserBook | null {
  const books = readAll()
  return books.find((b) => b.id === id) ?? null
}

export function upsertUserBook(userBook: UserBook): void {
  const books = readAll()
  const index = books.findIndex((b) => b.id === userBook.id)
  const now = new Date().toISOString()
  const toSave = {
    ...userBook,
    updatedAt: now,
  }
  if (index >= 0) {
    books[index] = toSave
  } else {
    books.push({ ...toSave, addedAt: toSave.addedAt || now })
  }
  writeAll(books)
}

export function deleteUserBook(id: string): void {
  const books = readAll().filter((b) => b.id !== id)
  writeAll(books)
}

export function clearLibrary(): void {
  writeAll([])
}

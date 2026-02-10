import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { isbnSchema } from '../lib/isbn'
import { fetchBookByIsbn } from '../services/openLibrary'
import { useLibrary } from '../hooks/useLibrary'
import { generateId } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { BookPreviewCard } from '../components/books/BookPreviewCard'
import { Alert } from '../components/ui/Alert'
import { BookCardSkeleton } from '../components/ui/Skeleton'
import { BottomSheet } from '../components/ui/BottomSheet'
import { ManualBookForm } from '../components/books/ManualBookForm'
import type { Book } from '../types'

const NOT_FOUND_MESSAGE = 'Book not found for this ISBN'

export function AddBookPage() {
  const navigate = useNavigate()
  const { addOrUpdate } = useLibrary()
  const [isbnInput, setIsbnInput] = useState('')
  const [isbnError, setIsbnError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [manualFormOpen, setManualFormOpen] = useState(false)
  const [failedIsbn, setFailedIsbn] = useState<string | null>(null)

  const fetchMutation = useMutation({
    mutationFn: async (isbn: string) => fetchBookByIsbn(isbn),
    onSuccess: () => {
      setIsbnError(null)
      setFailedIsbn(null)
    },
    onError: (error, isbn) => {
      setAdded(false)
      if (error instanceof Error && error.message === NOT_FOUND_MESSAGE) {
        setFailedIsbn(isbn)
      }
    },
  })

  function handleLookup() {
    setAdded(false)
    setFailedIsbn(null)
    const result = isbnSchema.safeParse(isbnInput.trim())
    if (!result.success) {
      setIsbnError(result.error.issues[0]?.message ?? 'Invalid ISBN')
      fetchMutation.reset()
      return
    }
    setIsbnError(null)
    fetchMutation.mutate(result.data)
  }

  function handleAdd(book: Book) {
    const id = generateId()
    const now = new Date().toISOString()
    addOrUpdate({
      id,
      book,
      status: 'planning',
      currentPage: 0,
      addedAt: now,
      updatedAt: now,
    })
    setAdded(true)
    fetchMutation.reset()
    setIsbnInput('')
  }

  function handleManualSave(book: Book) {
    const id = generateId()
    const now = new Date().toISOString()
    addOrUpdate({
      id,
      book,
      status: 'planning',
      currentPage: 0,
      addedAt: now,
      updatedAt: now,
    })
    setManualFormOpen(false)
    setFailedIsbn(null)
    fetchMutation.reset()
    navigate(`/book/${id}`)
  }

  const book = fetchMutation.data
  const isLoading = fetchMutation.isPending
  const fetchError = fetchMutation.isError ? fetchMutation.error : null
  const isNotFound =
    fetchError instanceof Error && fetchError.message === NOT_FOUND_MESSAGE

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-xl font-semibold text-neutral-900 mb-4">Add Book</h1>
      <div className="space-y-4">
        <Input
          id="isbn"
          label="ISBN (10 or 13)"
          placeholder="e.g. 9780132350889"
          value={isbnInput}
          onChange={(e) => {
            setIsbnInput(e.target.value)
            setIsbnError(null)
          }}
          error={isbnError ?? undefined}
          hint="Enter ISBN-10 or ISBN-13"
        />
        <Button
          type="button"
          onClick={handleLookup}
          disabled={!isbnInput.trim() || isLoading}
          fullWidth
        >
          {isLoading ? 'Looking up…' : 'Look up book'}
        </Button>
      </div>

      {fetchError && !isNotFound && (
        <Alert variant="error" title="Lookup failed" role="alert">
          {fetchError instanceof Error ? fetchError.message : 'Could not fetch book.'}
        </Alert>
      )}

      {isNotFound && failedIsbn && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Книгу не удалось найти автоматически
          </h2>
          <p className="text-sm text-neutral-700">
            Некоторые книги, особенно изданные в России, не индексируются в
            международных открытых каталогах. Вы можете добавить книгу вручную —
            это займёт меньше минуты.
          </p>
          <div className="rounded-[var(--radius-card,12px)] border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-800 mb-2">
              Где взять информацию о книге
            </p>
            <ul className="text-sm text-neutral-700 space-y-1 list-disc list-inside">
              <li>на обороте титульного листа в самой книге</li>
              <li>
                <a
                  href="https://search.rsl.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  Открыть каталог РГБ
                </a>
              </li>
            </ul>
          </div>
          <Button
            type="button"
            onClick={() => setManualFormOpen(true)}
            fullWidth
          >
            Добавить книгу вручную
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="mt-6">
          <BookCardSkeleton />
        </div>
      )}

      {book && !isLoading && (
        <div className="mt-6">
          <BookPreviewCard
            book={book}
            action={
              added ? (
                <p className="text-sm text-green-600 font-medium">Added to library</p>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleAdd(book)}
                  fullWidth
                >
                  Add to Library
                </Button>
              )
            }
          />
        </div>
      )}

      <BottomSheet
        isOpen={manualFormOpen}
        onClose={() => setManualFormOpen(false)}
        title="Добавить книгу вручную"
      >
        <ManualBookForm
          initialIsbn={failedIsbn ?? ''}
          onSave={handleManualSave}
          onCancel={() => setManualFormOpen(false)}
        />
      </BottomSheet>
    </div>
  )
}

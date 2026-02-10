import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLibrary } from '../hooks/useLibrary'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { BookCover } from '../components/books/BookCover'
import { ProgressBar } from '../components/books/ProgressBar'
import { BottomSheet } from '../components/ui/BottomSheet'
import { Input } from '../components/ui/Input'
import { Alert } from '../components/ui/Alert'
import type { BookStatus, UserBook } from '../types'

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
]

export function BookDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userBooks, addOrUpdate } = useLibrary()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pageInput, setPageInput] = useState('')
  const [pageError, setPageError] = useState<string | null>(null)

  if (!id) {
    return (
      <div className="p-4">
        <Alert variant="error">Invalid book ID.</Alert>
      </div>
    )
  }

  const found = userBooks.find((b) => b.id === id) ?? null
  if (!found) {
    return (
      <div className="p-4">
        <Alert variant="error" title="Not found">
          This book is not in your library.
        </Alert>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
          Back to Library
        </Button>
      </div>
    )
  }

  const userBook: UserBook = found
  const total = userBook.book.numberOfPages ?? 0

  function handleStatusChange(status: BookStatus) {
    addOrUpdate({ ...userBook, status })
  }

  function openSheet() {
    setPageInput(String(userBook.currentPage))
    setPageError(null)
    setSheetOpen(true)
  }

  function savePage() {
    const n = parseInt(pageInput.trim(), 10)
    if (Number.isNaN(n) || n < 0) {
      setPageError('Enter a valid page number (0 or more).')
      return
    }
    const max = total > 0 ? total : undefined
    if (max != null && n > max) {
      setPageError(`Page cannot exceed ${max}.`)
      return
    }
    addOrUpdate({ ...userBook, currentPage: n })
    setSheetOpen(false)
  }

  function adjustPage(delta: number) {
    const current = parseInt(pageInput.trim(), 10) || 0
    const n = Math.max(0, current + delta)
    const max = total > 0 ? total : n
    const clamped = max > 0 ? Math.min(n, max) : n
    setPageInput(String(clamped))
    setPageError(null)
  }

  const meta = [
    userBook.book.publisher,
    userBook.book.publishYear != null ? String(userBook.book.publishYear) : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col flex-1 p-4 pb-2">
      <Card className="p-4 mb-4">
        <div className="flex gap-4">
          <BookCover
            src={userBook.book.coverUrl}
            alt={userBook.book.title}
            className="h-40 w-28 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-neutral-900">
              {userBook.book.title}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              {userBook.book.authors.join(', ')}
            </p>
            {meta && (
              <p className="text-xs text-neutral-500 mt-1">{meta}</p>
            )}
            {total > 0 && (
              <p className="text-xs text-neutral-500">{total} pages</p>
            )}
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Status
        </label>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStatusChange(opt.value)}
              aria-pressed={userBook.status === opt.value}
              className={`
                min-h-[var(--min-touch,44px)] px-4 rounded-[var(--radius-button,8px)] text-sm font-medium
                ${userBook.status === opt.value ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {total > 0 && (
        <div className="mb-4">
          <ProgressBar
            current={userBook.currentPage}
            total={total}
          />
          <Button
            type="button"
            variant="secondary"
            className="mt-2 w-full"
            onClick={openSheet}
          >
            Update page
          </Button>
        </div>
      )}

      {total <= 0 && userBook.status === 'reading' && (
        <div className="mb-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={openSheet}
          >
            Set current page
          </Button>
        </div>
      )}

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Update progress"
      >
        <div className="space-y-4">
          <Input
            id="current-page"
            label="Current page"
            type="number"
            min={0}
            max={total > 0 ? total : undefined}
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value)
              setPageError(null)
            }}
            error={pageError ?? undefined}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => adjustPage(-10)}
              aria-label="Subtract 10 pages"
            >
              −10
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => adjustPage(-1)}
              aria-label="Subtract 1 page"
            >
              −1
            </Button>
            <span className="flex-1 text-center text-sm text-neutral-600">
              {pageInput || '0'} {total > 0 ? `/ ${total}` : ''}
            </span>
            <Button
              type="button"
              variant="secondary"
              onClick={() => adjustPage(1)}
              aria-label="Add 1 page"
            >
              +1
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => adjustPage(10)}
              aria-label="Add 10 pages"
            >
              +10
            </Button>
          </div>
          <Button type="button" fullWidth onClick={savePage}>
            Save
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}

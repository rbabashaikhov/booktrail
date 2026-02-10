import { Card } from '../ui/Card'
import { BookCover } from './BookCover'
import type { Book } from '../../types'

interface BookPreviewCardProps {
  book: Book
  action: React.ReactNode
}

export function BookPreviewCard({ book, action }: BookPreviewCardProps) {
  const authors = book.authors.join(', ')
  const meta = [book.publisher, book.publishYear].filter(Boolean).join(' · ')
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <BookCover
          src={book.coverUrl}
          alt={book.title}
          className="h-32 w-24 shrink-0"
        />
        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <h2 className="font-semibold text-neutral-900">{book.title}</h2>
          <p className="text-sm text-neutral-600">{authors}</p>
          {meta && <p className="text-xs text-neutral-500">{meta}</p>}
          {book.numberOfPages != null && (
            <p className="text-xs text-neutral-500">{book.numberOfPages} pages</p>
          )}
          <div className="mt-auto pt-2">{action}</div>
        </div>
      </div>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { BookCover } from './BookCover'
import type { UserBook } from '../../types'

interface BookCardProps {
  userBook: UserBook
}

function formatProgress(userBook: UserBook): string | null {
  if (userBook.status !== 'reading') return null
  const total = userBook.book.numberOfPages
  if (total == null || total <= 0) return `${userBook.currentPage} p.`
  const pct = Math.min(100, Math.round((userBook.currentPage / total) * 100))
  return `${userBook.currentPage}/${total} (${pct}%)`
}

export function BookCard({ userBook }: BookCardProps) {
  const progress = formatProgress(userBook)
  const authors = userBook.book.authors.join(', ')

  return (
    <Link to={`/book/${userBook.id}`} className="block">
      <Card className="flex gap-3 p-3 hover:border-neutral-300 transition-colors">
        <BookCover
          src={userBook.book.coverUrl}
          alt={userBook.book.title}
          className="h-24 w-16 shrink-0"
        />
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <h3 className="font-medium text-neutral-900 truncate">
            {userBook.book.title}
          </h3>
          <p className="text-sm text-neutral-600 truncate">{authors}</p>
          {progress && (
            <p className="text-sm text-blue-600 mt-1">{progress}</p>
          )}
        </div>
      </Card>
    </Link>
  )
}

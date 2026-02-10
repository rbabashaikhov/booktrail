import { useMemo, useState } from 'react'
import { Tabs } from '../components/ui/Tabs'
import { Input } from '../components/ui/Input'
import { BookCard } from '../components/books/BookCard'
import { BookCardSkeleton } from '../components/ui/Skeleton'
import { useLibrary } from '../hooks/useLibrary'
import type { BookStatus } from '../types'

const TABS: { value: BookStatus; label: string }[] = [
  { value: 'reading', label: 'Reading' },
  { value: 'planning', label: 'Planning' },
  { value: 'finished', label: 'Finished' },
]

export function LibraryPage() {
  const { userBooks, isLoading } = useLibrary()
  const [activeTab, setActiveTab] = useState<BookStatus>('reading')
  const [search, setSearch] = useState('')

  const byStatus = useMemo(() => {
    const filtered = userBooks.filter((b) => b.status === activeTab)
    const q = search.trim().toLowerCase()
    if (!q) return filtered
    return filtered.filter(
      (b) =>
        b.book.title.toLowerCase().includes(q) ||
        b.book.authors.some((a) => a.toLowerCase().includes(q))
    )
  }, [userBooks, activeTab, search])

  const counts = useMemo(
    () => ({
      reading: userBooks.filter((b) => b.status === 'reading').length,
      planning: userBooks.filter((b) => b.status === 'planning').length,
      finished: userBooks.filter((b) => b.status === 'finished').length,
    }),
    [userBooks]
  )

  const tabItems = TABS.map((t) => ({ ...t, count: counts[t.value] }))

  return (
    <div className="flex flex-col flex-1 p-4 pb-2">
      <h1 className="text-xl font-semibold text-neutral-900 mb-4">Library</h1>
      <Tabs
        items={tabItems}
        value={activeTab}
        onChange={setActiveTab}
        aria-label="Library tabs"
      />
      <div className="mt-4">
        <Input
          id="library-search"
          label="Search"
          type="search"
          placeholder="Title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search by title or author"
        />
      </div>
      <div className="mt-4 flex-1 min-h-0">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : byStatus.length === 0 ? (
          <EmptyState tab={activeTab} hasSearch={search.trim().length > 0} />
        ) : (
          <ul className="space-y-2 list-none p-0 m-0">
            {byStatus.map((ub) => (
              <li key={ub.id}>
                <BookCard userBook={ub} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  tab,
  hasSearch,
}: {
  tab: BookStatus
  hasSearch: boolean
}) {
  const message = hasSearch
    ? 'No books match your search.'
    : tab === 'reading'
      ? 'No books in progress. Add a book and set status to Reading.'
      : tab === 'planning'
        ? 'No books in your planning list.'
        : 'No finished books yet.'
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-neutral-600">
      <p className="text-sm">{message}</p>
    </div>
  )
}

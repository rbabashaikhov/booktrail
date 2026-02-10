import { useMemo } from 'react'
import { useLibrary } from '../hooks/useLibrary'
import { Card } from '../components/ui/Card'

export function StatsPage() {
  const { userBooks } = useLibrary()

  const stats = useMemo(() => {
    const reading = userBooks.filter((b) => b.status === 'reading').length
    const planning = userBooks.filter((b) => b.status === 'planning').length
    const finished = userBooks.filter((b) => b.status === 'finished').length
    const total = userBooks.length
    return { reading, planning, finished, total }
  }, [userBooks])

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-xl font-semibold text-neutral-900 mb-4">Stats</h1>
      <div className="grid gap-4">
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Total books</p>
          <p className="text-2xl font-semibold text-neutral-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Reading</p>
          <p className="text-2xl font-semibold text-blue-600">{stats.reading}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Planning</p>
          <p className="text-2xl font-semibold text-neutral-900">{stats.planning}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Finished</p>
          <p className="text-2xl font-semibold text-green-600">{stats.finished}</p>
        </Card>
      </div>
    </div>
  )
}

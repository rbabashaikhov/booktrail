import { useState } from 'react'
import { useLibrary } from '../hooks/useLibrary'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

export function SettingsPage() {
  const { userBooks, clear } = useLibrary()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleClear() {
    clear()
    setConfirmOpen(false)
  }

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-xl font-semibold text-neutral-900 mb-4">Settings</h1>

      <Card className="p-4 mb-4">
        <h2 className="font-medium text-neutral-900 mb-2">About</h2>
        <p className="text-sm text-neutral-600">
          BookTrail — your reading diary and progress tracker. Data is stored
          locally on this device. No backend.
        </p>
      </Card>

      <Card className="p-4">
        <h2 className="font-medium text-neutral-900 mb-2">Library</h2>
        <p className="text-sm text-neutral-600 mb-4">
          Clear all books from your library. This cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => setConfirmOpen(true)}
          disabled={userBooks.length === 0}
        >
          Clear library
        </Button>
      </Card>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear library?"
      >
        <p className="text-neutral-700 mb-4">
          This will remove all {userBooks.length} book(s). This action cannot be
          undone.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleClear}>
            Clear all
          </Button>
        </div>
      </Modal>
    </div>
  )
}

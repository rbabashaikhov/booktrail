import { Modal } from './Modal'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/**
 * Mobile-first bottom sheet (uses Modal with bottom slide on small screens).
 */
export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Modal>
  )
}

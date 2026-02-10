import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  'aria-describedby'?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  'aria-describedby': ariaDescribedBy,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !ref.current) return
    ref.current.focus({ preventScroll: true })
  }, [isOpen])

  if (!isOpen) return null

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={ariaDescribedBy}
    >
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative w-full max-w-md max-h-[90vh] overflow-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl modal-panel"
      >
        <div className="sticky top-0 flex items-center justify-between gap-2 p-4 border-b border-neutral-200 bg-white">
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[var(--min-touch,44px)] min-h-[var(--min-touch,44px)] flex items-center justify-center rounded-[var(--radius-button,8px)] text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

import type { ReactNode } from 'react'

type Variant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: Variant
  title?: string
  children: ReactNode
  role?: 'alert' | 'status'
}

const variantClasses: Record<Variant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

export function Alert({
  variant = 'info',
  title,
  children,
  role = 'alert',
}: AlertProps) {
  return (
    <div
      role={role}
      className={`rounded-[var(--radius-card,12px)] border p-4 ${variantClasses[variant]}`}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  )
}

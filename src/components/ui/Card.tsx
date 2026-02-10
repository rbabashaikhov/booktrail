import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-card,12px)] bg-white shadow-[var(--shadow-card)] border border-neutral-200 overflow-hidden ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

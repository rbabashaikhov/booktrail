import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-neutral-300 disabled:text-neutral-500',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-300 disabled:opacity-50',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50',
}

export function Button({
  variant = 'primary',
  fullWidth,
  className = '',
  disabled,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        min-h-[var(--min-touch,44px)] min-w-[var(--min-touch,44px)]
        px-4 rounded-[var(--radius-button,8px)] font-medium
        transition-colors
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

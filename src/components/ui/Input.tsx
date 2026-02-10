import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  hint?: string
}

export function Input({
  id,
  label,
  error,
  hint,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`
          min-h-[var(--min-touch,44px)] px-3 rounded-[var(--radius-button,8px)]
          border border-neutral-300 bg-white text-neutral-900
          placeholder:text-neutral-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          disabled:bg-neutral-100 disabled:text-neutral-500
          ${error ? 'border-red-500' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  )
}

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  if (total <= 0) return null
  const pct = Math.min(100, Math.round((current / total) * 100))
  return (
    <div className={className} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={`Reading progress: ${current} of ${total} pages`}>
      <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-neutral-600 mt-1">
        {current} / {total} pages ({pct}%)
      </p>
    </div>
  )
}

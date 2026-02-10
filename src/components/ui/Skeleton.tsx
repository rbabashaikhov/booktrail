interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 ${className}`.trim()}
      aria-hidden
    />
  )
}

export function BookCardSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-24 w-16 shrink-0 rounded" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3 mt-1" />
      </div>
    </div>
  )
}

interface BookCoverProps {
  src?: string | null
  alt: string
  className?: string
}

export function BookCover({ src, alt, className = '' }: BookCoverProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 text-neutral-500 text-xs rounded overflow-hidden ${className}`}
        aria-hidden
      >
        No cover
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover rounded overflow-hidden bg-neutral-100 ${className}`}
      loading="lazy"
    />
  )
}

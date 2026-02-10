import type { ReactNode } from 'react'

export interface TabItem<T extends string> {
  value: T
  label: string
  count?: number
}

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  'aria-label': ariaLabel,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 p-1 bg-neutral-100 rounded-[var(--radius-button,8px)]"
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          aria-selected={value === item.value}
          aria-controls={`panel-${item.value}`}
          id={`tab-${item.value}`}
          tabIndex={value === item.value ? 0 : -1}
          onClick={() => onChange(item.value)}
          className={`
            flex-1 min-h-[var(--min-touch,44px)] px-3 rounded-[var(--radius-button,8px)]
            text-sm font-medium transition-colors
            ${value === item.value ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}
          `}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ml-1 opacity-70">({item.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}

export function TabPanel<T extends string>({
  value,
  activeValue,
  id,
  children,
}: {
  value: T
  activeValue: T
  id: string
  children: ReactNode
}) {
  if (value !== activeValue) return null
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={`tab-${value}`}
      className="py-2"
    >
      {children}
    </div>
  )
}

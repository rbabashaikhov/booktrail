import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

interface BottomNavProps {
  items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  const location = useLocation()

  return (
    <nav
      className="flex items-center justify-around min-h-[56px] px-2 py-2 bg-white border-t border-neutral-200 safe-area-pb"
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive ? 'page' : undefined}
            className={`
              flex flex-col items-center justify-center gap-0.5 min-w-[var(--min-touch,44px)] min-h-[var(--min-touch,44px)]
              rounded-[var(--radius-button,8px)] text-sm font-medium
              ${isActive ? 'text-blue-600' : 'text-neutral-600 hover:text-neutral-900'}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Bosh sahifa', end: true },
  { to: '/restoranlar', label: 'Restoranlar' },
  { to: '/kategoriyalar', label: 'Kategoriyalar' },
  { to: '/aksiyalar', label: 'Aksiyalar' },
  { to: '/buyurtmalarim', label: 'Buyurtmalarim' },
]

type NavigationProps = {
  className?: string
  onNavigate?: () => void
  stacked?: boolean
}

export function Navigation({ className = '', onNavigate, stacked }: NavigationProps) {
  return (
    <nav className={className}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            stacked
              ? `rounded-[12px] px-[12px] py-[10px] text-[14px] font-semibold ${
                  isActive ? 'bg-[#F97316] text-white' : 'text-[#141b2b]'
                }`
              : `flex h-[36px] cursor-pointer items-center rounded-full px-[22px] text-[13px] leading-[18px] font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none ${
                  isActive
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#584237] hover:bg-[#F1F3FF] hover:text-[#141b2b]'
                }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export { navItems }

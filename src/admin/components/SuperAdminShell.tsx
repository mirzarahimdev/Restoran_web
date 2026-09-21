import { NavLink, Outlet } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { Logo } from '../../components/ui/Logo'
import { AdminUserMenu } from './AdminUserMenu'

const navItems = [
  { to: '/super-admin', label: 'Dashboard', end: true },
  { to: '/super-admin/restoranlar', label: 'Restoranlar' },
  { to: '/super-admin/adminlar', label: 'Adminlar' },
  { to: '/super-admin/buyurtmalar', label: 'Global Buyurtmalar' },
  { to: '/super-admin/moliya', label: 'Moliya' },
  { to: '/super-admin/hisobotlar', label: 'Hisobotlar' },
  { to: '/super-admin/loglar', label: 'Loglar' },
  { to: '/super-admin/sozlamalar', label: 'Sozlamalar' },
]

export function SuperAdminShell() {
  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#141b2b] antialiased">
      <header className="fixed top-0 z-50 w-full bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div className="flex flex-col">
                <span className="text-[18px] leading-none font-bold tracking-tight">
                  Food<span className="text-[#F97316]">UZ</span>
                </span>
                <span className="mt-0.5 text-[11px] font-semibold text-[#855300]">
                  Super Admin Master
                </span>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-[#F1F3FF] px-3 py-1 text-[11px] text-[#584237] lg:flex">
              <Icon name="hub" className="text-[16px] text-[#F97316]" />
              <span className="font-semibold text-[#141b2b]">Respublika tarmog&apos;i</span>
              <span className="font-bold text-[#F97316]">(5 hudud, 142 filial)</span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-full bg-[#F1F3FF] px-2 py-1 xl:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                    isActive
                      ? 'bg-[#F97316] font-bold text-white shadow-sm'
                      : 'font-semibold text-[#584237] hover:text-[#141b2b]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden w-56 items-center sm:flex">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 text-[20px] text-[#584237]"
              />
              <input
                type="search"
                placeholder="Tizim bo'ylab qidiruv..."
                className="h-9 w-full rounded-full bg-[#F1F3FF] pr-3 pl-9 text-[12px] outline-none placeholder:text-[#584237]/60 focus:bg-white"
              />
            </div>
            <button
              type="button"
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF]"
            >
              <Icon name="notifications" className="text-[20px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#BA1A1A] ring-2 ring-white" />
            </button>
            <AdminUserMenu
              name="Aziza Karimova"
              role="Super Administrator"
              roleClassName="text-[#855300]"
              statusDotClassName="bg-[#F97316]"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100vh-64px)] max-w-[1440px] bg-[#F9F9FF] px-6 pt-16 pb-6">
        <div className="pt-6">
          <Outlet />
        </div>
      </main>

      <footer className="w-full bg-white py-4 shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 text-[12px] text-[#584237] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#141b2b]">FoodUZ FoodTech Ecosystem</span>
            <span>•</span>
            <span>Super Admin Boshqaruv Markazi v2.4</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-[#855300]">
              <span className="h-2 w-2 rounded-full bg-[#FEA619]" />
              Server holati: 99.98% Barqaror
            </span>
            <span>© 2025 FoodUZ Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

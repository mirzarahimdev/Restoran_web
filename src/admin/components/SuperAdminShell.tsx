import { NavLink, Outlet } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { Logo } from '../../components/ui/Logo'
import { useAdminAuth } from '../auth/AdminAuthContext'
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
  const { user } = useAdminAuth()

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#141b2b] antialiased">
      {/* AppBar */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex h-[72px] w-full items-center justify-between gap-4 px-6">
          {/* Chap: logo + tarmoq */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} linkTo={false} />
              <div className="flex flex-col justify-center">
                <span className="text-[18px] leading-5 font-bold tracking-tight text-[#141b2b]">
                  FoodUZ
                </span>
                <span className="text-[11px] leading-4 font-semibold text-[#855300]">
                  Super Admin Master
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-[#F1F3FF] px-3 py-2 text-[12px] lg:flex">
              <Icon name="hub" className="text-[16px] text-[#9D4300]" />
              <span className="font-semibold text-[#141b2b]">Respublika tarmog&apos;i</span>
              <span className="font-bold text-[#9D4300]">(5 hudud, 142 filial)</span>
            </div>
          </div>

          {/* O‘rta: menyu */}
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

          {/* O‘ng: qidiruv + bell + profil */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="relative hidden w-56 items-center sm:flex">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 text-[20px] text-[#584237]"
              />
              <input
                type="search"
                placeholder="Tizim bo'ylab qidiruv..."
                className="h-9 w-full rounded-full bg-[#F1F3FF] pr-3 pl-9 text-[12px] text-[#141b2b] outline-none placeholder:text-[#584237]/60 focus:bg-white"
              />
            </div>

            <button
              type="button"
              aria-label="Bildirishnomalar"
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF]"
            >
              <Icon name="notifications" className="text-[20px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#BA1A1A] ring-2 ring-white" />
            </button>

            <AdminUserMenu
              name={user?.displayName || 'Aziza Karimova'}
              role="Super Administrator"
              panelRole="super-admin"
              roleClassName="text-[#855300]"
              statusDotClassName="bg-[#9D4300]"
            />
          </div>
        </div>

        {/* Kichik ekran menyusi */}
        <div className="flex gap-1 overflow-x-auto border-t border-[#E9EDFF] px-4 py-2 xl:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1.5 text-[12px] ${
                  isActive
                    ? 'bg-[#F97316] font-bold text-white'
                    : 'bg-[#F1F3FF] font-semibold text-[#584237]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="min-h-screen w-full bg-[#F9F9FF] px-6 pt-[116px] pb-6 xl:pt-[72px]">
        <div className="pt-6">
          <Outlet />
        </div>
      </main>

      <footer className="w-full bg-white py-4 shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center justify-between gap-2 px-6 text-[12px] text-[#584237] sm:flex-row">
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

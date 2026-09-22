import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { Logo } from '../../components/ui/Logo'
import { useAdminAuth } from '../auth/AdminAuthContext'
import { AdminBranchSelector } from './AdminBranchSelector'
import { AdminUserMenu } from './AdminUserMenu'

type NavItem = {
  to: string
  label: string
  icon: string
  badge?: string
  end?: boolean
}

const mainNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/buyurtmalar', label: 'Buyurtmalar', icon: 'receipt_long', badge: '8' },
  { to: '/admin/profil', label: 'Restoran profili', icon: 'storefront' },
]

const catalogNav: NavItem[] = [
  { to: '/admin/menyu', label: 'Menyu boshqaruvi', icon: 'restaurant_menu' },
  { to: '/admin/toifalar', label: 'Toifalar', icon: 'category' },
  { to: '/admin/mahsulotlar', label: 'Mahsulotlar', icon: 'inventory_2' },
  { to: '/admin/aksiyalar', label: 'Aksiyalar', icon: 'local_offer' },
]

const analyticsNav: NavItem[] = [
  { to: '/admin/mijozlar', label: 'Mijozlar', icon: 'group' },
  { to: '/admin/sharhlar', label: 'Sharhlar', icon: 'reviews' },
  { to: '/admin/tolovlar', label: "To'lovlar", icon: 'payments' },
  { to: '/admin/statistika', label: 'Statistika & Tahlil', icon: 'query_stats' },
]

/** AppBar balandligi */
const APPBAR_OFFSET = 72

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <div className="px-4 pt-4 pb-1.5">
        <span className="px-3 text-[12px] font-bold tracking-wider text-[#584237]/75 uppercase">
          {title}
        </span>
      </div>
      <nav className="flex flex-col gap-1.5 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors ${
                isActive
                  ? 'bg-[#F97316] font-bold text-white shadow-sm'
                  : 'text-[#584237] hover:bg-[#F1F3FF] hover:text-[#141b2b]'
              }`
            }
          >
            <span className="flex items-center gap-3.5">
              <Icon name={item.icon} className="text-[24px]" />
              <span className="text-[15px] font-semibold">{item.label}</span>
            </span>
            {item.badge && (
              <span className="rounded-full bg-[#FF6D2C] px-2.5 py-0.5 text-[12px] font-bold text-white shadow-sm">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function AdminShell() {
  const navigate = useNavigate()
  const { user, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    navigate('/kirish')
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#141b2b] antialiased">
      {/* AppBar — tepaga yopishgan, widgetlar to‘liq */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center gap-3 overflow-visible bg-white px-5 pr-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] xl:gap-5 xl:px-6">
        {/* FoodUZ */}
        <div className="flex shrink-0 items-center gap-3">
          <Logo size="sm" showText={false} linkTo={false} />
          <div className="flex flex-col justify-center">
            <span className="text-[18px] leading-5 font-bold tracking-tight text-[#141b2b]">
              FoodUZ
            </span>
            <span className="text-[11px] leading-4 font-medium text-[#584237]">
              Restoran Admin
            </span>
          </div>
        </div>

        {/* Qidiruv */}
        <div className="relative hidden w-[220px] shrink-0 items-center min-[1100px]:flex xl:w-[280px]">
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#584237]"
          />
          <input
            type="search"
            placeholder="Buyurtma, taom yoki ID izlash..."
            className="h-11 w-full rounded-full bg-[#F1F3FF] pr-3 pl-10 text-[13px] leading-none text-[#141b2b] outline-none placeholder:text-[#584237]/60 focus:bg-[#F9F9FF]"
          />
        </div>

        {/* Filial tanlash */}
        <AdminBranchSelector />

        <div className="min-w-2 flex-1" />

        {/* Amallar + profil — hech narsa kesilmasin */}
        <div className="flex shrink-0 items-center gap-3 overflow-visible">
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#F97316] px-4 text-[13px] font-bold whitespace-nowrap text-white shadow-[0_4px_12px_rgba(249,115,22,0.25)] transition-transform hover:bg-[#A73A00] active:scale-95"
          >
            <Icon name="add_circle" className="text-[20px]" />
            <span>+ Yangi qo&apos;shish</span>
          </button>

          <button
            type="button"
            aria-label="Bildirishnomalar"
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF]"
          >
            <Icon name="notifications" className="text-[22px]" />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-[#BA1A1A] ring-2 ring-white" />
          </button>

          <AdminUserMenu
            name={user?.displayName || 'Aziza Karimova'}
            role="Restoran Boshqaruvchisi"
            panelRole="admin"
            roleClassName="text-[#9D4300]"
            statusDotClassName="bg-[#FEA619]"
          />
        </div>
      </header>

      <aside
        className="fixed bottom-0 left-0 z-40 flex w-[280px] flex-col justify-between overflow-y-auto bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
        style={{ top: APPBAR_OFFSET }}
      >
        <div>
          <NavSection title="Asosiy" items={mainNav} />
          <NavSection title="Katalog & Menyular" items={catalogNav} />
          <NavSection title="Mijozlar & Tahlil" items={analyticsNav} />
        </div>

        <div className="border-t border-[#E9EDFF]/60 p-3">
          <nav className="flex flex-col gap-1.5">
            <NavLink
              to="/admin/sozlamalar"
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-[#F97316] font-bold text-white'
                    : 'text-[#584237] hover:bg-[#F1F3FF] hover:text-[#141b2b]'
                }`
              }
            >
              <Icon name="settings" className="text-[24px]" />
              <span className="text-[15px] font-semibold">Sozlamalar</span>
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[#BA1A1A] hover:bg-[#FFDAD6]"
            >
              <Icon name="logout" className="text-[24px]" />
              <span className="text-[15px] font-semibold">Tizimdan chiqish</span>
            </button>
          </nav>
        </div>
      </aside>

      <main
        className="min-h-screen bg-[#F9F9FF] pl-[280px]"
        style={{ paddingTop: APPBAR_OFFSET }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

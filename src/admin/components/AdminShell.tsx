import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { Logo } from '../../components/ui/Logo'
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

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <div className="px-4 pt-4 pb-1">
        <span className="px-3 text-[11px] font-semibold tracking-wider text-[#584237]/70 uppercase">
          {title}
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-[#F97316] font-bold text-white shadow-sm'
                  : 'text-[#584237] hover:bg-[#F1F3FF] hover:text-[#141b2b]'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon name={item.icon} className="text-[20px]" />
              <span className="text-[13px] font-semibold">{item.label}</span>
            </span>
            {item.badge && (
              <span className="rounded-full bg-[#FF6D2C] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
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

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#141b2b] antialiased">
      <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col justify-between overflow-y-auto bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex h-16 items-center gap-3 px-5">
            <Logo size="sm" showText={false} />
            <div className="flex flex-col">
              <span className="text-[18px] leading-none font-bold tracking-tight">
                Food<span className="text-[#F97316]">UZ</span>
              </span>
              <span className="mt-0.5 text-[11px] font-medium text-[#584237]">Restoran Admin</span>
            </div>
          </div>
          <NavSection title="Asosiy" items={mainNav} />
          <NavSection title="Katalog & Menyular" items={catalogNav} />
          <NavSection title="Mijozlar & Tahlil" items={analyticsNav} />
        </div>

        <div className="mt-4 p-3">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/admin/sozlamalar"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-[#F97316] font-bold text-white'
                    : 'text-[#584237] hover:bg-[#F1F3FF] hover:text-[#141b2b]'
                }`
              }
            >
              <Icon name="settings" className="text-[20px]" />
              <span className="text-[13px] font-semibold">Sozlamalar</span>
            </NavLink>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[#BA1A1A] transition-colors hover:bg-[#FFDAD6]"
            >
              <Icon name="logout" className="text-[20px]" />
              <span className="text-[13px] font-semibold">Tizimdan chiqish</span>
            </button>
          </nav>
        </div>
      </aside>

      <div className="pl-[260px]">
        <header className="fixed top-0 right-0 left-[260px] z-40 flex h-16 items-center justify-between bg-white/90 px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative flex w-72 items-center">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 text-[20px] text-[#584237]"
              />
              <input
                type="search"
                placeholder="Buyurtma, taom yoki ID izlash..."
                className="h-10 w-full rounded-full bg-[#F1F3FF] pr-3 pl-10 text-[12px] text-[#141b2b] outline-none placeholder:text-[#584237]/60 focus:bg-white"
              />
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-[#F1F3FF] px-3 py-1.5 text-[11px] text-[#584237] xl:flex">
              <Icon name="location_on" className="text-[18px] text-[#F97316]" />
              <span className="font-semibold text-[#141b2b]">Toshkent, Chilonzor filiali</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#FEA619]" />
              <span className="font-bold text-[#855300]">Faol (Ochiq)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#F97316] px-4 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(249,115,22,0.25)] transition-transform hover:bg-[#A73A00] active:scale-95"
            >
              <Icon name="add_circle" className="text-[20px]" />
              <span>+ Yangi qo&apos;shish</span>
            </button>
            <button
              type="button"
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF]"
            >
              <Icon name="notifications" className="text-[20px]" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#BA1A1A] ring-2 ring-white" />
            </button>
            <AdminUserMenu
              name="Aziza Karimova"
              role="Restoran Boshqaruvchisi"
              roleClassName="text-[#F97316]"
              statusDotClassName="bg-[#FEA619]"
            />
          </div>
        </header>

        <main className="min-h-screen bg-[#F9F9FF] p-6 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

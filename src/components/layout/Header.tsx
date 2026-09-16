import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { CartButton } from './CartButton'
import { LanguageSelector } from './LanguageSelector'
import { LocationSelector } from './LocationSelector'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()

  return (
    <header className="fixed inset-x-0 top-[15px] z-50 w-full bg-white/90 shadow-[0_4px_24px_rgba(20,27,43,0.04)] backdrop-blur-xl">
      <div className="flex h-[56px] w-full items-center gap-[12px] px-[55px]">
        <div className="flex min-w-0 shrink-0 items-center gap-[12px]">
          <Logo size="sm" />
          <LocationSelector className="hidden min-[900px]:inline-flex" />
          <Link
            to="/restoranlar"
            aria-label={t('header.search')}
            className="hidden h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E9EDFF] text-[#584237] transition-colors hover:bg-[#dde2f8] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none min-[1100px]:flex"
          >
            <Icon name="search" className="text-[18px]" />
          </Link>
        </div>

        <Navigation className="mx-auto hidden items-center gap-[10px] md:flex" />

        <div className="ml-auto flex shrink-0 items-center gap-[10px]">
          <LanguageSelector className="hidden lg:block" />

          <Link
            to="/sevimlilar"
            aria-label={t('header.favorites')}
            className="hidden h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237] transition-colors hover:bg-[#E9EDFF] hover:text-[#BA1A1A] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none sm:flex"
          >
            <Icon name="favorite" className="text-[18px]" />
          </Link>

          <CartButton />

          {user ? (
            <UserMenu />
          ) : (
            <Link
              to="/kirish"
              className="hidden h-[36px] items-center rounded-full bg-[#F97316] px-[16px] text-[13px] font-bold text-white transition-colors hover:bg-[#EA580C] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none sm:inline-flex"
            >
              {t('header.login')}
            </Link>
          )}

          <button
            type="button"
            className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#141b2b] transition-colors hover:bg-[#E9EDFF] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none md:hidden"
            aria-label={t('header.menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#E9EDFF] bg-white px-[55px] py-[12px] md:hidden">
          <LocationSelector className="mb-[8px] inline-flex w-full max-w-none" />
          <div className="mb-[8px] flex justify-end">
            <LanguageSelector />
          </div>
          <Link
            to="/sevimlilar"
            onClick={() => setMenuOpen(false)}
            className="mb-[8px] flex w-full cursor-pointer items-center gap-[8px] rounded-[12px] bg-[#F1F3FF] px-[12px] py-[10px] text-[14px] font-semibold text-[#141b2b]"
          >
            <Icon name="favorite" className="text-[20px] text-[#584237]" />
            {t('header.favorites')}
          </Link>
          {user ? (
            <Link
              to="/profil"
              onClick={() => setMenuOpen(false)}
              className="mb-[8px] flex w-full cursor-pointer items-center gap-[8px] rounded-[12px] bg-[#F1F3FF] px-[12px] py-[10px] text-[14px] font-semibold text-[#141b2b]"
            >
              <Icon name="person" className="text-[20px] text-[#584237]" />
              {t('header.profile')} ({user.fullName})
            </Link>
          ) : (
            <>
              <Link
                to="/kirish"
                onClick={() => setMenuOpen(false)}
                className="mb-[8px] flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#F97316] px-[12px] py-[10px] text-[14px] font-bold text-white"
              >
                {t('header.login')}
              </Link>
              <Link
                to="/royxatdan-otish"
                onClick={() => setMenuOpen(false)}
                className="mb-[8px] flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-[12px] border border-[#E5E7EB] bg-white px-[12px] py-[10px] text-[14px] font-semibold text-[#141b2b]"
              >
                {t('header.register')}
              </Link>
            </>
          )}
          <Navigation
            stacked
            className="flex flex-col gap-[4px]"
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}

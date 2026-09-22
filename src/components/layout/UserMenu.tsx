import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { Icon } from '../ui/Icon'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function UserMenu() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!user) return null

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/')
  }

  return (
    <div ref={rootRef} className="relative hidden sm:block">
      <div className="inline-flex h-[36px] max-w-[240px] items-center gap-[8px]">
        <Link
          to="/profil"
          className="inline-flex min-w-0 cursor-pointer items-center gap-[8px] rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-[32px] w-[32px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#E9EDFF] text-[11px] font-bold tracking-wide text-[#584237]">
              {initials(user.fullName)}
            </span>
          )}
          <span className="min-w-0 truncate text-[13px] font-semibold text-[#141b2b]">
            {user.fullName}
          </span>
        </Link>

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={t('header.profile')}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-[28px] w-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#F1F3FF] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none"
        >
          <Icon
            name="expand_more"
            className={`text-[18px] text-[#C0C4CC] transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute top-[42px] right-0 z-50 min-w-[168px] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white py-[6px] shadow-[0_12px_32px_rgba(20,27,43,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-[8px] px-[14px] py-[10px] text-left text-[13px] font-semibold text-[#141b2b] transition-colors hover:bg-[#F1F3FF]"
          >
            <Icon name="logout" className="text-[18px]" />
            Tizimdan chiqish
          </button>
        </div>
      )}
    </div>
  )
}

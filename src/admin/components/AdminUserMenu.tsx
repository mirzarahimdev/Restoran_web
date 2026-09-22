import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { useAdminAuth, type PanelRole } from '../auth/AdminAuthContext'

const PROFILE_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face'

type AdminUserMenuProps = {
  name: string
  role: string
  panelRole: PanelRole
  roleClassName?: string
  statusDotClassName?: string
  avatarUrl?: string
}

export function AdminUserMenu({
  name,
  role,
  roleClassName = 'text-[#855300]',
  statusDotClassName = 'bg-[#F97316]',
  avatarUrl = PROFILE_AVATAR,
}: AdminUserMenuProps) {
  const navigate = useNavigate()
  const { logout } = useAdminAuth()
  const [open, setOpen] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

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

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/kirish')
  }

  return (
    <div ref={rootRef} className="relative shrink-0 overflow-visible">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Profil menyusi"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 cursor-pointer items-center gap-3 overflow-visible border-l border-[#E9EDFF] py-1 pr-1 pl-4 select-none"
      >
        <div className="relative h-9 w-9 shrink-0 overflow-visible">
          {!imgFailed ? (
            <img
              src={avatarUrl}
              alt={name}
              width={36}
              height={36}
              onError={() => setImgFailed(true)}
              className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-white"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFDBCA] text-[12px] font-bold text-[#9D4300] shadow-sm ring-2 ring-white">
              {initials || 'A'}
            </span>
          )}
          <span
            className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusDotClassName}`}
          />
        </div>
        <div className="hidden min-w-0 flex-col text-left sm:flex">
          <span className="text-[13px] leading-tight font-bold whitespace-nowrap text-[#141b2b]">
            {name}
          </span>
          <span className={`text-[11px] leading-tight font-semibold whitespace-nowrap ${roleClassName}`}>
            {role}
          </span>
        </div>
        <Icon
          name="expand_more"
          className={`shrink-0 text-[18px] text-[#584237] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+10px)] right-0 z-50 min-w-[180px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-[0_8px_24px_rgba(20,27,43,0.1)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-[13px] font-medium text-[#141b2b] hover:bg-[#F1F3FF]"
          >
            <Icon name="logout" className="text-[18px]" />
            Tizimdan chiqish
          </button>
        </div>
      )}
    </div>
  )
}

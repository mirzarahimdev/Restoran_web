import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'

type AdminUserMenuProps = {
  name: string
  role: string
  roleClassName?: string
  statusDotClassName?: string
}

export function AdminUserMenu({
  name,
  role,
  roleClassName = 'text-[#855300]',
  statusDotClassName = 'bg-[#F97316]',
}: AdminUserMenuProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
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

  const logout = () => {
    setOpen(false)
    navigate('/')
  }

  return (
    <div ref={rootRef} className="relative flex items-center gap-3 border-l border-[#E9EDFF] pl-2">
      <div className="flex items-center gap-3 select-none">
        <div className="relative">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFDBCA] text-[11px] font-bold text-[#9D4300]">
            {initials || 'A'}
          </span>
          <span
            className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusDotClassName}`}
          />
        </div>
        <div className="hidden flex-col text-left md:flex">
          <span className="text-[13px] leading-tight font-bold">{name}</span>
          <span className={`text-[11px] leading-tight font-semibold ${roleClassName}`}>{role}</span>
        </div>
      </div>

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menyu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#F1F3FF]"
      >
        <Icon
          name="expand_more"
          className={`text-[18px] text-[#C0C4CC] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[42px] right-0 z-50 min-w-[132px] overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white py-[4px] shadow-[0_8px_24px_rgba(20,27,43,0.1)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-[8px] px-[14px] py-[10px] text-left text-[13px] font-medium text-[#141b2b] transition-colors hover:bg-[#F1F3FF]"
          >
            <Icon name="logout" className="text-[18px] text-[#141b2b]" />
            Chiqish
          </button>
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { Icon } from '../ui/Icon'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function UserMenu() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Link
      to="/profil"
      className="hidden h-[36px] max-w-[240px] cursor-pointer items-center gap-[8px] rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none sm:inline-flex"
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
      <Icon name="expand_more" className="shrink-0 text-[18px] text-[#C0C4CC]" />
    </Link>
  )
}

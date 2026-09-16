import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { RestaurantListItemDto } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Icon } from '../components/ui/Icon'
import { useRestaurantFavorites } from '../hooks/useRestaurantFavorites'
import { useLanguage } from '../i18n/LanguageContext'

function badgeClass(tone: string) {
  switch (tone) {
    case 'green':
      return 'bg-[#2D6A4F] text-white'
    case 'red':
      return 'bg-[#E53935] text-white'
    case 'peach':
      return 'bg-[#FFDBCA] text-[#9d4300]'
    default:
      return 'bg-[#F97316] text-white'
  }
}

export function FavoritesPage() {
  const { t } = useLanguage()
  const { token } = useAuth()
  const { ids, toggle, isFavorite, loading: favLoading } = useRestaurantFavorites()
  const [items, setItems] = useState<RestaurantListItemDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        if (token) {
          const rows = await api.favorites(token)
          if (!cancelled) setItems(rows)
          return
        }
        const guestIds = [...ids]
        if (!guestIds.length) {
          if (!cancelled) setItems([])
          return
        }
        const all = await api.restaurants()
        if (!cancelled) setItems(all.filter((r) => guestIds.includes(r.id)))
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token, ids])

  const remove = async (id: string) => {
    if (isFavorite(id)) await toggle(id)
    setItems((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="w-full px-[55px] pt-[24px] pb-[48px]">
      <nav className="mb-[14px] flex items-center gap-[8px] text-[13px]">
        <Link
          to="/"
          className="inline-flex items-center gap-[4px] font-medium text-[#8A7B74] hover:text-[#141b2b]"
        >
          <Icon name="home" className="text-[16px]" />
          {t('common.home')}
        </Link>
        <Icon name="chevron_right" className="text-[16px] text-[#C5CAD8]" />
        <span className="font-semibold text-[#141b2b]">{t('fav.breadcrumb')}</span>
      </nav>

      <div className="mb-[20px] flex flex-wrap items-end justify-between gap-[12px]">
        <div>
          <h1 className="text-[36px] leading-[42px] font-extrabold tracking-[-0.03em] text-[#141b2b]">
            {t('fav.title')}
          </h1>
          <p className="mt-[6px] max-w-[520px] text-[14px] leading-[20px] text-[#6B7280]">
            {t('fav.subtitle')}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-[6px] rounded-full bg-[#FFF4ED] px-[14px] py-[8px] text-[12px] font-bold text-[#9d4300]">
          <Icon name="favorite" className="text-[16px] text-[#BA1A1A]" filled />
          {t('fav.count', { count: items.length })}
        </span>
      </div>

      {!token && items.length === 0 && !loading && !favLoading ? (
        <div className="rounded-[20px] bg-white px-[24px] py-[56px] text-center">
          <p className="text-[16px] font-bold text-[#141b2b]">{t('fav.empty')}</p>
          <p className="mt-[6px] text-[13px] text-[#8A7B74]">{t('fav.emptySub')}</p>
          <div className="mt-[18px] flex flex-wrap items-center justify-center gap-[10px]">
            <Link
              to="/restoranlar"
              className="inline-flex rounded-full bg-[#F97316] px-[18px] py-[10px] text-[13px] font-bold text-white hover:bg-[#EA580C]"
            >
              {t('fav.emptyCta')}
            </Link>
            <Link
              to="/kirish"
              className="inline-flex rounded-full bg-[#F1F3FF] px-[18px] py-[10px] text-[13px] font-bold text-[#141b2b]"
            >
              {t('common.login')}
            </Link>
          </div>
        </div>
      ) : loading || favLoading ? (
        <p className="text-[14px] text-[#6B7280]">{t('profile.loading')}</p>
      ) : items.length === 0 ? (
        <div className="rounded-[20px] bg-white px-[24px] py-[56px] text-center">
          <span className="mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237]">
            <Icon name="favorite" className="text-[28px]" />
          </span>
          <p className="mt-[16px] text-[16px] font-bold text-[#141b2b]">{t('fav.empty')}</p>
          <p className="mt-[6px] text-[13px] text-[#8A7B74]">{t('fav.emptySub')}</p>
          <Link
            to="/restoranlar"
            className="mt-[18px] inline-flex rounded-full bg-[#F97316] px-[18px] py-[10px] text-[13px] font-bold text-white hover:bg-[#EA580C]"
          >
            {t('fav.emptyCta')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <article
              key={r.id}
              className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_rgba(20,27,43,0.04)]"
            >
              <Link to={`/restoranlar/${r.id}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={r.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute top-[10px] left-[10px] flex flex-wrap gap-[6px]">
                    {r.badges.slice(0, 2).map((b) => (
                      <span
                        key={b.label}
                        className={`rounded-full px-[8px] py-[3px] text-[10px] font-bold ${badgeClass(b.tone)}`}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <div className="p-[14px]">
                <div className="flex items-start justify-between gap-[8px]">
                  <div className="min-w-0">
                    <Link
                      to={`/restoranlar/${r.id}`}
                      className="block truncate text-[16px] font-extrabold text-[#141b2b] hover:text-[#F97316]"
                    >
                      {r.name}
                    </Link>
                    <p className="mt-[2px] truncate text-[12px] text-[#8A7B74]">
                      {r.tags.slice(0, 3).join(' · ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(r.id)}
                    className="flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FFF1F0] text-[#EF4444]"
                    aria-label={t('header.favorites')}
                  >
                    <Icon name="favorite" className="text-[18px]" filled />
                  </button>
                </div>
                <div className="mt-[10px] flex items-center gap-[10px] text-[12px] font-semibold text-[#584237]">
                  <span className="inline-flex items-center gap-[2px] text-[#F97316]">
                    <Icon name="star" className="text-[14px]" filled />
                    {r.rating.toFixed(1)}
                  </span>
                  <span>{r.eta}</span>
                  <span>{r.delivery}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { FeaturedPromoDto, PromotionDto } from '../api/types'
import { Icon } from '../components/ui/Icon'
import { useRestaurantFavorites } from '../hooks/useRestaurantFavorites'
import { useLanguage } from '../i18n/LanguageContext'

type PromoFilterId = 'all' | '30' | '20' | 'free' | 'combo' | 'new'

const promoFilters: { id: PromoFilterId; icon?: string }[] = [
  { id: 'all', icon: 'sell' },
  { id: '30' },
  { id: '20' },
  { id: 'free', icon: 'delivery_dining' },
  { id: 'combo' },
  { id: 'new' },
]

function badgeClass(tone: string) {
  switch (tone) {
    case 'red':
      return 'bg-[#E53935] text-white'
    case 'peach':
      return 'bg-[#FFDBCA] text-[#9d4300]'
    case 'green':
      return 'bg-[#2D6A4F] text-white'
    default:
      return 'bg-[#F97316] text-white'
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function useCountdownSeconds(initial: number) {
  const [total, setTotal] = useState(initial)

  useEffect(() => {
    setTotal(initial)
  }, [initial])

  useEffect(() => {
    if (total <= 0) return
    const id = window.setInterval(() => {
      setTotal((t) => Math.max(0, t - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [total])

  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

const sortIds = ['popular', 'discount', 'rating', 'eta'] as const
type SortId = (typeof sortIds)[number]

export function PromotionsPage() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<PromoFilterId>('all')
  const [sort, setSort] = useState<SortId>('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const { isFavorite, toggle } = useRestaurantFavorites()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promotions, setPromotions] = useState<PromotionDto[]>([])
  const [featured, setFeatured] = useState<FeaturedPromoDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const countdown = useCountdownSeconds(featured?.secondsRemaining ?? 0)

  useEffect(() => {
    setLoading(true)
    Promise.all([api.promotions(), api.promotionsFeatured()])
      .then(([rows, feat]) => {
        setPromotions(rows)
        setFeatured(feat)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Yuklanmadi'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...promotions]
    if (filter === 'new') {
      list = list.filter((p) => p.isNew)
    } else if (filter === 'free') {
      list = list.filter((p) => p.freeDelivery || p.filterTags.includes('free'))
    } else if (filter === '30') {
      list = list.filter((p) => (p.discountPercent ?? 0) >= 30 || p.filterTags.includes('30'))
    } else if (filter === '20') {
      list = list.filter((p) => (p.discountPercent ?? 0) >= 20 || p.filterTags.includes('20'))
    } else if (filter !== 'all') {
      list = list.filter((p) => p.filterTags.includes(filter))
    }
    if (sort === 'discount') {
      list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (sort === 'eta') {
      list.sort((a, b) => parseInt(a.eta, 10) - parseInt(b.eta, 10))
    } else {
      list.sort((a, b) => b.popularity - a.popularity)
    }
    return list
  }, [promotions, filter, sort])

  const applyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true)
  }

  const filterCount = (id: PromoFilterId) => {
    if (id === 'all') return promotions.length
    if (id === 'new') return promotions.filter((p) => p.isNew).length
    if (id === 'free') {
      return promotions.filter((p) => p.freeDelivery || p.filterTags.includes('free')).length
    }
    if (id === '30') {
      return promotions.filter(
        (p) => (p.discountPercent ?? 0) >= 30 || p.filterTags.includes('30'),
      ).length
    }
    if (id === '20') {
      return promotions.filter(
        (p) => (p.discountPercent ?? 0) >= 20 || p.filterTags.includes('20'),
      ).length
    }
    return promotions.filter((p) => p.filterTags.includes(id)).length
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
        <span className="font-semibold text-[#141b2b]">{t('promo.breadcrumb')}</span>
      </nav>

      <div className="mb-[8px] flex flex-wrap items-end justify-between gap-[12px]">
        <div>
          <h1 className="text-[36px] leading-[42px] font-extrabold tracking-[-0.03em] text-[#141b2b]">
            {t('promo.title')}
          </h1>
          <p className="mt-[6px] max-w-[520px] text-[14px] leading-[20px] text-[#6B7280]">
            {t('promo.subtitle')}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-[6px] rounded-full bg-[#EEF0FF] px-[14px] py-[8px] text-[12px] font-semibold text-[#3F4A6B]">
          <Icon name="local_fire_department" className="text-[16px] text-[#F97316]" />
          {t('promo.active', { count: featured?.activePromoCount ?? promotions.length })}
        </span>
      </div>

      {loading ? (
        <p className="mt-[18px] text-[14px] text-[#6B7280]">Yuklanmoqda…</p>
      ) : error ? (
        <p className="mt-[18px] text-[14px] text-[#BA1A1A]">{error}</p>
      ) : (
        <>
          {featured && (
            <div className="relative mt-[18px] overflow-hidden rounded-[24px] bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FDBA74] shadow-[0_12px_32px_rgba(249,115,22,0.28)]">
              <div className="pointer-events-none absolute -top-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute right-1/4 -bottom-16 h-40 w-40 rounded-full bg-white/15 blur-xl" />

              <div className="relative z-10 grid grid-cols-1 items-center gap-[20px] p-[22px] min-[960px]:grid-cols-[1.15fr_0.85fr] lg:gap-[28px] lg:p-[28px]">
                <div className="flex flex-col justify-center gap-[14px]">
                  <span className="inline-flex w-fit items-center gap-[6px] rounded-full bg-white/25 px-[12px] py-[6px] text-[11px] font-bold tracking-[0.08em] text-white uppercase backdrop-blur-md">
                    <span className="h-[6px] w-[6px] rounded-full bg-white" />
                    {featured.tag}
                  </span>
                  <h2 className="max-w-[440px] text-[30px] leading-[36px] font-extrabold tracking-tight text-white lg:text-[34px] lg:leading-[40px]">
                    {featured.title}
                  </h2>
                  <p className="max-w-[460px] text-[14px] leading-[22px] text-white/95">
                    {featured.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-[16px] pt-[4px]">
                    <Link
                      to={`/restoranlar/${featured.restaurantId}`}
                      className="inline-flex items-center gap-[8px] rounded-[14px] bg-white px-[22px] py-[12px] text-[14px] font-bold text-[#F97316] shadow-md transition-colors hover:bg-[#FFF7ED]"
                    >
                      {featured.cta}
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </Link>
                    <span className="inline-flex items-center gap-[6px] text-[14px] font-bold text-white">
                      <Icon name="schedule" className="text-[18px] text-white/90" />
                      {t('promo.endsIn', { time: countdown })}
                    </span>
                  </div>
                </div>

                <div className="relative aspect-[16/11] overflow-hidden rounded-[18px] shadow-[0_10px_28px_rgba(20,27,43,0.18)] min-[960px]:aspect-auto min-[960px]:h-full min-[960px]:min-h-[240px]">
                  <img
                    src={featured.image}
                    alt={t('promo.featuredAlt')}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-[12px] left-[12px] inline-flex items-center gap-[6px] rounded-[10px] bg-[#141b2b]/88 px-[10px] py-[6px] text-[11px] font-semibold text-white backdrop-blur-sm">
                    <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
                    {featured.imageBadge}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-[22px] flex flex-col gap-[12px] min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between">
            <div className="flex flex-wrap gap-[8px]">
              {promoFilters.map((f) => {
                const active = filter === f.id
                const count = filterCount(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`inline-flex h-[38px] items-center gap-[6px] rounded-full border px-[14px] text-[13px] font-semibold transition-colors ${
                      active
                        ? 'border-[#F97316] bg-[#F97316] text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]'
                        : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#F97316]/40 hover:bg-[#FFF7ED]'
                    }`}
                  >
                    {f.id === 'new' ? (
                      <span
                        className={`inline-flex h-[16px] items-center rounded-[3px] border px-[4px] text-[8px] leading-none font-extrabold tracking-[0.04em] ${
                          active
                            ? 'border-white/80 text-white'
                            : 'border-[#F15A24] text-[#F15A24]'
                        }`}
                      >
                        NEW
                      </span>
                    ) : f.icon ? (
                      <Icon
                        name={f.icon}
                        className={`text-[16px] ${
                          active
                            ? 'text-white'
                            : f.id === 'free'
                              ? 'text-[#F15A24]'
                              : 'text-[#6B7280]'
                        }`}
                      />
                    ) : null}
                    {t(`promo.filter.${f.id}`)}
                    <span
                      className={`rounded-full px-[7px] py-[1px] text-[11px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="relative self-start min-[1100px]:self-auto">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex h-[38px] items-center gap-[6px] text-[13px] font-semibold text-[#374151]"
              >
                <span className="font-medium text-[#9CA3AF]">{t('common.sort')}</span>
                {t(`promo.sort.${sort}`)}
                <Icon name="expand_more" className="text-[18px] text-[#6B7280]" />
              </button>
              {sortOpen && (
                <ul className="absolute top-[42px] right-0 z-20 min-w-[220px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white py-[6px] shadow-[0_12px_32px_rgba(20,27,43,0.12)]">
                  {sortIds.map((opt) => (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(opt)
                          setSortOpen(false)
                        }}
                        className={`flex w-full px-[14px] py-[10px] text-left text-[13px] font-semibold ${
                          sort === opt ? 'bg-[#FFF4ED] text-[#F97316]' : 'text-[#141b2b]'
                        }`}
                      >
                        {t(`promo.sort.${opt}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div
            id="promo-grid"
            className="mt-[18px] grid grid-cols-1 gap-[16px] min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-[20px] bg-white px-[24px] py-[48px] text-center">
                <p className="text-[16px] font-bold text-[#141b2b]">{t('promo.empty')}</p>
                <p className="mt-[6px] text-[13px] text-[#8A7B74]">{t('promo.emptySub')}</p>
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="mt-[16px] rounded-full bg-[#F97316] px-[16px] py-[8px] text-[13px] font-bold text-white"
                >
                  {t('promo.emptyCta')}
                </button>
              </div>
            ) : (
              filtered.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col rounded-[20px] bg-white p-[12px] transition-shadow hover:shadow-[0_10px_28px_rgba(17,24,39,0.08)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[14px]">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    <span
                      className={`absolute top-[10px] left-[10px] rounded-full px-[10px] py-[4px] text-[11px] font-bold ${badgeClass(p.badgeTone)}`}
                    >
                      {p.badge}
                    </span>
                    <button
                      type="button"
                      aria-label={t('common.addFavorite')}
                      onClick={() => void toggle(p.restaurantId)}
                      className="absolute top-[10px] right-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/90 text-[#584237]"
                    >
                      <Icon
                        name="favorite"
                        className={`text-[18px] ${isFavorite(p.restaurantId) ? 'text-[#BA1A1A]' : ''}`}
                        filled={isFavorite(p.restaurantId)}
                      />
                    </button>
                    <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[4px] rounded-[8px] bg-[#293040]/85 px-[8px] py-[4px] text-[11px] text-white">
                      <Icon name="schedule" className="text-[14px] text-[#FFDBCA]" />
                      {p.eta}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-[8px] pt-[12px]">
                    <h3 className="truncate text-[15px] font-bold text-[#141b2b]">{p.name}</h3>
                    <span className="flex shrink-0 items-center gap-[3px] rounded-full bg-[#FFF4ED] px-[8px] py-[3px] text-[12px] font-bold text-[#141b2b]">
                      <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
                      {p.rating}
                      <span className="font-semibold text-[#8A7B74]">({p.reviews})</span>
                    </span>
                  </div>
                  <p className="mt-[4px] truncate text-[12px] text-[#8A7B74]">{p.cuisine}</p>

                  <div className="mt-auto flex items-end justify-between gap-[8px] pt-[12px]">
                    <div>
                      <div className="flex items-baseline gap-[8px]">
                        <span className="text-[15px] font-extrabold text-[#141b2b]">{p.price}</span>
                        <span className="text-[12px] font-medium text-[#8A7B74] line-through">
                          {p.oldPrice}
                        </span>
                      </div>
                      <p className="mt-[2px] text-[12px] text-[#8A7B74]">
                        {t('promo.delivery')}{' '}
                        <span
                          className={`font-bold ${p.freeDelivery ? 'text-[#F97316]' : 'text-[#141b2b]'}`}
                        >
                          {p.freeDelivery ? t('common.free') : p.delivery}
                        </span>
                      </p>
                    </div>
                    <Link
                      to={`/restoranlar/${p.restaurantId}`}
                      aria-label={p.name}
                      className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#F97316] text-white shadow-[0_6px_14px_rgba(249,115,22,0.28)] transition-colors hover:bg-[#EA580C]"
                    >
                      <Icon name="add" className="text-[22px]" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-[22px] flex flex-col gap-[10px] rounded-[18px] bg-white p-[16px] min-[800px]:flex-row min-[800px]:items-center">
            <p className="text-[14px] font-semibold text-[#141b2b]">{t('promo.codeTitle')}</p>
            <div className="flex min-w-0 flex-1 gap-[8px]">
              <input
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value)
                  setPromoApplied(false)
                }}
                placeholder="FOODUZ2025"
                className="h-[42px] min-w-0 flex-1 rounded-[12px] bg-[#F5F6FB] px-[14px] text-[14px] outline-none focus:ring-2 focus:ring-[#F97316]/25"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="h-[42px] shrink-0 rounded-[12px] bg-[#F97316] px-[18px] text-[13px] font-bold text-white"
              >
                {t('promo.apply')}
              </button>
            </div>
            {promoApplied && (
              <p className="text-[13px] font-semibold text-[#2D6A4F]">{t('promo.codeOk')}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

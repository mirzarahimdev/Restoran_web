import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import type { CategoryDto, PopularDishDto, RestaurantListItemDto } from '../api/types'
import { Icon } from '../components/ui/Icon'
import { useRestaurantFavorites } from '../hooks/useRestaurantFavorites'
import { useLanguage } from '../i18n/LanguageContext'

type CatalogRestaurant = RestaurantListItemDto

const PAGE_SIZE = 9
const TOTAL_PAGES = 12

const sortIds = ['popular', 'rating', 'eta', 'distance'] as const
type SortId = (typeof sortIds)[number]

const priceTierIds = [
  { id: 1 as const, symbol: '$', key: 'rest.price.budget' },
  { id: 2 as const, symbol: '$$', key: 'rest.price.mid' },
  { id: 3 as const, symbol: '$$$', key: 'rest.price.premium' },
]

function visiblePages(current: number, total: number): (number | 'ellipsis-left' | 'ellipsis-right')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis-right', total]
  if (current >= total - 3) {
    return [1, 'ellipsis-left', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, 'ellipsis-left', current - 1, current, current + 1, 'ellipsis-right', total]
}

const ratingIds = [
  { id: '4.5', key: 'rest.rating.excellent' },
  { id: '4.0', key: 'rest.rating.good' },
  { id: 'all', key: 'common.all' },
] as const

const etaIds = [
  { id: 30, key: 'rest.eta.30' },
  { id: 45, key: 'rest.eta.45' },
  { id: 60, key: 'rest.eta.60' },
] as const

const defaultCats = ['milliy', 'pizza', 'burger']

const categoryFromQuery: Record<string, string> = {
  milliy: 'milliy',
  pizza: 'pizza',
  pitsa: 'pizza',
  fastfood: 'burger',
  burger: 'burger',
  sushi: 'sushi',
  dessert: 'dessert',
  shirinliklar: 'dessert',
  drinks: 'drinks',
  ichimliklar: 'drinks',
  coffee: 'coffee',
  qahvaxona: 'coffee',
  healthy: 'healthy',
  sogolom: 'healthy',
  europe: 'europe',
}

function applyCategoryFromUrl(cat: string) {
  return {
    selectedCats: [cat],
    freeOnly: false,
    openNow: false,
    priceTier: null as 1 | 2 | 3 | null,
    rating: 'all',
    eta: 60,
    strictFilters: true,
    page: 1,
  }
}

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

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between">
      <span className="text-[13px] font-medium text-[#141b2b]">{label}</span>
      <span
        className={`relative h-[22px] w-[40px] rounded-full transition-colors ${
          on ? 'bg-[#F97316]' : 'bg-[#E4E7F2]'
        }`}
      >
        <span
          className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform ${
            on ? 'left-[20px]' : 'left-[2px]'
          }`}
        />
      </span>
    </button>
  )
}

export function RestaurantsPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const urlCategory = categoryFromQuery[searchParams.get('category') ?? '']
  const urlQuery = (searchParams.get('q') ?? '').trim()
  const seeded = urlCategory ? applyCategoryFromUrl(urlCategory) : null

  const [query, setQuery] = useState(urlQuery)
  const [sort, setSort] = useState<SortId>('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [freeOnly, setFreeOnly] = useState(seeded?.freeOnly ?? true)
  const [openNow, setOpenNow] = useState(seeded?.openNow ?? true)
  const [priceTier, setPriceTier] = useState<1 | 2 | 3 | null>(seeded?.priceTier ?? 2)
  const [selectedCats, setSelectedCats] = useState<string[]>(
    seeded?.selectedCats ?? defaultCats,
  )
  const [rating, setRating] = useState(seeded?.rating ?? '4.5')
  const [eta, setEta] = useState(seeded?.eta ?? 30)
  const [page, setPage] = useState(1)
  const { isFavorite, toggle } = useRestaurantFavorites()
  const [strictFilters, setStrictFilters] = useState(Boolean(seeded) && !urlQuery)
  const [catalog, setCatalog] = useState<CatalogRestaurant[]>([])
  const [sidebarCats, setSidebarCats] = useState<CategoryDto[]>([])
  const [dishHits, setDishHits] = useState<PopularDishDto[]>([])
  const [dishesLoading, setDishesLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([api.restaurants(), api.categories()])
      .then(([restaurants, categories]) => {
        setCatalog(restaurants)
        setSidebarCats(categories)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Yuklanmadi'))
      .finally(() => setLoading(false))
  }, [])

  const sortLabel = (id: SortId) => t(`rest.sort.${id}`)

  useEffect(() => {
    const cat = categoryFromQuery[searchParams.get('category') ?? '']
    const q = (searchParams.get('q') ?? '').trim()
    const freeDelivery = searchParams.get('freeDelivery')
    const minRating = searchParams.get('minRating')
    const maxEta = searchParams.get('maxEta')
    setQuery(q)
    setPage(1)

    if (freeDelivery === '1') {
      setFreeOnly(true)
      setStrictFilters(true)
    }
    if (minRating) {
      setRating(minRating)
      setStrictFilters(true)
    }
    if (maxEta) {
      const n = Number(maxEta)
      if (!Number.isNaN(n)) {
        setEta(n)
        setStrictFilters(true)
      }
    }

    if (q) {
      setStrictFilters(false)
      if (cat) setSelectedCats([cat])
      return
    }

    if (!cat) return
    const next = applyCategoryFromUrl(cat)
    setSelectedCats(next.selectedCats)
    setFreeOnly(next.freeOnly)
    setOpenNow(next.openNow)
    setPriceTier(next.priceTier)
    setRating(next.rating)
    setEta(next.eta)
    setStrictFilters(next.strictFilters)
  }, [searchParams])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 1) {
      setDishHits([])
      setDishesLoading(false)
      return
    }
    let cancelled = false
    setDishesLoading(true)
    const timer = window.setTimeout(() => {
      api
        .searchDishes(q)
        .then((rows) => {
          if (!cancelled) setDishHits(rows)
        })
        .catch(() => {
          if (!cancelled) setDishHits([])
        })
        .finally(() => {
          if (!cancelled) setDishesLoading(false)
        })
    }, 250)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query])

  const resetFilters = () => {
    setFreeOnly(true)
    setOpenNow(true)
    setPriceTier(2)
    setSelectedCats(defaultCats)
    setRating('4.5')
    setEta(30)
    setQuery('')
    setDishHits([])
    setPage(1)
    setStrictFilters(false)
  }

  const markStrict = () => setStrictFilters(true)

  const toggleCat = (id: string) => {
    markStrict()
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = [...catalog]
    const q = query.trim().toLowerCase()
    if (q) {
      const dishRestaurantIds = new Set(dishHits.map((d) => d.restaurantId))
      list = list.filter(
        (r) =>
          dishRestaurantIds.has(r.id) ||
          r.name.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }

    if (strictFilters && !q) {
      if (freeOnly) list = list.filter((r) => r.freeDelivery)
      if (openNow) list = list.filter((r) => r.open)
      if (priceTier) list = list.filter((r) => r.priceTier === priceTier)
      if (selectedCats.length) {
        const aliases: Record<string, string[]> = {
          fastfood: ['burger', 'fastfood'],
          pitsa: ['pizza'],
          dessert: ['dessert'],
          shirinliklar: ['dessert'],
        }
        list = list.filter((r) =>
          selectedCats.some((cat) => (aliases[cat] ?? [cat]).includes(r.category)),
        )
      }
      if (rating === '4.5') list = list.filter((r) => r.rating >= 4.5)
      if (rating === '4.0') list = list.filter((r) => r.rating >= 4.0)
      list = list.filter((r) => r.deliveryMinutes <= eta)
    }

    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'eta') list.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes)
    if (sort === 'distance') {
      list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    }

    return list
  }, [
    catalog,
    query,
    dishHits,
    freeOnly,
    openNow,
    priceTier,
    selectedCats,
    rating,
    eta,
    sort,
    strictFilters,
  ])

  const pagedSource = useMemo(() => {
    if (filtered.length === 0) return []
    const needed = PAGE_SIZE * TOTAL_PAGES
    return Array.from({ length: needed }, (_, i) => {
      const base = filtered[i % filtered.length]
      return { ...base, linkId: base.id, id: `${base.id}-page-${i}` }
    })
  }, [filtered])

  const listRef = useRef<HTMLDivElement>(null)

  const pageItems = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), TOTAL_PAGES)
    const start = (safePage - 1) * PAGE_SIZE
    return pagedSource.slice(start, start + PAGE_SIZE)
  }, [pagedSource, page])

  useEffect(() => {
    if (page < 1) setPage(1)
    if (page > TOTAL_PAGES) setPage(TOTAL_PAGES)
  }, [page])

  const goToPage = (n: number) => {
    const next = Math.min(Math.max(n, 1), TOTAL_PAGES)
    if (next === page) return
    setPage(next)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="w-full px-[55px] pt-[24px] pb-[48px]">
      <nav className="mb-[14px] flex items-center gap-[8px] text-[13px]">
        <Link to="/" className="font-medium text-[#8A7B74] hover:text-[#141b2b]">
          {t('common.home')}
        </Link>
        <Icon name="chevron_right" className="text-[16px] text-[#C5CAD8]" />
        <span className="font-semibold text-[#141b2b]">{t('rest.breadcrumb')}</span>
      </nav>

      <div className="mb-[6px]">
        <h1 className="max-w-[560px] text-[36px] leading-[42px] font-extrabold tracking-[-0.03em] text-[#141b2b]">
          {t('rest.title')}
        </h1>
      </div>
      <div className="mb-[16px] flex flex-col gap-[12px] min-[960px]:flex-row min-[960px]:items-end">
        <p className="max-w-[520px] text-[14px] leading-[20px] text-[#6B7280] min-[960px]:flex-1">
          {t('rest.subtitle')}
        </p>
        <div className="flex min-w-0 w-full flex-col gap-[12px] min-[800px]:flex-row min-[800px]:items-center min-[960px]:w-auto min-[960px]:flex-1">
          <span className="inline-flex h-[44px] shrink-0 flex-col justify-center rounded-full bg-[#F6E8D8] px-[14px] text-center text-[11px] leading-[14px] font-bold text-[#9d4300]">
            {t('rest.open', { count: 184 })}
            <span>{t('rest.openLabel')}</span>
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[12px] min-[800px]:flex-row min-[960px]:max-w-[640px]">
            <label className="relative min-w-0 flex-1">
              <Icon
                name="search"
                className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 text-[20px] text-[#8A7B74]"
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder={t('rest.search')}
                className="h-[44px] w-full rounded-full bg-white pr-[16px] pl-[44px] text-[14px] text-[#141b2b] outline-none placeholder:text-[#8A7B74] focus:ring-2 focus:ring-[#F97316]/30"
              />
            </label>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex h-[44px] w-full items-center gap-[8px] rounded-full bg-white px-[16px] text-[13px] font-semibold text-[#141b2b] min-[800px]:w-auto"
              >
                {t('common.sort')} {sortLabel(sort)}
                <Icon name="expand_more" className="text-[18px]" />
              </button>
              {sortOpen && (
                <ul className="absolute top-[48px] right-0 z-20 min-w-[220px] overflow-hidden rounded-[16px] bg-white py-[6px] shadow-[0_12px_32px_rgba(20,27,43,0.12)]">
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
                        {sortLabel(opt)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[20px] min-[960px]:grid-cols-[252px_1fr]">
        <aside className="w-full">
          <div className="rounded-[20px] bg-white p-[18px]">
            <div className="mb-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[8px] text-[15px] font-bold text-[#141b2b]">
                <Icon name="tune" className="text-[18px] text-[#F97316]" />
                {t('rest.filters')}
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[13px] font-semibold text-[#F97316] hover:underline"
              >
                {t('rest.clear')}
              </button>
            </div>

            <div className="flex flex-col gap-[14px]">
              <Toggle
                label={t('rest.freeOnly')}
                on={freeOnly}
                onToggle={() => {
                  markStrict()
                  setFreeOnly((v) => !v)
                }}
              />
              <Toggle
                label={t('rest.openNow')}
                on={openNow}
                onToggle={() => {
                  markStrict()
                  setOpenNow((v) => !v)
                }}
              />
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">{t('rest.priceTier')}</p>
              <div className="grid grid-cols-3 gap-[6px]">
                {priceTierIds.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      markStrict()
                      setPriceTier(tier.id)
                    }}
                    className={`flex h-[52px] flex-col items-center justify-center rounded-[12px] leading-tight ${
                      priceTier === tier.id
                        ? 'bg-[#F97316] text-white'
                        : 'bg-[#F7F8FC] text-[#141b2b]'
                    }`}
                  >
                    <span className="text-[13px] font-extrabold">{tier.symbol}</span>
                    <span className="text-[10px] font-semibold">{t(tier.key)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">{t('rest.categories')}</p>
              <div className="flex flex-col gap-[10px]">
                {sidebarCats.map((cat) => {
                  const checked = selectedCats.includes(cat.id)
                  return (
                    <label
                      key={cat.id}
                      className="flex cursor-pointer items-center gap-[10px] text-[13px] text-[#141b2b]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCat(cat.id)}
                        className="h-[16px] w-[16px] rounded-[4px] accent-[#F97316]"
                      />
                      <span className="flex-1 font-medium">{cat.name}</span>
                      <span className="text-[12px] text-[#8A7B74]">{cat.restaurantCount}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">{t('rest.ratingBy')}</p>
              <div className="flex flex-col gap-[10px]">
                {ratingIds.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-[10px] text-[13px] font-medium text-[#141b2b]"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={rating === opt.id}
                      onChange={() => {
                        markStrict()
                        setRating(opt.id)
                      }}
                      className="accent-[#F97316]"
                    />
                    {t(opt.key)}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">{t('rest.etaLabel')}</p>
              <div className="flex flex-col items-start gap-[8px]">
                {etaIds.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      markStrict()
                      setEta(opt.id)
                    }}
                    className={`h-[32px] rounded-full px-[14px] text-[12px] font-semibold ${
                      eta === opt.id
                        ? 'bg-[#F97316] text-white'
                        : 'border border-[#F97316]/45 bg-white text-[#F97316]'
                    }`}
                  >
                    {t(opt.key)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div ref={listRef} className="min-w-0 flex-1 scroll-mt-[90px]">
          {query.trim() && (
            <section className="mb-[20px]">
              <div className="mb-[12px] flex items-end justify-between gap-[12px]">
                <div>
                  <h2 className="text-[20px] font-extrabold text-[#141b2b]">Topilgan taomlar</h2>
                  <p className="mt-[2px] text-[13px] text-[#8A7B74]">
                    “{query.trim()}” bo‘yicha {dishesLoading ? '…' : `${dishHits.length} ta`} natija
                  </p>
                </div>
              </div>
              {dishesLoading ? (
                <p className="rounded-[16px] bg-white px-[16px] py-[20px] text-[13px] text-[#6B7280]">
                  Taomlar qidirilmoqda…
                </p>
              ) : dishHits.length === 0 ? (
                <p className="rounded-[16px] bg-white px-[16px] py-[20px] text-[13px] text-[#8A7B74]">
                  Bunday taom topilmadi. Boshqa so‘z bilan qidirib ko‘ring.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-[12px] min-[700px]:grid-cols-2">
                  {dishHits.map((dish) => (
                    <Link
                      key={`${dish.restaurantId}-${dish.id}`}
                      to={`/restoranlar/${dish.restaurantId}`}
                      className="flex gap-[12px] overflow-hidden rounded-[16px] bg-white p-[10px] transition-shadow hover:shadow-[0_8px_24px_rgba(20,27,43,0.08)]"
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="h-[88px] w-[88px] shrink-0 rounded-[12px] object-cover"
                      />
                      <div className="min-w-0 flex-1 py-[2px]">
                        <p className="text-[11px] font-bold tracking-wide text-[#F97316] uppercase">
                          {dish.restaurant}
                        </p>
                        <h3 className="mt-[2px] truncate text-[15px] font-bold text-[#141b2b]">
                          {dish.name}
                        </h3>
                        <p className="mt-[4px] line-clamp-2 text-[12px] leading-[16px] text-[#8A7B74]">
                          {dish.description}
                        </p>
                        <p className="mt-[8px] text-[14px] font-extrabold text-[#141b2b]">
                          {dish.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {loading ? (
            <p className="rounded-[20px] bg-white px-[24px] py-[48px] text-center text-[14px] text-[#6B7280]">
              Yuklanmoqda…
            </p>
          ) : error ? (
            <p className="rounded-[20px] bg-white px-[24px] py-[48px] text-center text-[14px] text-[#BA1A1A]">
              {error}
            </p>
          ) : filtered.length === 0 && dishHits.length === 0 ? (
            <div className="rounded-[20px] bg-white px-[24px] py-[48px] text-center">
              <p className="text-[16px] font-bold text-[#141b2b]">{t('rest.empty')}</p>
              <p className="mt-[6px] text-[13px] text-[#8A7B74]">{t('rest.emptySub')}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-[16px] rounded-full bg-[#F97316] px-[16px] py-[8px] text-[13px] font-bold text-white"
              >
                {t('rest.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[16px] min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3">
              {pageItems.map((r) => (
                <Link
                  key={r.id}
                  to={`/restoranlar/${r.linkId}`}
                  className="group flex flex-col rounded-[20px] bg-white p-[12px] transition-shadow hover:shadow-[0_10px_28px_rgba(17,24,39,0.08)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[14px]">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                    <div className="absolute top-[10px] left-[10px] flex flex-wrap gap-[6px]">
                      {r.badges.map((b) => (
                        <span
                          key={b.label}
                          className={`rounded-full px-[10px] py-[4px] text-[11px] font-bold ${badgeClass(b.tone)}`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-label={t('common.addFavorite')}
                      onClick={(e) => {
                        e.preventDefault()
                        void toggle(r.linkId)
                      }}
                      className="absolute top-[10px] right-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/90 text-[#584237]"
                    >
                      <Icon
                        name="favorite"
                        className={`text-[18px] ${isFavorite(r.linkId) ? 'text-[#BA1A1A]' : ''}`}
                        filled={isFavorite(r.linkId)}
                      />
                    </button>
                    <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[4px] rounded-[8px] bg-[#293040]/85 px-[8px] py-[4px] text-[11px] text-white">
                      <Icon name="schedule" className="text-[14px] text-[#FFDBCA]" />
                      {r.eta}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-[8px] pt-[12px]">
                    <h3 className="truncate text-[15px] font-bold text-[#141b2b]">{r.name}</h3>
                    <span className="flex shrink-0 items-center gap-[3px] rounded-full bg-[#FFF4ED] px-[8px] py-[3px] text-[12px] font-bold text-[#141b2b]">
                      <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
                      {r.rating}
                      <span className="font-semibold text-[#8A7B74]">({r.reviews})</span>
                    </span>
                  </div>
                  <p className="mt-[4px] truncate text-[12px] text-[#8A7B74]">
                    {r.tags.join(' · ')} · {r.distance}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-[10px] pt-[12px]">
                    <div className="flex min-w-0 flex-1 items-end justify-between gap-[12px]">
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#8A7B74]">{t('rest.delivery')}</p>
                        <p
                          className={`truncate text-[13px] font-bold ${
                            r.freeDelivery ? 'text-[#F97316]' : 'text-[#141b2b]'
                          }`}
                        >
                          {r.freeDelivery ? t('common.free') : r.delivery}
                        </p>
                      </div>
                      <div className="min-w-0 text-right">
                        <p className="text-[12px] text-[#8A7B74]">{t('rest.minOrder')}</p>
                        <p className="truncate text-[13px] font-bold text-[#141b2b]">{r.minOrder}</p>
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#F97316] text-white shadow-[0_6px_14px_rgba(249,115,22,0.28)] transition-colors group-hover:bg-[#EA580C]"
                    >
                      <Icon name="add" className="text-[22px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-[28px] flex flex-col items-center gap-[12px]">
              <p className="text-[12px] font-medium text-[#8A7B74]">
                {t('rest.page')} <span className="font-bold text-[#141b2b]">{page}</span> /{' '}
                {TOTAL_PAGES}
              </p>

              <div
                className="flex flex-wrap items-center justify-center gap-[6px]"
                role="navigation"
                aria-label={t('rest.pages')}
              >
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                  aria-label={t('rest.prevPage')}
                  className={`inline-flex items-center gap-[4px] rounded-full bg-white px-[14px] py-[8px] text-[13px] font-semibold transition-colors ${
                    page === 1
                      ? 'cursor-not-allowed text-[#C5CAD8]'
                      : 'cursor-pointer text-[#141b2b] hover:bg-[#F5F6FF]'
                  }`}
                >
                  {t('rest.prev')}
                </button>

                {visiblePages(page, TOTAL_PAGES).map((item, idx) => {
                  if (item === 'ellipsis-left' || item === 'ellipsis-right') {
                    const jumpTo =
                      item === 'ellipsis-left'
                        ? Math.max(1, page - 3)
                        : Math.min(TOTAL_PAGES, page + 3)
                    return (
                      <button
                        key={`${item}-${idx}`}
                        type="button"
                        onClick={() => goToPage(jumpTo)}
                        className="flex h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-full bg-white px-[6px] text-[13px] font-bold text-[#8A7B74] transition-colors hover:bg-[#F5F6FF] hover:text-[#141b2b]"
                      >
                        ···
                      </button>
                    )
                  }

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      aria-current={page === item ? 'page' : undefined}
                      className={`flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
                        page === item
                          ? 'bg-[#F97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.35)]'
                          : 'bg-white text-[#141b2b] hover:bg-[#FFF4ED]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}

                <button
                  type="button"
                  disabled={page === TOTAL_PAGES}
                  onClick={() => goToPage(page + 1)}
                  aria-label={t('rest.nextPage')}
                  className={`inline-flex items-center gap-[4px] rounded-full bg-white px-[14px] py-[8px] text-[13px] font-semibold transition-colors ${
                    page === TOTAL_PAGES
                      ? 'cursor-not-allowed text-[#C5CAD8]'
                      : 'cursor-pointer text-[#141b2b] hover:bg-[#F5F6FF]'
                  }`}
                >
                  {t('rest.next')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

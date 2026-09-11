import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import {
  catalogCategories,
  catalogRestaurants,
  type CatalogBadge,
} from '../data/home'

const sortOptions = [
  'Ommabopligi bo‘yicha',
  'Reyting bo‘yicha',
  'Yetkazish vaqti',
  'Masofa bo‘yicha',
] as const

const priceTiers = [
  { id: 1 as const, symbol: '$', name: 'Tejamkor' },
  { id: 2 as const, symbol: '$$', name: 'O‘rtacha' },
  { id: 3 as const, symbol: '$$$', name: 'Premium' },
] as const

const ratingOptions = [
  { id: '4.5', label: '4.5+ A’lo sifat' },
  { id: '4.0', label: '4.0+ Yaxshi' },
  { id: 'all', label: 'Barchasi' },
]

const etaOptions = [
  { id: 30, label: '30 daqiqagacha' },
  { id: 45, label: '45 daqiqagacha' },
  { id: 60, label: '60 daqiqagacha' },
]

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
  europe: 'europe',
}

function badgeClass(tone: CatalogBadge['tone']) {
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
  const [searchParams] = useSearchParams()
  const initialCategory = categoryFromQuery[searchParams.get('category') ?? '']
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<(typeof sortOptions)[number]>(sortOptions[0])
  const [sortOpen, setSortOpen] = useState(false)
  const [freeOnly, setFreeOnly] = useState(true)
  const [openNow, setOpenNow] = useState(true)
  const [priceTier, setPriceTier] = useState<1 | 2 | 3 | null>(2)
  const [selectedCats, setSelectedCats] = useState<string[]>(
    initialCategory ? [initialCategory] : defaultCats,
  )
  const [rating, setRating] = useState('4.5')
  const [eta, setEta] = useState(30)
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [strictFilters, setStrictFilters] = useState(Boolean(initialCategory))

  const resetFilters = () => {
    setFreeOnly(true)
    setOpenNow(true)
    setPriceTier(2)
    setSelectedCats(defaultCats)
    setRating('4.5')
    setEta(30)
    setQuery('')
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
    let list = [...catalogRestaurants]
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    if (strictFilters) {
      if (freeOnly) list = list.filter((r) => r.freeDelivery)
      if (openNow) list = list.filter((r) => r.open)
      if (priceTier) list = list.filter((r) => r.priceTier === priceTier)
      if (selectedCats.length) list = list.filter((r) => selectedCats.includes(r.category))
      if (rating === '4.5') list = list.filter((r) => r.rating >= 4.5)
      if (rating === '4.0') list = list.filter((r) => r.rating >= 4.0)
      list = list.filter((r) => r.deliveryMinutes <= eta)
    }

    if (sort === 'Reyting bo‘yicha') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'Yetkazish vaqti') list.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes)
    if (sort === 'Masofa bo‘yicha') {
      list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    }

    return list
  }, [query, freeOnly, openNow, priceTier, selectedCats, rating, eta, sort, strictFilters])

  return (
    <div className="w-full px-[55px] pt-[24px] pb-[48px]">
      <nav className="mb-[14px] flex items-center gap-[8px] text-[13px]">
        <Link to="/" className="font-medium text-[#8A7B74] hover:text-[#141b2b]">
          Bosh sahifa
        </Link>
        <Icon name="chevron_right" className="text-[16px] text-[#C5CAD8]" />
        <span className="font-semibold text-[#141b2b]">Restoranlar</span>
      </nav>

      <div className="mb-[6px] flex flex-wrap items-end gap-[12px]">
        <h1 className="max-w-[560px] text-[36px] leading-[42px] font-extrabold tracking-[-0.03em] text-[#141b2b]">
          Toshkent shahridagi barcha restoranlar
        </h1>
        <span className="inline-flex shrink-0 flex-col rounded-full bg-[#F6E8D8] px-[14px] py-[8px] text-center text-[11px] leading-[14px] font-bold text-[#9d4300]">
          184 ta restoran
          <span>ochiq</span>
        </span>
      </div>
      <div className="mb-[16px] flex flex-col gap-[12px] min-[960px]:flex-row min-[960px]:items-end">
        <p className="max-w-[520px] text-[14px] leading-[20px] text-[#6B7280] min-[960px]:flex-1">
          O‘zingizga ma’qul bo‘lgan taom turi, narx va yetkazish vaqti bo‘yicha saralang. Yangi va
          issiq taomlar to‘g‘ridan-to‘g‘ri ostonangizda.
        </p>
        <div className="flex min-w-0 w-full flex-col gap-[12px] min-[800px]:flex-row min-[960px]:w-auto min-[960px]:max-w-[640px] min-[960px]:flex-1">
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
              placeholder="Restoran yoki oshxona turini qidiring..."
              className="h-[44px] w-full rounded-full bg-white pr-[16px] pl-[44px] text-[14px] text-[#141b2b] outline-none placeholder:text-[#8A7B74] focus:ring-2 focus:ring-[#F97316]/30"
            />
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex h-[44px] w-full items-center gap-[8px] rounded-full bg-white px-[16px] text-[13px] font-semibold text-[#141b2b] min-[800px]:w-auto"
            >
              Saralash: {sort}
              <Icon name="expand_more" className="text-[18px]" />
            </button>
            {sortOpen && (
              <ul className="absolute top-[48px] right-0 z-20 min-w-[220px] overflow-hidden rounded-[16px] bg-white py-[6px] shadow-[0_12px_32px_rgba(20,27,43,0.12)]">
                {sortOptions.map((opt) => (
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
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[20px] min-[960px]:grid-cols-[252px_1fr]">
        <aside className="w-full">
          <div className="rounded-[20px] bg-white p-[18px]">
            <div className="mb-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[8px] text-[15px] font-bold text-[#141b2b]">
                <Icon name="tune" className="text-[18px] text-[#F97316]" />
                Filtrlar
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[13px] font-semibold text-[#F97316] hover:underline"
              >
                Tozalash
              </button>
            </div>

            <div className="flex flex-col gap-[14px]">
              <Toggle
                label="Faqat bepul yetkazish"
                on={freeOnly}
                onToggle={() => {
                  markStrict()
                  setFreeOnly((v) => !v)
                }}
              />
              <Toggle
                label="Hozir ochiq"
                on={openNow}
                onToggle={() => {
                  markStrict()
                  setOpenNow((v) => !v)
                }}
              />
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">Narx toifasi</p>
              <div className="grid grid-cols-3 gap-[6px]">
                {priceTiers.map((tier) => (
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
                    <span className="text-[10px] font-semibold">{tier.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">Kategoriyalar</p>
              <div className="flex flex-col gap-[10px]">
                {catalogCategories.map((cat) => {
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
                      <span className="flex-1 font-medium">{cat.label}</span>
                      <span className="text-[12px] text-[#8A7B74]">{cat.count}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">Reyting bo‘yicha</p>
              <div className="flex flex-col gap-[10px]">
                {ratingOptions.map((opt) => (
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
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-[18px]">
              <p className="mb-[10px] text-[13px] font-bold text-[#141b2b]">
                Yetkazib berish vaqti
              </p>
              <div className="flex flex-col items-start gap-[8px]">
                {etaOptions.map((opt) => (
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
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-[20px] bg-white px-[24px] py-[48px] text-center">
              <p className="text-[16px] font-bold text-[#141b2b]">Restoran topilmadi</p>
              <p className="mt-[6px] text-[13px] text-[#8A7B74]">
                Filtrlarni o‘zgartiring yoki qidiruv so‘zini soddalashtiring.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-[16px] rounded-full bg-[#F97316] px-[16px] py-[8px] text-[13px] font-bold text-white"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[16px] min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3">
              {filtered.map((r) => (
                <Link
                  key={r.id}
                  to={`/restoranlar/${r.id}`}
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
                      aria-label="Sevimlilarga qo'shish"
                      onClick={(e) => {
                        e.preventDefault()
                        setFavorites((prev) => {
                          const next = new Set(prev)
                          if (next.has(r.id)) next.delete(r.id)
                          else next.add(r.id)
                          return next
                        })
                      }}
                      className="absolute top-[10px] right-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/90 text-[#584237]"
                    >
                      <Icon
                        name="favorite"
                        className={`text-[18px] ${favorites.has(r.id) ? 'text-[#BA1A1A]' : ''}`}
                        filled={favorites.has(r.id)}
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
                  <div className="mt-[12px] flex items-center justify-between pt-[2px] text-[12px]">
                    <div>
                      <p className="text-[#8A7B74]">Yetkazish:</p>
                      <p
                        className={`font-bold ${r.freeDelivery ? 'text-[#F97316]' : 'text-[#141b2b]'}`}
                      >
                        {r.delivery}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#8A7B74]">Min. buyurtma:</p>
                      <p className="font-bold text-[#141b2b]">{r.minOrder}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-[28px] flex items-center justify-center gap-[6px]">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full bg-white px-[14px] py-[8px] text-[13px] font-semibold text-[#C5CAD8] disabled:opacity-100"
            >
              ‹ Oldingi
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-[36px] w-[36px] items-center justify-center rounded-full text-[13px] font-bold ${
                  page === n ? 'bg-[#F97316] text-white' : 'bg-white text-[#141b2b]'
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-[4px] text-[#8A7B74]">...</span>
            <button
              type="button"
              onClick={() => setPage(12)}
              className={`flex h-[36px] w-[36px] items-center justify-center rounded-full text-[13px] font-bold ${
                page === 12 ? 'bg-[#F97316] text-white' : 'bg-white text-[#141b2b]'
              }`}
            >
              12
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(12, p + 1))}
              className="rounded-full bg-white px-[14px] py-[8px] text-[13px] font-semibold text-[#141b2b]"
            >
              Keyingi ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

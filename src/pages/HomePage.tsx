import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { PopularDishDto, RestaurantListItemDto } from '../api/types'
import { useCart } from '../cart/CartContext'
import { HeroSection } from '../components/home/HeroSection'
import { PromoBanner } from '../components/home/PromoBanner'
import { Icon } from '../components/ui/Icon'
import { useRestaurantFavorites } from '../hooks/useRestaurantFavorites'
import { useLanguage } from '../i18n/LanguageContext'

function badgeClass(tone?: string) {
  switch (tone) {
    case 'red':
      return 'bg-[#E53935] text-white'
    case 'green':
      return 'bg-[#2D6A4F] text-white'
    case 'peach':
      return 'bg-[#F3EDE6] text-[#141b2b]'
    default:
      return 'bg-[#F97316] text-white'
  }
}

const homeFilters = [
  { id: 'all', key: 'home.filter.all' },
  { id: 'nearby', key: 'home.filter.nearby' },
  { id: 'rating', key: 'home.filter.rating' },
  { id: 'free', key: 'home.filter.free' },
  { id: 'deals', key: 'home.filter.deals' },
] as const

function PopularRestaurants() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState<(typeof homeFilters)[number]['id']>('all')
  const { isFavorite, toggle } = useRestaurantFavorites()
  const [list, setList] = useState<RestaurantListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .restaurants({ sort: 'rating' })
      .then(setList)
      .catch((err) => setError(err instanceof Error ? err.message : 'Yuklanmadi'))
      .finally(() => setLoading(false))
  }, [])

  const visible = list.filter((r) => {
    if (activeFilter === 'free') return r.freeDelivery
    if (activeFilter === 'rating') return r.rating >= 4.8
    if (activeFilter === 'nearby') return parseFloat(r.distance) <= 2.5
    if (activeFilter === 'deals') return r.badges.length > 0
    return true
  })

  return (
    <section className="w-full px-[55px] py-[32px]">
      <div className="mb-[20px] flex flex-col justify-between gap-[12px] md:flex-row md:items-end">
        <div>
          <span className="text-[11px] font-bold tracking-[0.12em] text-[#9d4300] uppercase">
            {t('home.rest.eyebrow')}
          </span>
          <h2 className="mt-[4px] text-[28px] leading-[34px] font-bold text-[#141b2b]">
            {t('home.rest.title')}
          </h2>
        </div>
        <div className="flex items-center gap-[8px] overflow-x-auto pb-[4px]">
          {homeFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`flex h-[36px] shrink-0 items-center gap-[6px] rounded-full px-[14px] text-[13px] font-semibold transition-colors ${
                activeFilter === filter.id
                  ? 'bg-[#293040] text-white'
                  : 'bg-[#F1F3FF] text-[#141b2b] hover:bg-[#E9EDFF]'
              }`}
            >
              {filter.id === 'rating' && (
                <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
              )}
              {t(filter.key)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[14px] text-[#6B7280]">Yuklanmoqda…</p>
      ) : error ? (
        <p className="text-[14px] text-[#BA1A1A]">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-[16px] min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {visible.map((r) => {
            const badge = r.badges[0]
            return (
              <Link
                key={r.id}
                to={`/restoranlar/${r.id}`}
                className="group flex flex-col rounded-[20px] bg-white p-[12px] transition-shadow hover:shadow-[0_10px_28px_rgba(17,24,39,0.08)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={r.name}
                    src={r.image}
                  />
                  {badge && (
                    <span
                      className={`absolute top-[10px] left-[10px] rounded-full px-[10px] py-[4px] text-[11px] font-bold ${badgeClass(badge.tone)}`}
                    >
                      {badge.label}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={t('common.addFavorite')}
                    onClick={(e) => {
                      e.preventDefault()
                      void toggle(r.id)
                    }}
                    className="absolute top-[10px] right-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/90 text-[#584237] backdrop-blur-md hover:text-[#BA1A1A]"
                  >
                    <Icon
                      name="favorite"
                      filled={isFavorite(r.id)}
                      className={`text-[18px] ${isFavorite(r.id) ? 'text-[#BA1A1A]' : ''}`}
                    />
                  </button>
                  <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[4px] rounded-[8px] bg-[#293040]/85 px-[8px] py-[4px] text-[11px] text-white backdrop-blur-md">
                    <Icon name="schedule" className="text-[14px] text-[#FFDBCA]" />
                    <span>{r.eta}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col pt-[12px]">
                  <div className="flex items-center gap-[4px]">
                    <h3 className="text-[15px] font-bold text-[#141b2b]">{r.name}</h3>
                    {r.rating >= 4.8 && (
                      <Icon name="verified" className="text-[16px] text-[#F97316]" filled />
                    )}
                  </div>
                  <p className="mt-[4px] truncate text-[12px] text-[#6B7280]">{r.tags.join(', ')}</p>
                  <div className="mt-[12px] flex items-center justify-between text-[12px] text-[#6B7280]">
                    <div className="flex items-center gap-[4px]">
                      <Icon name="star" className="text-[16px] text-[#FEA619]" filled />
                      <span className="font-bold text-[#141b2b]">{r.rating}</span>
                      <span>({r.reviews})</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <span
                        className={`font-semibold ${r.freeDelivery ? 'text-[#F97316]' : 'text-[#141b2b]'}`}
                      >
                        {r.freeDelivery ? t('common.free') : r.delivery}
                      </span>
                      <span className="h-[3px] w-[3px] rounded-full bg-[#D1D5DB]" />
                      <span>{r.distance}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

function PopularDishes() {
  const { t } = useLanguage()
  const { addItem } = useCart()
  const [dishes, setDishes] = useState<PopularDishDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .popularDishes(8)
      .then(setDishes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Yuklanmadi'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="w-full px-[55px] py-[32px]">
      <div className="mb-[20px] flex items-end justify-between gap-[12px]">
        <div>
          <span className="text-[11px] font-bold tracking-[0.12em] text-[#9d4300] uppercase">
            {t('home.dishes.eyebrow')}
          </span>
          <h2 className="mt-[4px] text-[28px] leading-[34px] font-bold text-[#141b2b]">
            {t('home.dishes.title')}
          </h2>
        </div>
        <Link
          to="/restoranlar"
          className="inline-flex shrink-0 items-center gap-[4px] text-[14px] font-semibold text-[#F97316]"
        >
          {t('home.dishes.menu')}
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      </div>

      {loading ? (
        <p className="text-[14px] text-[#6B7280]">Yuklanmoqda…</p>
      ) : error ? (
        <p className="text-[14px] text-[#BA1A1A]">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-[16px] min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="group flex flex-col rounded-[20px] bg-white p-[12px] transition-shadow hover:shadow-[0_10px_28px_rgba(17,24,39,0.08)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
                <img
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={dish.name}
                  src={dish.image}
                />
                <div className="absolute top-[10px] left-[10px] flex items-center gap-[4px] rounded-full bg-white/95 px-[8px] py-[4px] backdrop-blur-md">
                  <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
                  <span className="text-[12px] font-bold text-[#141b2b]">{dish.rating}</span>
                  {dish.tag && (
                    <span className="text-[11px] font-semibold text-[#6B7280]">{dish.tag}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col pt-[12px]">
                <span className="text-[11px] font-bold tracking-wider text-[#F97316] uppercase">
                  {dish.restaurant}
                </span>
                <h3 className="mt-[4px] text-[16px] leading-[22px] font-bold text-[#141b2b]">
                  {dish.name}
                </h3>
                <p className="mt-[6px] line-clamp-2 text-[13px] leading-[18px] text-[#6B7280]">
                  {dish.description}
                </p>
                <div className="mt-auto flex items-end justify-between pt-[16px]">
                  <div>
                    <span className="text-[11px] text-[#6B7280]">{t('common.price')}</span>
                    <p className="text-[18px] leading-[22px] font-extrabold text-[#141b2b]">
                      {dish.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={t('common.addCart')}
                    onClick={() =>
                      addItem({
                        dishId: dish.id,
                        restaurantId: dish.restaurantId,
                        restaurantName: dish.restaurant,
                        name: dish.name,
                        description: dish.description,
                        price: dish.priceAmount,
                        image: dish.image,
                      })
                    }
                    className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#F97316] text-white shadow-[0_6px_14px_rgba(249,115,22,0.35)] hover:bg-[#EA580C]"
                  >
                    <Icon name="add" className="text-[22px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function HowItWorks() {
  const { t } = useLanguage()
  const steps = [
    {
      icon: 'location_on',
      iconBg: 'bg-[#E8EAFF] text-[#F97316]',
      title: t('home.how.step1.title'),
      text: t('home.how.step1.text'),
    },
    {
      icon: 'menu_book',
      iconBg: 'bg-[#FFDBCA] text-[#9d4300]',
      title: t('home.how.step2.title'),
      text: t('home.how.step2.text'),
    },
    {
      icon: 'moped',
      iconBg: 'bg-[#FFDDB8] text-[#9d4300]',
      title: t('home.how.step3.title'),
      text: t('home.how.step3.text'),
    },
  ]

  return (
    <section className="w-full px-[55px] py-[40px]">
      <div className="mx-auto mb-[32px] max-w-lg text-center">
        <span className="text-[10px] font-bold tracking-[0.12em] text-[#9d4300] uppercase">
          {t('home.how.eyebrow')}
        </span>
        <h2 className="mt-[4px] text-[20px] font-bold text-[#141b2b]">{t('home.how.title')}</h2>
        <p className="mt-[6px] text-[13px] text-[#6B7280]">{t('home.how.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-[16px] min-[900px]:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative flex flex-col items-center rounded-[20px] bg-white px-[28px] pt-[32px] pb-[28px] text-center"
          >
            <span className="absolute top-[16px] right-[20px] select-none text-[28px] font-bold text-[#D4DAEE]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div
              className={`mb-[20px] flex h-[56px] w-[56px] items-center justify-center rounded-[16px] ${step.iconBg}`}
            >
              <Icon name={step.icon} className="text-[28px]" filled />
            </div>
            <h3 className="mb-[8px] text-[16px] font-bold text-[#141b2b]">{step.title}</h3>
            <p className="max-w-[280px] text-[13px] leading-[20px] text-[#6B7280]">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FloatingOrderBar() {
  const { t } = useLanguage()

  return (
    <div className="fixed right-5 bottom-4 z-40 hidden items-center gap-2 rounded-full bg-[#293040]/95 p-1.5 pl-3 text-white shadow-[0_8px_24px_rgba(20,27,43,0.25)] backdrop-blur-xl min-[900px]:flex">
      <Icon name="electric_moped" className="text-[20px] text-[#FEA619]" />
      <div className="flex flex-col">
        <span className="text-[9px] text-white/70">{t('home.order.preparing')}</span>
        <span className="text-[11px] font-bold">{t('home.order.active')}</span>
      </div>
      <Link
        to="/profil#joriy"
        className="rounded-full bg-[#F97316] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#EA580C]"
      >
        {t('home.order.track')}
      </Link>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-[#F9F9FF]">
      <HeroSection />
      <PromoBanner />
      <PopularRestaurants />
      <PopularDishes />
      <HowItWorks />
      <FloatingOrderBar />
    </div>
  )
}

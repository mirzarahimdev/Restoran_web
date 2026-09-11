import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CategorySection } from '../components/home/CategorySection'
import { HeroSection } from '../components/home/HeroSection'
import { PromoBanner } from '../components/home/PromoBanner'
import { Icon } from '../components/ui/Icon'
import {
  popularDishes,
  restaurantFilters,
  restaurants,
  type Restaurant,
} from '../data/home'

function badgeClass(tone?: Restaurant['badgeTone']) {
  switch (tone) {
    case 'secondary':
      return 'bg-[#E53935] text-white'
    case 'neutral':
      return 'bg-[#2D6A4F] text-white'
    case 'fixed':
      return 'bg-[#F3EDE6] text-[#141b2b]'
    default:
      return 'bg-[#F97316] text-white'
  }
}

function PopularRestaurants() {
  const [activeFilter, setActiveFilter] = useState<(typeof restaurantFilters)[number]>('Barchasi')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="w-full px-[55px] py-[32px]">
      <div className="mb-[20px] flex flex-col justify-between gap-[12px] md:flex-row md:items-end">
        <div>
          <span className="text-[11px] font-bold tracking-[0.12em] text-[#9d4300] uppercase">
            Shaharning saralari
          </span>
          <h2 className="mt-[4px] text-[28px] leading-[34px] font-bold text-[#141b2b]">
            Mashhur restoranlar
          </h2>
        </div>
        <div className="flex items-center gap-[8px] overflow-x-auto pb-[4px]">
          {restaurantFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`flex h-[36px] shrink-0 items-center gap-[6px] rounded-full px-[14px] text-[13px] font-semibold transition-colors ${
                activeFilter === filter
                  ? 'bg-[#293040] text-white'
                  : 'bg-[#F1F3FF] text-[#141b2b] hover:bg-[#E9EDFF]'
              }`}
            >
              {filter === 'Reyting 4.5+' && (
                <Icon name="star" className="text-[14px] text-[#FEA619]" filled />
              )}
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[16px] min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
        {restaurants.map((r) => (
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
              {r.badge && (
                <span
                  className={`absolute top-[10px] left-[10px] rounded-full px-[10px] py-[4px] text-[11px] font-bold ${badgeClass(r.badgeTone)}`}
                >
                  {r.badge}
                </span>
              )}
              <button
                type="button"
                aria-label="Sevimlilarga qo'shish"
                onClick={(e) => {
                  e.preventDefault()
                  toggleFavorite(r.id)
                }}
                className="absolute top-[10px] right-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/90 text-[#584237] backdrop-blur-md hover:text-[#BA1A1A]"
              >
                <Icon
                  name="favorite"
                  filled={favorites.has(r.id)}
                  className={`text-[18px] ${favorites.has(r.id) ? 'text-[#BA1A1A]' : ''}`}
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
                {r.verified && (
                  <Icon name="verified" className="text-[16px] text-[#F97316]" filled />
                )}
              </div>
              <p className="mt-[4px] truncate text-[12px] text-[#6B7280]">{r.cuisine}</p>
              <div className="mt-[12px] flex items-center justify-between text-[12px] text-[#6B7280]">
                <div className="flex items-center gap-[4px]">
                  <Icon name="star" className="text-[16px] text-[#FEA619]" filled />
                  <span className="font-bold text-[#141b2b]">{r.rating}</span>
                  <span>({r.reviews})</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <span
                    className={`font-semibold ${r.delivery === 'Bepul' ? 'text-[#F97316]' : 'text-[#141b2b]'}`}
                  >
                    {r.delivery}
                  </span>
                  <span className="h-[3px] w-[3px] rounded-full bg-[#D1D5DB]" />
                  <span>{r.distance}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function PopularDishes() {
  return (
    <section className="w-full px-[55px] py-[32px]">
      <div className="mb-[20px] flex items-end justify-between gap-[12px]">
        <div>
          <span className="text-[11px] font-bold tracking-[0.12em] text-[#9d4300] uppercase">
            Mijozlar tanlovi
          </span>
          <h2 className="mt-[4px] text-[28px] leading-[34px] font-bold text-[#141b2b]">
            Eng ko&apos;p buyurtma qilingan taomlar
          </h2>
        </div>
        <Link
          to="/restoranlar"
          className="inline-flex shrink-0 items-center gap-[4px] text-[14px] font-semibold text-[#F97316]"
        >
          Menyuni ko&apos;rish
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-[16px] min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
        {popularDishes.map((dish) => (
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
                  <span className="text-[11px] text-[#6B7280]">Narxi:</span>
                  <p className="text-[18px] leading-[22px] font-extrabold text-[#141b2b]">
                    {dish.price}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Savatga qo'shish"
                  className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_6px_14px_rgba(249,115,22,0.35)] hover:bg-[#EA580C]"
                >
                  <Icon name="add" className="text-[22px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: 'location_on',
      iconBg: 'bg-[#E8EAFF] text-[#F97316]',
      title: 'Manzilingizni belgilang',
      text: "Uy yoki ofis joylashuvingizni tanlang va biz sizga eng yaqin bo'lgan faol restoranlar ro'yxatini taqdim etamiz.",
    },
    {
      icon: 'menu_book',
      iconBg: 'bg-[#FFDBCA] text-[#9d4300]',
      title: 'Sevimli taomlaringizni tanlang',
      text: "Yuzlab milliy va zamonaviy menyulardan xohlaganingizni savatga soling va qulay to'lov usulini tanlang.",
    },
    {
      icon: 'moped',
      iconBg: 'bg-[#FFDDB8] text-[#9d4300]',
      title: 'Tez va issiq yetkazib olamiz',
      text: 'Maxsus termokuriyerlar taomingizni sovutmasdan belgilangan vaqtda bevosita eshigingiz oldiga yetkazadi.',
    },
  ]

  return (
    <section className="w-full px-[55px] py-[40px]">
      <div className="mx-auto mb-[32px] max-w-lg text-center">
        <span className="text-[10px] font-bold tracking-[0.12em] text-[#9d4300] uppercase">
          Oson va Qulay
        </span>
        <h2 className="mt-[4px] text-[20px] font-bold text-[#141b2b]">
          Buyurtma berish qanday ishlaydi?
        </h2>
        <p className="mt-[6px] text-[13px] text-[#6B7280]">
          FoodUZ orqali sevimli taomingizni tanlash atigi 3 ta oddiy qadamdan iborat.
        </p>
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
  return (
    <div className="fixed right-5 bottom-4 z-40 hidden items-center gap-2 rounded-full bg-[#293040]/95 p-1.5 pl-3 text-white shadow-[0_8px_24px_rgba(20,27,43,0.25)] backdrop-blur-xl min-[900px]:flex">
      <Icon name="electric_moped" className="text-[20px] text-[#FEA619]" />
      <div className="flex flex-col">
        <span className="text-[9px] text-white/70">Buyurtmangiz tayyorlanmoqda</span>
        <span className="text-[11px] font-bold">1 ta faol buyurtma (Yo&apos;lda)</span>
      </div>
      <Link
        to="/buyurtmalarim"
        className="rounded-full bg-[#F97316] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#EA580C]"
      >
        Kuzatish
      </Link>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-[#F9F9FF]">
      <HeroSection />
      <CategorySection />
      <PromoBanner />
      <PopularRestaurants />
      <PopularDishes />
      <HowItWorks />
      <FloatingOrderBar />
    </div>
  )
}

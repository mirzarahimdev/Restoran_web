import { Icon } from '../ui/Icon'
import { BenefitPill } from './BenefitPill'
import { HeroFoodVisual } from './HeroFoodVisual'
import { HeroSearch } from './HeroSearch'

export function HeroSection() {
  return (
    <section className="relative w-full px-[55px] pt-8 pb-10 lg:pt-10 lg:pb-12">
      <div
        className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-[#F97316]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-48 right-10 -z-10 h-[450px] w-[450px] rounded-full bg-[#FEA619]/15 blur-3xl"
        aria-hidden
      />

      <div className="grid grid-cols-1 items-center gap-10 min-[900px]:grid-cols-12 min-[900px]:gap-10">
        {/* Chap: matn + qidiruv + chip’lar */}
        <div className="flex flex-col items-start gap-6 min-[900px]:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F97316] text-white">
              <Icon name="local_fire_department" className="text-[14px]" filled />
            </span>
            <span className="text-[13px] leading-[18px] font-semibold text-[#141b2b]">
              Toshkentdagi #1 Gastronomik Xizmat
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            <span className="text-[11px] leading-[14px] font-bold tracking-wider text-[#584237] uppercase">
              300+ Hamkor
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="max-w-xl text-[40px] leading-[1.1] font-extrabold tracking-tight text-[#141b2b] lg:text-[48px]">
              Sevimli taomlaringizni
              <br />
              <span className="relative inline-block text-[#F97316]">
                bir zumda
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#FEA619]"
                  fill="none"
                  viewBox="0 0 250 12"
                  aria-hidden
                >
                  <path
                    d="M3 9C60 3 180 3 247 9"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              <span className="text-[#141b2b]">buyurtma qiling</span>
            </h1>
            <p className="max-w-xl text-[16px] leading-6 text-[#584237]">
              Yaqin atrofdagi eng yaxshi restoranlardan mazali, yangi pishirilgan taomlarni bir necha
              daqiqada eshigingizgacha yetkazamiz.
            </p>
          </div>

          <HeroSearch />

          <div className="flex flex-wrap items-center gap-x-[32px] gap-y-[12px] pt-1">
            <BenefitPill
              icon="bolt"
              label="25–35 daqiqa yetkazish"
              iconBg="bg-[#F0D4B8] text-[#2A1700]"
            />
            <BenefitPill
              icon="star"
              label="4.9 mijozlar bahosi"
              iconBg="bg-[#FEA619] text-[#2A1700]"
              filled
            />
            <BenefitPill
              icon="two_wheeler"
              label="Bepul yetkazib berish"
              iconBg="bg-[#F5D5C8] text-[#2A1700]"
            />
          </div>
        </div>

        {/* O‘ng: floating taom widgetlari */}
        <div className="min-[900px]:col-span-5 overflow-visible">
          <HeroFoodVisual />
        </div>
      </div>
    </section>
  )
}

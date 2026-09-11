import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function PromoBanner() {
  return (
    <section className="w-full px-[55px] py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#C2410C] via-[#F97316] to-[#FB923C] px-8 py-8 text-white shadow-[0_12px_32px_rgba(249,115,22,0.28)] lg:px-10 lg:py-9">
        <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-16 h-40 w-40 rounded-full bg-[#FFDDB8]/20 blur-xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-6 min-[900px]:grid-cols-12">
          <div className="flex flex-col items-start gap-3 min-[900px]:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-md">
              <Icon name="campaign" className="text-[16px] text-white" />
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase">
                Aksiya va Chegirmalar
              </span>
            </div>

            <h2 className="max-w-2xl text-[28px] leading-9 font-extrabold tracking-tight lg:text-[32px] lg:leading-10">
              Bugun yetkazib berish mutlaqo bepul!
            </h2>

            <p className="max-w-2xl text-[15px] leading-6 text-white/95">
              Birinchi buyurtmangiz uchun{' '}
              <span className="mx-0.5 inline-block rounded-lg bg-white px-2 py-0.5 text-[14px] font-bold text-[#F97316]">
                FOODUZ2025
              </span>{' '}
              promo-kodi orqali <span className="font-bold">20,000 so&apos;m</span> chegirma va bepul
              eltib berish xizmatiga ega bo&apos;ling.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/restoranlar"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-bold text-[#F97316] shadow-md transition-colors hover:bg-[#FFF7ED]"
              >
                Buyurtma berish
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
              <span className="text-[12px] text-white/85">
                * Minimal buyurtma miqdori: 60,000 so&apos;m
              </span>
            </div>
          </div>

          <div className="hidden justify-end min-[900px]:col-span-4 min-[900px]:flex">
            <div className="flex min-w-[200px] flex-col items-center gap-2 rounded-3xl bg-white/15 px-6 py-5 backdrop-blur-md">
              <svg
                className="h-20 w-28 text-white"
                fill="none"
                viewBox="0 0 160 120"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="35" cy="95" fill="#141B2B" r="18" stroke="#FEA619" strokeWidth="4" />
                <circle cx="35" cy="95" fill="#FFFFFF" r="6" />
                <circle cx="125" cy="95" fill="#141B2B" r="18" stroke="#FEA619" strokeWidth="4" />
                <circle cx="125" cy="95" fill="#FFFFFF" r="6" />
                <path
                  d="M35 95H70L85 65H115L125 95"
                  stroke="#FFFFFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="6"
                />
                <path d="M85 65L75 40H60" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" />
                <rect fill="#FEA619" height="28" rx="6" width="30" x="25" y="45" />
                <path
                  d="M40 50V68M30 59H50"
                  stroke="#141B2B"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <path d="M115 65L108 30H120" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="5" />
                <path
                  d="M5 80H18M-5 95H12M8 110H22"
                  stroke="#FEA619"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span className="text-center text-[14px] font-bold">
                O&apos;rtacha yetkazish: 28 daq
              </span>
              <span className="text-center text-[12px] text-white/85">Issiq holda yetib boradi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

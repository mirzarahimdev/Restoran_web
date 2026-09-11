import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

const companyLinks = [
  { label: 'Biz haqimizda', to: '#' },
  { label: 'Karyera', to: '#' },
  { label: 'Yangiliklar', to: '#' },
  { label: 'Hamkorlik', to: '#' },
]

const helpLinks = [
  { label: 'FAQ', to: '#' },
  { label: "Bog'lanish", to: '#' },
  { label: 'Yetkazib berish shartlari', to: '#' },
  { label: 'Qoidalar', to: '#' },
]

const partnerLinks = [
  { label: "Hamkor bo'ling", to: '#' },
  { label: "Kuriyer bo'ling", to: '#' },
  { label: 'Biznes kabineti', to: '#' },
]

const payments = ['Uzcard', 'Humo', 'Payme', 'Click', 'Visa']

export function Footer() {
  return (
    <footer className="mt-16 w-full bg-surface-container-lowest shadow-[0_-4px_24px_rgba(20,27,43,0.03)]">
      <div className="container-fooduz py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm text-body-md text-on-surface-variant">
              O&apos;zbekistondagi eng mazali taomlar bir zumda eshigingizda. Issiq plov, tandir
              somsa va lazzatli shashliklar tezkor yetkazib berish bilan.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-label-lg font-bold text-on-surface">Kompaniya</span>
            {companyLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-label-lg font-bold text-on-surface">Mijozlarga yordam</span>
            {helpLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-label-lg font-bold text-on-surface">Restoranlar uchun</span>
            {partnerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-label-sm font-bold tracking-wider text-on-surface uppercase">
                Mobil ilovalar
              </span>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-surface-container px-3 py-2 transition-colors hover:bg-surface-container-high"
              >
                <Icon name="phone_iphone" className="text-on-surface" />
                <span className="flex flex-col text-left">
                  <span className="text-label-sm leading-none text-on-surface-variant">
                    Yuklab oling
                  </span>
                  <span className="text-label-md font-semibold text-on-surface">App Store</span>
                </span>
              </button>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-surface-container px-3 py-2 transition-colors hover:bg-surface-container-high"
              >
                <Icon name="play_arrow" className="text-on-surface" />
                <span className="flex flex-col text-left">
                  <span className="text-label-sm leading-none text-on-surface-variant">
                    Yuklab oling
                  </span>
                  <span className="text-label-md font-semibold text-on-surface">Google Play</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-container pt-8 text-on-surface-variant md:flex-row">
          <p className="text-center text-body-sm md:text-left">
            © 2025 FoodUZ. Barcha huquqlar himoyalangan. To&apos;lov tizimlari: Uzcard, Humo,
            Payme, Click, Visa
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded bg-surface-container px-2 py-1 text-label-sm font-semibold text-on-surface"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

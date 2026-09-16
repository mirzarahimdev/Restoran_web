import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { paymentLogos } from '../ui/PaymentLogos'

const payments = [
  { name: 'Uzcard' as const, color: '#1B4F9C', bg: '#EAF1FB' },
  { name: 'Humo' as const, color: '#1A237E', bg: '#EEF0FF' },
  { name: 'Payme' as const, color: '#00A8A8', bg: '#E8FAFA' },
  { name: 'Click' as const, color: '#2B6CF0', bg: '#EAF1FF' },
  { name: 'Visa' as const, color: '#1A1F71', bg: '#EEF0F8' },
]

function AppleLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#111111"
        d="M18.71 12.66c-.03-2.4 1.96-3.55 2.05-3.61-1.12-1.63-2.86-1.86-3.48-1.88-1.48-.15-2.89.87-3.64.87-.75 0-1.91-.85-3.14-.83-1.61.02-3.1.94-3.93 2.39-1.68 2.91-.43 7.23 1.2 9.59.8 1.16 1.76 2.45 3.01 2.4 1.21-.05 1.67-.78 3.13-.78 1.46 0 1.87.78 3.15.76 1.3-.02 2.13-1.18 2.92-2.34.92-1.34 1.3-2.64 1.32-2.71-.03-.01-2.53-.97-2.56-3.85l-.03-.01zM15.6 5.5c.67-.81 1.12-1.94.99-3.06-0.96.04-2.12.64-2.81 1.45-.62.72-1.16 1.87-1.01 2.97 1.07.08 2.16-.54 2.83-1.36z"
      />
    </svg>
  )
}

function GooglePlayLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#EA4335" d="M3.6 2.3c-.3.2-.5.5-.5.9v17.6c0 .4.2.7.5.9l9.7-9.7L3.6 2.3z" />
      <path fill="#FBBC04" d="M16.1 14.8l-2.8-2.8-9.7 9.7c.3.2.7.2 1.1 0l11.4-6.5v-.4z" />
      <path fill="#4285F4" d="M20.4 10.7L16.1 8.2l-2.8 2.8 2.8 2.8 4.3-2.5c.8-.4.8-1.2 0-1.6z" />
      <path fill="#34A853" d="M13.3 12l2.8-2.8L4.7 1.5c-.4-.2-.8-.1-1.1 0L13.3 12z" />
    </svg>
  )
}

function StoreButton({
  logo,
  label,
  store,
  href,
}: {
  logo: ReactNode
  label: string
  store: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-[#E4E7F5] bg-gradient-to-r from-[#F5F6FF] to-[#EEF0FF] px-[14px] py-[11px] text-left shadow-[0_2px_8px_rgba(20,27,43,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#F97316]/30 hover:shadow-[0_8px_20px_rgba(249,115,22,0.12)]"
    >
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-white shadow-[0_2px_6px_rgba(20,27,43,0.06)]">
        {logo}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[10px] leading-none text-[#8A7B74]">{label}</span>
        <span className="mt-[4px] text-[13px] leading-none font-bold text-[#141b2b]">{store}</span>
      </span>
      <Icon
        name="arrow_outward"
        className="ml-auto shrink-0 text-[16px] text-[#C5CAD8] transition-colors group-hover:text-[#F97316]"
      />
    </a>
  )
}

export function Footer() {
  const { t } = useLanguage()

  const companyLinks = [
    { label: t('footer.about'), to: '/' },
    { label: t('footer.careers'), to: '/aksiyalar' },
    { label: t('footer.news'), to: '/aksiyalar' },
    { label: t('footer.partnership'), to: '/restoranlar' },
  ]

  const helpLinks = [
    { label: t('footer.faq'), href: 'tel:+998712000000' },
    { label: t('footer.contact'), href: 'tel:+998712000000' },
    { label: t('footer.deliveryTerms'), to: '/restoranlar' },
    { label: t('footer.rules'), to: '/kirish' },
  ]

  const partnerLinks = [
    { label: t('footer.bePartner'), href: 'mailto:partners@fooduz.uz' },
    { label: t('footer.beCourier'), href: 'mailto:courier@fooduz.uz' },
    { label: t('footer.business'), href: 'mailto:business@fooduz.uz' },
  ]

  return (
    <footer className="mt-16 w-full bg-surface-container-lowest shadow-[0_-4px_24px_rgba(20,27,43,0.03)]">
      <div className="container-fooduz py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm text-body-md text-on-surface-variant">{t('footer.tagline')}</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-label-lg font-bold text-on-surface">{t('footer.company')}</span>
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
            <span className="text-label-lg font-bold text-on-surface">{t('footer.help')}</span>
            {helpLinks.map((link) =>
              'href' in link && link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={'to' in link && link.to ? link.to : '/'}
                  className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-label-lg font-bold text-on-surface">
              {t('footer.forRestaurants')}
            </span>
            {partnerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="flex max-w-[240px] flex-col gap-[8px] pt-3">
              <span className="text-[11px] font-bold tracking-[0.12em] text-[#141b2b] uppercase">
                {t('footer.apps')}
              </span>
              <StoreButton
                logo={<AppleLogo className="h-[22px] w-[22px]" />}
                label={t('footer.download')}
                store="App Store"
                href="https://apps.apple.com/search?term=FoodUZ"
              />
              <StoreButton
                logo={<GooglePlayLogo className="h-[22px] w-[22px]" />}
                label={t('footer.download')}
                store="Google Play"
                href="https://play.google.com/store/search?q=FoodUZ&c=apps"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-surface-container pt-8 text-on-surface-variant md:flex-row">
          <p className="text-center text-body-sm md:text-left">{t('footer.copyright')}</p>
          <div className="flex flex-wrap items-center justify-center gap-[8px]">
            {payments.map((p) => {
              const PaymentLogo = paymentLogos[p.name]
              return (
                <span
                  key={p.name}
                  className="inline-flex h-[34px] items-center gap-[7px] rounded-[10px] border border-white/80 px-[10px] text-[12px] font-bold shadow-[0_2px_8px_rgba(20,27,43,0.05)]"
                  style={{ backgroundColor: p.bg, color: p.color }}
                >
                  <PaymentLogo
                    className={p.name === 'Visa' ? 'h-[14px] w-[34px]' : 'h-[18px] w-[18px]'}
                  />
                  {p.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

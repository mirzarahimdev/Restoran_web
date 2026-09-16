type LogoProps = {
  className?: string
}

/** Brand-colored mark icons for footer payment chips */
export function UzcardLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="uzcard-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B5CAB" />
          <stop offset="100%" stopColor="#063A73" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="5" width="21" height="14" rx="2.5" fill="url(#uzcard-g)" />
      <rect x="1.5" y="8.2" width="21" height="2.8" fill="#F5C518" />
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fill="#fff"
        fontSize="5.2"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        UZ
      </text>
    </svg>
  )
}

export function HumoLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1.5" y="4" width="21" height="16" rx="3.5" fill="#4B2E83" />
      <path
        d="M6.5 15.2c0-2.6 1.7-4.2 4-4.2 1.3 0 2.2.5 2.9 1.2l-1.1 1c-.4-.4-.9-.7-1.7-.7-1.3 0-2.1.9-2.1 2.7s.8 2.7 2.1 2.7c.8 0 1.3-.3 1.7-.7l1.1 1c-.7.7-1.6 1.2-2.9 1.2-2.3 0-4-1.6-4-4.2z"
        fill="#fff"
      />
      <circle cx="17.4" cy="9" r="2" fill="#00AEEF" />
      <circle cx="17.4" cy="9" r="0.85" fill="#fff" />
    </svg>
  )
}

export function PaymeLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1.5" y="4" width="21" height="16" rx="4" fill="#00C8C8" />
      <path
        d="M7.4 8h3.4c2.1 0 3.4 1.2 3.4 3.1S12.9 14.2 10.8 14.2H9.2V16.2H7.4V8zm1.8 1.5v3.2h1.5c1.1 0 1.7-.6 1.7-1.6s-.6-1.6-1.7-1.6H9.2z"
        fill="#fff"
      />
      <circle cx="17.5" cy="15.2" r="1.6" fill="#fff" />
    </svg>
  )
}

export function ClickLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="#0057FF" />
      <path
        d="M7.8 12.2l2.8 2.8 5.6-5.8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function VisaLogo({ className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 48 16" className={className} aria-hidden>
      <path
        d="M19.4 1.2h-3.5l-3.5 13.6h3.5L19.4 1.2zm15.2 0h-3.3c-.7 0-1.2.3-1.5.9L25.2 14.8h3.6l.7-2h4.4l.4 2h3.2L34.6 1.2zm-3.9 9.1l1.8-5 1 5h-2.8zM14.7 1.2L11.4 9.8l-.4-1.9C10.4 5.4 8.4 3.8 6.1 3l.1-.6h5.1c.7 0 1.3.5 1.4 1.2l1.3 6.9 3.1-8.1 3.6-.2zm26.7 0l-2.8 13.6h-3.3L38.1 5l-2 9.8h-3.4L29.2 1.2h3.5l2 9.5 3.2-9.5h3.5z"
        fill="#1A1F71"
      />
      <path d="M42.2 1.2l-4.3 13.6h3.3l4.3-13.6h-3.3z" fill="#F7A600" />
    </svg>
  )
}

export const paymentLogos = {
  Uzcard: UzcardLogo,
  Humo: HumoLogo,
  Payme: PaymeLogo,
  Click: ClickLogo,
  Visa: VisaLogo,
} as const

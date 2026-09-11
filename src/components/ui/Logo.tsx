import { Link } from 'react-router-dom'

type LogoProps = {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md'
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 'h-[32px] w-[32px]' : 'h-[36px] w-[36px]'
  const textSize = size === 'sm' ? 'text-[16px]' : 'text-headline-md'

  return (
    <Link to="/" className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 ${className}`}>
      <svg
        className={`${iconSize} shrink-0`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="48" height="48" rx="12" fill="#F97316" />
        <path
          d="M24 12c-5.5 0-9 3.2-9 8.2 0 2.4 1 4.4 2.6 5.8V34a2 2 0 0 0 2 2h8.8a2 2 0 0 0 2-2V26c1.6-1.4 2.6-3.4 2.6-5.8C33 15.2 29.5 12 24 12Z"
          fill="#fff"
        />
        <circle cx="24" cy="10.5" r="2" fill="#fff" />
        <rect x="14" y="34" width="20" height="2.5" rx="1.25" fill="#fff" />
      </svg>
      {showText && (
        <span className={`relative font-bold tracking-tight text-[#141b2b] ${textSize}`}>
          Food<span className="text-[#F97316]">UZ</span>
          {size === 'sm' && (
            <span
              className="absolute -top-0.5 -right-1.5 h-1.5 w-1.5 rounded-full bg-[#F97316]"
              aria-hidden
            />
          )}
        </span>
      )}
    </Link>
  )
}

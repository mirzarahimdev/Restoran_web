import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

export function AuthHeader() {
  return (
    <header className="fixed inset-x-0 top-[15px] z-50 rounded-t-2xl bg-surface shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            <span className="hidden sm:inline">Bosh sahifaga qaytish</span>
          </Link>

          <div className="hidden h-4 w-px bg-outline-variant/40 sm:block" />

          <Link to="/" className="flex items-center gap-2">
            <svg
              className="h-8 w-8 shrink-0"
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
            <span className="relative text-headline-sm font-bold tracking-tight text-on-surface">
              Food<span className="text-primary-container">UZ</span>
              <span
                className="absolute -top-0.5 -right-1.5 h-1.5 w-1.5 rounded-full bg-primary-container"
                aria-hidden
              />
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 text-label-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <Icon name="language" className="text-[16px] text-primary" />
          <span>O&apos;zbekcha</span>
          <Icon name="expand_more" className="text-[16px]" />
        </button>
      </div>
    </header>
  )
}

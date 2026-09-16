import { Logo } from '../ui/Logo'
import { LanguageSelector } from './LanguageSelector'

export function AuthHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E9EDFF] bg-white">
      <div className="grid h-[64px] w-full grid-cols-[1fr_auto_1fr] items-center gap-[12px] px-[24px] lg:px-[40px]">
        <div aria-hidden className="justify-self-start" />

        <Logo className="justify-self-center" size="sm" />

        <LanguageSelector />
      </div>
    </header>
  )
}

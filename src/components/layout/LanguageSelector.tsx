import { useEffect, useRef, useState } from 'react'
import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageContext'
import { languages, type LanguageId } from '../../i18n/types'

type LanguageSelectorProps = {
  className?: string
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const current = languages.find((l) => l.id === lang) ?? languages[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pick = (id: LanguageId) => {
    setLang(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative justify-self-end ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-[36px] items-center gap-[6px] rounded-full bg-[#F1F3FF] px-[12px] text-[12px] font-semibold text-[#141b2b] transition-colors hover:bg-[#E9EDFF]"
      >
        <span className="font-bold lowercase">{current.code}</span>
        <span>{current.label}</span>
        <Icon
          name="expand_more"
          className={`text-[16px] text-[#6B7280] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('lang.select')}
          className="absolute top-[42px] right-0 z-50 min-w-[160px] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white py-[6px] shadow-[0_12px_32px_rgba(20,27,43,0.12)]"
        >
          {languages.map((item) => {
            const active = item.id === lang
            return (
              <li key={item.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => pick(item.id)}
                  className={`flex w-full items-center gap-[8px] px-[14px] py-[10px] text-left text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-[#FFF4ED] text-[#F97316]'
                      : 'text-[#141b2b] hover:bg-[#F1F3FF]'
                  }`}
                >
                  <span className="w-[28px] font-bold lowercase text-[#6B7280]">{item.code}</span>
                  <span>{item.label}</span>
                  {active && <Icon name="check" className="ml-auto text-[16px]" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

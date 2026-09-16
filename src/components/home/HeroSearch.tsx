import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { HERO_SEARCH_FOCUS_EVENT } from '../../lib/searchFocus'
import { Icon } from '../ui/Icon'

const categoryIds = [
  { id: 'all', icon: 'restaurant', key: 'hero.cat.all' },
  { id: 'plov', icon: 'rice_bowl', key: 'hero.cat.plov', query: 'milliy' },
  { id: 'pizza', icon: 'local_pizza', key: 'hero.cat.pizza', query: 'pizza' },
  { id: 'fastfood', icon: 'lunch_dining', key: 'hero.cat.fastfood', query: 'fastfood' },
  { id: 'dessert', icon: 'cake', key: 'hero.cat.dessert', query: 'dessert' },
] as const

export function HeroSearch() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<(typeof categoryIds)[number]['id']>('all')
  const category = categoryIds.find((c) => c.id === categoryId) ?? categoryIds[0]

  useEffect(() => {
    const onFocusRequest = () => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener(HERO_SEARCH_FOCUS_EVENT, onFocusRequest)
    return () => window.removeEventListener(HERO_SEARCH_FOCUS_EVENT, onFocusRequest)
  }, [])

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

  const goSearch = () => {
    const params = new URLSearchParams()
    const q = query.trim()
    if (q) params.set('q', q)
    if (categoryId !== 'all' && 'query' in category && category.query) {
      params.set('category', category.query)
    }
    const qs = params.toString()
    navigate(qs ? `/restoranlar?${qs}` : '/restoranlar')
  }

  return (
    <form
      className="flex h-auto w-full max-w-[640px] flex-col items-stretch gap-2 rounded-[28px] bg-white p-1.5 shadow-[0_8px_28px_rgba(20,27,43,0.08)] sm:h-[56px] sm:flex-row sm:items-center sm:rounded-full sm:gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        goSearch()
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-4">
        <Icon name="search" className="shrink-0 text-[22px] text-[#6B7280]" />
        <input
          ref={inputRef}
          id="hero-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('hero.search.ph')}
          className="w-full min-w-0 bg-transparent text-[15px] leading-5 text-[#141b2b] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>

      <div ref={rootRef} className="relative hidden shrink-0 sm:block">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={t('hero.cat.aria')}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3.5 transition-colors hover:bg-[#E4E7FC]"
        >
          <Icon name="restaurant_menu" className="text-[18px] text-[#F97316]" />
          <span className="max-w-[130px] truncate text-[14px] leading-5 font-semibold text-[#141b2b]">
            {t(category.key)}
          </span>
          <Icon
            name="expand_more"
            className={`text-[18px] text-[#6B7280] transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={t('hero.cat.aria')}
            className="absolute top-[calc(100%+10px)] right-0 z-50 min-w-[220px] overflow-hidden rounded-[16px] border border-[#E9EDFF] bg-white py-[6px] shadow-[0_16px_40px_rgba(20,27,43,0.14)]"
          >
            {categoryIds.map((item) => {
              const active = item.id === categoryId
              return (
                <li key={item.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryId(item.id)
                      setOpen(false)
                    }}
                    className={`flex w-full cursor-pointer items-center gap-[10px] px-[14px] py-[11px] text-left text-[13px] font-semibold transition-colors ${
                      active
                        ? 'bg-[#FFF4ED] text-[#F97316]'
                        : 'text-[#141b2b] hover:bg-[#F5F6FF]'
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      className={`text-[18px] ${active ? 'text-[#F97316]' : 'text-[#8A7B74]'}`}
                    />
                    <span className="truncate">{t(item.key)}</span>
                    {active && <Icon name="check" className="ml-auto text-[16px] text-[#F97316]" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#F97316] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#EA580C] sm:h-10 sm:px-6"
      >
        {t('hero.search.submit')}
      </button>
    </form>
  )
}

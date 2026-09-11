import { useEffect, useRef } from 'react'
import { HERO_SEARCH_FOCUS_EVENT } from '../../lib/searchFocus'
import { Icon } from '../ui/Icon'

export function HeroSearch() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onFocusRequest = () => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener(HERO_SEARCH_FOCUS_EVENT, onFocusRequest)
    return () => window.removeEventListener(HERO_SEARCH_FOCUS_EVENT, onFocusRequest)
  }, [])

  return (
    <form
      className="flex h-auto w-full max-w-[640px] flex-col items-stretch gap-2 rounded-[28px] bg-white p-1.5 shadow-[0_8px_28px_rgba(20,27,43,0.08)] sm:h-[56px] sm:flex-row sm:items-center sm:rounded-full sm:gap-2"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-4">
        <Icon name="search" className="shrink-0 text-[22px] text-[#6B7280]" />
        <input
          ref={inputRef}
          id="hero-search-input"
          type="text"
          placeholder="Restoran yoki taom nomini kiriting..."
          className="w-full min-w-0 bg-transparent text-[15px] leading-5 text-[#141b2b] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>

      <label className="hidden h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#EEF0FF] px-3.5 transition-colors hover:bg-[#E4E7FC] sm:inline-flex">
        <Icon name="restaurant_menu" className="text-[18px] text-[#F97316]" />
        <select
          aria-label="Taom kategoriyasi"
          className="max-w-[130px] cursor-pointer appearance-none bg-transparent text-[14px] leading-5 font-semibold text-[#141b2b] outline-none"
          defaultValue="all"
        >
          <option value="all">Barcha taomlar</option>
          <option value="plov">Milliy osh</option>
          <option value="pizza">Pitsalar</option>
          <option value="fastfood">Burgerlar</option>
          <option value="dessert">Shirinliklar</option>
        </select>
        <Icon name="expand_more" className="text-[18px] text-[#6B7280]" />
      </label>

      <button
        type="submit"
        className="flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F97316] px-6 text-[15px] font-semibold text-white transition-all hover:bg-[#EA580C] active:scale-[0.98] sm:w-auto"
      >
        <span>Qidirish</span>
        <Icon name="arrow_forward" className="text-[18px]" />
      </button>
    </form>
  )
}

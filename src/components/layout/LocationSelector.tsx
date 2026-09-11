import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../ui/Icon'

const locations = [
  "Toshkent sh., Mirzo Ulug'bek t.",
  'Toshkent sh., Yunusobod t.',
  'Toshkent sh., Chilonzor t.',
  'Toshkent sh., Yakkasaroy t.',
  'Toshkent sh., Shayxontohur t.',
  'Toshkent sh., Sergelgoh t.',
]

type LocationSelectorProps = {
  className?: string
}

export function LocationSelector({ className = '' }: LocationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(locations[0])
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

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

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-[36px] w-full max-w-[300px] cursor-pointer items-center gap-[6px] rounded-full bg-[#E9EDFF] px-[12px] text-left text-[13px] leading-[18px] font-semibold text-[#141b2b] transition-colors hover:bg-[#dde2f8] focus-visible:ring-2 focus-visible:ring-[#F97316]/40 focus-visible:outline-none"
      >
        <Icon name="location_on" className="shrink-0 text-[18px] text-[#F97316]" filled />
        <span className="truncate">{selected}</span>
        <Icon
          name="expand_more"
          className={`shrink-0 text-[16px] text-[#584237] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Yetkazib berish manzili"
          className="absolute top-[calc(100%+8px)] left-0 z-[70] min-w-[280px] overflow-hidden rounded-2xl border border-[#E9EDFF] bg-white py-1.5 shadow-[0_12px_32px_rgba(20,27,43,0.12)]"
        >
          {locations.map((loc) => {
            const active = loc === selected
            return (
              <li key={loc} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(loc)
                    setOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-[13px] font-semibold transition-colors hover:bg-[#F1F3FF] ${
                    active ? 'bg-[#FFF4ED] text-[#9d4300]' : 'text-[#141b2b]'
                  }`}
                >
                  <Icon
                    name="location_on"
                    className={`shrink-0 text-[18px] ${active ? 'text-[#F97316]' : 'text-[#584237]'}`}
                  />
                  <span className="truncate">{loc}</span>
                  {active && <Icon name="check" className="ml-auto text-[18px] text-[#F97316]" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

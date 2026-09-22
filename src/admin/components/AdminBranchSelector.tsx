import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../../components/ui/Icon'

const branches = [
  { id: 'chilonzor', label: 'Toshkent, Chilonzor filiali', status: 'Faol (Ochiq)', open: true },
  { id: 'yunusobod', label: 'Toshkent, Yunusobod filiali', status: 'Faol (Ochiq)', open: true },
  { id: 'mirabad', label: 'Toshkent, Mirobod filiali', status: 'Yopiq', open: false },
  { id: 'sergeli', label: 'Toshkent, Sergeli filiali', status: 'Faol (Ochiq)', open: true },
  { id: 'samarqand', label: 'Samarqand, Registon filiali', status: 'Faol (Ochiq)', open: true },
]

export function AdminBranchSelector() {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(branches[0].id)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = branches.find((b) => b.id === selectedId) ?? branches[0]

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
    <div ref={rootRef} className="relative hidden shrink-0 min-[1280px]:block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-[#F1F3FF] px-4 text-[13px] whitespace-nowrap transition-colors hover:bg-[#E9EDFF]"
      >
        <Icon name="location_on" className="text-[18px] text-[#9D4300]" />
        <span className="font-semibold text-[#141b2b]">{selected.label}</span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${selected.open ? 'bg-[#FEA619]' : 'bg-[#9CA3AF]'}`}
        />
        <span className={`font-bold ${selected.open ? 'text-[#855300]' : 'text-[#584237]'}`}>
          {selected.status}
        </span>
        <Icon
          name="expand_more"
          className={`ml-0.5 text-[18px] text-[#584237] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Filial tanlash"
          className="absolute top-[calc(100%+10px)] left-0 z-[70] min-w-[320px] overflow-hidden rounded-2xl border border-[#E9EDFF] bg-white py-1.5 shadow-[0_12px_32px_rgba(20,27,43,0.12)]"
        >
          {branches.map((branch) => {
            const active = branch.id === selected.id
            return (
              <li key={branch.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(branch.id)
                    setOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-[#F1F3FF] ${
                    active ? 'bg-[#FFF4ED]' : ''
                  }`}
                >
                  <Icon
                    name="storefront"
                    className={`shrink-0 text-[20px] ${active ? 'text-[#F97316]' : 'text-[#584237]'}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[13px] font-semibold ${
                        active ? 'text-[#9D4300]' : 'text-[#141b2b]'
                      }`}
                    >
                      {branch.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-[11px] font-semibold ${
                        branch.open ? 'text-[#855300]' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {branch.status}
                    </span>
                  </span>
                  {active && <Icon name="check" className="shrink-0 text-[18px] text-[#F97316]" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

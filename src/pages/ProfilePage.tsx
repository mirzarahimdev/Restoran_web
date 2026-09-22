import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { OrderDto, RestaurantListItemDto } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'
import { Icon } from '../components/ui/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { languages } from '../i18n/types'

const ADDR_KEY = 'fooduz_profile_addresses'
const NOTIFY_KEY = 'fooduz_notify_on'
const BIRTH_KEY = 'fooduz_birthdate'
const COURIER_PHONE = '+998712000000'
const SUPPORT_PHONE = '+998712000000'

type Address = {
  id: string
  title: string
  line: string
  primary: boolean
}

type HistoryFilter = 'all' | 'delivered' | 'cancelled'
type DateFilter = 'all' | '30' | '7'

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'home',
    title: 'Uy (asosiy)',
    line: "Mirzo Ulug'bek t., Buyuk Ipak Yo'li 42, 15-uy",
    primary: true,
  },
  {
    id: 'work',
    title: 'Ish joyi',
    line: 'Yunusobod t., Amir Temur ko‘chasi 18',
    primary: false,
  },
]

function formatSum(n: number) {
  return `${n.toLocaleString('uz-UZ')} so'm`
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return { first: fullName || '—', last: '—' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

function orderCode(id: number) {
  return `#FU-${String(id).padStart(5, '0')}`
}

function paymentLabel(method: string, t: (k: string) => string) {
  const key = `profile.pay.${method}`
  const mapped = t(key)
  return mapped === key ? method : mapped
}

function statusMeta(status: string, t: (k: string) => string) {
  if (status === 'delivered') {
    return { label: t('profile.status.delivered'), className: 'bg-[#E8F5E9] text-[#2E7D32]' }
  }
  if (status === 'cancelled') {
    return { label: t('profile.status.cancelled'), className: 'bg-[#FFEBEE] text-[#C62828]' }
  }
  if (status === 'on_the_way') {
    return { label: t('profile.status.onTheWay'), className: 'bg-[#FFF4ED] text-[#F97316]' }
  }
  return { label: t('profile.status.pending'), className: 'bg-[#EEF2FF] text-[#4338CA]' }
}

const LIVE_STATUSES = new Set(['on_the_way', 'preparing', 'pending', 'accepted'])

function readAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(ADDR_KEY)
    if (!raw) return DEFAULT_ADDRESSES
    const parsed = JSON.parse(raw) as Address[]
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ADDRESSES
  } catch {
    return DEFAULT_ADDRESSES
  }
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-[16px]">
      <div
        role="dialog"
        aria-modal
        className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-[20px] bg-white p-[20px] shadow-[0_20px_48px_rgba(20,27,43,0.2)]"
      >
        <div className="mb-[16px] flex items-center justify-between gap-[12px]">
          <h3 className="text-[18px] font-extrabold text-[#141b2b]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#141b2b]"
            aria-label="Close"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function openMaps(query: string) {
  const text = query.trim()
  if (!text) return
  window.open(
    `https://yandex.uz/maps/?text=${encodeURIComponent(text)}&z=16&l=map`,
    '_blank',
    'noopener,noreferrer',
  )
}

function printReceipt(order: OrderDto, restaurantName: string, t: (k: string) => string) {
  const items = order.items
    .map(
      (i) =>
        `<tr><td>${i.name} ×${i.qty}</td><td style="text-align:right">${formatSum(i.price * i.qty)}</td></tr>`,
    )
    .join('')
  const html = `<!doctype html><html><head><title>${orderCode(order.id)}</title>
    <style>body{font-family:system-ui,sans-serif;padding:24px;color:#141b2b}
    h1{font-size:20px;margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:16px}
    td{padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.muted{color:#6B7280;font-size:12px}
    .total{font-size:18px;font-weight:800;margin-top:16px}</style></head><body>
    <h1>FoodUZ ${t('profile.receipt')}</h1>
    <p class="muted">${orderCode(order.id)} · ${restaurantName}</p>
    <p class="muted">${order.address}</p>
    <table>${items}</table>
    <p class="total">${formatSum(order.total)}</p>
    <p class="muted">${paymentLabel(order.paymentMethod, t)} · ${statusMeta(order.status, t).label}</p>
    </body></html>`
  const win = window.open('', '_blank', 'noopener,noreferrer,width=480,height=640')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  win.print()
}

export function ProfilePage() {
  const { t, lang } = useLanguage()
  const { user, token, updateProfile, changePassword } = useAuth()
  const { syncRestaurantCart } = useCart()
  const navigate = useNavigate()
  const historyRef = useRef<HTMLElement>(null)
  const liveRef = useRef<HTMLElement>(null)

  const [favorites, setFavorites] = useState<RestaurantListItemDto[]>([])
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [restaurants, setRestaurants] = useState<RestaurantListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('30')
  const [historyQuery, setHistoryQuery] = useState('')
  const [notifyOn, setNotifyOn] = useState(() => localStorage.getItem(NOTIFY_KEY) !== '0')
  const [visibleCount, setVisibleCount] = useState(4)
  const [addresses, setAddresses] = useState<Address[]>(() => readAddresses())
  const [birthdate, setBirthdate] = useState(() => localStorage.getItem(BIRTH_KEY) || '14.05.1994')

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [paymentsOpen, setPaymentsOpen] = useState(false)
  const [addressModal, setAddressModal] = useState<Address | 'new' | null>(null)
  const [viewOrder, setViewOrder] = useState<OrderDto | null>(null)
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', email: '', birth: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [addrForm, setAddrForm] = useState({ title: '', line: '', primary: false })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      api.favorites(token).catch(() => [] as RestaurantListItemDto[]),
      api.orders(token).catch(() => [] as OrderDto[]),
      api.restaurants().catch(() => [] as RestaurantListItemDto[]),
    ])
      .then(([favs, ords, rests]) => {
        setFavorites(favs)
        setOrders(ords)
        setRestaurants(rests)
      })
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const target = hash === 'joriy' ? liveRef.current : hash === 'tarix' ? historyRef.current : null
    if (target) {
      window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    }
  }, [loading, orders])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(id)
  }, [toast])

  const restaurantMap = useMemo(() => {
    const map = new Map<string, RestaurantListItemDto>()
    for (const r of restaurants) map.set(r.id, r)
    for (const r of favorites) map.set(r.id, r)
    return map
  }, [restaurants, favorites])

  const liveOrder = useMemo(() => {
    const live = orders.find((o) => o.status === 'on_the_way')
    if (live) return live
    return orders.find((o) => LIVE_STATUSES.has(o.status)) ?? null
  }, [orders])

  const historyOrders = useMemo(() => {
    let list = orders.filter((o) => o.id !== liveOrder?.id)
    if (historyFilter === 'delivered') list = list.filter((o) => o.status === 'delivered')
    if (historyFilter === 'cancelled') list = list.filter((o) => o.status === 'cancelled')
    if (dateFilter === '7') list = list.slice(0, Math.max(1, Math.ceil(list.length * 0.35)))
    if (dateFilter === '30') list = list.slice(0, Math.max(2, Math.ceil(list.length * 0.75)))
    if (historyQuery.trim()) {
      const q = historyQuery.trim().toLowerCase()
      list = list.filter((o) => {
        const rest = restaurantMap.get(o.restaurantId)
        return (
          orderCode(o.id).toLowerCase().includes(q) ||
          rest?.name.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q)) ||
          o.address.toLowerCase().includes(q)
        )
      })
    }
    return list
  }, [orders, liveOrder, historyFilter, historyQuery, restaurantMap, dateFilter])

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length
  const orderCount = Math.max(orders.length, deliveredCount)
  const { first, last } = splitName(user?.fullName ?? '')
  const langLabel = languages.find((l) => l.id === lang)?.label ?? "O'zbekcha"

  if (!user) return <Navigate to="/kirish" replace />

  const liveRest = liveOrder ? restaurantMap.get(liveOrder.restaurantId) : null

  const showToast = (msg: string) => setToast(msg)

  const openEdit = () => {
    setEditForm({
      fullName: user.fullName,
      phone: user.phone,
      email: user.email || '',
      birth: birthdate,
    })
    setFormError('')
    setEditOpen(true)
  }

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await updateProfile({
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim() || undefined,
      })
      setBirthdate(editForm.birth.trim() || birthdate)
      localStorage.setItem(BIRTH_KEY, editForm.birth.trim() || birthdate)
      setEditOpen(false)
      showToast(t('profile.savedOk'))
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('profile.saveFail'))
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (passwordForm.next !== passwordForm.confirm) {
      setFormError(t('profile.passwordMismatch'))
      return
    }
    setSaving(true)
    try {
      await changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      })
      setPasswordOpen(false)
      setPasswordForm({ current: '', next: '', confirm: '' })
      showToast(t('profile.passwordOk'))
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('profile.saveFail'))
    } finally {
      setSaving(false)
    }
  }

  const persistAddresses = (next: Address[]) => {
    setAddresses(next)
    localStorage.setItem(ADDR_KEY, JSON.stringify(next))
  }

  const openAddress = (addr: Address | 'new') => {
    if (addr === 'new') {
      setAddrForm({ title: '', line: '', primary: false })
    } else {
      setAddrForm({ title: addr.title, line: addr.line, primary: addr.primary })
    }
    setAddressModal(addr)
  }

  const saveAddress = (e: FormEvent) => {
    e.preventDefault()
    if (!addrForm.title.trim() || !addrForm.line.trim()) return
    if (addressModal === 'new') {
      const next: Address[] = [
        ...addresses.map((a) => (addrForm.primary ? { ...a, primary: false } : a)),
        {
          id: `addr-${Date.now()}`,
          title: addrForm.title.trim(),
          line: addrForm.line.trim(),
          primary: addrForm.primary || addresses.length === 0,
        },
      ]
      persistAddresses(next)
    } else if (addressModal) {
      const next = addresses.map((a) => {
        if (a.id !== addressModal.id) {
          return addrForm.primary ? { ...a, primary: false } : a
        }
        return {
          ...a,
          title: addrForm.title.trim(),
          line: addrForm.line.trim(),
          primary: addrForm.primary,
        }
      })
      persistAddresses(next)
    }
    setAddressModal(null)
    showToast(t('profile.addressSaved'))
  }

  const reorder = (order: OrderDto) => {
    const rest = restaurantMap.get(order.restaurantId)
    syncRestaurantCart(
      order.restaurantId,
      rest?.name ?? order.restaurantId,
      order.items.map((i) => ({
        dishId: i.dishId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image || '',
      })),
    )
    showToast(t('profile.reorderOk'))
    navigate('/buyurtmalarim')
  }

  const toggleNotify = () => {
    setNotifyOn((v) => {
      const next = !v
      localStorage.setItem(NOTIFY_KEY, next ? '1' : '0')
      showToast(next ? t('profile.notifyOn') : t('profile.notifyOff'))
      return next
    })
  }

  return (
    <div className="w-full px-[24px] pt-[20px] pb-[48px] md:px-[40px] lg:px-[55px]">
      {toast && (
        <div className="fixed top-[88px] right-[24px] z-[90] rounded-full bg-[#141b2b] px-[16px] py-[10px] text-[13px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <section className="mb-[20px] rounded-[24px] bg-white px-[20px] py-[20px] shadow-[0_8px_28px_rgba(20,27,43,0.04)] md:px-[28px] md:py-[24px]">
        <div className="flex flex-col gap-[20px] lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-[16px] sm:flex-row sm:items-start">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-[88px] w-[88px] shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-[#E9EDFF] text-[28px] font-bold text-[#584237]">
                {initials(user.fullName)}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-[8px]">
                <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-[#141b2b]">
                  {user.fullName}
                </h1>
                <span className="inline-flex items-center rounded-full bg-[#FFF4ED] px-[10px] py-[4px] text-[11px] font-bold text-[#F97316]">
                  {t('profile.badge.loyal')}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#FFF8E7] px-[10px] py-[4px] text-[11px] font-bold text-[#B45309]">
                  {t('profile.badge.gold', { count: Math.max(orderCount, 1) })}
                </span>
              </div>

              <div className="mt-[10px] flex flex-wrap gap-x-[18px] gap-y-[6px] text-[13px] text-[#6B7280]">
                <span className="inline-flex items-center gap-[6px]">
                  <Icon name="mail" className="text-[16px] text-[#F97316]" />
                  {user.email || '—'}
                </span>
                <span className="inline-flex items-center gap-[6px]">
                  <Icon name="call" className="text-[16px] text-[#F97316]" />
                  {user.phone || '—'}
                </span>
              </div>

              <div className="mt-[14px] flex flex-wrap gap-[10px]">
                <div className="rounded-[14px] bg-[#FFF4ED] px-[14px] py-[10px]">
                  <p className="text-[11px] font-medium text-[#9d4300]">{t('profile.saved')}</p>
                  <p className="text-[15px] font-extrabold text-[#141b2b]">
                    {formatSum(deliveredCount * 7000 + 10000)}
                  </p>
                </div>
                <div className="rounded-[14px] bg-[#FFF4ED] px-[14px] py-[10px]">
                  <p className="text-[11px] font-medium text-[#9d4300]">{t('profile.cashback')}</p>
                  <p className="text-[15px] font-extrabold text-[#141b2b]">
                    {formatSum(Math.max(5000, deliveredCount * 2500))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-[20px] xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-[16px]">
          <section className="rounded-[20px] bg-white p-[18px] shadow-[0_8px_28px_rgba(20,27,43,0.04)]">
            <div className="mb-[14px] flex items-center justify-between gap-[8px]">
              <h2 className="text-[16px] font-extrabold text-[#141b2b]">
                {t('profile.personal')}
              </h2>
              <button
                type="button"
                onClick={openEdit}
                className="cursor-pointer text-[12px] font-bold text-[#F97316] hover:underline"
              >
                {t('profile.editShort')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              {[
                { label: t('profile.firstName'), value: first },
                { label: t('profile.lastName'), value: last },
                { label: t('profile.birth'), value: birthdate },
                { label: t('profile.language'), value: langLabel },
              ].map((field) => (
                <div key={field.label} className="rounded-[12px] bg-[#F8F9FC] px-[12px] py-[10px]">
                  <p className="text-[11px] text-[#8A7B74]">{field.label}</p>
                  <p className="mt-[2px] truncate text-[13px] font-semibold text-[#141b2b]">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] bg-white p-[18px] shadow-[0_8px_28px_rgba(20,27,43,0.04)]">
            <h2 className="mb-[14px] text-[16px] font-extrabold text-[#141b2b]">
              {t('profile.addresses')}
            </h2>
            <div className="flex flex-col gap-[10px]">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start gap-[10px] rounded-[14px] border border-[#EEF0F6] px-[12px] py-[12px]"
                >
                  <span className="mt-[2px] flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#FFF4ED] text-[#F97316]">
                    <Icon name="location_on" className="text-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-[6px]">
                      <p className="text-[13px] font-bold text-[#141b2b]">{addr.title}</p>
                      {addr.primary && (
                        <span className="rounded-full bg-[#E8F5E9] px-[8px] py-[2px] text-[10px] font-bold text-[#2E7D32]">
                          {t('profile.primary')}
                        </span>
                      )}
                    </div>
                    <p className="mt-[2px] text-[12px] leading-[18px] text-[#6B7280]">
                      {addr.line}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAddress(addr)}
                    className="cursor-pointer text-[#9CA3AF] hover:text-[#F97316]"
                    aria-label={t('profile.editShort')}
                  >
                    <Icon name="edit" className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => openAddress('new')}
              className="mt-[12px] inline-flex h-[40px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[12px] border border-dashed border-[#F97316]/40 text-[13px] font-bold text-[#F97316] transition-colors hover:bg-[#FFF4ED]"
            >
              <Icon name="add" className="text-[18px]" />
              {t('profile.addAddress')}
            </button>
          </section>

          <section className="rounded-[20px] bg-white p-[18px] shadow-[0_8px_28px_rgba(20,27,43,0.04)]">
            <div className="mb-[14px] flex items-center justify-between gap-[8px]">
              <h2 className="text-[16px] font-extrabold text-[#141b2b]">
                {t('profile.favRestaurants')}
              </h2>
              <Link
                to="/sevimlilar"
                className="text-[12px] font-bold text-[#F97316] hover:underline"
              >
                {t('profile.seeAll', { count: favorites.length })}
              </Link>
            </div>
            {loading ? (
              <p className="text-[13px] text-[#8A7B74]">{t('profile.loading')}</p>
            ) : favorites.length === 0 ? (
              <p className="text-[13px] text-[#8A7B74]">{t('profile.favEmpty')}</p>
            ) : (
              <div className="flex flex-col gap-[10px]">
                {favorites.slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    to={`/restoranlar/${r.id}`}
                    className="flex items-center gap-[10px] rounded-[14px] transition-colors hover:bg-[#F8F9FC]"
                  >
                    <img
                      src={r.image}
                      alt=""
                      className="h-[48px] w-[48px] shrink-0 rounded-[12px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[#141b2b]">{r.name}</p>
                      <p className="truncate text-[11px] text-[#8A7B74]">
                        {r.tags.slice(0, 2).join(' · ') || r.category}
                      </p>
                      <p className="mt-[2px] flex items-center gap-[8px] text-[11px] font-semibold text-[#6B7280]">
                        <span className="inline-flex items-center gap-[2px] text-[#F97316]">
                          <Icon name="star" className="text-[14px]" filled />
                          {r.rating.toFixed(1)}
                        </span>
                        <span>{r.eta}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[20px] bg-white p-[18px] shadow-[0_8px_28px_rgba(20,27,43,0.04)]">
            <h2 className="mb-[10px] text-[16px] font-extrabold text-[#141b2b]">
              {t('profile.settings')}
            </h2>
            <div className="divide-y divide-[#F1F3FF]">
              <div className="flex items-center gap-[10px] py-[12px]">
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237]">
                  <Icon name="notifications" className="text-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#141b2b]">
                    {t('profile.notify')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifyOn}
                  onClick={toggleNotify}
                  className={`relative h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors ${
                    notifyOn ? 'bg-[#F97316]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${
                      notifyOn ? 'translate-x-[20px]' : ''
                    }`}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPaymentsOpen(true)}
                className="flex w-full cursor-pointer items-center gap-[10px] py-[12px] text-left transition-colors hover:bg-[#F8F9FC]"
              >
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237]">
                  <Icon name="credit_card" className="text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#141b2b]">
                    {t('profile.payments')}
                  </span>
                  <span className="block text-[11px] text-[#8A7B74]">{t('profile.paymentsSub')}</span>
                </span>
                <Icon name="chevron_right" className="text-[18px] text-[#C5CAD8]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormError('')
                  setPasswordForm({ current: '', next: '', confirm: '' })
                  setPasswordOpen(true)
                }}
                className="flex w-full cursor-pointer items-center gap-[10px] py-[12px] text-left transition-colors hover:bg-[#F8F9FC]"
              >
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237]">
                  <Icon name="lock" className="text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#141b2b]">
                    {t('profile.security')}
                  </span>
                  <span className="block text-[11px] text-[#8A7B74]">{t('profile.securitySub')}</span>
                </span>
                <Icon name="chevron_right" className="text-[18px] text-[#C5CAD8]" />
              </button>
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="flex w-full items-center gap-[10px] py-[12px] text-left transition-colors hover:bg-[#F8F9FC]"
              >
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237]">
                  <Icon name="help" className="text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#141b2b]">
                    {t('profile.help')}
                  </span>
                  <span className="block text-[11px] text-[#8A7B74]">{t('profile.helpSub')}</span>
                </span>
                <Icon name="chevron_right" className="text-[18px] text-[#C5CAD8]" />
              </a>
            </div>
          </section>
        </aside>

        <div className="flex min-w-0 flex-col gap-[16px]">
          {liveOrder && (
            <section
              ref={liveRef}
              id="joriy"
              className="scroll-mt-[88px] rounded-[20px] bg-white p-[18px] shadow-[0_8px_28px_rgba(20,27,43,0.04)] md:p-[22px]"
            >
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[10px]">
                <h2 className="text-[16px] font-extrabold text-[#141b2b]">
                  {t('profile.liveOrder')}{' '}
                  <span className="font-semibold text-[#6B7280]">
                    · {orderCode(liveOrder.id)}
                  </span>
                </h2>
                <span className="rounded-full bg-[#FFF4ED] px-[12px] py-[6px] text-[12px] font-bold text-[#F97316]">
                  {t('profile.etaLive')}
                </span>
              </div>

              <div className="mb-[16px] flex flex-wrap items-start justify-between gap-[12px]">
                <div>
                  <p className="text-[15px] font-extrabold text-[#141b2b]">
                    {liveRest?.name ?? liveOrder.restaurantId}
                  </p>
                  <p className="mt-[4px] text-[12px] text-[#6B7280]">{liveOrder.address}</p>
                </div>
                <p className="text-[18px] font-extrabold text-[#141b2b]">
                  {formatSum(liveOrder.total)}
                </p>
              </div>

              <div className="mb-[16px] grid grid-cols-4 gap-[6px]">
                {[
                  { key: 'accepted', done: true, time: '14:15' },
                  { key: 'prepared', done: true, time: '14:32' },
                  { key: 'courier', done: liveOrder.status === 'on_the_way', time: '' },
                  { key: 'delivered', done: false, time: '' },
                ].map((step, i, arr) => (
                  <div key={step.key} className="relative text-center">
                    {i < arr.length - 1 && (
                      <span
                        className={`absolute top-[11px] left-1/2 h-[2px] w-full ${
                          step.done ? 'bg-[#F97316]' : 'bg-[#E5E7EB]'
                        }`}
                        aria-hidden
                      />
                    )}
                    <span
                      className={`relative z-[1] mx-auto flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] font-bold ${
                        step.done
                          ? 'bg-[#F97316] text-white'
                          : 'border-2 border-[#E5E7EB] bg-white text-[#9CA3AF]'
                      }`}
                    >
                      {step.done ? <Icon name="check" className="text-[14px]" /> : i + 1}
                    </span>
                    <p className="mt-[8px] text-[11px] font-semibold text-[#141b2b]">
                      {t(`profile.step.${step.key}`)}
                    </p>
                    {step.time && (
                      <p className="text-[10px] text-[#8A7B74]">{step.time}</p>
                    )}
                  </div>
                ))}
              </div>

              <ul className="mb-[16px] space-y-[6px]">
                {liveOrder.items.map((item) => (
                  <li
                    key={`${item.dishId}-${item.name}`}
                    className="flex items-center justify-between text-[13px]"
                  >
                    <span className="text-[#6B7280]">
                      {item.name} ×{item.qty}
                    </span>
                    <span className="font-semibold text-[#141b2b]">
                      {formatSum(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-[10px] sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    openMaps(
                      liveOrder.address ||
                        liveRest?.address ||
                        liveRest?.name ||
                        'Toshkent',
                    )
                  }
                  className="inline-flex h-[44px] flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-full bg-[#F97316] px-[16px] text-[13px] font-bold text-white hover:bg-[#EA580C]"
                >
                  <Icon name="map" className="text-[18px]" />
                  {t('profile.track')}
                </button>
                <a
                  href={`tel:${COURIER_PHONE}`}
                  className="inline-flex h-[44px] flex-1 items-center justify-center gap-[8px] rounded-full border border-[#E5E7EB] bg-white px-[16px] text-[13px] font-bold text-[#141b2b] hover:bg-[#F8F9FC]"
                >
                  <Icon name="call" className="text-[18px]" />
                  {t('profile.callCourier')}
                </a>
              </div>
            </section>
          )}

          <section
            ref={historyRef}
            id="tarix"
            className="scroll-mt-[88px] rounded-[20px] bg-white p-[18px] shadow-[0_8px_28px_rgba(20,27,43,0.04)] md:p-[22px]"
          >
            <div className="mb-[14px] flex flex-wrap items-end justify-between gap-[12px]">
              <h2 className="text-[18px] font-extrabold text-[#141b2b]">
                {t('profile.history')}
              </h2>
              <div className="flex flex-wrap gap-[8px]">
                {(
                  [
                    ['all', t('profile.filter.all', { count: orders.length })],
                    ['delivered', t('profile.filter.delivered', { count: deliveredCount })],
                    ['cancelled', t('profile.filter.cancelled', { count: cancelledCount })],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setHistoryFilter(id)
                      setVisibleCount(4)
                    }}
                    className={`h-[34px] cursor-pointer rounded-full px-[12px] text-[12px] font-bold transition-colors ${
                      historyFilter === id
                        ? 'bg-[#F97316] text-white'
                        : 'bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-[16px] flex flex-col gap-[10px] sm:flex-row">
              <label className="relative min-w-0 flex-1">
                <Icon
                  name="search"
                  className="pointer-events-none absolute top-1/2 left-[12px] -translate-y-1/2 text-[18px] text-[#9CA3AF]"
                />
                <input
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                  placeholder={t('profile.searchOrders')}
                  className="h-[40px] w-full rounded-[12px] bg-[#F5F6FB] pr-[12px] pl-[40px] text-[13px] font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#F97316]/20"
                />
              </label>
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as DateFilter)
                    setVisibleCount(4)
                  }}
                  className="h-[40px] cursor-pointer appearance-none rounded-[12px] bg-[#F5F6FB] py-[0] pr-[36px] pl-[14px] text-[12px] font-semibold text-[#584237] outline-none"
                >
                  <option value="7">{t('profile.last7')}</option>
                  <option value="30">{t('profile.last30')}</option>
                  <option value="all">{t('profile.allTime')}</option>
                </select>
                <Icon
                  name="expand_more"
                  className="pointer-events-none absolute top-1/2 right-[10px] -translate-y-1/2 text-[16px] text-[#9CA3AF]"
                />
              </div>
            </div>

            {loading ? (
              <p className="py-[24px] text-center text-[13px] text-[#8A7B74]">
                {t('profile.loading')}
              </p>
            ) : historyOrders.length === 0 ? (
              <p className="py-[24px] text-center text-[13px] text-[#8A7B74]">
                {t('profile.historyEmpty')}
              </p>
            ) : (
              <div className="flex flex-col gap-[12px]">
                {historyOrders.slice(0, visibleCount).map((order) => {
                  const rest = restaurantMap.get(order.restaurantId)
                  const meta = statusMeta(order.status, t)
                  return (
                    <article
                      key={order.id}
                      className="rounded-[16px] border border-[#EEF0F6] p-[14px] md:p-[16px]"
                    >
                      <div className="mb-[12px] flex flex-wrap items-start justify-between gap-[10px]">
                        <div className="flex min-w-0 items-center gap-[10px]">
                          {rest?.image ? (
                            <img
                              src={rest.image}
                              alt=""
                              className="h-[44px] w-[44px] rounded-[12px] object-cover"
                            />
                          ) : (
                            <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#F1F3FF]">
                              <Icon name="storefront" className="text-[22px] text-[#584237]" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-extrabold text-[#141b2b]">
                              {rest?.name ?? order.restaurantId}
                            </p>
                            <p className="text-[11px] text-[#8A7B74]">
                              {orderCode(order.id)}
                              {rest ? ` · ★ ${rest.rating.toFixed(1)}` : ''}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-[10px] py-[4px] text-[11px] font-bold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      <ul className="mb-[10px] space-y-[4px]">
                        {order.items.map((item) => (
                          <li
                            key={`${order.id}-${item.dishId}-${item.name}`}
                            className="text-[12px] text-[#6B7280]"
                          >
                            {item.name} ×{item.qty}
                          </li>
                        ))}
                      </ul>

                      <p className="mb-[12px] text-[12px] text-[#8A7B74]">
                        <Icon name="location_on" className="mr-[2px] align-[-3px] text-[14px]" />
                        {order.address}
                      </p>

                      <div className="mb-[12px] flex flex-wrap items-center justify-between gap-[8px]">
                        <p className="text-[16px] font-extrabold text-[#141b2b]">
                          {formatSum(order.total)}
                        </p>
                        <p className="text-[12px] font-semibold text-[#6B7280]">
                          {paymentLabel(order.paymentMethod, t)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-[8px]">
                        <button
                          type="button"
                          onClick={() => setViewOrder(order)}
                          className="inline-flex h-[36px] cursor-pointer items-center rounded-full bg-[#F1F3FF] px-[12px] text-[12px] font-bold text-[#141b2b] hover:bg-[#E9EDFF]"
                        >
                          {t('profile.viewOrder')}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            printReceipt(order, rest?.name ?? order.restaurantId, t)
                          }
                          className="inline-flex h-[36px] cursor-pointer items-center rounded-full bg-[#F1F3FF] px-[12px] text-[12px] font-bold text-[#141b2b] hover:bg-[#E9EDFF]"
                        >
                          {t('profile.receipt')}
                        </button>
                        {order.status === 'delivered' && (
                          <button
                            type="button"
                            onClick={() => reorder(order)}
                            className="inline-flex h-[36px] cursor-pointer items-center rounded-full bg-[#F97316] px-[12px] text-[12px] font-bold text-white hover:bg-[#EA580C]"
                          >
                            {t('profile.reorder')}
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {visibleCount < historyOrders.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + 4)}
                className="mt-[16px] inline-flex h-[44px] w-full cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[13px] font-bold text-[#141b2b] hover:bg-[#E9EDFF]"
              >
                {t('profile.loadMore')}
              </button>
            )}
          </section>
        </div>
      </div>

      {editOpen && (
        <Modal title={t('profile.edit')} onClose={() => setEditOpen(false)}>
          <form onSubmit={saveProfile} className="flex flex-col gap-[12px]">
            {[
              ['fullName', t('profile.name'), editForm.fullName],
              ['phone', t('profile.phone'), editForm.phone],
              ['email', t('profile.email'), editForm.email],
              ['birth', t('profile.birth'), editForm.birth],
            ].map(([key, label, value]) => (
              <label key={key} className="block">
                <span className="mb-[4px] block text-[12px] text-[#8A7B74]">{label}</span>
                <input
                  value={value}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="h-[42px] w-full rounded-[12px] bg-[#F5F6FB] px-[12px] text-[14px] font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#F97316]/25"
                  required={key !== 'email'}
                />
              </label>
            ))}
            {formError && <p className="text-[12px] font-semibold text-[#C62828]">{formError}</p>}
            <button
              type="submit"
              disabled={saving}
              className="mt-[4px] h-[44px] cursor-pointer rounded-full bg-[#F97316] text-[14px] font-bold text-white hover:bg-[#EA580C] disabled:opacity-60"
            >
              {t('profile.save')}
            </button>
          </form>
        </Modal>
      )}

      {passwordOpen && (
        <Modal title={t('profile.security')} onClose={() => setPasswordOpen(false)}>
          <form onSubmit={savePassword} className="flex flex-col gap-[12px]">
            {[
              ['current', t('profile.currentPassword')],
              ['next', t('profile.newPassword')],
              ['confirm', t('profile.confirmPassword')],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-[4px] block text-[12px] text-[#8A7B74]">{label}</span>
                <input
                  type="password"
                  value={passwordForm[key as keyof typeof passwordForm]}
                  onChange={(e) =>
                    setPasswordForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="h-[42px] w-full rounded-[12px] bg-[#F5F6FB] px-[12px] text-[14px] font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#F97316]/25"
                  required
                  minLength={6}
                />
              </label>
            ))}
            {formError && <p className="text-[12px] font-semibold text-[#C62828]">{formError}</p>}
            <button
              type="submit"
              disabled={saving}
              className="mt-[4px] h-[44px] cursor-pointer rounded-full bg-[#F97316] text-[14px] font-bold text-white hover:bg-[#EA580C] disabled:opacity-60"
            >
              {t('profile.save')}
            </button>
          </form>
        </Modal>
      )}

      {addressModal && (
        <Modal
          title={addressModal === 'new' ? t('profile.addAddress') : t('profile.editShort')}
          onClose={() => setAddressModal(null)}
        >
          <form onSubmit={saveAddress} className="flex flex-col gap-[12px]">
            <label className="block">
              <span className="mb-[4px] block text-[12px] text-[#8A7B74]">{t('profile.addrTitle')}</span>
              <input
                value={addrForm.title}
                onChange={(e) => setAddrForm((f) => ({ ...f, title: e.target.value }))}
                className="h-[42px] w-full rounded-[12px] bg-[#F5F6FB] px-[12px] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#F97316]/25"
                required
              />
            </label>
            <label className="block">
              <span className="mb-[4px] block text-[12px] text-[#8A7B74]">{t('profile.addrLine')}</span>
              <textarea
                value={addrForm.line}
                onChange={(e) => setAddrForm((f) => ({ ...f, line: e.target.value }))}
                className="min-h-[88px] w-full rounded-[12px] bg-[#F5F6FB] px-[12px] py-[10px] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#F97316]/25"
                required
              />
            </label>
            <label className="flex cursor-pointer items-center gap-[8px] text-[13px] font-semibold text-[#141b2b]">
              <input
                type="checkbox"
                checked={addrForm.primary}
                onChange={(e) => setAddrForm((f) => ({ ...f, primary: e.target.checked }))}
              />
              {t('profile.primary')}
            </label>
            <button
              type="submit"
              className="h-[44px] cursor-pointer rounded-full bg-[#F97316] text-[14px] font-bold text-white hover:bg-[#EA580C]"
            >
              {t('profile.save')}
            </button>
          </form>
        </Modal>
      )}

      {paymentsOpen && (
        <Modal title={t('profile.payments')} onClose={() => setPaymentsOpen(false)}>
          <div className="flex flex-col gap-[10px]">
            {[
              { brand: 'Humo', last: '4582' },
              { brand: 'Uzcard', last: '9910' },
            ].map((card) => (
              <div
                key={card.last}
                className="flex items-center gap-[12px] rounded-[14px] border border-[#EEF0F6] px-[14px] py-[12px]"
              >
                <Icon name="credit_card" className="text-[22px] text-[#F97316]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#141b2b]">{card.brand}</p>
                  <p className="text-[12px] text-[#6B7280]">•••• {card.last}</p>
                </div>
              </div>
            ))}
            <p className="text-[12px] text-[#8A7B74]">{t('profile.paymentsHint')}</p>
            <button
              type="button"
              onClick={() => {
                setPaymentsOpen(false)
                showToast(t('profile.cardSoon'))
              }}
              className="h-[44px] cursor-pointer rounded-full bg-[#F97316] text-[14px] font-bold text-white hover:bg-[#EA580C]"
            >
              {t('profile.addCard')}
            </button>
          </div>
        </Modal>
      )}

      {viewOrder && (
        <Modal
          title={`${t('profile.viewOrder')} ${orderCode(viewOrder.id)}`}
          onClose={() => setViewOrder(null)}
        >
          <div className="flex flex-col gap-[10px]">
            <p className="text-[13px] font-semibold text-[#141b2b]">
              {restaurantMap.get(viewOrder.restaurantId)?.name ?? viewOrder.restaurantId}
            </p>
            <p className="text-[12px] text-[#6B7280]">{viewOrder.address}</p>
            <ul className="space-y-[6px] rounded-[12px] bg-[#F8F9FC] p-[12px]">
              {viewOrder.items.map((item) => (
                <li
                  key={`${item.dishId}-${item.name}`}
                  className="flex justify-between text-[13px]"
                >
                  <span>
                    {item.name} ×{item.qty}
                  </span>
                  <span className="font-semibold">{formatSum(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="text-[16px] font-extrabold text-[#141b2b]">
              {formatSum(viewOrder.total)} · {paymentLabel(viewOrder.paymentMethod, t)}
            </p>
            <div className="flex flex-wrap gap-[8px]">
              <button
                type="button"
                onClick={() =>
                  printReceipt(
                    viewOrder,
                    restaurantMap.get(viewOrder.restaurantId)?.name ?? viewOrder.restaurantId,
                    t,
                  )
                }
                className="h-[40px] cursor-pointer rounded-full bg-[#F1F3FF] px-[14px] text-[12px] font-bold"
              >
                {t('profile.receipt')}
              </button>
              {viewOrder.status === 'delivered' && (
                <button
                  type="button"
                  onClick={() => {
                    reorder(viewOrder)
                    setViewOrder(null)
                  }}
                  className="h-[40px] cursor-pointer rounded-full bg-[#F97316] px-[14px] text-[12px] font-bold text-white"
                >
                  {t('profile.reorder')}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )}

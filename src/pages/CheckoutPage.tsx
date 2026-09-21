import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth/AuthContext'
import { formatCartSum, useCart } from '../cart/CartContext'
import { YandexDeliveryMap } from '../components/maps/YandexDeliveryMap'
import { Icon } from '../components/ui/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import {
  DEFAULT_TASHKENT,
  getYandexMapsApiKey,
  loadYandexMaps,
  reverseGeocode,
  type LatLon,
  type YandexAddress,
} from '../lib/yandexMaps'

const stepDefs = [
  { n: 1, titleKey: 'checkout.step1', statusKey: 'checkout.step1.status', state: 'done' as const },
  {
    n: 2,
    titleKey: 'checkout.step2',
    statusKey: 'checkout.step2.status',
    state: 'current' as const,
  },
  { n: 3, titleKey: 'checkout.step3', statusKey: 'checkout.step3.status', state: 'next' as const },
  { n: 4, titleKey: 'checkout.step4', statusKey: 'checkout.step4.status', state: 'todo' as const },
]

function Field({
  label,
  value,
  onChange,
  icon,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  icon?: string
  className?: string
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-[4px] block text-[11px] font-normal text-[#8A7B74]">{label}</span>
      <span className="relative block min-w-0">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute top-1/2 left-[12px] -translate-y-1/2 text-[16px] text-[#F97316]/80"
          />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[40px] w-full min-w-0 truncate rounded-[12px] bg-[#F5F6FB] text-[13px] font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#F97316]/20 ${
            icon ? 'pr-[12px] pl-[36px]' : 'px-[12px]'
          }`}
        />
      </span>
    </label>
  )
}

function PaymentBadge({ children }: { children: string }) {
  return (
    <span className="rounded-[8px] border border-[#E8EAF2] bg-white/80 px-[8px] py-[2px] text-[10px] font-medium text-[#7A716B]">
      {children}
    </span>
  )
}

function PaymentRadio({ selected }: { selected: boolean }) {
  return (
    <span
      className={`mt-[2px] flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border ${
        selected ? 'border-[#F97316]' : 'border-[#D0D4E0]'
      }`}
    >
      {selected && <span className="h-[7px] w-[7px] rounded-full bg-[#F97316]" />}
    </span>
  )
}

function Stepper() {
  const { t } = useLanguage()

  return (
    <div className="rounded-[18px] bg-white px-[16px] py-[18px] sm:px-[28px]">
      <div className="relative grid grid-cols-4 gap-0">
        <div
          className="pointer-events-none absolute top-[18px] right-[12.5%] left-[12.5%] z-0 flex h-[3px] -translate-y-1/2"
          aria-hidden
        >
          <div className="h-full flex-1 rounded-full bg-[#F97316]/85" />
          <div className="h-full flex-1 rounded-full bg-[#EEF0F8]" />
          <div className="h-full flex-1 rounded-full bg-[#EEF0F8]" />
        </div>

        {stepDefs.map((step) => {
          const done = step.state === 'done'
          const current = step.state === 'current'
          return (
            <div
              key={step.n}
              className="relative z-[1] flex min-w-0 flex-col items-center px-[4px] text-center"
            >
              <span
                className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${
                  done || current
                    ? `bg-[#F97316] text-white ${
                        current ? 'shadow-[0_0_0_5px_rgba(249,115,22,0.14)]' : ''
                      }`
                    : 'border border-[#E8EAF2] bg-white text-[#9AA0B2]'
                }`}
              >
                {done ? <Icon name="check" className="text-[18px]" /> : step.n}
              </span>
              <p
                className={`mt-[10px] text-[12px] leading-[16px] font-semibold sm:text-[13px] ${
                  current ? 'text-[#F97316]' : 'text-[#141b2b]'
                }`}
              >
                {t(step.titleKey)}
              </p>
              <p
                className={`mt-[2px] text-[11px] font-normal ${
                  current ? 'text-[#F97316]/90' : 'text-[#9AA0B2]'
                }`}
              >
                {t(step.statusKey)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type PaymentMethod = 'card' | 'wallet' | 'cash'

export function CheckoutPage() {
  const { t } = useLanguage()
  const { token, user } = useAuth()
  const { items, restaurantId, restaurantName, foodTotal, clear } = useCart()
  const [delivery, setDelivery] = useState<'yetkazish' | 'olibketish'>('yetkazish')
  const [payment, setPayment] = useState<PaymentMethod>('card')
  const [promoError, setPromoError] = useState('')
  const [promo, setPromo] = useState('FOODUZ2025')
  const [promoApplied, setPromoApplied] = useState(false)
  const [city, setCity] = useState('Toshkent sh., Yunusobod t.')
  const [street, setStreet] = useState('Amir Temur ko‘chasi, 45-uy')
  const [apt, setApt] = useState('14-kvartira, 3-podyezd, 4-qavat')
  const [note, setNote] = useState("Domofon kodi: 1423, iltimos eshik qo'ng'irog'ini chaling")
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderMsg, setOrderMsg] = useState('')
  const [orderId, setOrderId] = useState<number | null>(null)
  const [locating, setLocating] = useState(false)
  const [mapCoords, setMapCoords] = useState<LatLon>(DEFAULT_TASHKENT)
  const [mapLabel, setMapLabel] = useState(
    'Toshkent sh., Yunusobod tumani, Amir Temur shoh ko‘chasi 45-uy',
  )
  const [cardLast4, setCardLast4] = useState('5678')

  const applyAddress = useCallback((coords: LatLon, address: YandexAddress) => {
    setMapCoords(coords)
    setMapLabel(address.label)
    if (address.city) setCity(address.city)
    if (address.street) setStreet(address.street)
  }, [])

  useEffect(() => {
    if (!user) return
    setName(user.fullName || '')
    const p = user.phone || ''
    setPhone(p.startsWith('g:') ? '' : p)
  }, [user])

  const serviceFee = items.length > 0 ? 4000 : 0
  const promoDiscount = promoApplied ? 10000 : 0
  const deliveryFee = delivery === 'yetkazish' ? 0 : 0
  const total = Math.max(0, foodTotal + serviceFee + deliveryFee - promoDiscount)
  const totalLabel = total.toLocaleString('uz-UZ')
  const branchName = restaurantName || 'Restoran'

  const dishCountLabel = useMemo(() => {
    const n = items.reduce((c, i) => c + i.qty, 0)
    return `${n} ta taom`
  }, [items])

  const placeOrder = async () => {
    if (!restaurantId || items.length === 0) {
      setOrderMsg('Savat bo‘sh')
      return
    }
    setOrderMsg('')
    setSubmitting(true)
    try {
      const order = await api.createOrder(
        {
          restaurantId,
          items: items.map((item) => ({
            dishId: item.dishId,
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image,
          })),
          recipientName: name.trim(),
          recipientPhone: phone.replace(/\s/g, ''),
          address: [city, street, apt].filter(Boolean).join(', '),
          paymentMethod: payment,
          comment: [delivery === 'olibketish' ? 'Olib ketish' : '', note].filter(Boolean).join(' | '),
        },
        token,
      )
      clear()
      setOrderId(order.id)
      setOrderMsg(`Buyurtma #${order.id} qabul qilindi. Tez orada bog‘lanamiz.`)
    } catch (err) {
      setOrderMsg(err instanceof Error ? err.message : 'Buyurtma yuborilmadi')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderId && items.length === 0) {
    return (
      <div className="w-full px-[55px] py-[48px] text-center">
        <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#E8F8EF] text-[#2D6A4F]">
          <Icon name="check_circle" className="text-[36px]" filled />
        </div>
        <p className="mt-[16px] text-[20px] font-extrabold text-[#141b2b]">Buyurtma qabul qilindi</p>
        <p className="mt-[8px] text-[14px] text-[#6B7280]">{orderMsg}</p>
        <div className="mt-[20px] flex flex-wrap items-center justify-center gap-[10px]">
          <Link
            to="/"
            className="inline-flex rounded-full bg-[#F97316] px-[20px] py-[12px] text-[14px] font-bold text-white"
          >
            Bosh sahifa
          </Link>
          <Link
            to="/restoranlar"
            className="inline-flex rounded-full bg-[#F1F3FF] px-[20px] py-[12px] text-[14px] font-bold text-[#141b2b]"
          >
            Yana buyurtma
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0 && !orderMsg) {
    return (
      <div className="w-full px-[55px] py-[48px] text-center">
        <p className="text-[18px] font-bold text-[#141b2b]">Savat bo‘sh</p>
        <p className="mt-[8px] text-[14px] text-[#6B7280]">Restorandan taom qo‘shing.</p>
        <Link
          to="/restoranlar"
          className="mt-[20px] inline-flex rounded-full bg-[#F97316] px-[20px] py-[12px] text-[14px] font-bold text-white"
        >
          Restoranlar
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full px-[55px] pt-[20px] pb-[40px]">
      <Stepper />

      <div className="mt-[16px] grid grid-cols-1 items-start gap-[16px] min-[1100px]:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="flex min-w-0 flex-col gap-[10px]">
          <section className="min-w-0 rounded-[16px] bg-white px-[14px] py-[12px]">
            <div className="mb-[10px] flex flex-wrap items-center justify-between gap-[10px]">
              <div className="flex min-w-0 items-center gap-[8px]">
                <Icon name="local_shipping" className="shrink-0 text-[18px] text-[#F97316]" />
                <h2 className="truncate text-[14px] font-semibold text-[#141b2b]">
                  {t('checkout.deliveryMethod')}
                </h2>
              </div>
              <span className="max-w-full shrink-0 truncate rounded-full bg-[#F2F3FA] px-[10px] py-[3px] text-[11px] font-medium text-[#6B70B8]">
                {t('checkout.branch', { name: branchName })}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-[8px] min-[700px]:grid-cols-2">
              <button
                type="button"
                onClick={() => setDelivery('yetkazish')}
                className={`flex min-h-[52px] min-w-0 items-center gap-[10px] rounded-[12px] border px-[12px] py-[10px] text-left ${
                  delivery === 'yetkazish'
                    ? 'border-[#F97316]/50 bg-white'
                    : 'border-transparent bg-[#F5F6FB]'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#141b2b]">
                    {t('checkout.delivery')}
                  </span>
                  <span className="block text-[11px] leading-[15px] text-[#9AA0B2]">
                    {t('checkout.deliverySub')}
                  </span>
                </span>
                {delivery === 'yetkazish' ? (
                  <Icon name="check_circle" className="shrink-0 text-[18px] text-[#F97316]" filled />
                ) : (
                  <span className="h-[15px] w-[15px] shrink-0 rounded-full border border-[#D0D4E0]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setDelivery('olibketish')}
                className={`flex min-h-[52px] min-w-0 items-center gap-[10px] rounded-[12px] border px-[12px] py-[10px] text-left ${
                  delivery === 'olibketish'
                    ? 'border-[#F97316]/50 bg-white'
                    : 'border-transparent bg-[#F5F6FB]'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#141b2b]">
                    {t('checkout.pickup')}
                  </span>
                  <span className="block text-[11px] leading-[15px] text-[#9AA0B2]">
                    {t('checkout.pickupSub')}
                  </span>
                </span>
                {delivery === 'olibketish' ? (
                  <Icon name="check_circle" className="shrink-0 text-[18px] text-[#F97316]" filled />
                ) : (
                  <span className="h-[15px] w-[15px] shrink-0 rounded-full border border-[#D0D4E0]" />
                )}
              </button>
            </div>
          </section>

          <section className="min-w-0 rounded-[16px] bg-white px-[14px] py-[12px]">
            <div className="mb-[10px] flex flex-wrap items-center justify-between gap-[10px]">
              <div className="flex min-w-0 items-center gap-[8px]">
                <Icon name="location_on" className="shrink-0 text-[18px] text-[#F97316]" />
                <h2 className="truncate text-[14px] font-semibold text-[#141b2b]">
                  {t('checkout.addressInfo')}
                </h2>
              </div>
              <button
                type="button"
                disabled={locating}
                onClick={() => {
                  if (!navigator.geolocation) {
                    setOrderMsg(t('checkout.geoUnsupported'))
                    return
                  }
                  setLocating(true)
                  navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                      const coords: LatLon = [pos.coords.latitude, pos.coords.longitude]
                      try {
                        if (getYandexMapsApiKey()) {
                          const ymaps = await loadYandexMaps()
                          const address = await reverseGeocode(ymaps, coords)
                          applyAddress(coords, address)
                        } else {
                          const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}`,
                            { headers: { Accept: 'application/json' } },
                          )
                          const data = (await res.json()) as {
                            display_name?: string
                            address?: {
                              city?: string
                              town?: string
                              road?: string
                              house_number?: string
                            }
                          }
                          applyAddress(coords, {
                            label:
                              data.display_name ||
                              `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`,
                            city: data.address?.city || data.address?.town,
                            street:
                              [data.address?.road, data.address?.house_number]
                                .filter(Boolean)
                                .join(', ') || undefined,
                          })
                        }
                      } catch {
                        applyAddress(coords, {
                          label: `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`,
                        })
                      } finally {
                        setLocating(false)
                      }
                    },
                    () => {
                      setLocating(false)
                      setOrderMsg(t('checkout.geoDenied'))
                    },
                    { enableHighAccuracy: true, timeout: 12000 },
                  )
                }}
                className="inline-flex shrink-0 items-center gap-[4px] text-[12px] font-semibold text-[#F97316] disabled:opacity-60"
              >
                <Icon name="my_location" className="text-[15px]" />
                {locating ? t('checkout.locating') : t('checkout.myLocation')}
              </button>
            </div>

            <YandexDeliveryMap
              coords={mapCoords}
              label={mapLabel}
              selectedTitle={t('checkout.selectedLocation')}
              changeLabel={t('checkout.changeOnMap')}
              mapTitle={t('checkout.mapTitle')}
              pickHint={t('checkout.pickOnMap')}
              onLocationChange={applyAddress}
            />

            <div className="mt-[12px] grid grid-cols-1 gap-[10px] min-[700px]:grid-cols-2">
              <Field
                label={t('checkout.city')}
                value={city}
                onChange={setCity}
                icon="apartment"
              />
              <Field
                label={t('checkout.street')}
                value={street}
                onChange={setStreet}
                icon="home"
              />
              <Field
                label={t('checkout.apt')}
                value={apt}
                onChange={setApt}
                icon="meeting_room"
                className="min-[700px]:col-span-2"
              />
              <Field
                label={t('checkout.note')}
                value={note}
                onChange={setNote}
                icon="chat_bubble"
                className="min-[700px]:col-span-2"
              />
            </div>
          </section>

          <section className="min-w-0 rounded-[16px] bg-white px-[14px] py-[12px]">
            <div className="mb-[10px] flex items-center gap-[8px]">
              <Icon name="person" className="shrink-0 text-[18px] text-[#F97316]" />
              <h2 className="text-[14px] font-semibold text-[#141b2b]">{t('checkout.recipient')}</h2>
            </div>
            <div className="grid grid-cols-1 gap-[10px] min-[700px]:grid-cols-2">
              <Field label={t('checkout.fullName')} value={name} onChange={setName} icon="badge" />
              <Field
                label={t('checkout.phoneSms')}
                value={phone}
                onChange={setPhone}
                icon="call"
              />
            </div>
          </section>

          <section className="min-w-0 rounded-[16px] bg-white px-[14px] py-[12px]">
            <div className="mb-[10px] flex flex-wrap items-center justify-between gap-[8px]">
              <div className="flex min-w-0 items-center gap-[8px]">
                <Icon name="account_balance_wallet" className="shrink-0 text-[18px] text-[#F97316]" />
                <h2 className="truncate text-[14px] font-semibold text-[#141b2b]">
                  {t('checkout.payment')}
                </h2>
              </div>
              <span className="inline-flex shrink-0 items-center gap-[4px] text-[11px] font-normal text-[#9AA0B2]">
                <Icon name="lock" className="text-[13px] text-[#C9A227]/80" />
                {t('checkout.securePay')}
              </span>
            </div>

            <div className="flex flex-col gap-[8px]">
              <button
                type="button"
                onClick={() => setPayment('card')}
                className={`w-full rounded-[14px] px-[12px] py-[11px] text-left transition-colors ${
                  payment === 'card' ? 'bg-[#FFF6F0]' : 'bg-[#F5F6FB]'
                }`}
              >
                <div className="flex min-w-0 items-start gap-[10px]">
                  <PaymentRadio selected={payment === 'card'} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-[8px]">
                      <div className="min-w-0">
                        <p className="flex items-center gap-[6px] text-[13px] font-semibold text-[#141b2b]">
                          <Icon name="credit_card" className="text-[17px] text-[#F97316]" />
                          {t('checkout.card')}
                        </p>
                        <p className="mt-[2px] pl-[23px] text-[11px] text-[#9AA0B2]">
                          {t('checkout.cardSub')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-[6px]">
                        {['Uzcard', 'Humo', 'Visa'].map((tag) => (
                          <PaymentBadge key={tag}>{tag}</PaymentBadge>
                        ))}
                      </div>
                    </div>

                    {payment === 'card' && (
                      <div className="mt-[10px] flex min-w-0 flex-wrap items-center justify-between gap-[10px] rounded-[10px] border border-[#F0F1F6] bg-white px-[12px] py-[9px]">
                        <div className="flex min-w-0 items-center gap-[10px]">
                          <span className="flex h-[30px] w-[42px] shrink-0 items-center justify-center rounded-[7px] border border-[#EBECEF] bg-[#FAFBFF] text-[9px] font-bold tracking-wide text-[#1A237E]/80">
                            HUMO
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-[#141b2b]">
                              Humo •••• {cardLast4}
                            </p>
                            <p className="truncate text-[11px] text-[#9AA0B2]">
                              {t('checkout.cardHolder')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const next = window.prompt(t('checkout.otherCardPrompt'), cardLast4)
                            if (next && /^\d{4}$/.test(next.trim())) {
                              setCardLast4(next.trim())
                            }
                          }}
                          className="shrink-0 cursor-pointer text-[12px] font-semibold text-[#F97316]"
                        >
                          {t('checkout.otherCard')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPayment('wallet')}
                className={`flex w-full min-w-0 items-center gap-[10px] rounded-[14px] px-[12px] py-[11px] text-left transition-colors ${
                  payment === 'wallet' ? 'bg-[#FFF6F0]' : 'bg-[#F5F6FB]'
                }`}
              >
                <PaymentRadio selected={payment === 'wallet'} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-[6px] text-[13px] font-semibold text-[#141b2b]">
                    <Icon name="payments" className="text-[17px] text-[#9AA0B2]" />
                    {t('checkout.wallet')}
                  </p>
                  <p className="mt-[2px] pl-[23px] text-[11px] text-[#9AA0B2]">
                    {t('checkout.walletSub')}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-[6px]">
                  {['Payme', 'Click'].map((tag) => (
                    <PaymentBadge key={tag}>{tag}</PaymentBadge>
                  ))}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPayment('cash')}
                className={`flex w-full min-w-0 items-center gap-[10px] rounded-[14px] px-[12px] py-[11px] text-left transition-colors ${
                  payment === 'cash' ? 'bg-[#FFF6F0]' : 'bg-[#F5F6FB]'
                }`}
              >
                <PaymentRadio selected={payment === 'cash'} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-[6px] text-[13px] font-semibold text-[#141b2b]">
                    <Icon name="attach_money" className="text-[17px] text-[#9AA0B2]" />
                    {t('checkout.cash')}
                  </p>
                  <p className="mt-[2px] pl-[23px] text-[11px] text-[#9AA0B2]">
                    {t('checkout.cashSub')}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-[#9AA0B2]">
                  {t('checkout.changeNeeded')}
                </span>
              </button>
            </div>
          </section>
        </div>

        <aside className="w-full min-w-0 min-[1100px]:sticky min-[1100px]:top-[86px]">
          <div className="overflow-hidden rounded-[20px] bg-white px-[16px] pt-[16px] pb-[14px]">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#F97316] uppercase">
              {t('checkout.summary')}
            </p>
            <h3 className="mt-[6px] truncate text-[17px] font-bold text-[#141b2b]">
              {branchName}
            </h3>
            <p className="mt-[4px] flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[11px] text-[#8A7B74]">
              <span>{dishCountLabel}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-[3px]">
                <Icon name="schedule" className="text-[13px] text-[#F97316]" />
                Tayyorlash ~20 daqiqa
              </span>
            </p>

            <ul className="mt-[14px] flex flex-col gap-[12px]">
              {items.map((item) => (
                <li key={item.dishId} className="flex min-w-0 items-center gap-[10px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[42px] w-[42px] shrink-0 rounded-[10px] object-cover"
                  />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate text-[13px] font-semibold text-[#141b2b]">{item.name}</p>
                    <p className="truncate text-[11px] text-[#8A7B74]">
                      {formatCartSum(item.price * item.qty)}
                    </p>
                  </div>
                  <div className="w-[70px] shrink-0 text-right">
                    <p className="truncate text-[13px] font-semibold text-[#141b2b]">
                      {formatCartSum(item.price)}
                    </p>
                    <p className="truncate text-[11px] text-[#8A7B74]">{item.qty}x</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-[15px] rounded-[16px] bg-[#F4F6FD] p-[10px]">
              <div className="flex min-w-0 items-center gap-[8px]">
                <div className="flex min-w-0 flex-1 items-center gap-[8px] rounded-[10px] bg-white px-[10px]">
                  <Icon name="confirmation_number" className="shrink-0 text-[18px] text-[#F97316]" />
                  <input
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value)
                      setPromoApplied(false)
                      setPromoError('')
                    }}
                    className="h-[36px] min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#F97316] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const code = promo.trim().toUpperCase()
                    if (code === 'FOODUZ2025' || code === 'FOODUZ10') {
                      setPromo(code)
                      setPromoApplied(true)
                      setPromoError('')
                    } else {
                      setPromoApplied(false)
                      setPromoError(t('checkout.promoInvalid'))
                    }
                  }}
                  className="h-[36px] shrink-0 rounded-[10px] bg-[#F97316] px-[14px] text-[12px] font-semibold text-white"
                >
                  {t('checkout.apply')}
                </button>
              </div>
              {promoError && (
                <p className="mt-[8px] text-[11px] font-semibold text-[#C62828]">{promoError}</p>
              )}
              {promoApplied && (
                <div className="mt-[8px] flex items-center justify-between gap-[8px] rounded-[10px] bg-[#FFE9DF] px-[10px] py-[8px] text-[11px]">
                  <span className="inline-flex min-w-0 items-center gap-[6px] truncate text-[#7A4A3A]">
                    <Icon name="check_circle" className="shrink-0 text-[15px] text-[#F97316]" filled />
                    <span className="truncate">{t('checkout.activated', { code: promo })}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-[#F97316]">−10,000 {t('checkout.sum')}</span>
                </div>
              )}
            </div>

            <div className="mt-[15px] rounded-[16px] bg-[#F4F6FD] px-[14px] py-[14px]">
              <div className="flex flex-col gap-[10px] text-[12px]">
                <div className="flex justify-between gap-[8px] text-[#584237]">
                  <span>{t('checkout.foodPrice')}</span>
                  <span className="font-medium text-[#141b2b]">
                    {foodTotal.toLocaleString('uz-UZ')} {t('checkout.sum')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-[8px] text-[#584237]">
                  <span>{t('checkout.deliveryFee')}</span>
                  <span className="rounded-full bg-[#FFF1E8] px-[10px] py-[2px] text-[11px] font-semibold text-[#F97316]">
                    {t('common.free')}
                  </span>
                </div>
                <div className="flex justify-between gap-[8px] text-[#584237]">
                  <span>{t('checkout.service')}</span>
                  <span className="font-medium text-[#141b2b]">
                    {serviceFee.toLocaleString('uz-UZ')} {t('checkout.sum')}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between gap-[8px] font-semibold text-[#C45C3A]">
                    <span>{t('checkout.promoDiscount')}</span>
                    <span>
                      −{promoDiscount.toLocaleString('uz-UZ')} {t('checkout.sum')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-[14px] flex items-end justify-between gap-[8px] border-t border-[#E2E6F5] pt-[12px]">
                <p className="text-[14px] font-bold text-[#141b2b]">{t('checkout.total')}</p>
                <p className="shrink-0 leading-none">
                  <span className="text-[26px] font-bold text-[#F97316]">{totalLabel}</span>
                  <span className="ml-[4px] text-[13px] font-semibold text-[#F97316]">
                    {t('checkout.sum')}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={placeOrder}
              className="mt-[15px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#F97316] px-[14px] text-[13px] font-semibold text-white hover:bg-[#ea6a0c] disabled:opacity-60"
            >
              <span className="truncate">
                {submitting ? '...' : t('checkout.confirm', { amount: totalLabel })}
              </span>
              <Icon name="arrow_forward" className="shrink-0 text-[18px]" />
            </button>

            {orderMsg && (
              <p className="mt-[10px] text-center text-[12px] font-medium text-[#141b2b]">{orderMsg}</p>
            )}

            <div className="mt-[12px] flex items-center justify-center gap-[6px] rounded-[10px] bg-[#F4F6FD] px-[10px] py-[9px]">
              <Icon name="verified_user" className="shrink-0 text-[15px] text-[#6B70B8]" />
              <p className="text-center text-[10px] leading-[14px] text-[#6B6470]">
                {t('checkout.guarantee')}
              </p>
            </div>
          </div>

          <div className="mt-[15px] flex min-w-0 items-center gap-[10px] rounded-[14px] bg-white px-[12px] py-[10px]">
            <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#FDE8D1]">
              <Icon name="support_agent" className="text-[20px] text-[#3D4454]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-[#141b2b]">
                {t('checkout.supportTitle')}
              </p>
              <p className="mt-[1px] truncate text-[10px] text-[#A8AEBE]">
                {t('checkout.supportSub')}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

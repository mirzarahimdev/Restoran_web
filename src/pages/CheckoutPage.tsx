import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { checkoutItems, checkoutRestaurant } from '../data/checkout'

const steps = [
  { n: 1, title: '1. Savat', status: 'Bajarildi', state: 'done' as const },
  { n: 2, title: '2. Yetkazish manzili', status: 'Jarayonda', state: 'current' as const },
  { n: 3, title: '3. To‘lov turi', status: 'Navbatdagi', state: 'next' as const },
  { n: 4, title: '4. Tasdiqlash', status: 'Yakuniy', state: 'todo' as const },
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
    <label className={`block ${className}`}>
      <span className="mb-[4px] block text-[11px] font-medium text-[#8A7B74]">{label}</span>
      <span className="relative block">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute top-1/2 left-[12px] -translate-y-1/2 text-[16px] text-[#8A7B74]"
          />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[40px] w-full rounded-[12px] bg-[#F4F6FB] text-[13px] font-semibold text-[#141b2b] outline-none focus:ring-2 focus:ring-[#F97316]/30 ${
            icon ? 'pr-[12px] pl-[36px]' : 'px-[12px]'
          }`}
        />
      </span>
    </label>
  )
}

function Stepper() {
  return (
    <div className="rounded-[20px] bg-white px-[28px] py-[16px]">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done = step.state === 'done'
          const current = step.state === 'current'
          return (
            <div key={step.n} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center text-center">
                <span
                  className={`flex h-[32px] w-[32px] items-center justify-center rounded-full text-[13px] font-bold ${
                    done || current
                      ? 'bg-[#F97316] text-white'
                      : 'border border-[#E4E7F2] bg-white text-[#8A7B74]'
                  }`}
                >
                  {done ? <Icon name="check" className="text-[16px]" /> : step.n}
                </span>
                <p
                  className={`mt-[6px] text-[12px] font-bold whitespace-nowrap ${
                    current ? 'text-[#F97316]' : 'text-[#141b2b]'
                  }`}
                >
                  {step.title}
                </p>
                <p className={`text-[11px] ${current ? 'text-[#F97316]' : 'text-[#8A7B74]'}`}>
                  {step.status}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-[10px] mb-[28px] h-[3px] min-w-[20px] flex-1 rounded-full ${
                    i === 0 ? 'bg-[#F97316]' : 'bg-[#E9EDFF]'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CheckoutPage() {
  const [delivery, setDelivery] = useState<'yetkazish' | 'olibketish'>('yetkazish')
  const [promo, setPromo] = useState('FOODUZ2025')
  const [promoApplied, setPromoApplied] = useState(true)
  const [city, setCity] = useState('Toshkent sh., Yunusobod t.')
  const [street, setStreet] = useState('Amir Temur ko‘chasi, 45-uy')
  const [apt, setApt] = useState('14-kvartira, 3-podyezd, 4-qavat')
  const [note, setNote] = useState("Domofon kodi: 1423, iltimos eshik qo'ng'irog'ini chaling")
  const [name, setName] = useState('Aziza Karimova')
  const [phone, setPhone] = useState('+998 90 123 45 67')

  return (
    <div className="w-full px-[55px] pt-[20px] pb-[40px]">
      <Stepper />

      <div className="mt-[16px] grid grid-cols-1 items-start gap-[16px] min-[1100px]:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-[12px]">
          <section className="rounded-[18px] bg-white px-[16px] py-[14px]">
            <div className="mb-[10px] flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[8px]">
                <Icon name="local_shipping" className="text-[20px] text-[#F97316]" />
                <h2 className="text-[15px] font-bold text-[#141b2b]">Yetkazib berish usuli</h2>
              </div>
              <span className="rounded-full border border-[#E9EDFF] px-[10px] py-[3px] text-[11px] font-semibold text-[#584237]">
                Filial: {checkoutRestaurant.name}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-[8px] min-[700px]:grid-cols-2">
              <button
                type="button"
                onClick={() => setDelivery('yetkazish')}
                className={`flex h-[56px] items-center gap-[10px] rounded-[14px] border px-[12px] text-left ${
                  delivery === 'yetkazish'
                    ? 'border-[#F97316] bg-white'
                    : 'border-transparent bg-[#F4F6FB]'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-[#141b2b]">Yetkazib berish</span>
                  <span className="text-[11px] text-[#8A7B74]">25–35 daqiqa ichida eshikkacha</span>
                </span>
                {delivery === 'yetkazish' ? (
                  <Icon name="check_circle" className="text-[20px] text-[#F97316]" filled />
                ) : (
                  <span className="h-[16px] w-[16px] rounded-full border-2 border-[#C5CAD8]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setDelivery('olibketish')}
                className={`flex h-[56px] items-center gap-[10px] rounded-[14px] border px-[12px] text-left ${
                  delivery === 'olibketish'
                    ? 'border-[#F97316] bg-white'
                    : 'border-transparent bg-[#F4F6FB]'
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-[#141b2b]">Olib ketish</span>
                  <span className="text-[11px] text-[#8A7B74]">Navbatsiz, 15 daqiqada tayyor</span>
                </span>
                {delivery === 'olibketish' ? (
                  <Icon name="check_circle" className="text-[20px] text-[#F97316]" filled />
                ) : (
                  <span className="h-[16px] w-[16px] rounded-full border-2 border-[#C5CAD8]" />
                )}
              </button>
            </div>
          </section>

          <section className="rounded-[18px] bg-white px-[16px] py-[14px]">
            <div className="mb-[10px] flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[8px]">
                <Icon name="location_on" className="text-[20px] text-[#F97316]" />
                <h2 className="text-[15px] font-bold text-[#141b2b]">Manzil ma’lumotlari</h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-[4px] text-[12px] font-bold text-[#F97316]"
              >
                <Icon name="my_location" className="text-[16px]" />
                Mening joylashuvim
              </button>
            </div>

            <div className="relative h-[148px] overflow-hidden rounded-[14px] bg-[#E4EAF1]">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 800 148"
                preserveAspectRatio="none"
                aria-hidden
              >
                <rect width="800" height="148" fill="#E4EAF1" />
                <rect x="0" y="64" width="800" height="12" fill="#F7FAFC" />
                <rect x="0" y="104" width="800" height="7" fill="#EEF3F7" />
                <rect x="0" y="26" width="800" height="6" fill="#EDF2F6" />
                <rect x="210" y="0" width="12" height="148" fill="#F7FAFC" />
                <rect x="430" y="0" width="16" height="148" fill="#F9FBFD" />
                <rect x="620" y="0" width="8" height="148" fill="#EDF2F6" />
                <rect x="120" y="32" width="100" height="36" rx="8" fill="#C5D7C4" />
                <rect x="280" y="14" width="90" height="32" rx="8" fill="#C9D8C8" />
                <rect x="500" y="44" width="80" height="30" rx="8" fill="#D8C4D4" />
              </svg>
              <span className="absolute top-[24%] left-[12%] rounded-full bg-white/90 px-[7px] py-[1px] text-[10px] font-bold text-[#2D6A4F]">
                Magic City Park
              </span>
              <span className="absolute top-[10%] left-[34%] rounded-full bg-white/90 px-[7px] py-[1px] text-[10px] font-bold text-[#2D6A4F]">
                Tashkent City Park
              </span>
              <span className="absolute top-[38%] left-[58%] rounded-full bg-white/90 px-[7px] py-[1px] text-[10px] font-bold text-[#7B3FA0]">
                Railway Museum
              </span>
              <span className="absolute top-[40%] left-[28%] text-[20px] font-extrabold tracking-wide text-[#3D4A57]">
                Tashkent
              </span>
              <div className="absolute inset-x-[8px] bottom-[8px] flex items-center gap-[8px] rounded-[10px] bg-[#293040]/80 px-[10px] py-[7px] backdrop-blur-sm">
                <Icon name="near_me" className="shrink-0 text-[16px] text-[#F97316]" filled />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold tracking-[0.08em] text-[#F97316] uppercase">
                    Tanlangan lokatsiya
                  </p>
                  <p className="truncate text-[11px] font-semibold text-white">
                    Toshkent sh., Yunusobod tumani, Amir Temur shoh ko‘chasi 45-uy
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-white/70 px-[8px] py-[4px] text-[10px] font-bold text-white"
                >
                  Xaritada o‘zgartirish
                </button>
              </div>
            </div>

            <div className="mt-[12px] grid grid-cols-1 gap-[10px] min-[700px]:grid-cols-2">
              <Field label="Shahar va tuman" value={city} onChange={setCity} icon="location_on" />
              <Field
                label="Ko‘cha va uy raqami"
                value={street}
                onChange={setStreet}
                icon="near_me"
              />
              <Field
                label="Kvartira / Podyezd / Qavat"
                value={apt}
                onChange={setApt}
                icon="apartment"
                className="min-[700px]:col-span-2"
              />
              <Field
                label="Kuryer uchun qo‘shimcha izoh"
                value={note}
                onChange={setNote}
                icon="sticky_note_2"
                className="min-[700px]:col-span-2"
              />
            </div>
          </section>

          <section className="rounded-[18px] bg-white px-[16px] py-[14px]">
            <div className="mb-[10px] flex items-center gap-[8px]">
              <Icon name="person" className="text-[20px] text-[#F97316]" />
              <h2 className="text-[15px] font-bold text-[#141b2b]">Qabul qiluvchi ma’lumotlari</h2>
            </div>
            <div className="grid grid-cols-1 gap-[10px] min-[700px]:grid-cols-2">
              <Field label="Ism va familiya" value={name} onChange={setName} />
              <Field
                label="Telefon raqami (SMS xabarnoma uchun)"
                value={phone}
                onChange={setPhone}
                icon="call"
              />
            </div>
          </section>
        </div>

        <aside className="min-[1100px]:sticky min-[1100px]:top-[86px]">
          <div className="rounded-[18px] bg-white p-[16px]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#8A7B74] uppercase">
              Buyurtma xulosasi
            </p>
            <h3 className="mt-[4px] text-[16px] font-bold text-[#141b2b]">
              {checkoutRestaurant.name}
            </h3>
            <p className="mt-[2px] flex flex-wrap items-center gap-[4px] text-[11px] text-[#8A7B74]">
              <Icon name="star" className="text-[13px] text-[#FEA619]" filled />
              <span className="font-bold text-[#141b2b]">{checkoutRestaurant.rating}</span>
              <span>· {checkoutRestaurant.dishes}</span>
              <span>· {checkoutRestaurant.prep}</span>
            </p>

            <ul className="mt-[12px] flex flex-col gap-[10px]">
              {checkoutItems.map((item) => (
                <li key={item.id} className="flex items-center gap-[8px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[40px] w-[40px] rounded-[10px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-[#141b2b]">{item.name}</p>
                    <p className="truncate text-[10px] text-[#8A7B74]">{item.detail}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-bold text-[#141b2b]">{item.price}</p>
                    <p className="text-[10px] text-[#8A7B74]">{item.qty}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-[12px] rounded-[14px] border border-[#F97316]/25 p-[8px]">
              <div className="flex items-center gap-[8px]">
                <Icon name="confirmation_number" className="text-[18px] text-[#F97316]" />
                <input
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value)
                    setPromoApplied(false)
                  }}
                  className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#F97316] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPromoApplied(true)}
                  className="h-[30px] rounded-full bg-[#F97316] px-[12px] text-[12px] font-bold text-white"
                >
                  Qo‘llash
                </button>
              </div>
              {promoApplied && (
                <p className="mt-[6px] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#2D6A4F]">
                    “{promo}” faollashtirildi
                  </span>
                  <span className="font-bold text-[#F97316]">−10,000 so‘m</span>
                </p>
              )}
            </div>

            <div className="mt-[12px] flex flex-col gap-[6px] text-[12px]">
              <div className="flex justify-between text-[#584237]">
                <span>Taomlar narxi</span>
                <span className="font-semibold text-[#141b2b]">98,000 so‘m</span>
              </div>
              <div className="flex justify-between text-[#584237]">
                <span>Yetkazib berish</span>
                <span className="font-bold text-[#F97316]">Bepul</span>
              </div>
              <div className="flex justify-between text-[#584237]">
                <span>Xizmat ko‘rsatish (4%)</span>
                <span className="font-semibold text-[#141b2b]">4,000 so‘m</span>
              </div>
              <div className="flex justify-between text-[#584237]">
                <span>Promo-kod chegirmasi</span>
                <span className="font-bold text-[#F97316]">−10,000 so‘m</span>
              </div>
            </div>

            <div className="mt-[10px] flex items-end justify-between border-t border-[#F1F3FF] pt-[10px]">
              <div>
                <p className="text-[13px] font-bold text-[#141b2b]">Jami to‘lov:</p>
                <p className="text-[10px] text-[#8A7B74]">QQS kiritilgan</p>
              </div>
              <p className="text-[28px] leading-[32px] font-extrabold text-[#F97316]">92,000 so‘m</p>
            </div>

            <button
              type="button"
              className="mt-[12px] flex h-[44px] w-full items-center justify-center gap-[8px] rounded-full bg-[#F97316] text-[13px] font-bold text-white hover:bg-[#ea6a0c]"
            >
              Buyurtmani tasdiqlash (92,000 so‘m)
              <Icon name="arrow_forward" className="text-[18px]" />
            </button>
            <p className="mt-[8px] text-center text-[10px] leading-[14px] text-[#8A7B74]">
              Xavfsiz to‘lov va 100% yangi tayyorlangan taom kafolati
            </p>
          </div>

          <div className="mt-[10px] flex items-center gap-[8px] rounded-[14px] bg-white px-[12px] py-[10px]">
            <Icon name="support_agent" className="text-[18px] text-[#F97316]" />
            <p className="text-[12px] font-bold text-[#141b2b]">Savol yoki taklif bormi?</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

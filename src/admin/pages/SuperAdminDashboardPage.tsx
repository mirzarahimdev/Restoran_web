import { useState, type ReactNode } from 'react'
import { Icon } from '../../components/ui/Icon'

const restaurants = [
  {
    name: 'Samarqand Osh Markazi',
    address: 'Toshkent, Chilonzor 9-mavze',
    owner: 'Akmal Qodirov',
    phone: '+998 90 123-45-67',
    menu: '48 ta',
    orders: '7,840',
    revenue: '420,000,000',
    commission: '12%',
    status: 'active' as const,
  },
  {
    name: 'Bella Pizza Trattoria',
    address: 'Toshkent, Mirobod k. 14',
    owner: 'Marco Bellini',
    phone: '+998 97 711-22-33',
    menu: '62 ta',
    orders: '5,420',
    revenue: '315,000,000',
    commission: '11.5%',
    status: 'active' as const,
  },
  {
    name: 'Burger House Artisan',
    address: 'Samarqand, Registon shoh k.',
    owner: 'Temur Yusupov',
    phone: '+998 93 450-00-11',
    menu: '35 ta',
    orders: '4,910',
    revenue: '280,000,000',
    commission: '12%',
    status: 'active' as const,
  },
  {
    name: 'Tokyo Sushi Tashkent',
    address: 'Toshkent, Yunusobod 4',
    owner: 'Nodirbek Salimov',
    phone: '+998 90 999-88-77',
    menu: '86 ta',
    orders: '3,120',
    revenue: '245,500,000',
    commission: '13%',
    status: 'active' as const,
  },
  {
    name: 'Rayhon Milliy Taomlar (Yangi)',
    address: 'Andijon, Bobur shoh k. 28',
    owner: 'Dilshod Mirzayev',
    phone: '+998 94 333-12-00',
    menu: '24 ta',
    orders: '—',
    revenue: 'Ariza berilgan',
    commission: '12% Standart',
    status: 'moderation' as const,
  },
  {
    name: 'Sweet House Patisserie',
    address: 'Buxoro, Naqshband k. 7',
    owner: 'Gulchehra Rahimova',
    phone: '+998 91 222-34-56',
    menu: '40 ta',
    orders: '840',
    revenue: '42,100,000',
    commission: '12%',
    status: 'suspended' as const,
  },
]

const leaders = [
  { rank: 1, name: 'Samarqand Osh Markazi', revenue: '420 mln so‘m / oy', rating: '4.9' },
  { rank: 2, name: 'Bella Pizza Trattoria', revenue: '315 mln so‘m / oy', rating: '4.8' },
  { rank: 3, name: 'Burger House Artisan', revenue: '280 mln so‘m / oy', rating: '4.7' },
]

const logs = [
  {
    icon: 'app_registration',
    tone: 'tertiary',
    text: "Yangi restoran 'Oqtepa Lavash Chilonzor' arizasi ro‘yxatga olindi.",
    meta: '10 daqiqa oldin • Avtomatik audit',
  },
  {
    icon: 'percent',
    tone: 'secondary',
    text: 'Menejer Jasur Aliyev maxsus aksiya komissiya stavkasini yangiladi (11.5%).',
    meta: '32 daqiqa oldin • IP: 84.54.72.10',
  },
  {
    icon: 'sync_alt',
    tone: 'muted',
    text: 'To‘lov shlyuzi Click Merchant API sinxronizatsiyasi muvaffaqiyatli yakunlandi.',
    meta: '1 soat oldin • Tizim cron servisi',
  },
]

export function SuperAdminDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<'haftalik' | 'oylik' | 'yillik'>('haftalik')
  const [filter, setFilter] = useState<'all' | 'active' | 'stopped' | 'new'>('all')

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-sm lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E1E8FD] px-2.5 py-0.5 text-[11px] tracking-wider text-[#584237] uppercase">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#F97316]" />
              Jonli Nazorat Markazi
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#584237]">
              <Icon name="public" className="text-[14px] text-[#F97316]" />
              O‘zbekiston bo‘yicha markaziy boshqaruv
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E9EDFF] px-2 py-0.5 text-[11px] font-semibold text-[#684000]">
              <Icon name="verified" className="text-[14px]" />
              99.98% Barqaror Uptime
            </span>
          </div>
          <h1 className="text-[22px] font-bold tracking-tight">Super Boshqaruv Konsoli</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F97316] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-transform hover:bg-[#FF6D2C] active:scale-95"
          >
            <Icon name="add_business" className="text-[18px]" />
            Yangi Restoran ulash
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F1F3FF] px-4 py-2 text-[13px] font-semibold hover:bg-[#E9EDFF]"
          >
            <Icon name="file_download" className="text-[18px]" />
            Eksport (Excel/PDF)
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#FFDAD6] px-3 py-2 text-[13px] font-bold text-[#93000A] hover:opacity-90"
          >
            <Icon name="emergency" className="text-[18px] text-[#BA1A1A]" />
            Favqulodda ogohlantirish
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SuperKpi
          label="Jami Platforma Aylamasi"
          value="4,820.5"
          unit="mln"
          icon="payments"
          iconBg="bg-[#FFDBCA] text-[#9D4300]"
          trend="+28.4%"
          trendNote="oylik o‘sish"
          right="UZS GMV"
        />
        <SuperKpi
          label="FoodUZ Komissiya Sof Tushumi"
          value="578.46"
          unit="mln"
          valueClass="text-[#F97316]"
          icon="account_balance_wallet"
          iconBg="bg-[#FFDDB8] text-[#855300]"
          trend="+31.2%"
          trendNote="o‘rtacha 12% komissiya"
          right="Sof marja"
          rightClass="text-[#855300] font-bold"
        />
        <SuperKpi
          label="Faol Restoranlar Tarmog‘i"
          value="348"
          unit="filial"
          icon="storefront"
          iconBg="bg-[#E9EDFF] text-[#584237]"
          footer={
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-bold text-[#684000]">
                  <span className="h-2 w-2 rounded-full bg-[#FEA619]" /> 294 Ochiq
                </span>
                <span className="font-bold text-[#A73A00]">• 14 ta ariza</span>
              </div>
              <span className="text-[12px] text-[#584237]">5 ta hudud</span>
            </div>
          }
        />
        <SuperKpi
          label="Jami Buyurtmalar"
          value="84,920"
          icon="moped"
          iconBg="bg-[#FFDBCE] text-[#A73A00]"
          footer={
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#F97316]">4,180</span>
                <span className="text-[12px] text-[#584237]">bugun</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F97316]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#F97316]" /> 412 kuryer yo‘lda
              </span>
            </div>
          }
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 xl:col-span-8">
          <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-semibold">
                    Platforma Tushumlari & Hududiy O‘sish Dinamikasi
                  </h2>
                  <span className="rounded bg-[#E1E8FD] px-2 py-0.5 text-[11px] font-semibold text-[#584237]">
                    2025 Real-Time
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-[#584237]">
                  Toshkent, Samarqand, Buxoro, Andijon bo‘yicha tranzaksiyalar va to‘lov usullari
                  tahlili
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-[#F1F3FF] p-1">
                {(
                  [
                    ['haftalik', 'Haftalik'],
                    ['oylik', 'Oylik'],
                    ['yillik', 'Yillik'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setChartPeriod(id)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] ${
                      chartPeriod === id
                        ? 'bg-white font-bold text-[#141b2b] shadow-sm'
                        : 'text-[#584237] hover:text-[#141b2b]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex h-56 w-full flex-col justify-end">
              <svg className="h-44 w-full overflow-visible" viewBox="0 0 760 160" fill="none">
                <defs>
                  <linearGradient id="primaryAreaGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="secondaryLineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#fea619" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#fea619" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" x2="760" y1="20" y2="20" stroke="#e1e8fd" strokeDasharray="4 4" />
                <line x1="0" x2="760" y1="70" y2="70" stroke="#e1e8fd" strokeDasharray="4 4" />
                <line x1="0" x2="760" y1="120" y2="120" stroke="#e1e8fd" strokeDasharray="4 4" />
                <path
                  d="M0,130 Q120,110 240,95 T480,75 T760,50 L760,160 L0,160 Z"
                  fill="url(#secondaryLineGrad)"
                />
                <path
                  d="M0,130 Q120,110 240,95 T480,75 T760,50"
                  fill="none"
                  stroke="#fea619"
                  strokeWidth="2.5"
                />
                <path
                  d="M0,110 Q140,85 260,60 T520,35 T760,15 L760,160 L0,160 Z"
                  fill="url(#primaryAreaGrad)"
                />
                <path
                  d="M0,110 Q140,85 260,60 T520,35 T760,15"
                  fill="none"
                  stroke="#9d4300"
                  strokeWidth="3"
                />
                <circle cx="260" cy="60" r="5" fill="#f97316" stroke="#fff" strokeWidth="2" />
                <circle cx="520" cy="35" r="5" fill="#f97316" stroke="#fff" strokeWidth="2" />
                <circle cx="760" cy="15" r="6" fill="#9d4300" stroke="#fff" strokeWidth="2" />
              </svg>
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#584237]">
                <span>Dush</span>
                <span>Sesh</span>
                <span>Chor</span>
                <span>Pay</span>
                <span>Jum (Pik)</span>
                <span>Shan (Oila)</span>
                <span className="font-bold text-[#F97316]">Yak (Bugun)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#E9EDFF] pt-3 sm:grid-cols-4">
              {[
                ['Toshkent Sh.', '3.12 mlrd', '+34%'],
                ['Samarqand Vil.', '890 mln', '+22%'],
                ["Farg‘ona Vodiysi", '540 mln', '+18%'],
                ['Buxoro & Xorazm', '270 mln', '+15%'],
              ].map(([region, val, growth]) => (
                <div key={region} className="flex flex-col">
                  <span className="text-[12px] text-[#584237]">{region}</span>
                  <span className="text-[18px] font-bold">
                    {val} <span className="text-[11px] text-[#F97316]">{growth}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-[#F1F3FF] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">To‘lov usullari bo‘yicha global oqim</span>
                <span className="text-[11px] text-[#584237]">84,920 tranzaksiya</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#E9EDFF]">
                <div className="h-full bg-[#9D4300]" style={{ width: '64%' }} />
                <div className="h-full bg-[#FEA619]" style={{ width: '26%' }} />
                <div className="h-full bg-[#E0C0B1]" style={{ width: '10%' }} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#584237]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9D4300]" /> Humo & Uzcard:{' '}
                  <strong className="text-[#141b2b]">64%</strong> (3,085 mln)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEA619]" /> Click & Payme:{' '}
                  <strong className="text-[#141b2b]">26%</strong> (1,253 mln)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E0C0B1]" /> Naqd:{' '}
                  <strong className="text-[#141b2b]">10%</strong> (482 mln)
                </span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-bold">Restoranlar Tarmog‘i Boshqaruvi</h2>
                <span className="rounded-full bg-[#9D4300]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#9D4300]">
                  348 ta umumiy
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex w-64 items-center">
                  <Icon name="search" className="absolute left-3 text-[18px] text-[#584237]" />
                  <input
                    className="h-9 w-full rounded-full bg-[#F1F3FF] pr-3 pl-9 text-[12px] outline-none focus:ring-1 focus:ring-[#F97316]"
                    placeholder="Nomi, egasi yoki filial..."
                  />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#F1F3FF] p-1">
                  {(
                    [
                      ['all', 'Barchasi'],
                      ['active', 'Faol'],
                      ['stopped', "To‘xtatilgan"],
                      ['new', 'Yangi (14)'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`cursor-pointer rounded-full px-3 py-1 text-[11px] ${
                        filter === id
                          ? id === 'new'
                            ? 'font-bold text-[#A73A00]'
                            : 'bg-white font-bold text-[#141b2b] shadow-sm'
                          : 'text-[#584237] hover:text-[#141b2b]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="bg-[#F1F3FF] text-[13px] tracking-wider text-[#584237] uppercase">
                    <th className="rounded-l-lg px-4 py-3">Restoran & Manzil</th>
                    <th className="px-3 py-3">Egasi / Menejer</th>
                    <th className="px-3 py-3 text-center">Menyu</th>
                    <th className="px-3 py-3 text-right">Oylik Buyurtma</th>
                    <th className="px-3 py-3 text-right">Aylanma (so‘m)</th>
                    <th className="px-3 py-3 text-center">Komissiya</th>
                    <th className="px-3 py-3 text-center">Holat</th>
                    <th className="rounded-r-lg px-4 py-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDFF]/60">
                  {restaurants.map((r) => (
                    <tr
                      key={r.name}
                      className={`transition-colors hover:bg-[#F1F3FF]/40 ${
                        r.status === 'suspended' ? 'opacity-80' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF4ED] text-[18px] shadow-sm">
                            🍽️
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-bold">{r.name}</span>
                            <span className="flex items-center gap-1 text-[12px] text-[#584237]">
                              <Icon name="pin_drop" className="text-[14px]" />
                              {r.address}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">{r.owner}</span>
                          <span className="font-mono text-[12px] text-[#584237]">{r.phone}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-[13px] font-bold">{r.menu}</td>
                      <td className="px-3 py-3 text-right font-mono font-semibold tabular-nums">
                        {r.orders}
                      </td>
                      <td
                        className={`px-3 py-3 text-right font-mono font-bold tabular-nums ${
                          r.status === 'active' ? 'text-[#F97316]' : 'text-[#584237]'
                        }`}
                      >
                        {r.revenue}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold ${
                            r.status === 'moderation'
                              ? 'bg-[#E1E8FD] text-[#141b2b]'
                              : 'bg-[#9D4300]/10 text-[#9D4300]'
                          }`}
                        >
                          {r.commission}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {r.status === 'active' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E9EDFF] px-2.5 py-1 text-[11px] font-bold text-[#684000]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#855300]" /> Faol
                          </span>
                        )}
                        {r.status === 'moderation' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFDBCE] px-2.5 py-1 text-[11px] font-bold text-[#5D1D00]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#A73A00]" /> Moderatsiyada
                          </span>
                        )}
                        {r.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFDAD6] px-2.5 py-1 text-[11px] font-bold text-[#93000A]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#BA1A1A]" /> To‘xtatilgan
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status === 'moderation' ? (
                          <button
                            type="button"
                            className="cursor-pointer rounded-full bg-[#F97316] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#FF6D2C]"
                          >
                            Tasdiqlash
                          </button>
                        ) : r.status === 'suspended' ? (
                          <button
                            type="button"
                            className="cursor-pointer rounded-full bg-[#E9EDFF] px-3 py-1 text-[11px] font-bold hover:bg-[#E1E8FD]"
                          >
                            Tiklash
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <RoundIcon name="tune" />
                            <RoundIcon name="receipt_long" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E9EDFF] pt-3 text-[12px] text-[#584237] sm:flex-row">
              <span>Jami 348 ta restorandan 1–6 ko‘rsatilmoqda</span>
              <div className="flex items-center gap-1">
                <RoundPage disabled>
                  <Icon name="chevron_left" className="text-[16px]" />
                </RoundPage>
                <RoundPage active>1</RoundPage>
                <RoundPage>2</RoundPage>
                <RoundPage>3</RoundPage>
                <span className="px-1">...</span>
                <RoundPage>58</RoundPage>
                <RoundPage>
                  <Icon name="chevron_right" className="text-[16px]" />
                </RoundPage>
              </div>
            </div>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-6 xl:col-span-4">
          <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-[#F97316]" />
                <h3 className="text-[18px] font-semibold">Kuryerlar Logistikasi</h3>
              </div>
              <span className="rounded bg-[#E1E8FD] px-2 py-0.5 text-[11px] font-bold text-[#584237]">
                Jonli GPS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col rounded-lg bg-[#F1F3FF] p-3">
                <span className="text-[12px] text-[#584237]">O‘rtacha yetkazish</span>
                <span className="mt-1 text-[22px] font-bold tabular-nums text-[#F97316]">
                  24.6 <span className="text-[11px] font-normal text-[#141b2b]">daq</span>
                </span>
                <span className="mt-0.5 text-[11px] font-semibold text-[#855300]">
                  Tezkor: &lt;30 daqiqa
                </span>
              </div>
              <div className="flex flex-col rounded-lg bg-[#F1F3FF] p-3">
                <span className="text-[12px] text-[#584237]">Kechikish darajasi</span>
                <span className="mt-1 text-[22px] font-bold tabular-nums">1.2%</span>
                <span className="mt-0.5 text-[11px] font-semibold text-[#F97316]">Norma doirasida</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#584237]">Katta Toshkent zonalari yuklamasi</span>
                <span className="font-bold">88% Bandlik</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F3FF]">
                <div className="h-full rounded-full bg-[#F97316]" style={{ width: '88%' }} />
              </div>
              <div className="flex items-center justify-between pt-1 text-[12px] text-[#584237]">
                <span>412 kuryer smenada</span>
                <span className="font-bold text-[#855300]">36 ta zaxirada</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold">Top Restoranlar Reytingi</h3>
              <span className="text-[11px] font-bold text-[#F97316]">Avgust 2025</span>
            </div>
            <div className="flex flex-col gap-3">
              {leaders.map((l) => (
                <div
                  key={l.name}
                  className="flex items-center justify-between rounded-lg bg-[#F1F3FF] p-3 transition-colors hover:bg-[#E9EDFF]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`w-6 text-center text-[18px] font-black ${
                        l.rank === 1 ? 'text-[#855300]' : 'text-[#584237]'
                      }`}
                    >
                      {l.rank}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[18px]">
                      🏆
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[13px] font-bold">{l.name}</span>
                      <span className="text-[12px] text-[#584237]">{l.revenue}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-[#855300]">
                    <Icon name="star" className="text-[14px]" filled />
                    {l.rating}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold">Tizim Faoliyati va Xavfsizlik</h3>
              <Icon name="security" className="text-[18px] text-[#584237]" />
            </div>
            <div className="flex flex-col gap-3">
              {logs.map((log) => (
                <div key={log.meta} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      log.tone === 'tertiary'
                        ? 'bg-[#FFDBCE] text-[#A73A00]'
                        : log.tone === 'secondary'
                          ? 'bg-[#FFDDB8] text-[#855300]'
                          : 'bg-[#E9EDFF] text-[#141b2b]'
                    }`}
                  >
                    <Icon name={log.icon} className="text-[16px]" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <p className="text-[12px] leading-tight text-[#141b2b]">{log.text}</p>
                    <span className="mt-1 text-[11px] text-[#584237]">{log.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-[#E1E8FD] to-[#E9EDFF] p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Icon name="summarize" className="text-[22px] text-[#F97316]" />
              <h4 className="text-[16px] font-bold">Oylik Soliq va Moliya Xulosasi</h4>
            </div>
            <p className="text-[12px] text-[#584237]">
              2025-yil Avgust oyi bo‘yicha hisob-kitob qilingan davlat soliq hisoboti va filiallararo
              yakuniy aktlar tayyor.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[13px] font-bold shadow-sm hover:bg-[#F9F9FF]"
              >
                <Icon name="table_view" className="text-[18px] text-[#F97316]" /> Excel (.xlsx)
              </button>
              <button
                type="button"
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#F97316] px-3 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-[#FF6D2C]"
              >
                <Icon name="picture_as_pdf" className="text-[18px]" /> PDF Hujjat
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function SuperKpi({
  label,
  value,
  unit,
  icon,
  iconBg,
  trend,
  trendNote,
  right,
  rightClass,
  valueClass,
  footer,
}: {
  label: string
  value: string
  unit?: string
  icon: string
  iconBg: string
  trend?: string
  trendNote?: string
  right?: string
  rightClass?: string
  valueClass?: string
  footer?: ReactNode
}) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[13px] tracking-wider text-[#584237] uppercase">{label}</span>
          <span className={`mt-1 text-[36px] leading-tight font-extrabold tabular-nums ${valueClass || ''}`}>
            {value}{' '}
            {unit && <span className="text-[18px] font-semibold text-[#584237]">{unit}</span>}
          </span>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}>
          <Icon name={icon} className="text-[24px]" />
        </div>
      </div>
      <div className="-mx-5 -mb-5 mt-4 bg-[#F1F3FF]/50 px-5 py-2">
        {footer || (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[13px] font-bold text-[#F97316]">
              <Icon name="trending_up" className="text-[16px]" />
              <span>{trend}</span>
              <span className="text-[12px] font-normal text-[#584237]">{trendNote}</span>
            </div>
            <span className={`font-mono text-[12px] text-[#584237] ${rightClass || ''}`}>{right}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function RoundIcon({ name }: { name: string }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF] hover:text-[#141b2b]"
    >
      <Icon name={name} className="text-[16px]" />
    </button>
  )
}

function RoundPage({
  children,
  active,
  disabled,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[11px] font-bold transition-colors disabled:opacity-40 ${
        active
          ? 'bg-[#F97316] text-white'
          : 'bg-[#F1F3FF] text-[#584237] hover:bg-[#E9EDFF] hover:text-[#141b2b]'
      }`}
    >
      {children}
    </button>
  )
}

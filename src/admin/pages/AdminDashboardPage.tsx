import { useState, type ReactNode } from 'react'
import { Icon } from '../../components/ui/Icon'

const hourBars = [
  { h: '09:00', height: 18 },
  { h: '10:00', height: 28 },
  { h: '11:00', height: 52 },
  { h: '12:00', height: 94, peak: 'Tushlik cho‘qqisi', peakTone: 'primary' as const },
  { h: '13:00', height: 88, bold: true, tone: 'primary' as const },
  { h: '14:00', height: 48 },
  { h: '15:00', height: 30 },
  { h: '16:00', height: 25 },
  { h: '17:00', height: 45 },
  { h: '18:00', height: 72, bold: true, tone: 'secondary' as const },
  { h: '19:00', height: 98, peak: 'Kechki bazm', peakTone: 'secondary' as const },
  { h: '20:00', height: 80, bold: true, tone: 'secondary' as const },
  { h: '21:00', height: 35 },
]

const orders = [
  {
    id: '#UZ-8842',
    time: '12:38 bugun',
    customer: 'Jahongir Otajonov',
    phone: '+998 90 123-45-67',
    items: 'Samarqandcha osh (0.7kg) x2',
    extras: 'Achichuk, Tandir non x2, Ko‘k choy',
    total: '112,000 so‘m',
    note: 'Yetkazish bepul',
    noteTone: 'emerald',
    pay: 'Click',
    payIcon: 'check_circle',
    payTone: 'emerald',
    status: 'Tayyorlanmoqda',
    statusTone: 'cooking',
    dot: 'orange',
  },
  {
    id: '#UZ-8841',
    time: '12:31 bugun',
    customer: 'Dilshodbek Rustamov',
    phone: '+998 97 780-12-34',
    items: "Tandir qo‘zi go‘shti (0.5kg)",
    extras: 'Suzma, Achichuk salat, Obi non',
    total: '148,000 so‘m',
    note: 'Kuryer biriktirilgan',
    noteTone: 'muted',
    pay: 'Humo',
    payIcon: 'check_circle',
    payTone: 'emerald',
    status: 'Yetkazilmoqda',
    statusTone: 'delivery',
    dot: 'blue',
  },
  {
    id: '#UZ-8840',
    time: '2 daqiqa oldin',
    timeHot: true,
    customer: 'Malika Yusupova',
    phone: '+998 94 654-99-11',
    items: 'Gijduvon shashlik x4',
    extras: 'Piyoz, Samarqand non, Limon choy',
    total: '96,000 so‘m',
    note: 'Kuryer qidirilmoqda',
    noteTone: 'muted',
    pay: 'Naqd pul',
    payIcon: 'local_atm',
    payTone: 'amber',
    status: 'Yangi tushgan',
    statusTone: 'new',
    dot: 'ping',
    highlight: true,
    accept: true,
  },
  {
    id: '#UZ-8839',
    time: '12:15 bugun',
    customer: 'Sobirjon Mahmudov',
    phone: '+998 93 450-88-00',
    items: "To‘y oshi ziyorat patnisi (1.5kg)",
    extras: 'Kazi, bedana tuxum, shakarob',
    total: '195,000 so‘m',
    note: 'Tugallangan',
    noteTone: 'emerald',
    pay: 'Payme',
    payIcon: 'check_circle',
    payTone: 'emerald',
    status: 'Yetkazildi',
    statusTone: 'done',
    dot: 'slate',
    faded: true,
  },
]

const kitchenQueue = [
  {
    id: '#UZ-8842',
    tag: 'Katta qozon',
    tagTone: 'primary',
    eta: '04:12 qoldi',
    etaTone: 'primary',
    title: "Samarqandcha To‘y Oshi x3 (Kazi, tuxumli)",
    progress: 78,
    bar: 'primary',
    hot: true,
  },
  {
    id: '#UZ-8840',
    tag: 'Tandir',
    tagTone: 'secondary',
    eta: '08:45 qoldi',
    etaTone: 'secondary',
    title: 'Gijduvon Shashlik x4 + Tandir Somsa x6',
    progress: 45,
    bar: 'secondary',
  },
  {
    id: '#UZ-8837',
    tag: 'Salat & Ichimlik',
    tagTone: 'muted',
    eta: '12:20 qoldi',
    etaTone: 'muted',
    title: 'Achichuk x3, Suzma x2, Samarqand Non x4',
    progress: 25,
    bar: 'muted',
  },
]

const topDishes = [
  { name: "Samarqandcha To‘y Oshi", sold: '86 porsiya sotildi', sum: '4,128,000', growth: '+22%', emoji: '🍚' },
  { name: "Tandir Go‘sht maxsus", sold: '42 porsiya sotildi', sum: '3,150,000', growth: '+15%', emoji: '🍖' },
  { name: 'Gijduvon Shashlik', sold: '68 dona sotildi', sum: '2,176,000', growth: '+8%', emoji: '🍢' },
  { name: 'Achichuk Salati', sold: '94 porsiya sotildi', sum: '1,410,000', growth: '+31%', emoji: '🥗' },
]

const reviews = [
  {
    initials: 'AO',
    name: 'Anvar Qosimov',
    stars: 5,
    text: "Samarqand oshi rostdan ham o‘zining asl ta'mida yetib keldi. Ayniqsa issiq non va achichuk mazzali bo‘ldi. Rahmat!",
    when: '18 daqiqa oldin',
    tone: 'primary',
  },
  {
    initials: 'NK',
    name: 'Nodira Karimova',
    stars: 4,
    text: "Tandir go‘shti juda mayin pishgan, biroq kuryer 10 daqiqaga kechikdi. Ovqat iliq holda keldi.",
    when: '42 daqiqa oldin',
    tone: 'secondary',
  },
]

const orderTabs = [
  { id: 'all', label: 'Barchasi', count: '142', active: true },
  { id: 'new', label: 'Yangi', badge: '8', badgeTone: 'hot' },
  { id: 'cook', label: 'Tayyorlanmoqda', badge: '10', badgeTone: 'amber' },
  { id: 'ship', label: 'Yetkazilmoqda', badge: '6', badgeTone: 'blue' },
  { id: 'done', label: 'Yetkazildi', count: '114' },
  { id: 'cancel', label: 'Bekor qilindi', count: '4', countTone: 'error' },
]

export function AdminDashboardPage() {
  const [period, setPeriod] = useState<'bugun' | 'haftalik' | 'oylik'>('bugun')
  const [tab, setTab] = useState('all')

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[11px] text-[#584237]">
            <span className="cursor-pointer transition-colors hover:text-[#F97316]">
              Boshqaruv paneli
            </span>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="font-semibold text-[#141b2b]">Samarqand Osh Markazi</span>
            <span className="rounded-full bg-[#E9EDFF] px-2 py-0.5 font-medium text-[#141b2b]">
              Filial #1 - Chilonzor
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-bold tracking-tight text-[#141b2b]">
              Oshxona boshqaruv markazi
            </h1>
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Holati: Ochiq (Buyurtma qabul qilinmoqda)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-sm hover:bg-[#E9EDFF]"
          >
            <Icon name="tune" className="text-[20px] text-[#584237]" />
            Filtrlar
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold shadow-sm hover:bg-[#E9EDFF]"
          >
            <Icon name="download" className="text-[20px] text-[#584237]" />
            Eksport (Excel)
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F97316] px-5 py-2 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] transition-transform hover:bg-[#A73A00] active:scale-95"
          >
            <Icon name="point_of_sale" className="text-[20px]" />
            Kassa (Yangi chek)
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Bugungi tushum"
          value="8,450,000"
          unit="so‘m"
          icon="payments"
          iconBg="bg-orange-50 text-[#F97316]"
          footer={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <Icon name="trending_up" className="text-[16px]" />
                <span>+14.2%</span>
                <span className="ml-1 font-normal text-[#584237]/70">kechagiga nisbatan</span>
              </div>
              <svg className="h-6 w-16 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 64 24">
                <path
                  d="M1 18 L14 14 L28 17 L42 8 L54 11 L63 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          }
        />
        <KpiCard
          label="Bugungi buyurtmalar"
          value="142"
          unit="ta chek"
          icon="receipt_long"
          iconBg="bg-amber-50 text-[#FEA619]"
          footer={
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-[#F97316]">
                  <span className="h-2 w-2 rounded-full bg-[#F97316]" />
                  18 ta oshxona
                </span>
                <span className="text-[#584237]/40">•</span>
                <span className="flex items-center gap-1 font-semibold text-[#855300]">
                  <span className="h-2 w-2 rounded-full bg-[#FEA619]" />6 ta yo‘lda
                </span>
              </div>
              <Icon name="arrow_forward" className="text-[18px] text-[#584237]/50" />
            </div>
          }
        />
        <KpiCard
          label="O‘rtacha buyurtma (AOV)"
          value="59,500"
          unit="so‘m"
          icon="shopping_bag"
          iconBg="bg-blue-50 text-blue-600"
          footer={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <Icon name="trending_up" className="text-[16px]" />
                <span>+4.8%</span>
                <span className="ml-1 font-normal text-[#584237]/70">o‘tgan haftaga</span>
              </div>
              <span className="text-[11px] text-[#584237]">Target: 65k</span>
            </div>
          }
        />
        <KpiCard
          label="Mijozlar reytingi"
          value="4.9"
          icon="thumb_up"
          iconBg="bg-amber-50 text-[#855300]"
          valueExtra={
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" className="text-[20px]" filled />
              ))}
              <Icon name="star_half" className="text-[20px]" filled />
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#584237]">Jami 1,240 ta samimiy sharh</span>
              <span className="cursor-pointer text-[11px] font-bold text-[#F97316] hover:underline">
                Barchasi
              </span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          <section className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[18px] font-bold text-[#141b2b]">
                  Daromad va buyurtmalar dinamikasi
                </h2>
                <p className="mt-0.5 text-[12px] text-[#584237]">
                  Bugungi eng qizg‘in tushlik (12:00-14:00) va kechki ovqat (18:30-21:00) tahlili
                </p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-xl bg-[#F1F3FF] p-1 sm:self-auto">
                {(
                  [
                    ['bugun', 'Bugun'],
                    ['haftalik', 'Haftalik'],
                    ['oylik', 'Oylik'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPeriod(id)}
                    className={`cursor-pointer rounded-lg px-3 py-1 text-[11px] transition-colors ${
                      period === id
                        ? 'bg-white font-bold text-[#141b2b] shadow-sm'
                        : 'font-semibold text-[#584237] hover:text-[#141b2b]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex h-56 w-full flex-col justify-end pt-4 pb-2">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-20">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-px w-full bg-[#584237]" />
                ))}
              </div>
              <div className="relative z-10 flex h-44 items-end justify-between gap-2 px-2">
                {hourBars.map((bar) => {
                  const tone =
                    bar.tone === 'secondary' || bar.peakTone === 'secondary'
                      ? 'bg-[#FEA619]'
                      : bar.tone === 'primary' || bar.peakTone === 'primary'
                        ? 'bg-[#F97316]'
                        : 'bg-[#E1E8FD] group-hover:bg-[#F97316]/70'
                  return (
                    <div key={bar.h} className="group relative flex flex-1 flex-col items-center gap-2">
                      {bar.peak && (
                        <span
                          className={`absolute -top-7 rounded px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white shadow-sm ${
                            bar.peakTone === 'secondary' ? 'bg-[#855300]' : 'bg-[#9D4300]'
                          }`}
                        >
                          {bar.peak}
                        </span>
                      )}
                      <div
                        className={`w-full rounded-t-md transition-all ${tone} ${
                          bar.peak ? 'shadow-[0_4px_12px_rgba(249,115,22,0.3)]' : ''
                        }`}
                        style={{ height: `${bar.height}%` }}
                      />
                      <span
                        className={`text-[11px] ${
                          bar.bold || bar.peak
                            ? 'font-bold text-[#141b2b]'
                            : 'text-[#584237]/60'
                        }`}
                      >
                        {bar.h}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-[#F1F3FF]/40 p-4 sm:grid-cols-3">
              <PayStat color="bg-[#F97316]" label="Uzcard & Humo (54%)" value="4,563,000" />
              <PayStat color="bg-[#FEA619]" label="Naqd pul (28%)" value="2,366,000" />
              <PayStat color="bg-blue-500" label="Click & Payme (18%)" value="1,521,000" />
            </div>
          </section>

          <section className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[18px] font-bold text-[#141b2b]">So‘nggi buyurtmalar</h2>
                <p className="mt-0.5 text-[12px] text-[#584237]">
                  Real vaqtdagi onlayn va zaldagi mijozlar so‘rovlari
                </p>
              </div>
              <div className="relative flex items-center">
                <Icon name="search" className="absolute left-2 text-[18px] text-[#584237]" />
                <input
                  className="w-48 rounded-full bg-[#F1F3FF] py-1.5 pr-3 pl-8 text-[12px] outline-none"
                  placeholder="Buyurtma ID yoki ism..."
                />
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
              {orderTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition-colors ${
                    tab === t.id
                      ? 'bg-[#141b2b] font-bold text-white shadow-sm'
                      : 'bg-[#F1F3FF] font-medium text-[#141b2b] hover:bg-[#E9EDFF]'
                  }`}
                >
                  {t.label}{' '}
                  {t.badge ? (
                    <span
                      className={`ml-1 rounded-full px-1.5 text-[11px] font-bold ${
                        t.badgeTone === 'hot'
                          ? 'bg-[#FF6D2C] text-white'
                          : t.badgeTone === 'amber'
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-500 text-white'
                      }`}
                    >
                      {t.badge}
                    </span>
                  ) : (
                    <span
                      className={`ml-1 text-[11px] font-bold ${
                        t.countTone === 'error' ? 'text-[#BA1A1A]' : 'opacity-70'
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F1F3FF]/60 text-[11px] tracking-wider text-[#584237] uppercase">
                    <th className="rounded-l-xl px-4 py-3">ID</th>
                    <th className="px-4 py-3">Mijoz</th>
                    <th className="px-4 py-3">Taomlar to‘plami</th>
                    <th className="px-4 py-3">Jami narx</th>
                    <th className="px-4 py-3">To‘lov holati</th>
                    <th className="px-4 py-3">Buyurtma holati</th>
                    <th className="rounded-r-xl px-4 py-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className={`transition-colors hover:bg-[#F1F3FF]/40 ${
                        o.highlight ? 'bg-orange-50/30' : ''
                      } ${o.faded ? 'opacity-80' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              o.dot === 'ping'
                                ? 'animate-ping bg-[#FF6D2C]'
                                : o.dot === 'blue'
                                  ? 'bg-blue-500'
                                  : o.dot === 'slate'
                                    ? 'bg-slate-300'
                                    : 'bg-[#F97316]'
                            }`}
                          />
                          <span className="text-[13px] font-extrabold">{o.id}</span>
                        </div>
                        <span
                          className={`text-[12px] ${
                            o.timeHot ? 'font-bold text-[#F97316]' : 'text-[#584237]/70'
                          }`}
                        >
                          {o.time}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold">{o.customer}</span>
                          <span className="text-[12px] text-[#584237]">{o.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex max-w-[200px] flex-col">
                          <span className="truncate text-[13px] font-semibold">{o.items}</span>
                          <span className="truncate text-[12px] text-[#584237]">{o.extras}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[13px] font-extrabold">{o.total}</span>
                        <span
                          className={`block text-[11px] font-semibold ${
                            o.noteTone === 'emerald' ? 'text-emerald-600' : 'text-[#584237]'
                          }`}
                        >
                          {o.note}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            o.payTone === 'amber'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          <Icon name={o.payIcon} className="text-[14px]" />
                          {o.pay}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill tone={o.statusTone} label={o.status} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        {o.accept ? (
                          <button
                            type="button"
                            className="cursor-pointer rounded-lg bg-[#F97316] px-3 py-1 text-[11px] font-bold text-white shadow hover:bg-[#A73A00]"
                          >
                            Qabul qilish
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <IconBtn name="visibility" />
                            <IconBtn name="print" />
                            {!o.faded && <IconBtn name="edit_note" accent />}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="-mx-6 -mb-6 mt-4 flex items-center justify-between rounded-b-2xl bg-[#F1F3FF]/30 px-6 pt-4 pb-4">
              <span className="text-[12px] text-[#584237]">Jami 142 tadan 1-4 ko‘rsatilmoqda</span>
              <div className="flex items-center gap-1">
                <PageBtn disabled>
                  <Icon name="chevron_left" className="text-[16px]" />
                </PageBtn>
                <PageBtn active>1</PageBtn>
                <PageBtn>2</PageBtn>
                <PageBtn>3</PageBtn>
                <PageBtn>
                  <Icon name="chevron_right" className="text-[16px]" />
                </PageBtn>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-4">
          <section className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 animate-ping rounded-full bg-[#F97316]" />
                <h3 className="text-[18px] font-bold">Oshxona holati (Live)</h3>
              </div>
              <span className="rounded-full bg-[#FF6D2C]/10 px-2 py-0.5 text-[11px] font-bold text-[#A73A00]">
                18 ta navbatda
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {kitchenQueue.map((q) => (
                <div
                  key={q.id}
                  className={`flex flex-col gap-2 rounded-xl p-3 transition-colors ${
                    q.hot ? 'bg-orange-50/50 hover:bg-orange-50' : 'bg-[#F1F3FF]/80 hover:bg-[#F1F3FF]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold">{q.id}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          q.tagTone === 'primary'
                            ? 'bg-[#F97316] text-white'
                            : q.tagTone === 'secondary'
                              ? 'bg-[#FEA619] text-[#684000]'
                              : 'bg-[#DCE2F7] text-[#584237]'
                        }`}
                      >
                        {q.tag}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[11px] font-extrabold ${
                        q.etaTone === 'primary'
                          ? 'text-[#F97316]'
                          : q.etaTone === 'secondary'
                            ? 'text-[#855300]'
                            : 'text-[#584237]'
                      }`}
                    >
                      <Icon name="timer" className="text-[16px]" />
                      {q.eta}
                    </div>
                  </div>
                  <div className="text-[14px] font-medium">{q.title}</div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E1E8FD]">
                    <div
                      className={`h-full rounded-full ${
                        q.bar === 'primary'
                          ? 'bg-[#F97316]'
                          : q.bar === 'secondary'
                            ? 'bg-[#FEA619]'
                            : 'bg-[#584237]'
                      }`}
                      style={{ width: `${q.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-bold">Bugungi top taomlar</h3>
              <span className="cursor-pointer text-[11px] font-bold text-[#F97316] hover:underline">
                Barcha menyu
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {topDishes.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF4ED] text-[24px] shadow-sm">
                    {d.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-[13px] font-bold">{d.name}</h4>
                    <span className="text-[12px] text-[#584237]">{d.sold}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[13px] font-extrabold">{d.sum}</span>
                    <span className="text-[11px] font-bold text-emerald-600">{d.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="reviews" className="text-[#FEA619]" />
                <h3 className="text-[18px] font-bold">Yangi sharhlar</h3>
              </div>
              <span className="cursor-pointer text-[11px] font-bold text-[#F97316] hover:underline">
                Barchasi (1.2k)
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <div key={r.name} className="flex flex-col gap-2 rounded-xl bg-[#F1F3FF]/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                          r.tone === 'primary'
                            ? 'bg-[#FFDBCA] text-[#9D4300]'
                            : 'bg-[#FFDDB8] text-[#855300]'
                        }`}
                      >
                        {r.initials}
                      </span>
                      <span className="text-[13px] font-bold">{r.name}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          name="star"
                          className="text-[16px]"
                          filled={i < r.stars}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="line-clamp-2 text-[12px] text-[#584237]">&ldquo;{r.text}&rdquo;</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#584237]/60">{r.when}</span>
                    <button
                      type="button"
                      className="flex cursor-pointer items-center gap-1 text-[11px] font-bold text-[#F97316] hover:text-[#A73A00]"
                    >
                      <Icon name="reply" className="text-[14px]" />
                      Javob qaytarish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#F97316] to-[#A73A00] p-5 text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="w-max rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-extrabold tracking-wide uppercase">
                  Faol taklif
                </span>
                <h3 className="mt-2 text-[18px] leading-tight font-extrabold">
                  Tushlikka 15% chegirma!
                </h3>
                <p className="mt-1 text-[12px] text-white/90">
                  Soat 11:30 dan 14:30 gacha bo‘lgan barcha Samarqandcha oshlarga tatbiq etiladi.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Icon name="local_fire_department" className="text-[24px]" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
              <div className="flex items-center gap-2">
                <Icon name="insights" className="text-[20px]" />
                <span className="text-[13px] font-bold">Bugun 34 ta buyurtmada qo‘llandi</span>
              </div>
              <button
                type="button"
                className="cursor-pointer rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#F97316] shadow hover:bg-orange-50"
              >
                Sozlash
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  unit,
  icon,
  iconBg,
  footer,
  valueExtra,
}: {
  label: string
  value: string
  unit?: string
  icon: string
  iconBg: string
  footer: ReactNode
  valueExtra?: ReactNode
}) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(17,24,39,0.04)] transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wider text-[#584237]/80 uppercase">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[32px] leading-10 font-extrabold tracking-tight">{value}</span>
            {unit && <span className="text-[11px] font-bold text-[#584237]">{unit}</span>}
            {valueExtra}
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-inner ${iconBg}`}>
          <Icon name={icon} className="text-[24px]" />
        </div>
      </div>
      <div className="-mx-5 -mb-5 mt-4 bg-[#F1F3FF]/50 px-5 pt-3 pb-3">{footer}</div>
    </div>
  )
}

function PayStat({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-8 w-3 rounded-full ${color}`} />
      <div className="flex flex-col">
        <span className="text-[11px] text-[#584237]">{label}</span>
        <span className="text-[18px] font-bold">
          {value} <span className="text-[12px] font-normal">so‘m</span>
        </span>
      </div>
    </div>
  )
}

function StatusPill({ tone, label }: { tone: string; label: string }) {
  const styles: Record<string, string> = {
    cooking: 'bg-[#FF6D2C]/10 text-[#A73A00]',
    delivery: 'bg-blue-50 text-blue-700',
    new: 'bg-[#F97316] text-white shadow-sm',
    done: 'bg-emerald-100 text-emerald-800',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${styles[tone] || ''}`}
    >
      {tone === 'cooking' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A73A00]" />}
      {tone === 'delivery' && <Icon name="sports_motorsports" className="text-[14px]" />}
      {tone === 'new' && <Icon name="notifications_active" className="text-[14px]" />}
      {tone === 'done' && <Icon name="task_alt" className="text-[14px]" />}
      {label}
    </span>
  )
}

function IconBtn({ name, accent }: { name: string; accent?: boolean }) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-[#E9EDFF] ${
        accent ? 'text-[#F97316]' : 'text-[#584237] hover:text-[#141b2b]'
      }`}
    >
      <Icon name={name} className="text-[20px]" />
    </button>
  )
}

function PageBtn({
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
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[11px] transition-colors disabled:opacity-40 ${
        active
          ? 'bg-[#F97316] font-bold text-white shadow-sm'
          : 'bg-white font-semibold text-[#141b2b] hover:bg-[#E9EDFF]'
      }`}
    >
      {children}
    </button>
  )
}

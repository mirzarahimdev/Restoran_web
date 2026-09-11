import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthHeader } from '../components/layout/AuthHeader'
import { GoogleIcon } from '../components/ui/GoogleIcon'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'

const AUTH_FOOD_IMG =
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1400&h=1600&fit=crop'

const AVATAR_IMG =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop'

function PasswordChip({ label, valid }: { label: string; valid: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-label-sm transition-colors ${
        valid
          ? 'bg-secondary-container/20 font-semibold text-secondary'
          : 'bg-surface-container text-on-surface-variant'
      }`}
    >
      <Icon name="check" className="text-[14px]" />
      {label}
    </span>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = confirm.length > 0 && confirm === password

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AuthHeader />
      <main className="min-h-screen w-full pt-[79px]">
        <div className="flex min-h-[calc(100vh-79px)] w-full flex-col overflow-hidden lg:flex-row">
          {/* Left storytelling panel */}
          <div className="relative flex min-h-[460px] w-full flex-col justify-between overflow-hidden p-6 md:p-10 lg:w-5/12 lg:min-h-0 lg:p-12 xl:w-1/2">
            <img
              alt="O'zbek gastronomiyasi"
              className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
              src={AUTH_FOOD_IMG}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/95 via-on-background/60 to-on-background/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-primary-container/20" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-on-surface shadow-md backdrop-blur-md">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary-container" />
                <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
                  Milliy &amp; Zamonaviy Taomlar
                </span>
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-label-sm text-white backdrop-blur-md sm:flex">
                <Icon name="verified" className="text-[16px] text-secondary-container" filled />
                <span>100% Halol Kafolati</span>
              </div>
            </div>

            <div className="relative z-10 my-auto flex flex-col gap-6 py-8">
              <div className="inline-flex max-w-fit items-center gap-3 rounded-2xl bg-white/10 p-3 pr-5 shadow-lg backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary">
                  <Icon name="two_wheeler" className="text-[20px]" />
                </div>
                <div>
                  <p className="text-headline-sm leading-tight text-white">Toshkent bo&apos;ylab</p>
                  <p className="text-body-sm text-surface-variant">
                    O&apos;rtacha yetkazish vaqti 24 daqiqa
                  </p>
                </div>
              </div>

              <div className="grid max-w-md grid-cols-1 gap-3">
                {[
                  { icon: '⚡️', text: '25 daqiqada yetkazib berish' },
                  { icon: '🎁', text: "Birinchi buyurtmaga 20,000 so'm bonus" },
                  { icon: '💳', text: "Barcha to'lov tizimlari (Humo, Uzcard, Click, Payme)" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3 text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20"
                  >
                    <span className="text-[20px]" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="text-label-lg">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 max-w-lg rounded-2xl bg-surface/90 p-5 text-on-surface shadow-xl backdrop-blur-lg">
                <div className="mb-2 flex items-center gap-1 text-secondary-container">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="text-[18px]" filled />
                  ))}
                </div>
                <blockquote className="mb-4 text-body-md leading-relaxed font-medium text-on-surface">
                  “FoodUZ orqali har kuni tushlik va kechki ovqatni issiq holatda qabul qilamiz.
                  Xizmat darajasi a&apos;lo!”
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    alt="Aziza Karimova"
                    className="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-primary-container"
                    src={AVATAR_IMG}
                  />
                  <div>
                    <p className="text-headline-sm text-on-surface">Aziza Karimova</p>
                    <p className="text-label-sm text-on-surface-variant">
                      Doimiy mijoz • 48+ taom buyurtmasi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-label-sm text-surface-variant">
              <span>© 2025 FoodUZ Logistics</span>
              <div className="flex gap-4 font-medium text-white">
                <span>Toshkent</span>
                <span>•</span>
                <span>Samarqand</span>
                <span>•</span>
                <span>Buxoro</span>
              </div>
            </div>
          </div>

          {/* Right registration form */}
          <div className="flex w-full items-center justify-center bg-surface p-5 sm:p-8 lg:w-7/12 lg:p-12 xl:w-1/2">
            <div className="flex w-full max-w-[520px] flex-col gap-6 rounded-3xl bg-surface-container-lowest p-6 shadow-xl shadow-on-surface/5 sm:p-10">
              <div className="flex flex-col items-center text-center">
                <Logo className="mb-4 justify-center" />
                <h1 className="text-headline-lg font-bold tracking-tight text-on-surface">
                  Ro&apos;yxatdan o&apos;tish
                </h1>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  FoodUZ bilan mazali taomlarga bir qadam yaqinroq.
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md font-semibold text-on-surface">Ism va familiya</label>
                  <div className="relative flex items-center">
                    <Icon
                      name="person"
                      className="pointer-events-none absolute left-4 text-[20px] text-on-surface-variant"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Ismingiz va familiyangizni kiriting"
                      className="w-full rounded-xl bg-surface-container-low py-3 pr-4 pl-12 text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-md font-semibold text-on-surface">Telefon raqami</label>
                  <div className="relative flex items-center">
                    <Icon
                      name="phone"
                      className="pointer-events-none absolute left-4 text-[20px] text-on-surface-variant"
                    />
                    <input
                      required
                      type="tel"
                      defaultValue="+998 "
                      placeholder="+998 (__) ___-__-__"
                      className="w-full rounded-xl bg-surface-container-low py-3 pr-4 pl-12 text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-md font-semibold text-on-surface">Email</label>
                  <div className="relative flex items-center">
                    <Icon
                      name="mail"
                      className="pointer-events-none absolute left-4 text-[20px] text-on-surface-variant"
                    />
                    <input
                      required
                      type="email"
                      placeholder="example@mail.com"
                      className="w-full rounded-xl bg-surface-container-low py-3 pr-4 pl-12 text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-label-md font-semibold text-on-surface">Parol</label>
                    <div className="relative flex items-center">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Kamida 8 ta belgi"
                        className="w-full rounded-xl bg-surface-container-low py-3 pr-10 pl-4 text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-3 flex items-center text-on-surface-variant transition-colors hover:text-on-surface"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <Icon
                          name={showPassword ? 'visibility_off' : 'visibility'}
                          className="text-[20px]"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-label-md font-semibold text-on-surface">
                      Parolni tasdiqlash
                    </label>
                    <div className="relative flex items-center">
                      <input
                        required
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Parolni qayta kiriting"
                        className="w-full rounded-xl bg-surface-container-low py-3 pr-10 pl-4 text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:outline-none"
                      />
                      <div
                        className={`pointer-events-none absolute right-3 flex items-center text-secondary-container transition-opacity ${
                          passwordsMatch ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Icon name="check_circle" className="text-[20px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <PasswordChip label="8+ belgi" valid={hasLength} />
                  <PasswordChip label="Katta harf" valid={hasUpper} />
                  <PasswordChip label="Raqam" valid={hasNumber} />
                </div>

                <label className="group flex cursor-pointer items-start gap-3 pt-1">
                  <div className="relative mt-0.5 flex items-center">
                    <input
                      required
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md bg-surface-container-high transition-all checked:bg-primary-container focus:outline-none"
                    />
                    <Icon
                      name="check"
                      className="pointer-events-none absolute left-0.5 text-[16px] text-on-primary opacity-0 transition-opacity peer-checked:opacity-100"
                    />
                  </div>
                  <span className="select-none text-body-sm leading-snug text-on-surface-variant transition-colors group-hover:text-on-surface">
                    <span className="font-semibold text-primary hover:underline">
                      Foydalanish shartlari
                    </span>{' '}
                    va{' '}
                    <span className="font-semibold text-primary hover:underline">
                      Maxfiylik siyosatiga
                    </span>{' '}
                    roziman
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-4 text-label-lg font-bold text-on-primary shadow-lg shadow-primary-container/25 transition-all hover:bg-tertiary-container active:scale-[0.98]"
                >
                  <span>Ro&apos;yxatdan o&apos;tish</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-px w-full bg-surface-container-high" />
                </div>
                <span className="relative bg-surface-container-lowest px-4 text-label-sm tracking-wider text-on-surface-variant/70 uppercase">
                  yoki
                </span>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-surface-container-low px-6 py-3 text-label-md font-semibold text-on-surface transition-all hover:bg-surface-container active:scale-[0.98]"
              >
                <GoogleIcon />
                <span>Google orqali ro&apos;yxatdan o&apos;tish</span>
              </button>

              <div className="pt-1 text-center">
                <p className="text-body-md text-on-surface-variant">
                  Hisobingiz bormi?{' '}
                  <Link
                    to="/kirish"
                    className="ml-1 text-label-md font-bold text-primary transition-colors hover:text-primary-container"
                  >
                    Kirish
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

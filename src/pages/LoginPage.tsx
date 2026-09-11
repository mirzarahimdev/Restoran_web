import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthHeader } from '../components/layout/AuthHeader'
import { GoogleIcon } from '../components/ui/GoogleIcon'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'

const AUTH_FOOD_IMG =
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&h=1600&fit=crop'

export function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'phone' | 'email'>('phone')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-on-background text-on-surface">
      <AuthHeader />
      <main className="min-h-screen w-full pt-[79px]">
        <section className="grid min-h-[calc(100vh-79px)] w-full grid-cols-1 overflow-hidden bg-surface lg:grid-cols-12">
          {/* Left branding panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-on-background p-10 xl:p-12 lg:col-span-7 lg:flex">
            <div className="absolute inset-0 z-0">
              <img
                alt="O'zbek taomlari"
                className="h-full w-full scale-105 object-cover object-center transition-transform duration-1000 ease-out hover:scale-100"
                src={AUTH_FOOD_IMG}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/70 to-on-background/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-r from-on-background/90 via-on-background/40 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-primary/10 mix-blend-color-burn" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/15 px-4 py-2 text-surface-container-lowest shadow-sm backdrop-blur-md">
                <span className="text-sm" aria-hidden>
                  ✨
                </span>
                <span className="text-label-md tracking-wide">
                  Toshkentdagi eng tezkor yetkazib berish
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-surface-container-lowest/10 px-3 py-1 text-label-sm text-surface-container-lowest/80 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary-container" />
                <span>Jonli oshxonalar ochiq</span>
              </div>
            </div>

            <div className="relative z-10 mt-auto max-w-xl space-y-8 pt-16">
              <div className="space-y-4">
                <h1 className="text-display font-extrabold leading-tight tracking-tight text-surface-container-lowest">
                  Sevimli taomlaringiz <br />
                  <span className="inline-flex items-center gap-2 text-primary-fixed-dim">
                    shu yerda
                    <span className="inline-block text-[38px] drop-shadow-md" aria-hidden>
                      🍽️
                    </span>
                  </span>
                </h1>
                <p className="max-w-lg text-body-lg leading-relaxed text-surface-variant/90">
                  FoodUZ orqali sevimli restoranlaringizdan mazali taomlarni tez va oson buyurtma
                  qiling. Har bir taom sarxil, issiq va o&apos;z vaqtida.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { value: '300+', label: 'Restoranlar', accent: false },
                  { value: '25 daqiqa', label: "O'rtacha eltish", accent: true },
                  { value: '100,000+', label: 'Mamnun mijozlar', accent: false },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-surface-container-lowest/10 p-4 backdrop-blur-md transition-all hover:bg-surface-container-lowest/15"
                  >
                    <div
                      className={`text-headline-md font-bold ${stat.accent ? 'text-primary-fixed' : 'text-surface-container-lowest'}`}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1 text-label-sm text-surface-variant/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex flex-col items-center justify-center bg-surface px-4 py-8 sm:px-6 lg:col-span-5 lg:px-10 xl:px-12">
            <div className="w-full max-w-[440px] space-y-6">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Logo className="justify-center" />
                <div className="space-y-1 pt-2">
                  <h2 className="text-headline-lg font-bold tracking-tight text-on-surface">
                    Tizimga kirish
                  </h2>
                  <p className="text-body-md text-on-surface-variant">
                    Hisobingizga kirish uchun ma&apos;lumotlaringizni kiriting.
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center rounded-xl bg-surface-container-low p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMode('phone')}
                  className={`flex-1 rounded-lg py-2 text-center text-label-md font-semibold transition-all duration-200 ${
                    mode === 'phone'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Telefon orqali
                </button>
                <button
                  type="button"
                  onClick={() => setMode('email')}
                  className={`flex-1 rounded-lg py-2 text-center text-label-md font-semibold transition-all duration-200 ${
                    mode === 'email'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Email orqali
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === 'phone' ? (
                  <div className="space-y-2">
                    <label className="block text-label-md font-semibold text-on-surface" htmlFor="phone">
                      Telefon raqami
                    </label>
                    <div className="relative flex items-center rounded-xl bg-surface-container-lowest shadow-sm transition-shadow focus-within:shadow-md">
                      <div className="flex items-center gap-1 px-4 py-3 text-label-md font-semibold text-on-surface">
                        <span aria-hidden>🇺🇿</span>
                        <span>+998</span>
                      </div>
                      <div className="h-6 w-px bg-surface-container-highest" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(90) 123-45-67"
                        className="w-full bg-transparent px-4 py-3 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-label-md font-semibold text-on-surface" htmlFor="email">
                      Elektron pochta
                    </label>
                    <div className="relative flex items-center rounded-xl bg-surface-container-lowest shadow-sm transition-shadow focus-within:shadow-md">
                      <Icon name="mail" className="pl-4 pr-2 text-[20px] text-outline" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="misol@fooduz.uz"
                        className="w-full bg-transparent py-3 pr-4 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-label-md font-semibold text-on-surface" htmlFor="password">
                    Parol
                  </label>
                  <div className="relative flex items-center rounded-xl bg-surface-container-lowest shadow-sm transition-shadow focus-within:shadow-md">
                    <Icon name="lock" className="pl-4 pr-2 text-[20px] text-outline" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Parolingizni kiriting"
                      className="w-full bg-transparent py-3 pr-3 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Parolni ko'rsatish yoki yashirish"
                      className="mr-2 p-2 text-outline transition-colors hover:text-on-surface"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 cursor-pointer rounded accent-primary-container"
                    />
                    <span className="text-body-sm text-on-surface-variant">Meni eslab qolish</span>
                  </label>
                  <Link
                    to="/parolni-tiklash"
                    className="text-label-md font-semibold text-primary-container transition-colors hover:text-tertiary"
                  >
                    Parolni unutdingizmi?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-label-lg font-semibold text-on-primary shadow-md transition-all duration-200 hover:scale-[1.01] hover:bg-tertiary active:scale-[0.98]"
                >
                  <span>Kirish</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </button>
              </form>

              <div className="relative flex items-center justify-center py-1">
                <div className="h-px w-full bg-surface-container-highest" />
                <span className="absolute bg-surface px-3 text-label-sm tracking-wider text-on-surface-variant uppercase">
                  yoki
                </span>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 text-label-md font-semibold text-on-surface shadow-sm transition-all duration-200 hover:bg-surface-container-low"
              >
                <GoogleIcon />
                <span>Google orqali kirish</span>
              </button>

              <div className="pt-2 text-center">
                <p className="text-body-md text-on-surface-variant">
                  Hali hisobingiz yo&apos;qmi?{' '}
                  <Link
                    to="/royxatdan-otish"
                    className="ml-1 text-label-md font-bold text-primary hover:underline"
                  >
                    Ro&apos;yxatdan o&apos;tish
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-3 text-outline">
                <Icon name="lock" className="text-[14px]" />
                <span className="text-body-sm">256-bit xavfsiz shifrlangan ma&apos;lumotlar</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { GoogleIcon } from '../components/ui/GoogleIcon'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import { useLanguage } from '../i18n/LanguageContext'

const AUTH_FOOD_IMG =
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&h=1600&fit=crop'

export function LoginPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { login, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState<'phone' | 'email'>('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('+998901112233')
  const [email, setEmail] = useState('aziza@fooduz.uz')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'email') {
        await login({ email: email.trim(), password })
      } else {
        await login({ phone: phone.trim(), password })
      }
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google orqali kirish muvaffaqiyatsiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#141b2b]">
      <main className="min-h-screen w-full">
        <section className="grid min-h-screen w-full grid-cols-1 overflow-hidden bg-[#F9F9FF] lg:grid-cols-12">
          {/* Left branding panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#141b2b] py-10 pr-10 pl-[10px] xl:py-12 xl:pr-12 xl:pl-[10px] lg:col-span-7 lg:flex">
            <div className="absolute inset-0 z-0">
              <img
                alt="O'zbek taomlari"
                className="h-full w-full scale-105 object-cover object-center"
                src={AUTH_FOOD_IMG}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b] via-[#141b2b]/70 to-[#141b2b]/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#141b2b]/90 via-[#141b2b]/40 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-[12px]">
              <div className="inline-flex items-center gap-[8px] rounded-full bg-white/15 px-[14px] py-[8px] text-white backdrop-blur-md">
                <span className="text-[14px]" aria-hidden>
                  ✨
                </span>
                <span className="text-[12px] font-semibold tracking-wide">
                  {t('login.badge.fast')}
                </span>
              </div>
              <div className="flex items-center gap-[6px] rounded-full bg-white/10 px-[12px] py-[6px] text-[12px] font-semibold text-white/90 backdrop-blur-md">
                <span className="h-[8px] w-[8px] animate-pulse rounded-full bg-[#F97316]" />
                <span>{t('login.badge.open')}</span>
              </div>
            </div>

            <div className="relative z-10 mt-auto max-w-xl space-y-8 pt-16">
              <div className="space-y-4">
                <h1 className="text-[40px] leading-[46px] font-extrabold tracking-tight text-white xl:text-[48px] xl:leading-[54px]">
                  {t('login.hero.title')}{' '}
                  <span className="inline-block text-[38px]" aria-hidden>
                    🍽️
                  </span>
                </h1>
                <p className="max-w-lg text-[16px] leading-[24px] text-white/90">
                  {t('login.hero.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-[12px] pt-2">
                {[
                  { value: '300+', label: t('login.stat.restaurants') },
                  { value: '25 daqiqa', label: t('login.stat.delivery') },
                  { value: '100,000+', label: t('login.stat.customers') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[14px] bg-white/10 p-[14px] backdrop-blur-md"
                  >
                    <div className="text-[20px] font-extrabold text-white">{stat.value}</div>
                    <div className="mt-[4px] text-[12px] text-white/75">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex flex-col items-center justify-center bg-white px-4 py-8 sm:px-6 lg:col-span-5 lg:px-10 xl:px-12">
            <div className="w-full max-w-[440px] space-y-6">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Logo className="justify-center" />
                <div className="space-y-1 pt-2">
                  <h2 className="text-[28px] leading-[34px] font-extrabold tracking-tight text-[#141b2b]">
                    {t('login.title')}
                  </h2>
                  <p className="text-[14px] text-[#6B7280]">{t('login.subtitle')}</p>
                </div>
              </div>

              <div className="flex w-full items-center rounded-[12px] bg-[#F1F3FF] p-[4px]">
                <button
                  type="button"
                  onClick={() => setMode('phone')}
                  className={`flex-1 rounded-[10px] py-[10px] text-center text-[13px] font-semibold transition-all ${
                    mode === 'phone'
                      ? 'bg-white text-[#9d4300] shadow-sm'
                      : 'text-[#6B7280] hover:text-[#141b2b]'
                  }`}
                >
                  {t('login.mode.phone')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('email')}
                  className={`flex-1 rounded-[10px] py-[10px] text-center text-[13px] font-semibold transition-all ${
                    mode === 'email'
                      ? 'bg-white text-[#9d4300] shadow-sm'
                      : 'text-[#6B7280] hover:text-[#141b2b]'
                  }`}
                >
                  {t('login.mode.email')}
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === 'phone' ? (
                  <div className="space-y-2">
                    <label className="block text-[13px] font-semibold text-[#141b2b]" htmlFor="phone">
                      {t('login.phone')}
                    </label>
                    <div className="relative flex items-center rounded-[12px] border border-[#E5E7EB] bg-white transition-shadow focus-within:border-[#F97316]/50 focus-within:ring-2 focus-within:ring-[#F97316]/20">
                      <div className="flex items-center gap-[4px] px-[14px] py-[12px] text-[13px] font-bold text-[#141b2b]">
                        <span>UZ</span>
                        <span className="font-semibold text-[#6B7280]">+998</span>
                      </div>
                      <div className="h-[22px] w-px bg-[#E5E7EB]" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={phone.replace(/^\+998/, '')}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 9)
                          setPhone(`+998${digits}`)
                        }}
                        placeholder="(90) 123-45-67"
                        className="w-full bg-transparent px-[14px] py-[12px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[13px] font-semibold text-[#141b2b]" htmlFor="email">
                      {t('login.email')}
                    </label>
                    <div className="relative flex items-center rounded-[12px] border border-[#E5E7EB] bg-white transition-shadow focus-within:border-[#F97316]/50 focus-within:ring-2 focus-within:ring-[#F97316]/20">
                      <Icon name="mail" className="pl-[14px] pr-[6px] text-[20px] text-[#9CA3AF]" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="misol@fooduz.uz"
                        className="w-full bg-transparent py-[12px] pr-[14px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    className="block text-[13px] font-semibold text-[#141b2b]"
                    htmlFor="password"
                  >
                    {t('login.password')}
                  </label>
                  <div className="relative flex items-center rounded-[12px] border border-[#E5E7EB] bg-white transition-shadow focus-within:border-[#F97316]/50 focus-within:ring-2 focus-within:ring-[#F97316]/20">
                    <Icon name="lock" className="pl-[14px] pr-[6px] text-[20px] text-[#9CA3AF]" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      className="w-full bg-transparent py-[12px] pr-[8px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Parolni ko'rsatish yoki yashirish"
                      className="mr-[8px] p-[6px] text-[#9CA3AF] transition-colors hover:text-[#141b2b]"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <Icon
                        name={showPassword ? 'visibility_off' : 'visibility'}
                        className="text-[20px]"
                      />
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-[10px] bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-[8px] select-none">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-[16px] w-[16px] cursor-pointer rounded accent-[#F97316]"
                    />
                    <span className="text-[13px] text-[#6B7280]">{t('login.remember')}</span>
                  </label>
                  <Link
                    to="/parolni-tiklash"
                    className="text-[13px] font-semibold text-[#F97316] transition-colors hover:text-[#EA580C]"
                  >
                    {t('login.forgot')}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#F97316] px-[24px] py-[14px] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all hover:bg-[#EA580C] active:scale-[0.99] disabled:opacity-60"
                >
                  <span>{loading ? '...' : t('login.submit')}</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </button>
              </form>

              <div className="relative flex items-center justify-center py-1">
                <div className="h-px w-full bg-[#E5E7EB]" />
                <span className="absolute bg-white px-[12px] text-[12px] font-semibold tracking-wider text-[#9CA3AF] uppercase">
                  {t('common.or')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void handleGoogle()}
                disabled={loading}
                className="flex w-full items-center justify-center gap-[12px] rounded-[14px] border border-[#E5E7EB] bg-white px-[16px] py-[12px] text-[14px] font-semibold text-[#141b2b] transition-all hover:bg-[#F9F9FF] disabled:opacity-60"
              >
                <GoogleIcon />
                <span>{t('login.google')}</span>
              </button>

              <div className="pt-2 text-center">
                <p className="text-[14px] text-[#6B7280]">
                  {t('login.noAccount')}{' '}
                  <Link
                    to="/royxatdan-otish"
                    className="ml-[4px] text-[14px] font-bold text-[#9d4300] hover:underline"
                  >
                    {t('login.register')}
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-[6px] pt-2 text-[#9CA3AF]">
                <Icon name="lock" className="text-[14px]" />
                <span className="text-[12px]">{t('login.secure')}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

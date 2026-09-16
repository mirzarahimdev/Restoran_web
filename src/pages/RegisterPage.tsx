import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { GoogleIcon } from '../components/ui/GoogleIcon'
import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import { useLanguage } from '../i18n/LanguageContext'

const AUTH_FOOD_IMG =
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&h=1600&fit=crop'

const AVATAR_IMG =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop'

function PasswordChip({ label, valid }: { label: string; valid: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-[4px] text-[12px] font-semibold transition-colors ${
        valid ? 'text-[#F97316]' : 'text-[#9CA3AF]'
      }`}
    >
      <Icon name="check_circle" className="text-[16px]" filled={valid} />
      {label}
    </span>
  )
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('email already') || lower.includes('email allaqachon')) {
    return "Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasidan kiring."
  }
  if (lower.includes('phone already') || lower.includes('telefon')) {
    return "Bu telefon raqami allaqachon ro'yxatdan o'tgan. Kirish sahifasidan kiring."
  }
  if (lower.includes('value is not a valid email') || lower.includes('email')) {
    if (lower.includes('valid') || lower.includes('value_error')) {
      return "Email formati noto'g'ri"
    }
  }
  if (lower.includes('register failed')) return "Ro'yxatdan o'tish muvaffaqiyatsiz"
  return message
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { register, loginWithGoogle } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('+998')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = confirm.length > 0 && confirm === password

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (fullName.trim().length < 2) {
      setError("Ism va familiyani to'liq kiriting")
      return
    }
    const cleanPhone = phone.replace(/\s/g, '')
    if (cleanPhone.length < 13) {
      setError("Telefon raqamini to'liq kiriting (+998XXXXXXXXX)")
      return
    }
    if (!passwordsMatch || !hasLength || !hasUpper || !hasNumber) {
      setError('Parol talablari bajarilmagan')
      return
    }
    setLoading(true)
    try {
      await register({
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        password,
      })
      navigate('/')
    } catch (err) {
      setError(mapAuthError(err instanceof Error ? err.message : "Ro'yxatdan o'tish muvaffaqiyatsiz"))
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
      setError(err instanceof Error ? err.message : 'Google orqali ro‘yxatdan o‘tish muvaffaqiyatsiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#141b2b]">
      <main className="min-h-screen w-full">
        <div className="flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
          {/* Left storytelling panel */}
          <div className="relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden bg-[#141b2b] p-6 md:p-10 lg:w-[45%] lg:min-h-0 lg:p-12">
            <img
              alt="O'zbek gastronomiyasi"
              className="absolute top-0 right-0 bottom-0 left-[10px] h-full w-[calc(100%-10px)] scale-105 object-cover object-center"
              src={AUTH_FOOD_IMG}
            />
            <div className="absolute top-0 right-0 bottom-0 left-[10px] bg-gradient-to-t from-[#141b2b]/95 via-[#141b2b]/55 to-[#141b2b]/25" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-[10px]">
              <div className="inline-flex items-center gap-[8px] rounded-full bg-[#F97316] px-[14px] py-[8px] text-white shadow-md">
                <Icon name="restaurant" className="text-[16px]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  {t('register.badge.cuisine')}
                </span>
              </div>
              <div className="inline-flex items-center gap-[6px] rounded-full bg-[#FEA619] px-[12px] py-[7px] text-[12px] font-bold text-white shadow-md">
                <Icon name="verified" className="text-[16px]" filled />
                <span>{t('register.badge.halal')}</span>
              </div>
            </div>

            <div className="relative z-10 my-auto ml-[10px] flex flex-col gap-[12px] py-8">
              <div className="inline-flex max-w-md items-center gap-[12px] rounded-[16px] bg-[#141b2b]/55 px-[14px] py-[12px] text-white shadow-lg backdrop-blur-md">
                <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#F97316]/20 text-[#F97316]">
                  <Icon name="two_wheeler" className="text-[22px]" />
                </span>
                <div>
                  <p className="text-[15px] font-bold leading-tight">{t('register.citywide')}</p>
                  <p className="text-[12px] text-white/80">{t('register.avgTime')}</p>
                </div>
              </div>

              {[
                {
                  icon: 'bolt',
                  color: 'text-[#F97316]',
                  text: t('register.fast'),
                },
                {
                  icon: 'featured_seasonal_and_gifts',
                  color: 'text-[#F97316]',
                  text: t('register.bonus'),
                },
                {
                  icon: 'credit_card',
                  color: 'text-[#60A5FA]',
                  text: t('register.payments'),
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="inline-flex max-w-md items-center gap-[12px] rounded-[16px] bg-[#141b2b]/55 px-[14px] py-[12px] text-white shadow-lg backdrop-blur-md"
                >
                  <span
                    className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-white/10 ${item.color}`}
                  >
                    <Icon name={item.icon} className="text-[22px]" />
                  </span>
                  <span className="text-[14px] font-semibold leading-snug">{item.text}</span>
                </div>
              ))}

              <div className="mt-[8px] max-w-md rounded-[18px] bg-white p-[18px] text-[#141b2b] shadow-xl">
                <div className="mb-[8px] flex items-center gap-[2px] text-[#FEA619]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="text-[18px]" filled />
                  ))}
                </div>
                <blockquote className="mb-[14px] text-[14px] leading-[20px] font-medium text-[#141b2b]">
                  {t('register.quote')}
                </blockquote>
                <div className="flex items-center gap-[12px]">
                  <img
                    alt="Aziza Karimova"
                    className="h-[44px] w-[44px] rounded-full object-cover shadow-sm ring-2 ring-[#F97316]/40"
                    src={AVATAR_IMG}
                  />
                  <div>
                    <p className="text-[15px] font-bold text-[#141b2b]">Aziza Karimova</p>
                    <p className="text-[12px] text-[#6B7280]">{t('register.client')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-[8px] text-[12px] text-white/75">
              <span>© 2025 FoodUZ Logistics</span>
              <div className="flex gap-[8px] font-medium text-white">
                <span>Toshkent</span>
                <span>•</span>
                <span>Samarqand</span>
                <span>•</span>
                <span>Buxoro</span>
              </div>
            </div>
          </div>

          {/* Right registration form */}
          <div className="flex w-full items-center justify-center bg-[#F9F9FF] p-5 sm:p-8 lg:w-[55%] lg:p-10 xl:p-12">
            <div className="flex w-full max-w-[520px] flex-col gap-5 rounded-[24px] bg-white p-6 shadow-[0_12px_40px_rgba(20,27,43,0.08)] sm:p-8">
              <div className="flex flex-col items-center text-center">
                <Logo className="mb-3 justify-center" size="sm" />
                <h1 className="text-[28px] leading-[34px] font-extrabold tracking-tight text-[#141b2b]">
                  {t('register.title')}
                </h1>
                <p className="mt-1 text-[14px] text-[#6B7280]">{t('register.subtitle')}</p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-[#141b2b]">
                    {t('register.fullName')}
                  </label>
                  <div className="relative flex items-center">
                    <Icon
                      name="person"
                      className="pointer-events-none absolute left-[14px] text-[20px] text-[#6B7280]"
                    />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('register.fullNamePh')}
                      className="w-full rounded-[12px] bg-[#F1F3FF] py-[12px] pr-[14px] pl-[44px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:bg-white focus:ring-2 focus:ring-[#F97316]/25 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-[#141b2b]">
                    {t('register.phone')}
                  </label>
                  <div className="relative flex items-center">
                    <Icon
                      name="phone"
                      className="pointer-events-none absolute left-[14px] text-[20px] text-[#6B7280]"
                    />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 (__) ___-__-__"
                      className="w-full rounded-[12px] bg-[#F1F3FF] py-[12px] pr-[14px] pl-[44px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:bg-white focus:ring-2 focus:ring-[#F97316]/25 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-[#141b2b]">{t('register.email')}</label>
                  <div className="relative flex items-center">
                    <Icon
                      name="mail"
                      className="pointer-events-none absolute left-[14px] text-[20px] text-[#6B7280]"
                    />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full rounded-[12px] bg-[#F1F3FF] py-[12px] pr-[14px] pl-[44px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:bg-white focus:ring-2 focus:ring-[#F97316]/25 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-semibold text-[#141b2b]">
                      {t('register.password')}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('register.passwordPh')}
                        className="w-full rounded-[12px] bg-[#F1F3FF] py-[12px] pr-[40px] pl-[14px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:bg-white focus:ring-2 focus:ring-[#F97316]/25 focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-[10px] flex items-center text-[#6B7280] transition-colors hover:text-[#141b2b]"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <Icon
                          name={showPassword ? 'visibility_off' : 'visibility'}
                          className="text-[20px]"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-semibold text-[#141b2b]">
                      {t('register.confirm')}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        required
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder={t('register.confirmPh')}
                        className="w-full rounded-[12px] bg-[#F1F3FF] py-[12px] pr-[40px] pl-[14px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:bg-white focus:ring-2 focus:ring-[#F97316]/25 focus:outline-none"
                      />
                      <div
                        className={`pointer-events-none absolute right-[10px] flex items-center text-[#2D6A4F] transition-opacity ${
                          passwordsMatch ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Icon name="check_circle" className="text-[20px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px] pt-[2px]">
                  <PasswordChip label={t('register.rule.len')} valid={hasLength} />
                  <PasswordChip label={t('register.rule.upper')} valid={hasUpper} />
                  <PasswordChip label={t('register.rule.num')} valid={hasNumber} />
                </div>

                <label className="group flex cursor-pointer items-start gap-[10px] pt-1">
                  <input
                    required
                    type="checkbox"
                    className="mt-[2px] h-[16px] w-[16px] cursor-pointer rounded accent-[#F97316]"
                  />
                  <span className="select-none text-[13px] leading-snug text-[#6B7280]">
                    {t('register.termsBefore')}{' '}
                    <span className="font-semibold text-[#F97316]">{t('register.termsLink')}</span>{' '}
                    {t('register.termsMid')}{' '}
                    <span className="font-semibold text-[#F97316]">{t('register.privacyLink')}</span>{' '}
                    {t('register.termsAfter')}
                  </span>
                </label>

                {error && (
                  <div className="rounded-[10px] bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600">
                    <p>{error}</p>
                    {error.toLowerCase().includes('kirish') && (
                      <Link
                        to="/kirish"
                        className="mt-[6px] inline-block font-bold text-[#F97316] hover:underline"
                      >
                        Kirish sahifasiga o‘tish →
                      </Link>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#F97316] px-[24px] py-[14px] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all hover:bg-[#EA580C] active:scale-[0.99] disabled:opacity-60"
                >
                  <span>{loading ? '...' : t('register.submit')}</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-px w-full bg-[#E5E7EB]" />
                </div>
                <span className="relative bg-white px-[16px] text-[12px] font-semibold tracking-wider text-[#9CA3AF] uppercase">
                  {t('common.or')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void handleGoogle()}
                disabled={loading}
                className="flex w-full items-center justify-center gap-[12px] rounded-[14px] bg-[#F1F3FF] px-[16px] py-[12px] text-[14px] font-semibold text-[#141b2b] transition-all hover:bg-[#E9EDFF] disabled:opacity-60"
              >
                <GoogleIcon />
                <span>{t('register.google')}</span>
              </button>

              <div className="pt-1 text-center">
                <p className="text-[14px] text-[#6B7280]">
                  {t('register.hasAccount')}{' '}
                  <Link
                    to="/kirish"
                    className="ml-[4px] text-[14px] font-bold text-[#F97316] hover:underline"
                  >
                    {t('common.login')}
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

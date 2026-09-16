import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthHeader } from '../components/layout/AuthHeader'
import { Icon } from '../components/ui/Icon'
import { useLanguage } from '../i18n/LanguageContext'

const AUTH_FOOD_IMG =
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=1600&fit=crop'

const OTP_LENGTH = 6

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [phone, setPhone] = useState('(90) 456-78-45')
  const [step, setStep] = useState<1 | 2>(1)
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [seconds, setSeconds] = useState(0)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (seconds <= 0) return
    const id = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [seconds])

  const maskedPhone = `+998 ${phone || '(__) ___-__-__'}`
  const timerLabel = `00:${String(seconds).padStart(2, '0')}`

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault()
    if (!phone.trim()) return
    setStep(2)
    setSeconds(60)
    setOtp(Array(OTP_LENGTH).fill(''))
    window.setTimeout(() => inputsRef.current[0]?.focus(), 50)
  }

  const changeNumber = () => {
    setStep(1)
    setOtp(Array(OTP_LENGTH).fill(''))
    setSeconds(0)
  }

  const resendCode = () => {
    if (seconds > 0) return
    setSeconds(60)
    setOtp(Array(OTP_LENGTH).fill(''))
    inputsRef.current[0]?.focus()
  }

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!digits) return
    const next = Array(OTP_LENGTH).fill('')
    digits.split('').forEach((d, i) => {
      next[i] = d
    })
    setOtp(next)
    inputsRef.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus()
  }

  const confirmOtp = (e: FormEvent) => {
    e.preventDefault()
    if (otp.join('').length < OTP_LENGTH) return
    navigate('/kirish')
  }

  return (
    <div className="min-h-screen bg-[#F3F4F8] text-[#141b2b]">
      <AuthHeader />
      <main className="min-h-screen w-full pt-[64px]">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1280px] grid-cols-1 gap-[20px] px-[20px] py-[24px] lg:grid-cols-[1.05fr_1fr] lg:px-[32px] lg:py-[28px]">
          {/* Left panel */}
          <section className="relative overflow-hidden rounded-[24px] min-h-[420px] lg:min-h-0">
            <img
              src={AUTH_FOOD_IMG}
              alt="FoodUZ xavfsizlik"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b]/95 via-[#141b2b]/55 to-[#141b2b]/25" />

            <div className="relative z-10 flex h-full flex-col justify-between p-[22px] lg:p-[28px]">
              <div className="flex items-start justify-between gap-[12px]">
                <span className="inline-flex items-center gap-[8px] rounded-full bg-white/15 px-[12px] py-[7px] text-[11px] font-bold tracking-[0.08em] text-white uppercase backdrop-blur-md">
                  <span className="h-[8px] w-[8px] rounded-full bg-[#F97316]" />
                  {t('forgot.badge')}
                </span>
                <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                  <Icon name="shield" className="text-[20px]" />
                </span>
              </div>

              <div className="max-w-[420px]">
                <p className="text-[11px] font-bold tracking-[0.14em] text-[#FFDBCA] uppercase">
                  {t('forgot.eyebrow')}
                </p>
                <h1 className="mt-[10px] text-[32px] leading-[38px] font-extrabold tracking-tight text-white lg:text-[36px] lg:leading-[42px]">
                  {t('forgot.title')}
                </h1>
                <p className="mt-[12px] text-[14px] leading-[22px] text-white/90">
                  {t('forgot.subtitle')}
                </p>
              </div>

              <div className="space-y-[12px]">
                <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                  <div className="rounded-[14px] bg-[#141b2b]/55 px-[14px] py-[12px] text-white backdrop-blur-md">
                    <Icon name="lock" className="mb-[8px] text-[20px] text-[#FFDBCA]" />
                    <p className="text-[13px] font-bold">{t('forgot.smsTitle')}</p>
                    <p className="mt-[2px] text-[12px] text-white/75">{t('forgot.smsSub')}</p>
                  </div>
                  <div className="rounded-[14px] bg-[#141b2b]/55 px-[14px] py-[12px] text-white backdrop-blur-md">
                    <Icon name="security" className="mb-[8px] text-[20px] text-[#FFDBCA]" />
                    <p className="text-[13px] font-bold">{t('forgot.encTitle')}</p>
                    <p className="mt-[2px] text-[12px] text-white/75">{t('forgot.encSub')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[12px] rounded-[14px] bg-[#141b2b]/70 px-[14px] py-[12px] text-white backdrop-blur-md">
                  <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#F97316] text-white">
                    <Icon name="call" className="text-[20px]" />
                  </span>
                  <div>
                    <p className="text-[12px] text-white/70">{t('forgot.support')}</p>
                    <p className="text-[15px] font-bold">+998 (71) 200-00-00</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right cards */}
          <section className="flex flex-col gap-[16px]">
            {/* Step 1 */}
            <form
              onSubmit={sendCode}
              className={`rounded-[20px] bg-white p-[20px] shadow-[0_8px_28px_rgba(20,27,43,0.06)] transition-opacity lg:p-[22px] ${
                step === 2 ? 'opacity-70' : 'opacity-100'
              }`}
            >
              <div className="mb-[16px] flex items-start gap-[12px]">
                <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#FFF4ED] text-[#F97316]">
                  <Icon name="lock_reset" className="text-[24px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <h2 className="text-[18px] font-extrabold text-[#141b2b]">
                      {t('forgot.step1')}
                    </h2>
                    <span className="rounded-full bg-[#FEF3C7] px-[10px] py-[3px] text-[11px] font-bold text-[#92400E]">
                      {t('forgot.step1Badge')}
                    </span>
                  </div>
                  <p className="mt-[4px] text-[13px] text-[#6B7280]">{t('forgot.step1Sub')}</p>
                </div>
              </div>

              <label className="mb-[6px] block text-[13px] font-semibold text-[#141b2b]">
                {t('forgot.phone')}
              </label>
              <div className="mb-[16px] flex flex-col gap-[10px] sm:flex-row">
                <div className="relative flex min-w-0 flex-1 items-center rounded-[12px] bg-[#F1F3FF]">
                  <div className="flex items-center gap-[6px] px-[12px] py-[12px] text-[13px] font-bold text-[#141b2b]">
                    <span aria-hidden>🇺🇿</span>
                    <span>UZ</span>
                  </div>
                  <div className="h-[22px] w-px bg-[#D7DCEC]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={step === 2}
                    placeholder="+998 (90) 456-78-45"
                    className="w-full bg-transparent px-[12px] py-[12px] text-[14px] text-[#141b2b] placeholder:text-[#9CA3AF] focus:outline-none disabled:opacity-70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={step === 2}
                  className="inline-flex h-[48px] shrink-0 items-center justify-center gap-[6px] rounded-[12px] bg-[#F97316] px-[18px] text-[14px] font-bold text-white transition-colors hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t('forgot.send')}
                  <Icon name="chevron_right" className="text-[20px]" />
                </button>
              </div>

              <Link
                to="/kirish"
                className="inline-flex items-center gap-[6px] text-[13px] font-semibold text-[#6B7280] hover:text-[#141b2b]"
              >
                <Icon name="arrow_back" className="text-[16px]" />
                {t('forgot.backLogin')}
              </Link>
            </form>

            {/* Step 2 */}
            <form
              onSubmit={confirmOtp}
              className="rounded-[20px] bg-white p-[20px] shadow-[0_8px_28px_rgba(20,27,43,0.06)] lg:p-[22px]"
            >
              <div className="mb-[14px] flex items-start gap-[12px]">
                <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#FFF4ED] text-[#F97316]">
                  <Icon name="mail" className="text-[24px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <h2 className="text-[18px] font-extrabold text-[#141b2b]">
                      {t('forgot.step2')}
                    </h2>
                    <span className="rounded-full bg-[#FFF4ED] px-[10px] py-[3px] text-[11px] font-bold text-[#9d4300]">
                      {t('forgot.step2Badge')}
                    </span>
                  </div>
                  <p className="mt-[6px] text-[13px] leading-[18px] text-[#6B7280]">
                    {t('forgot.codeSent', { phone: maskedPhone }).split(maskedPhone)[0]}
                    <span className="font-semibold text-[#141b2b]">{maskedPhone}</span>
                    {t('forgot.codeSent', { phone: maskedPhone }).split(maskedPhone)[1] ?? ''}{' '}
                    <button
                      type="button"
                      onClick={changeNumber}
                      className="font-semibold text-[#F97316] hover:underline"
                    >
                      {t('forgot.changeNumber')}
                    </button>
                  </p>
                </div>
              </div>

              <div className="mb-[14px] flex flex-wrap justify-center gap-[8px] sm:justify-start">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setDigit(index, e.target.value)}
                    onKeyDown={(e) => onKeyDown(index, e)}
                    onPaste={onPaste}
                    disabled={step === 1}
                    className={`h-[52px] w-[44px] rounded-[12px] border-2 bg-white text-center text-[22px] font-extrabold text-[#141b2b] outline-none transition-colors sm:w-[48px] ${
                      digit ? 'border-[#F97316]' : 'border-[#E5E7EB]'
                    } focus:border-[#F97316] disabled:bg-[#F9FAFB] disabled:opacity-60`}
                    aria-label={`OTP ${index + 1}`}
                  />
                ))}
              </div>

              <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[10px] text-[13px]">
                <span className="inline-flex items-center gap-[6px] font-semibold text-[#6B7280]">
                  <Icon name="timer" className="text-[18px] text-[#F97316]" />
                  {t('forgot.resendTimer', { time: timerLabel })}
                </span>
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={step === 1 || seconds > 0}
                  className="inline-flex items-center gap-[4px] font-semibold text-[#F97316] hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                >
                  <Icon name="refresh" className="text-[16px]" />
                  {t('forgot.resend')}
                </button>
              </div>

              <button
                type="submit"
                disabled={step === 1 || otp.join('').length < OTP_LENGTH}
                className="flex w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#F97316] px-[24px] py-[14px] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(249,115,22,0.28)] transition-all hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('forgot.confirm')}
                <Icon name="arrow_forward" className="text-[20px]" />
              </button>

              <div className="mt-[14px] flex flex-wrap items-center justify-between gap-[10px] text-[12px] text-[#6B7280]">
                <span>{t('forgot.noCode')}</span>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = 'tel:+998712000000'
                  }}
                  className="inline-flex cursor-pointer items-center gap-[4px] font-semibold text-[#584237] hover:text-[#141b2b]"
                >
                  <Icon name="call" className="text-[16px] text-[#F97316]" />
                  {t('forgot.call')}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}

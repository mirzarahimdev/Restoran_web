import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { translations } from './translations'
import { LANG_STORAGE_KEY, type LanguageId } from './types'

type LanguageContextValue = {
  lang: LanguageId
  setLang: (lang: LanguageId) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLang(): LanguageId {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored === 'uzb' || stored === 'rus' || stored === 'eng') return stored
  } catch {
    /* ignore */
  }
  return 'uzb'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageId>(() =>
    typeof window === 'undefined' ? 'uzb' : readStoredLang(),
  )

  const setLang = useCallback((next: LanguageId) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'uzb' ? 'uz' : lang === 'rus' ? 'ru' : 'en'
  }, [lang])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = translations[lang]
      let text = dict[key] ?? translations.uzb[key] ?? key
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{{${name}}}`, String(value))
        }
      }
      return text
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

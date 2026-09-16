export type LanguageId = 'uzb' | 'rus' | 'eng'

export type TranslationDict = Record<string, string>

export const languages = [
  { id: 'uzb' as const, code: 'uzb', label: "O'zbekcha" },
  { id: 'rus' as const, code: 'rus', label: 'Русский' },
  { id: 'eng' as const, code: 'eng', label: 'English' },
]

export const LANG_STORAGE_KEY = 'fooduz-lang'

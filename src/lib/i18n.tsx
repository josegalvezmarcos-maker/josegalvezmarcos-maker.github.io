import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react'

export type Lang = 'es' | 'en'
export const LANGS: Lang[] = ['es', 'en']

/** A string available in every supported language. */
export type Localized = Record<Lang, string>

const STORAGE_KEY = 'apc-lang'
const TITLES: Localized = {
  es: 'Operaciones a pie de campo · José Antonio Gálvez Marcos',
  en: 'Operations on the Floor · José Antonio Gálvez Marcos',
}

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Pick the current-language variant of a localized value. */
  tr: <T>(value: Record<Lang, T>) => T
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

// Tiny external store over localStorage so every reader stays in sync.
const listeners = new Set<() => void>()

function readStoredLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // The server snapshot is always Spanish so hydration matches the server HTML.
  const lang = useSyncExternalStore(
    subscribe,
    readStoredLang,
    () => 'es' as Lang,
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = TITLES[lang]
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable
    }
    listeners.forEach((l) => l())
  }, [])

  const tr = useCallback(<T,>(value: Record<Lang, T>) => value[lang], [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

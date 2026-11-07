import { LANGS, useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const t = useStrings().langToggle

  return (
    <div
      role="group"
      aria-label={t.label}
      className="ml-1 inline-flex h-9 items-center rounded-md border border-border bg-card/60 p-0.5"
    >
      {LANGS.map((l) => {
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={active}
            aria-label={t[l]}
            onClick={() => setLang(l)}
            className={cn(
              'h-full rounded-[5px] px-2.5 font-data text-[11px] font-bold tracking-wider uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}

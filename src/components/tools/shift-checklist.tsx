import { useEffect, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { CHECKLIST_ITEMS } from '@/data/content'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { useStrings } from '@/data/ui-strings'

const STORAGE_KEY = 'apc-checklist'

function getStatus(pct: number, t: ReturnType<typeof useStrings>['checklist']) {
  if (pct === 100)
    return {
      label: t.ready,
      className: 'bg-success/15 text-success border-success/40',
      bar: 'bg-success',
    }
  if (pct >= 60)
    return {
      label: t.almost,
      className: 'bg-warning/15 text-warning border-warning/40',
      bar: 'bg-warning',
    }
  return {
    label: t.notReady,
    className: 'bg-destructive/15 text-red-400 border-destructive/40',
    bar: 'bg-destructive',
  }
}

export function ShiftChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const { tr } = useLanguage()
  const t = useStrings().checklist

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setDone(JSON.parse(saved))
    } catch {
      // ignore corrupt storage
    }
  }, [])

  const update = (next: Record<string, boolean>) => {
    setDone(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage unavailable
    }
  }

  const completed = CHECKLIST_ITEMS.filter((i) => done[i.id]).length
  const pct = Math.round((completed / CHECKLIST_ITEMS.length) * 100)
  const status = getStatus(pct, t)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <ul className="space-y-2.5">
        {CHECKLIST_ITEMS.map((item, idx) => {
          const checked = !!done[item.id]
          return (
            <li key={item.id}>
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => update({ ...done, [item.id]: !checked })}
                className={cn(
                  'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                  checked
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-border bg-background/40 hover:border-primary/40',
                )}
              >
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-lg border font-data text-xs font-bold transition-all motion-reduce:transition-none',
                    checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input text-muted-foreground',
                  )}
                >
                  {checked ? <Check className="size-4" /> : idx + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block font-medium',
                      checked && 'text-foreground',
                    )}
                  >
                    {tr(item.label)}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {tr(item.detail)}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative h-6 w-11 shrink-0 rounded-full transition-colors motion-reduce:transition-none',
                    checked ? 'bg-primary' : 'bg-input',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 size-4 rounded-full bg-white transition-transform motion-reduce:transition-none',
                      checked && 'translate-x-5',
                    )}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <aside className="flex flex-col rounded-2xl border border-border bg-background/50 p-6">
        <p className="text-sm text-muted-foreground">{t.status}</p>
        <p
          className="mt-2 font-data text-6xl font-bold tabular-nums"
          aria-live="polite"
        >
          {pct}
          <span className="text-2xl text-muted-foreground">%</span>
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-input">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 motion-reduce:transition-none',
              status.bar,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={cn(
            'mt-4 inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-sm font-medium',
            status.className,
          )}
        >
          <span className={cn('size-2 rounded-full', status.bar)} />
          {status.label}
        </span>
        <p className="mt-3 text-sm text-muted-foreground">
          {t.progress(completed, CHECKLIST_ITEMS.length)}
        </p>
        <button
          type="button"
          onClick={() => update({})}
          className="mt-auto inline-flex items-center gap-2 self-start rounded-md pt-6 text-sm text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
        >
          <RotateCcw className="size-4" />
          {t.reset}
        </button>
      </aside>
    </div>
  )
}

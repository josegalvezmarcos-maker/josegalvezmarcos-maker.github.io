import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Panel({
  title,
  hint,
  action,
  className,
  children,
}: {
  title?: string
  hint?: string
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card p-4 sm:p-5',
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="font-display text-sm font-semibold">{title}</h2>
            )}
            {hint && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {hint}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export type Tone = 'neutral' | 'good' | 'warn' | 'bad'

const TONE_DOT: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  good: 'bg-success',
  warn: 'bg-warning',
  bad: 'bg-destructive',
}

export function Stat({
  label,
  value,
  note,
  tone = 'neutral',
}: {
  label: string
  value: string
  note?: string
  tone?: Tone
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        {tone !== 'neutral' && (
          <span className={cn('size-2 rounded-full', TONE_DOT[tone])} />
        )}
        {label}
      </p>
      <p className="mt-2 font-data text-2xl font-bold tracking-tight">
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
  compact,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  compact?: boolean
}) {
  const [draft, setDraft] = useState<string | null>(null)

  const clamp = (n: number) =>
    Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.max(min, n))

  return (
    <label className="block min-w-0">
      <span
        className={cn(
          'mb-1.5 block text-xs text-muted-foreground',
          compact && 'sr-only',
        )}
      >
        {label}
      </span>
      <span className="flex h-9 items-center rounded-md border border-input bg-background/60 px-2.5 focus-within:ring-2 focus-within:ring-ring">
        <input
          type="number"
          inputMode="decimal"
          value={draft ?? value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            setDraft(e.target.value)
            const n = Number(e.target.value)
            if (e.target.value !== '' && Number.isFinite(n)) onChange(clamp(n))
          }}
          onBlur={() => setDraft(null)}
          className="w-full min-w-0 bg-transparent font-data text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="ml-1 shrink-0 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </span>
    </label>
  )
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  format?: (v: number) => string
}) {
  const fill = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        {label}
        <span className="font-data text-sm font-bold text-foreground">
          {format ? format(value) : value}
        </span>
      </span>
      <input
        type="range"
        className="range w-full"
        value={value}
        min={min}
        max={max}
        step={step}
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-lg border border-border bg-background/60 p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
            o.value === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ToolHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="signage text-3xl leading-[0.95] sm:text-4xl">{title}</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      )}
    </div>
  )
}

export function numberFormat(lang: string, digits = 0) {
  const nf = new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'es-ES', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    useGrouping: true,
  })
  return (n: number) => (Number.isFinite(n) ? nf.format(n) : '∞')
}

export function loadTone(load: number): Tone {
  if (load > 1) return 'bad'
  if (load >= 0.9) return 'warn'
  return 'good'
}

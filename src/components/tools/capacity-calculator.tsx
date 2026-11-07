import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Gauge, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStrings } from '@/data/ui-strings'

interface Inputs {
  workers: number
  hours: number
  rate: number
  absenteeism: number
  breakMin: number
  margin: number
  volume: number
}

const DEFAULTS: Inputs = {
  workers: 25,
  hours: 8,
  rate: 120,
  absenteeism: 8,
  breakMin: 30,
  margin: 10,
  volume: 18000,
}

const FIELDS: {
  key: keyof Inputs
  min: number
  max: number
  step: number
}[] = [
  { key: 'workers', min: 1, max: 500, step: 1 },
  { key: 'hours', min: 1, max: 12, step: 0.5 },
  { key: 'rate', min: 1, max: 1000, step: 1 },
  { key: 'absenteeism', min: 0, max: 60, step: 1 },
  { key: 'breakMin', min: 0, max: 120, step: 5 },
  { key: 'margin', min: 0, max: 40, step: 1 },
  { key: 'volume', min: 0, max: 1000000, step: 100 },
]

const makeFmt = (locale: string) => {
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  return (n: number) => nf.format(Math.max(0, Math.round(n)))
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export function CapacityCalculator() {
  const t = useStrings().capacity
  const fmt = makeFmt(t.locale)
  const [raw, setRaw] = useState<Record<keyof Inputs, string>>(
    () =>
      Object.fromEntries(
        Object.entries(DEFAULTS).map(([k, v]) => [k, String(v)]),
      ) as Record<keyof Inputs, string>,
  )

  const v = Object.fromEntries(
    FIELDS.map((f) => {
      const n = Number(raw[f.key].replace(',', '.'))
      return [f.key, Number.isFinite(n) ? clamp(n, f.min, f.max) : f.min]
    }),
  ) as unknown as Inputs

  const gross = v.workers * v.hours * v.rate
  const present = v.workers * (1 - v.absenteeism / 100)
  const productiveHours = Math.max(0, v.hours - v.breakMin / 60)
  const real = present * productiveHours * v.rate
  const effective = real * (1 - v.margin / 100)
  const target = Math.floor(effective / 50) * 50
  const perPersonHour =
    present > 0 && productiveHours > 0 ? target / present / productiveHours : 0

  const absLoss =
    gross - v.workers * (1 - v.absenteeism / 100) * v.hours * v.rate
  const breakLoss = present * (v.breakMin / 60) * v.rate
  const marginLoss = real - effective

  const unitsPerPerson =
    productiveHours * v.rate * (1 - v.margin / 100) * (1 - v.absenteeism / 100)
  const neededWorkers =
    unitsPerPerson > 0 ? Math.ceil(v.volume / unitsPerPerson) : 0
  const load = effective > 0 ? (v.volume / effective) * 100 : 0

  const status =
    v.volume <= 0 ? null : load > 100 ? 'over' : load >= 90 ? 'limit' : 'ok'

  const pct = (n: number) => (gross > 0 ? (n / gross) * 100 : 0)
  const segments = [
    { label: t.segments.effective, value: effective, className: 'bg-primary' },
    {
      label: t.segments.margin,
      value: marginLoss,
      className: 'bg-blue-300/60',
    },
    {
      label: t.segments.breaks,
      value: breakLoss,
      className: 'bg-amber-400/70',
    },
    {
      label: t.segments.absenteeism,
      value: absLoss,
      className: 'bg-rose-400/70',
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        aria-label={t.formLabel}
      >
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className={cn(f.key === 'volume' && 'sm:col-span-2')}
          >
            <label
              htmlFor={`cap-${f.key}`}
              className="text-sm font-medium text-foreground/90"
            >
              {t.fields[f.key].label}
            </label>
            <div className="mt-1.5 flex items-center rounded-lg border border-input bg-background/60 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 motion-reduce:transition-none">
              <input
                id={`cap-${f.key}`}
                type="number"
                inputMode="decimal"
                min={f.min}
                max={f.max}
                step={f.step}
                value={raw[f.key]}
                onChange={(e) =>
                  setRaw((r) => ({ ...r, [f.key]: e.target.value }))
                }
                className="h-11 w-full min-w-0 bg-transparent px-3 font-data text-base outline-none"
              />
              <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                {t.fields[f.key].unit}
              </span>
            </div>
            {t.fields[f.key].help && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t.fields[f.key].help}
              </p>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRaw(
              Object.fromEntries(
                Object.entries(DEFAULTS).map(([k, val]) => [k, String(val)]),
              ) as Record<keyof Inputs, string>,
            )
          }
          className="justify-self-start text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t.resetValues}
        </button>
      </form>

      <div className="space-y-4" aria-live="polite">
        <div className="grid grid-cols-2 gap-3">
          <Metric label={t.gross} value={fmt(gross)} unit={t.units} />
          <Metric
            label={t.effective}
            value={fmt(effective)}
            unit={t.units}
            highlight
          />
          <Metric label={t.target} value={fmt(target)} unit={t.units} />
          <Metric
            label={t.perPerson}
            value={perPersonHour.toFixed(0)}
            unit={t.unitsPerHour}
          />
        </div>

        <div className="rounded-2xl border border-border bg-background/50 p-5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Gauge className="size-4 text-primary" />
            {t.breakdown}
          </p>
          <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-input">
            {segments.map((s) => (
              <div
                key={s.label}
                className={cn(
                  'h-full transition-all duration-500 motion-reduce:transition-none',
                  s.className,
                )}
                style={{ width: `${pct(s.value)}%` }}
              />
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className={cn('size-2 rounded-full', s.className)} />
                <span className="text-muted-foreground">{s.label}</span>
                <span className="ml-auto font-data">
                  {pct(s.value).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {t.presence(fmt(present), productiveHours.toFixed(1))}
          </p>
        </div>

        {status && (
          <div
            role={status === 'over' ? 'alert' : 'status'}
            className={cn(
              'flex gap-3 rounded-2xl border p-4',
              status === 'over' && 'border-destructive/50 bg-destructive/10',
              status === 'limit' && 'border-warning/50 bg-warning/10',
              status === 'ok' && 'border-success/40 bg-success/10',
            )}
          >
            {status === 'ok' ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            ) : (
              <AlertTriangle
                className={cn(
                  'mt-0.5 size-5 shrink-0',
                  status === 'over' ? 'text-red-400' : 'text-warning',
                )}
              />
            )}
            <div className="text-sm">
              <p className="font-semibold">
                {status === 'over' && t.over}
                {status === 'limit' && t.limit}
                {status === 'ok' && t.ok}
                <span className="ml-2 font-data font-bold">
                  {load.toFixed(0)}%
                </span>
              </p>
              <p className="mt-1 text-muted-foreground">
                {status === 'over' &&
                  t.overText(fmt(v.volume - effective), neededWorkers)}
                {status === 'limit' && t.limitText}
                {status === 'ok' && t.okText(fmt(effective - v.volume))}
              </p>
            </div>
          </div>
        )}

        <p className="flex gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t.note}
        </p>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  unit,
  highlight,
}: {
  label: string
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4',
        highlight
          ? 'border-primary/50 bg-primary/10'
          : 'border-border bg-background/50',
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-data text-xl font-bold tabular-nums sm:text-2xl">
        {value}
        <span className="ml-1 text-xs font-medium text-muted-foreground">
          {unit}
        </span>
      </p>
    </div>
  )
}

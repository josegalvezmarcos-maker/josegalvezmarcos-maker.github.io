import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Copy, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  SECTORS,
  kpiStatus,
  sectorById,
  type Kpi,
  type KpiStatus,
  type SectorId,
} from '@/data/sectors'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { kpiPreset, useWorkspace } from '@/lib/workspace'
import { Panel, ToolHeader, numberFormat } from '../primitives'
import { ShareButton } from '../share-button'

const STATUS_STYLE: Record<KpiStatus, { dot: string; ring: string }> = {
  met: { dot: 'bg-success', ring: 'border-success/40' },
  close: { dot: 'bg-warning', ring: 'border-warning/40' },
  off: { dot: 'bg-destructive', ring: 'border-destructive/50' },
  empty: { dot: 'bg-muted-foreground', ring: 'border-border' },
}

function Sparkline({
  values,
  target,
  label,
}: {
  values: (number | null)[]
  target: number
  label: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 240
  const H = 64
  const nums = values.filter((v): v is number => v !== null)
  if (nums.length === 0) return <div className="h-16" />
  const lo = Math.min(...nums, target)
  const hi = Math.max(...nums, target)
  const span = hi - lo || 1
  const x = (i: number) => 4 + (i / Math.max(values.length - 1, 1)) * (W - 8)
  const y = (v: number) => H - 6 - ((v - lo) / span) * (H - 12)
  let d = ''
  values.forEach((v, i) => {
    if (v === null) return
    d += `${d && values[i - 1] !== null ? 'L' : 'M'}${x(i)},${y(v)}`
  })
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-16 w-full"
        role="img"
        aria-label={label}
        onMouseLeave={() => setHover(null)}
      >
        <line
          x1={0}
          x2={W}
          y1={y(target)}
          y2={y(target)}
          stroke="var(--chart-plan)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <path d={d} fill="none" stroke="var(--chart-actual)" strokeWidth={2} />
        {values.map((v, i) =>
          v === null ? null : (
            <g key={i}>
              <circle
                cx={x(i)}
                cy={y(v)}
                r={i === hover ? 4.5 : i === values.length - 1 ? 3.5 : 0}
                fill="var(--chart-actual)"
                stroke="var(--card)"
                strokeWidth={2}
              />
              <rect
                x={x(i) - W / values.length / 2}
                y={0}
                width={W / values.length}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          ),
        )}
      </svg>
      {hover !== null && values[hover] !== null && (
        <span className="pointer-events-none absolute -top-1 right-0 rounded border border-border bg-popover px-1.5 py-0.5 font-data text-[10px]">
          S{hover + 1}: {values[hover]}
        </span>
      )}
    </div>
  )
}

export function KpiBoard() {
  const { tr, lang } = useLanguage()
  const { workspace, update } = useWorkspace()
  const k = workspace.kpis
  const sector = sectorById(k.sector)
  const fmt = numberFormat(lang, 1)
  const fmt2 = numberFormat(lang, 2)
  const show = (kpi: Kpi, v: number) =>
    kpi.unit === '€' || Math.abs(v) < 10 ? fmt2(v) : fmt(v)

  const patch = (next: Partial<typeof k>) =>
    update((w) => ({ ...w, kpis: { ...w.kpis, ...next } }))

  const series = (kpi: Kpi) =>
    Array.from({ length: k.weeks }, (_, i) => k.values[kpi.id]?.[i] ?? null)

  const setValue = (kpi: Kpi, week: number, raw: string) => {
    const next = series(kpi)
    const n = Number(raw.replace(',', '.'))
    next[week] = raw.trim() === '' || !Number.isFinite(n) ? null : n
    patch({ values: { ...k.values, [kpi.id]: next } })
  }

  const lastOf = (kpi: Kpi) => {
    const s = series(kpi)
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] !== null)
        return {
          value: s[i] as number,
          index: i,
          prev:
            s
              .slice(0, i)
              .reverse()
              .find((v) => v !== null) ?? null,
        }
    }
    return null
  }

  const statuses = sector.kpis.map((kpi) =>
    kpiStatus(kpi, lastOf(kpi)?.value, k.targets[kpi.id] ?? kpi.target),
  )
  const met = statuses.filter((s) => s === 'met').length

  const statusLabel: Record<KpiStatus, string> = {
    met: tr({ es: 'En objetivo', en: 'On target' }),
    close: tr({ es: 'Cerca', en: 'Close' }),
    off: tr({ es: 'Fuera', en: 'Off target' }),
    empty: tr({ es: 'Sin datos', en: 'No data' }),
  }

  const copySummary = async () => {
    const lines = [
      `*${tr({ es: 'KPIs', en: 'KPIs' })} · ${tr(sector.name)}*`,
      ...sector.kpis.map((kpi, i) => {
        const last = lastOf(kpi)
        const target = k.targets[kpi.id] ?? kpi.target
        return `- ${tr(kpi.label)}: ${last ? show(kpi, last.value) : '—'} ${kpi.unit} (${tr({ es: 'objetivo', en: 'target' })} ${show(kpi, target)}) · ${statusLabel[statuses[i]]}`
      }),
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      toast.success(tr({ es: 'Resumen copiado', en: 'Summary copied' }))
    } catch {
      toast.error(tr({ es: 'No se pudo copiar', en: 'Could not copy' }))
    }
  }

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Tablero de KPIs', en: 'KPI board' })}
        description={tr({
          es: 'Elige el tipo de operación y tendrás los indicadores que de verdad se miran en ella, con su fórmula. Anota cada semana y el tablero marca qué está en objetivo. Los datos de ejemplo son ficticios y los objetivos, orientativos: ajústalos a tu contrato.',
          en: 'Pick the type of operation and get the indicators that really matter there, with their formula. Log each week and the board flags what is on target. Example data is fictional and targets are indicative: adjust them to your contract.',
        })}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copySummary()}
            >
              <Copy />
              {tr({ es: 'Copiar resumen', en: 'Copy summary' })}
            </Button>
            <ShareButton tool="kpis" />
          </>
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {SECTORS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={s.id === k.sector}
            onClick={() =>
              update((w) => ({ ...w, kpis: kpiPreset(s.id as SectorId) }))
            }
            className={cn(
              'shrink-0 rounded-lg border px-3 py-2 text-left text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
              s.id === k.sector
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary/60 hover:text-foreground',
            )}
          >
            <span className="block font-data text-[10px] opacity-70">
              {s.code}
            </span>
            <span className="font-medium">{tr(s.name)}</span>
          </button>
        ))}
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        {tr({
          es: 'Cambiar de tipo carga sus datos de ejemplo y sustituye lo que hubiera.',
          en: 'Switching type loads its example data and replaces what was there.',
        })}{' '}
        <span className="text-foreground">
          {tr({
            es: `${met} de ${sector.kpis.length} en objetivo.`,
            en: `${met} of ${sector.kpis.length} on target.`,
          })}
        </span>
      </p>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {sector.kpis.map((kpi, i) => {
          const last = lastOf(kpi)
          const target = k.targets[kpi.id] ?? kpi.target
          const status = statuses[i]
          const delta =
            last && last.prev !== null ? last.value - last.prev : null
          const better =
            delta === null || delta === 0
              ? null
              : kpi.higherIsBetter
                ? delta > 0
                : delta < 0
          return (
            <li
              key={kpi.id}
              className={cn(
                'rounded-xl border bg-card p-4',
                STATUS_STYLE[status].ring,
              )}
            >
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full',
                    STATUS_STYLE[status].dot,
                  )}
                />
                <span className="truncate">{tr(kpi.label)}</span>
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="font-data text-2xl font-bold">
                  {last ? show(kpi, last.value) : '—'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {kpi.unit}
                </span>
                {delta !== null && delta !== 0 && (
                  <span
                    className={cn(
                      'ml-auto inline-flex items-center font-data text-xs',
                      better ? 'text-success' : 'text-destructive-foreground',
                    )}
                  >
                    {delta > 0 ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : (
                      <ArrowDownRight className="size-3.5" />
                    )}
                    {show(kpi, Math.abs(delta))}
                  </span>
                )}
                {delta === 0 && (
                  <Minus className="ml-auto size-3.5 text-muted-foreground" />
                )}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {statusLabel[status]} · {tr({ es: 'objetivo', en: 'target' })}{' '}
                {kpi.higherIsBetter ? '≥' : '≤'} {show(kpi, target)}
              </p>
              <div className="mt-2">
                <Sparkline
                  values={series(kpi)}
                  target={target}
                  label={`${tr(kpi.label)}: ${last ? show(kpi, last.value) : '—'} ${kpi.unit}`}
                />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {tr(kpi.formula)}
              </p>
            </li>
          )
        })}
      </ul>
      <ul className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[var(--chart-actual)]" />
          {tr({ es: 'Valor semanal', en: 'Weekly value' })}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-dashed border-[var(--chart-plan)]" />
          {tr({ es: 'Objetivo', en: 'Target' })}
        </li>
      </ul>

      <Panel
        className="mt-4"
        title={tr({ es: 'Registro semanal', en: 'Weekly log' })}
        hint={tr({
          es: 'Escribe el valor de cada semana. El objetivo también se edita.',
          en: 'Enter each week’s value. The target is editable too.',
        })}
        action={
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              aria-label={tr({ es: 'Quitar semana', en: 'Remove week' })}
              disabled={k.weeks <= 4}
              onClick={() => patch({ weeks: k.weeks - 1 })}
            >
              <Minus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={tr({ es: 'Añadir semana', en: 'Add week' })}
              disabled={k.weeks >= 26}
              onClick={() => patch({ weeks: k.weeks + 1 })}
            >
              <Plus />
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="pb-2 text-left font-normal">KPI</th>
                <th className="w-20 pb-2 font-normal">
                  {tr({ es: 'Objetivo', en: 'Target' })}
                </th>
                {Array.from({ length: k.weeks }, (_, w) => (
                  <th key={w} className="w-16 pb-2 font-data font-normal">
                    S{w + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sector.kpis.map((kpi) => (
                <tr key={kpi.id} className="border-t border-border/60">
                  <td className="py-1.5 pr-2 text-xs">
                    {tr(kpi.label)}{' '}
                    <span className="text-muted-foreground">({kpi.unit})</span>
                  </td>
                  <td className="p-0.5">
                    <input
                      type="number"
                      step="any"
                      value={k.targets[kpi.id] ?? kpi.target}
                      aria-label={`${tr({ es: 'Objetivo', en: 'Target' })}: ${tr(kpi.label)}`}
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        if (e.target.value !== '' && Number.isFinite(n))
                          patch({ targets: { ...k.targets, [kpi.id]: n } })
                      }}
                      className="h-8 w-full rounded border border-primary/40 bg-background/60 px-1 text-center font-data text-xs outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  {series(kpi).map((v, w) => (
                    <td key={w} className="p-0.5">
                      <input
                        type="number"
                        step="any"
                        value={v ?? ''}
                        aria-label={`${tr(kpi.label)} S${w + 1}`}
                        onChange={(e) => setValue(kpi, w, e.target.value)}
                        className="h-8 w-full rounded border border-input bg-background/60 px-1 text-center font-data text-xs outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

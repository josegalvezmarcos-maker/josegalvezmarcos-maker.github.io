import { useMemo, useState } from 'react'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { planShift, trackPace, type Zone } from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'
import {
  NumberField,
  Panel,
  SliderField,
  Stat,
  ToolHeader,
  loadTone,
  numberFormat,
} from '../primitives'
import { ShareButton } from '../share-button'

function PaceChart({
  plan,
  actual,
  projected,
  hours,
  format,
  labels,
}: {
  plan: number[]
  actual: number[]
  projected: number
  hours: number
  format: (n: number) => string
  labels: { hour: string; plan: string; actual: string; projection: string }
}) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 720
  const H = 280
  const pad = { l: 56, r: 16, t: 16, b: 30 }
  const slots = plan.length
  const top = Math.max(...plan, projected, ...actual, 1) * 1.05
  const x = (i: number) => pad.l + (i / slots) * (W - pad.l - pad.r)
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b)
  const line = (values: number[]) =>
    [`M${x(0)},${y(0)}`, ...values.map((v, i) => `L${x(i + 1)},${y(v)}`)].join(
      ' ',
    )
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * top)
  const last = actual.length
  const lastValue = last ? actual[last - 1] : 0

  return (
    <div>
      <ul className="mb-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 bg-[var(--chart-actual)]" />
          {labels.actual}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-5 border-t-2 border-dashed border-[var(--chart-plan)]" />
          {labels.plan}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-5 border-t-2 border-dotted border-[var(--chart-actual)]" />
          {labels.projection}
        </li>
      </ul>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`${labels.actual}: ${format(lastValue)} · ${labels.projection}: ${format(projected)}`}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={pad.l}
                x2={W - pad.r}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={pad.l - 8}
                y={y(t) + 4}
                textAnchor="end"
                fontSize={11}
                fill="var(--muted-foreground)"
              >
                {format(t)}
              </text>
            </g>
          ))}
          {plan.map((_, i) => (
            <text
              key={i}
              x={x(i + 1)}
              y={H - 10}
              textAnchor="middle"
              fontSize={11}
              fill="var(--muted-foreground)"
            >
              {labels.hour}
              {i + 1}
            </text>
          ))}
          <path
            d={line(plan)}
            fill="none"
            stroke="var(--chart-plan)"
            strokeWidth={2}
            strokeDasharray="6 5"
          />
          {last > 0 && last < slots && (
            <line
              x1={x(last)}
              y1={y(lastValue)}
              x2={x(hours)}
              y2={y(projected)}
              stroke="var(--chart-actual)"
              strokeWidth={2}
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
          )}
          {last > 0 && (
            <path
              d={line(actual)}
              fill="none"
              stroke="var(--chart-actual)"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          )}
          {actual.map((v, i) => (
            <circle
              key={i}
              cx={x(i + 1)}
              cy={y(v)}
              r={4.5}
              fill="var(--chart-actual)"
              stroke="var(--card)"
              strokeWidth={2}
            />
          ))}
          {hover !== null && (
            <line
              x1={x(hover + 1)}
              x2={x(hover + 1)}
              y1={pad.t}
              y2={H - pad.b}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
            />
          )}
          {plan.map((_, i) => (
            <rect
              key={i}
              x={x(i + 0.5)}
              y={pad.t}
              width={x(1) - x(0)}
              height={H - pad.t - pad.b}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg"
            style={{
              left: `${Math.min(70, ((hover + 1) / slots) * 85)}%`,
            }}
          >
            <p className="font-medium">
              {labels.hour}
              {hover + 1}
            </p>
            <p className="text-muted-foreground">
              {labels.plan}:{' '}
              <span className="font-data text-foreground">
                {format(plan[hover])}
              </span>
            </p>
            {actual[hover] !== undefined && (
              <p className="text-muted-foreground">
                {labels.actual}:{' '}
                <span className="font-data text-foreground">
                  {format(actual[hover])}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ShiftPlanner() {
  const { tr, lang } = useLanguage()
  const { workspace, update } = useWorkspace()
  const s = workspace.shift
  const fmt = numberFormat(lang)
  const pct = (n: number) => (Number.isFinite(n) ? `${fmt(n * 100)} %` : '∞')

  const patch = (next: Partial<typeof s>) =>
    update((w) => ({ ...w, shift: { ...w.shift, ...next } }))
  const patchZone = (id: string, next: Partial<Zone>) =>
    patch({ zones: s.zones.map((z) => (z.id === id ? { ...z, ...next } : z)) })

  const plan = useMemo(() => planShift(s.zones, s), [s])
  const pace = useMemo(
    () => trackPace(plan.totalDemand, s.hours, s.logged),
    [plan.totalDemand, s.hours, s.logged],
  )
  const slots = Math.ceil(s.hours)

  const setLogged = (i: number, value: string) => {
    const next: (number | null)[] = Array.from(
      { length: slots },
      (_, k) => s.logged[k] ?? null,
    )
    const n = Number(value)
    next[i] = value === '' || !Number.isFinite(n) || n < 0 ? null : n
    patch({ logged: next })
  }

  const rosterGap = plan.rosterNeeded - plan.roster

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Plan de turno', en: 'Shift plan' })}
        description={tr({
          es: 'Dimensiona con un margen sostenible, reparte a las personas donde más carga hay y sigue el ritmo real hora a hora. Cambia cualquier dato: los ejemplos son tuyos para sobrescribir.',
          en: 'Size the shift with a sustainable margin, place people where the load is highest and track actual pace hour by hour. Overwrite any value: the examples are yours to replace.',
        })}
        actions={<ShareButton tool="shift" />}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label={tr({ es: 'Carga del turno', en: 'Shift load' })}
          value={pct(plan.load)}
          tone={loadTone(plan.load)}
          note={tr({
            es: `${fmt(plan.totalDemand)} de ${fmt(plan.totalCapacity)} uds. asumibles`,
            en: `${fmt(plan.totalDemand)} of ${fmt(plan.totalCapacity)} feasible units`,
          })}
        />
        <Stat
          label={tr({ es: 'Zona más cargada', en: 'Busiest zone' })}
          value={pct(plan.peakLoad)}
          tone={loadTone(plan.peakLoad)}
          note={tr({
            es: `${pct(plan.peakLoadAfter)} si aplicas el reparto`,
            en: `${pct(plan.peakLoadAfter)} with the suggested split`,
          })}
        />
        <Stat
          label={tr({ es: 'Plantilla necesaria', en: 'Roster needed' })}
          value={fmt(plan.rosterNeeded)}
          tone={rosterGap > 0 ? 'bad' : 'good'}
          note={
            rosterGap > 0
              ? tr({
                  es: `Faltan ${fmt(rosterGap)} sobre ${fmt(plan.roster)} en cuadrante`,
                  en: `${fmt(rosterGap)} short of the ${fmt(plan.roster)} rostered`,
                })
              : tr({
                  es: `${fmt(plan.roster)} en cuadrante: cubierto`,
                  en: `${fmt(plan.roster)} rostered: covered`,
                })
          }
        />
        <Stat
          label={tr({
            es: 'Proyección a fin de turno',
            en: 'End-of-shift projection',
          })}
          value={pace.hoursLogged ? fmt(pace.projected) : '—'}
          tone={!pace.hoursLogged ? 'neutral' : pace.gap >= 0 ? 'good' : 'bad'}
          note={
            pace.hoursLogged
              ? tr({
                  es: `${pace.gap >= 0 ? '+' : ''}${fmt(pace.gap)} uds. sobre el volumen`,
                  en: `${pace.gap >= 0 ? '+' : ''}${fmt(pace.gap)} units against volume`,
                })
              : tr({
                  es: 'Registra la primera hora',
                  en: 'Log the first hour',
                })
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-4">
          <Panel
            title={tr({ es: 'Zonas', en: 'Zones' })}
            action={
              <Button
                variant="outline"
                size="sm"
                disabled={s.zones.length >= 30}
                onClick={() =>
                  patch({
                    zones: [
                      ...s.zones,
                      {
                        id: crypto.randomUUID(),
                        name: tr({ es: 'Nueva zona', en: 'New zone' }),
                        demand: 1000,
                        rate: 80,
                        workers: 2,
                      },
                    ],
                  })
                }
              >
                <Plus />
                {tr({ es: 'Zona', en: 'Zone' })}
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-normal">
                      {tr({ es: 'Zona', en: 'Zone' })}
                    </th>
                    <th className="w-28 pb-2 font-normal">
                      {tr({ es: 'Volumen', en: 'Volume' })}
                    </th>
                    <th className="w-24 pb-2 font-normal">
                      {tr({ es: 'Uds./hora', en: 'Units/hour' })}
                    </th>
                    <th className="w-20 pb-2 font-normal">
                      {tr({ es: 'Personas', en: 'People' })}
                    </th>
                    <th className="w-44 pb-2 font-normal">
                      {tr({ es: 'Carga', en: 'Load' })}
                    </th>
                    <th className="w-24 pb-2 font-normal">
                      {tr({ es: 'Sugerido', en: 'Suggested' })}
                    </th>
                    <th className="w-9 pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {s.zones.map((z) => {
                    const row = plan.rows.find((r) => r.id === z.id)
                    const load = row?.load ?? 0
                    const tone = loadTone(load)
                    const delta = (row?.suggested ?? 0) - z.workers
                    return (
                      <tr key={z.id} className="border-t border-border/60">
                        <td className="py-2 pr-2">
                          <input
                            value={z.name}
                            maxLength={60}
                            aria-label={tr({
                              es: 'Nombre de zona',
                              en: 'Zone name',
                            })}
                            onChange={(e) =>
                              patchZone(z.id, { name: e.target.value })
                            }
                            className="h-9 w-full rounded-md border border-transparent bg-transparent px-2 outline-none hover:border-input focus:border-input focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <NumberField
                            compact
                            label={tr({ es: 'Volumen', en: 'Volume' })}
                            value={z.demand}
                            max={10000000}
                            step={100}
                            onChange={(v) => patchZone(z.id, { demand: v })}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <NumberField
                            compact
                            label={tr({ es: 'Uds./hora', en: 'Units/hour' })}
                            value={z.rate}
                            max={100000}
                            onChange={(v) => patchZone(z.id, { rate: v })}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <NumberField
                            compact
                            label={tr({ es: 'Personas', en: 'People' })}
                            value={z.workers}
                            max={2000}
                            onChange={(v) =>
                              patchZone(z.id, { workers: Math.round(v) })
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-input">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  tone === 'bad' && 'bg-destructive',
                                  tone === 'warn' && 'bg-warning',
                                  tone === 'good' && 'bg-success',
                                )}
                                style={{
                                  width: `${Math.min(100, Number.isFinite(load) ? load * 100 : 100)}%`,
                                }}
                              />
                            </div>
                            <span className="w-14 text-right font-data text-xs">
                              {pct(load)}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 font-data text-sm">
                          {row?.suggested ?? 0}
                          {delta !== 0 && (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              ({delta > 0 ? '+' : ''}
                              {delta})
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={tr({
                              es: `Quitar ${z.name}`,
                              en: `Remove ${z.name}`,
                            })}
                            onClick={() =>
                              patch({
                                zones: s.zones.filter((x) => x.id !== z.id),
                              })
                            }
                          >
                            <Trash2 />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title={tr({
              es: 'Ritmo real frente al plan',
              en: 'Actual pace against plan',
            })}
            hint={tr({
              es: 'Anota las unidades de cada hora. La proyección usa la media de las dos últimas.',
              en: 'Log the units of each hour. The projection uses the average of the last two.',
            })}
          >
            <PaceChart
              plan={pace.plan}
              actual={pace.actual}
              projected={pace.hoursLogged ? pace.projected : 0}
              hours={slots}
              format={fmt}
              labels={{
                hour: tr({ es: 'h', en: 'h' }),
                plan: tr({ es: 'Plan', en: 'Plan' }),
                actual: tr({ es: 'Real', en: 'Actual' }),
                projection: tr({ es: 'Proyección', en: 'Projection' }),
              }}
            />
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
              {Array.from({ length: slots }, (_, i) => (
                <label key={i} className="block min-w-0">
                  <span className="mb-1 block text-center font-data text-[11px] text-muted-foreground">
                    h{i + 1}
                  </span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={s.logged[i] ?? ''}
                    onChange={(e) => setLogged(i, e.target.value)}
                    aria-label={tr({
                      es: `Unidades en la hora ${i + 1}`,
                      en: `Units in hour ${i + 1}`,
                    })}
                    className="h-9 w-full rounded-md border border-input bg-background/60 px-1 text-center font-data text-xs outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </label>
              ))}
            </div>
            {pace.hoursLogged > 0 && pace.hoursLogged < s.hours && (
              <p className="mt-3 text-sm text-muted-foreground">
                {tr({
                  es: `Para cerrar el volumen hacen falta ${fmt(pace.neededRate)} uds./hora; las dos últimas horas van a ${fmt(pace.recentRate)}.`,
                  en: `Closing the volume takes ${fmt(pace.neededRate)} units/hour; the last two hours ran at ${fmt(pace.recentRate)}.`,
                })}
              </p>
            )}
          </Panel>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel title={tr({ es: 'Condiciones', en: 'Conditions' })}>
            <div className="space-y-5">
              <SliderField
                label={tr({ es: 'Horas de turno', en: 'Shift hours' })}
                value={s.hours}
                min={1}
                max={12}
                step={0.5}
                format={(v) => `${v} h`}
                onChange={(hours) => patch({ hours })}
              />
              <SliderField
                label={tr({ es: 'Pausas', en: 'Breaks' })}
                value={s.breakMin}
                min={0}
                max={90}
                step={5}
                format={(v) => `${v} min`}
                onChange={(breakMin) => patch({ breakMin })}
              />
              <SliderField
                label={tr({ es: 'Absentismo', en: 'Absenteeism' })}
                value={s.absenteeism}
                min={0}
                max={30}
                format={(v) => `${v} %`}
                onChange={(absenteeism) => patch({ absenteeism })}
              />
              <SliderField
                label={tr({
                  es: 'Margen sostenible',
                  en: 'Sustainable margin',
                })}
                value={s.margin}
                min={0}
                max={30}
                format={(v) => `${v} %`}
                onChange={(margin) => patch({ margin })}
              />
            </div>
          </Panel>

          <Panel
            title={tr({ es: 'Movimientos propuestos', en: 'Proposed moves' })}
            hint={tr({
              es: 'Cada persona va a la zona con mayor carga, lo que reduce el pico sin pedir más ritmo.',
              en: 'Each person goes to the zone with the highest load, lowering the peak without asking for more pace.',
            })}
          >
            {plan.moves.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tr({
                  es: 'El reparto actual ya es el más equilibrado.',
                  en: 'The current split is already the most balanced.',
                })}
              </p>
            ) : (
              <ul className="space-y-2">
                {plan.moves.map((m) => (
                  <li
                    key={`${m.from}-${m.to}`}
                    className="flex items-center gap-2 rounded-lg bg-background/60 p-2.5 text-sm"
                  >
                    <span className="font-data font-bold">{m.count}</span>
                    <span className="min-w-0 truncate text-muted-foreground">
                      {m.from}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-primary" />
                    <span className="min-w-0 truncate">{m.to}</span>
                  </li>
                ))}
              </ul>
            )}
            {plan.peakLoadAfter > 1 && (
              <p className="mt-3 text-sm text-warning">
                {tr({
                  es: 'Ni repartiendo mejor llega: hace falta más gente, menos volumen u otro horario, no más presión.',
                  en: 'A better split is not enough: it needs more people, less volume or other hours, not more pressure.',
                })}
              </p>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}

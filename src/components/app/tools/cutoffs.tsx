import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  formatClock,
  planCutoffs,
  type ScheduledWave,
  type Wave,
} from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'
import {
  NumberField,
  Panel,
  Segmented,
  Stat,
  ToolHeader,
  numberFormat,
} from '../primitives'
import { ShareButton } from '../share-button'

function Timeline({
  waves,
  labels,
}: {
  waves: ScheduledWave[]
  labels: { late: string; onTime: string; cutoff: string }
}) {
  if (waves.length === 0) return null
  const from = Math.min(...waves.map((w) => w.start))
  const to = Math.max(...waves.map((w) => Math.max(w.end, w.due))) + 15
  const pct = (m: number) => ((m - from) / (to - from)) * 100
  const hours: number[] = []
  for (let h = Math.ceil(from / 60) * 60; h <= to; h += 60) hours.push(h)
  const step = hours.length > 10 ? 2 : 1

  return (
    <div>
      <div className="relative ml-28 h-5 sm:ml-36">
        {hours.map(
          (h, i) =>
            i % step === 0 && (
              <span
                key={h}
                className="absolute -translate-x-1/2 font-data text-[10px] text-muted-foreground"
                style={{ left: `${pct(h)}%` }}
              >
                {formatClock(h)}
              </span>
            ),
        )}
      </div>
      <ul className="space-y-2">
        {waves.map((w) => {
          const late = w.slack < 0
          return (
            <li key={w.id} className="flex items-center gap-2">
              <span className="w-26 shrink-0 truncate text-xs sm:w-34">
                {w.name}
              </span>
              <div className="relative h-8 flex-1 rounded-md bg-background/60">
                {hours.map((h) => (
                  <span
                    key={h}
                    className="absolute inset-y-0 w-px bg-border/50"
                    style={{ left: `${pct(h)}%` }}
                  />
                ))}
                <div
                  title={`${w.name}: ${formatClock(w.start)}–${formatClock(w.end)}`}
                  className={cn(
                    'absolute inset-y-1 flex items-center overflow-hidden rounded px-1.5 font-data text-[10px] font-bold',
                    late
                      ? 'bg-destructive text-white'
                      : 'bg-primary text-primary-foreground',
                  )}
                  style={{
                    left: `${pct(w.start)}%`,
                    width: `max(4px, ${pct(w.end) - pct(w.start)}%)`,
                  }}
                >
                  <span className="truncate">{formatClock(w.end)}</span>
                </div>
                <span
                  aria-label={`${labels.cutoff} ${formatClock(w.due)}`}
                  className="absolute inset-y-0 w-0.5 bg-foreground"
                  style={{ left: `${pct(w.due)}%` }}
                />
              </div>
              <span
                className={cn(
                  'w-16 shrink-0 text-right text-xs',
                  late
                    ? 'text-destructive-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {late ? labels.late : labels.onTime}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type Order = 'edd' | 'fifo'

export function Cutoffs() {
  const { tr, lang } = useLanguage()
  const { workspace, update } = useWorkspace()
  const c = workspace.cutoffs
  const fmt = numberFormat(lang)
  const [order, setOrder] = useState<Order>('edd')

  const patch = (next: Partial<typeof c>) =>
    update((w) => ({ ...w, cutoffs: { ...w.cutoffs, ...next } }))
  const patchWave = (id: string, next: Partial<Wave>) =>
    patch({ waves: c.waves.map((w) => (w.id === id ? { ...w, ...next } : w)) })

  const plan = useMemo(
    () => planCutoffs(c.waves, c.start, c.rate),
    [c.waves, c.start, c.rate],
  )
  const shown = order === 'edd' ? plan.edd : plan.fifo
  const rateGap = plan.minimumRate - c.rate
  const worst = plan.edd.reduce(
    (min, w) => Math.min(min, w.slack),
    Number.POSITIVE_INFINITY,
  )

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Cortes de salida', en: 'Cutoffs' })}
        description={tr({
          es: 'Introduce olas o rutas con su hora de corte. Compara trabajar por orden de lista con servir primero el corte más cercano (EDD) y calcula el ritmo mínimo que cubre todos. Asume un ritmo constante y sin paradas.',
          en: 'Enter waves or routes with their cutoff. Compare working in list order with earliest cutoff first (EDD) and find the minimum rate that makes them all. It assumes a constant rate with no stops.',
        })}
        actions={<ShareButton tool="cutoffs" />}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label={tr({
            es: 'Tarde por orden de lista',
            en: 'Late in list order',
          })}
          value={fmt(plan.lateFifo)}
          tone={plan.lateFifo ? 'bad' : 'good'}
          note={tr({
            es: `de ${c.waves.length} olas`,
            en: `of ${c.waves.length} waves`,
          })}
        />
        <Stat
          label={tr({ es: 'Tarde con EDD', en: 'Late with EDD' })}
          value={fmt(plan.lateEdd)}
          tone={plan.lateEdd ? 'bad' : 'good'}
          note={tr({
            es: `de ${c.waves.length} olas`,
            en: `of ${c.waves.length} waves`,
          })}
        />
        <Stat
          label={tr({ es: 'Ritmo mínimo', en: 'Minimum rate' })}
          value={`${fmt(plan.minimumRate)}/h`}
          tone={rateGap > 0 ? 'bad' : 'good'}
          note={
            rateGap > 0
              ? tr({
                  es: `Faltan ${fmt(rateGap)}/h sobre tu ritmo`,
                  en: `${fmt(rateGap)}/h above your rate`,
                })
              : tr({
                  es: `Te sobran ${fmt(-rateGap)}/h`,
                  en: `${fmt(-rateGap)}/h to spare`,
                })
          }
        />
        <Stat
          label={tr({ es: 'Margen más ajustado', en: 'Tightest slack' })}
          value={Number.isFinite(worst) ? `${fmt(worst)} min` : '—'}
          tone={worst < 0 ? 'bad' : worst < 30 ? 'warn' : 'good'}
          note={tr({ es: 'Con EDD', en: 'With EDD' })}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(340px,1fr)]">
        <Panel
          className="min-w-0"
          title={tr({ es: 'Línea de tiempo', en: 'Timeline' })}
          hint={tr({
            es: 'La barra es el trabajo y la marca vertical, el corte.',
            en: 'The bar is the work and the vertical mark is the cutoff.',
          })}
          action={
            <Segmented
              label={tr({ es: 'Secuencia', en: 'Sequence' })}
              value={order}
              options={[
                { value: 'edd', label: 'EDD' },
                {
                  value: 'fifo',
                  label: tr({ es: 'Orden de lista', en: 'List order' }),
                },
              ]}
              onChange={setOrder}
            />
          }
        >
          {shown.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {tr({ es: 'Añade una ola.', en: 'Add a wave.' })}
            </p>
          ) : (
            <Timeline
              waves={shown}
              labels={{
                late: tr({ es: 'Tarde', en: 'Late' }),
                onTime: tr({ es: 'A tiempo', en: 'On time' }),
                cutoff: tr({ es: 'Corte', en: 'Cutoff' }),
              }}
            />
          )}
        </Panel>

        <div className="min-w-0 space-y-4">
          <Panel title={tr({ es: 'Condiciones', en: 'Conditions' })}>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted-foreground">
                  {tr({ es: 'Inicio', en: 'Start' })}
                </span>
                <input
                  type="time"
                  value={c.start}
                  onChange={(e) => patch({ start: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background/60 px-2.5 font-data text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <NumberField
                label={tr({ es: 'Tu ritmo', en: 'Your rate' })}
                value={c.rate}
                min={1}
                max={1000000}
                step={50}
                suffix="/h"
                onChange={(rate) => patch({ rate })}
              />
            </div>
          </Panel>
          <Panel
            title={tr({ es: 'Olas', en: 'Waves' })}
            action={
              <Button
                variant="outline"
                size="sm"
                disabled={c.waves.length >= 40}
                onClick={() =>
                  patch({
                    waves: [
                      ...c.waves,
                      {
                        id: crypto.randomUUID(),
                        name: tr({ es: 'Nueva ola', en: 'New wave' }),
                        units: 1000,
                        cutoff: '15:00',
                      },
                    ],
                  })
                }
              >
                <Plus />
                {tr({ es: 'Ola', en: 'Wave' })}
              </Button>
            }
          >
            <ul className="space-y-2">
              {c.waves.map((w) => (
                <li
                  key={w.id}
                  className="grid grid-cols-[1fr_auto] gap-2 rounded-lg bg-background/60 p-2"
                >
                  <input
                    value={w.name}
                    maxLength={60}
                    aria-label={tr({ es: 'Nombre', en: 'Name' })}
                    onChange={(e) => patchWave(w.id, { name: e.target.value })}
                    className="h-9 min-w-0 rounded-md border border-transparent bg-transparent px-2 text-sm outline-none hover:border-input focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={tr({
                      es: `Quitar ${w.name}`,
                      en: `Remove ${w.name}`,
                    })}
                    onClick={() =>
                      patch({ waves: c.waves.filter((x) => x.id !== w.id) })
                    }
                  >
                    <Trash2 />
                  </Button>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <NumberField
                      compact
                      label={tr({ es: 'Unidades', en: 'Units' })}
                      value={w.units}
                      max={10000000}
                      step={100}
                      suffix={tr({ es: 'uds.', en: 'units' })}
                      onChange={(units) => patchWave(w.id, { units })}
                    />
                    <input
                      type="time"
                      value={w.cutoff}
                      aria-label={tr({
                        es: 'Hora de corte',
                        en: 'Cutoff time',
                      })}
                      onChange={(e) =>
                        patchWave(w.id, { cutoff: e.target.value })
                      }
                      className="h-9 rounded-md border border-input bg-background/60 px-2 font-data text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  )
}

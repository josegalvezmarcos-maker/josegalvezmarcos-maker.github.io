import { useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  parseSkus,
  slotSkus,
  type AbcClass,
  type SlottedSku,
} from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { useWorkspace } from '@/lib/workspace'
import {
  Panel,
  SliderField,
  Stat,
  ToolHeader,
  numberFormat,
} from '../primitives'
import { ShareButton } from '../share-button'

const CLASS_FILL: Record<AbcClass, string> = {
  A: 'var(--abc-a)',
  B: 'var(--abc-b)',
  C: 'var(--abc-c)',
}

function Pareto({
  rows,
  format,
  label,
}: {
  rows: SlottedSku[]
  format: (n: number) => string
  label: string
}) {
  const [hover, setHover] = useState<SlottedSku | null>(null)
  const shown = rows.slice(0, 60)
  const W = 720
  const H = 240
  const pad = { l: 40, r: 8, t: 10, b: 12 }
  const gap = 2
  const band = (W - pad.l - pad.r) / Math.max(shown.length, 1)
  const top = shown[0]?.picks || 1
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b)

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={label}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y(t * top)}
              y2={y(t * top)}
              stroke="var(--border)"
            />
            <text
              x={pad.l - 6}
              y={y(t * top) + 4}
              fontSize={10}
              textAnchor="end"
              fill="var(--muted-foreground)"
            >
              {format(t * top)}
            </text>
          </g>
        ))}
        {shown.map((row, i) => (
          <g key={row.sku} onMouseEnter={() => setHover(row)}>
            <rect
              x={pad.l + i * band}
              y={pad.t}
              width={band}
              height={H - pad.t - pad.b}
              fill="transparent"
            />
            <rect
              x={pad.l + i * band + gap / 2}
              y={y(row.picks)}
              width={Math.max(1, band - gap)}
              height={Math.max(1, H - pad.b - y(row.picks))}
              rx={Math.min(3, band / 3)}
              fill={CLASS_FILL[row.abc]}
              opacity={hover && hover.sku !== row.sku ? 0.55 : 1}
            />
          </g>
        ))}
      </svg>
      {hover && (
        <div className="pointer-events-none absolute top-1 right-2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg">
          <p className="font-medium">{hover.sku}</p>
          <p className="font-data text-muted-foreground">
            {format(hover.picks)} · {hover.abc} · {format(hover.cumulative)} %
          </p>
        </div>
      )}
    </div>
  )
}

export function Slotting() {
  const { tr, lang } = useLanguage()
  const { workspace, update } = useWorkspace()
  const s = workspace.slotting
  const fmt = numberFormat(lang)
  const fmt1 = numberFormat(lang, 1)

  const patch = (next: Partial<typeof s>) =>
    update((w) => ({ ...w, slotting: { ...w.slotting, ...next } }))

  const { rows, invalid } = useMemo(() => parseSkus(s.csv), [s.csv])
  const result = useMemo(
    () =>
      slotSkus(
        rows,
        { aisles: s.aisles, bays: s.bays, aisleGap: 3.5, bayLength: 1.4 },
        { a: s.thresholdA, b: Math.max(s.thresholdB, s.thresholdA + 1) },
      ),
    [rows, s.aisles, s.bays, s.thresholdA, s.thresholdB],
  )

  const reduction =
    result.avgTravelNow > 0
      ? (1 - result.avgTravelProposed / result.avgTravelNow) * 100
      : 0
  const skuCount = result.rows.length
  const aShare = skuCount ? (result.counts.A / skuCount) * 100 : 0
  const aPicks = result.totalPicks
    ? (result.picksByClass.A / result.totalPicks) * 100
    : 0

  const copyMoves = async () => {
    const csv = [
      'sku,picks,clase,actual,propuesta',
      ...result.moves.map(
        (m) => `${m.sku},${m.picks},${m.abc},${m.current},${m.proposed}`,
      ),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(csv)
      toast.success(tr({ es: 'Movimientos copiados', en: 'Moves copied' }))
    } catch {
      toast.error(tr({ es: 'No se pudo copiar', en: 'Could not copy' }))
    }
  }

  const classes: AbcClass[] = ['A', 'B', 'C']

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Slotting ABC', en: 'ABC slotting' })}
        description={tr({
          es: 'Pega referencia y picks de tu extracción. La lista se interpreta como el orden actual en el almacén y se compara con colocar lo que más rota lo más cerca de la salida. Da una estimación de recorrido, no un plan de reubicación cerrado.',
          en: 'Paste SKU and picks from your export. The list is read as the current warehouse order and compared with placing the fastest movers closest to the exit. It estimates walking distance; it is not a finished relocation plan.',
        })}
        actions={<ShareButton tool="slotting" />}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label={tr({ es: 'Recorrido medio ahora', en: 'Average walk now' })}
          value={`${fmt(result.avgTravelNow)} m`}
          note={tr({ es: 'Ida y vuelta por pick', en: 'Round trip per pick' })}
        />
        <Stat
          label={tr({ es: 'Con el nuevo slotting', en: 'With new slotting' })}
          value={`${fmt(result.avgTravelProposed)} m`}
          tone={reduction > 0 ? 'good' : 'neutral'}
          note={tr({
            es: `${fmt1(reduction)} % menos en el modelo`,
            en: `${fmt1(reduction)} % less in the model`,
          })}
        />
        <Stat
          label={tr({ es: 'Clase A', en: 'Class A' })}
          value={`${fmt(result.counts.A)} SKU`}
          note={tr({
            es: `${fmt(aShare)} % de referencias · ${fmt(aPicks)} % de picks`,
            en: `${fmt(aShare)} % of SKUs · ${fmt(aPicks)} % of picks`,
          })}
        />
        <Stat
          label={tr({ es: 'Referencias analizadas', en: 'SKUs analysed' })}
          value={fmt(skuCount)}
          tone={invalid.length ? 'warn' : 'neutral'}
          note={
            invalid.length
              ? tr({
                  es: `${invalid.length} líneas ignoradas`,
                  en: `${invalid.length} lines ignored`,
                })
              : tr({ es: 'Sin líneas ignoradas', en: 'No lines ignored' })
          }
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-4">
          <Panel
            title={tr({ es: 'Picks por referencia', en: 'Picks by SKU' })}
            hint={tr({
              es: 'Ordenadas de más a menos rotación. Las primeras 60.',
              en: 'Sorted from fastest to slowest. The first 60.',
            })}
          >
            <ul className="mb-2 flex gap-4 text-xs text-muted-foreground">
              {classes.map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{ background: CLASS_FILL[c] }}
                  />
                  {tr({ es: 'Clase', en: 'Class' })} {c} ·{' '}
                  {fmt(result.counts[c])}
                </li>
              ))}
            </ul>
            <Pareto
              rows={result.rows}
              format={fmt}
              label={tr({
                es: `Distribución de picks de ${skuCount} referencias`,
                en: `Pick distribution across ${skuCount} SKUs`,
              })}
            />
          </Panel>

          <Panel
            title={tr({ es: 'Qué mover primero', en: 'What to move first' })}
            hint={tr({
              es: 'Ordenado por metros evitados. Supone una ubicación por referencia.',
              en: 'Sorted by metres avoided. Assumes one location per SKU.',
            })}
            action={
              <Button
                variant="outline"
                size="sm"
                disabled={!result.moves.length}
                onClick={() => void copyMoves()}
              >
                <Copy />
                CSV
              </Button>
            }
          >
            {result.moves.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tr({
                  es: 'No hay movimientos que reduzcan el recorrido.',
                  en: 'No moves would reduce walking.',
                })}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-normal">
                        {tr({ es: 'Referencia', en: 'SKU' })}
                      </th>
                      <th className="pb-2 font-normal">
                        {tr({ es: 'Clase', en: 'Class' })}
                      </th>
                      <th className="pb-2 text-right font-normal">Picks</th>
                      <th className="pb-2 pl-4 font-normal">
                        {tr({ es: 'De → a', en: 'From → to' })}
                      </th>
                      <th className="pb-2 text-right font-normal">
                        {tr({ es: 'Metros evitados', en: 'Metres avoided' })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.moves.map((m) => (
                      <tr key={m.sku} className="border-t border-border/60">
                        <td className="py-2 pr-2">{m.sku}</td>
                        <td className="py-2 font-data">{m.abc}</td>
                        <td className="py-2 text-right font-data">
                          {fmt(m.picks)}
                        </td>
                        <td className="py-2 pl-4 font-data text-xs text-muted-foreground">
                          {m.current} → {m.proposed}
                        </td>
                        <td className="py-2 text-right font-data">
                          {fmt(m.gain)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel
            title={tr({ es: 'Tus datos', en: 'Your data' })}
            hint={tr({
              es: 'Una línea por referencia: referencia, picks. Los de ejemplo son inventados. Se procesan solo en tu navegador.',
              en: 'One line per SKU: SKU, picks. The examples are made up. Processed only in your browser.',
            })}
          >
            <textarea
              value={s.csv}
              rows={11}
              maxLength={60000}
              spellCheck={false}
              onChange={(e) => patch({ csv: e.target.value })}
              aria-label={tr({
                es: 'Referencias y picks',
                en: 'SKUs and picks',
              })}
              className="w-full resize-y rounded-md border border-input bg-background/60 p-2.5 font-data text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {invalid.length > 0 && (
              <p className="mt-1 text-xs text-warning">
                {tr({ es: 'Ignoradas: ', en: 'Ignored: ' })}
                {invalid.slice(0, 4).join(' · ')}
              </p>
            )}
          </Panel>
          <Panel title={tr({ es: 'Parámetros', en: 'Parameters' })}>
            <div className="space-y-4">
              <SliderField
                label={tr({ es: 'Corte clase A', en: 'Class A cutoff' })}
                value={s.thresholdA}
                min={50}
                max={95}
                format={(v) => `${v} %`}
                onChange={(thresholdA) => patch({ thresholdA })}
              />
              <SliderField
                label={tr({ es: 'Corte clase B', en: 'Class B cutoff' })}
                value={s.thresholdB}
                min={60}
                max={99}
                format={(v) => `${v} %`}
                onChange={(thresholdB) => patch({ thresholdB })}
              />
              <SliderField
                label={tr({ es: 'Pasillos', en: 'Aisles' })}
                value={s.aisles}
                min={2}
                max={30}
                onChange={(aisles) => patch({ aisles })}
              />
              <SliderField
                label={tr({ es: 'Huecos por pasillo', en: 'Bays per aisle' })}
                value={s.bays}
                min={4}
                max={40}
                onChange={(bays) => patch({ bays })}
              />
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  aisleHeight,
  formatLocation,
  optimiseRoute,
  parseLocations,
  pathLength,
  randomPicks,
  sShapeRoute,
  toPoint,
  tourLength,
  tourPath,
  type Location,
  type Point,
  type WarehouseLayout,
} from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import { useWorkspace } from '@/lib/workspace'
import {
  NumberField,
  Panel,
  Segmented,
  SliderField,
  Stat,
  ToolHeader,
  numberFormat,
} from '../primitives'
import { ShareButton } from '../share-button'

type Method = 'list' | 'sshape' | 'optimal'

function pointOnPath(path: Point[], fraction: number): Point {
  if (path.length === 0) return { x: 0, y: 0 }
  let remaining = pathLength(path) * fraction
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
    if (remaining <= len && len > 0) {
      const t = remaining / len
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    remaining -= len
  }
  return path[path.length - 1]
}

export function WarehouseMap({
  layout,
  picks,
  path,
  progress,
  onToggle,
  mapLabel,
}: {
  layout: WarehouseLayout
  picks: Location[]
  path: Point[]
  progress: number
  onToggle?: (l: Location) => void
  mapLabel: string
}) {
  const margin = layout.aisleGap
  const height = aisleHeight(layout)
  const width = (layout.aisles + 1) * layout.aisleGap
  const rackWidth = layout.aisleGap * 0.32
  const toSvgY = (y: number) => height - y
  const d = path
    .map((p, i) => `${i ? 'L' : 'M'}${p.x},${toSvgY(p.y)}`)
    .join(' ')
  const walker = path.length ? pointOnPath(path, progress) : null
  const picked = new Set(picks.map((p) => `${p.aisle}:${p.bay}`))
  const dot = Math.min(layout.bayLength * 0.42, layout.aisleGap * 0.2)

  return (
    <svg
      viewBox={`${-margin * 0.6} ${-margin * 0.6} ${width + margin * 0.6} ${height + margin * 1.4}`}
      className="h-full max-h-[70vh] w-full"
      role="img"
      aria-label={mapLabel}
    >
      {Array.from({ length: layout.aisles }, (_, a) => {
        const x = (a + 1) * layout.aisleGap
        return (
          <g key={a}>
            {[-1, 1].map((side) => (
              <rect
                key={side}
                x={
                  side < 0
                    ? x - layout.aisleGap / 2
                    : x + layout.aisleGap / 2 - rackWidth
                }
                y={layout.bayLength * 0.4}
                width={rackWidth}
                height={height - layout.bayLength * 0.8}
                rx={0.15}
                fill="var(--secondary)"
              />
            ))}
            <text
              x={x}
              y={-margin * 0.2}
              textAnchor="middle"
              fontSize={layout.aisleGap * 0.3}
              fill="var(--muted-foreground)"
            >
              {a + 1}
            </text>
            {onToggle &&
              Array.from({ length: layout.bays }, (_, b) => (
                <rect
                  key={b}
                  x={x - layout.aisleGap / 2}
                  y={toSvgY((b + 1) * layout.bayLength)}
                  width={layout.aisleGap}
                  height={layout.bayLength}
                  fill="transparent"
                  className="cursor-pointer hover:fill-primary/15"
                  onClick={() => onToggle({ aisle: a, bay: b })}
                >
                  <title>
                    {formatLocation({ aisle: a, bay: b })}
                    {picked.has(`${a}:${b}`) ? ' ✓' : ''}
                  </title>
                </rect>
              ))}
          </g>
        )
      })}
      {d && (
        <>
          <path
            d={d}
            fill="none"
            stroke="var(--chart-actual)"
            strokeOpacity={0.25}
            strokeWidth={layout.aisleGap * 0.09}
            strokeLinejoin="round"
          />
          <path
            d={d}
            fill="none"
            stroke="var(--chart-actual)"
            strokeWidth={layout.aisleGap * 0.09}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${progress} 1`}
          />
        </>
      )}
      {picks.map((p) => {
        const c = toPoint(p, layout)
        return (
          <circle
            key={`${p.aisle}:${p.bay}`}
            cx={c.x}
            cy={toSvgY(c.y)}
            r={dot}
            fill="var(--foreground)"
            stroke="var(--card)"
            strokeWidth={dot * 0.35}
            pointerEvents="none"
          />
        )
      })}
      <g pointerEvents="none">
        <rect
          x={-layout.aisleGap * 0.35}
          y={height - layout.aisleGap * 0.05}
          width={layout.aisleGap * 0.7}
          height={layout.aisleGap * 0.5}
          rx={0.2}
          fill="var(--primary)"
        />
      </g>
      {walker && (
        <circle
          cx={walker.x}
          cy={toSvgY(walker.y)}
          r={dot * 1.35}
          fill="var(--chart-plan)"
          stroke="var(--card)"
          strokeWidth={dot * 0.35}
          pointerEvents="none"
        />
      )}
    </svg>
  )
}

export function PickRoute() {
  const { tr, lang } = useLanguage()
  const { workspace, update } = useWorkspace()
  const r = workspace.route
  const fmt = numberFormat(lang)
  const fmt1 = numberFormat(lang, 1)
  const [method, setMethod] = useState<Method>('optimal')
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(1)
  const raf = useRef(0)

  const patch = (next: Partial<typeof r>) =>
    update((w) => ({ ...w, route: { ...w.route, ...next } }))

  const layout: WarehouseLayout = useMemo(
    () => ({
      aisles: r.aisles,
      bays: r.bays,
      aisleGap: r.aisleGap,
      bayLength: r.bayLength,
    }),
    [r.aisles, r.bays, r.aisleGap, r.bayLength],
  )
  const { picks, invalid } = useMemo(
    () => parseLocations(r.list, layout),
    [r.list, layout],
  )

  const routes = useMemo(() => {
    const best = optimiseRoute(picks, layout)
    const s = sShapeRoute(picks, layout)
    return {
      list: {
        sequence: picks,
        path: tourPath(picks, layout),
        length: tourLength(picks, layout),
      },
      sshape: { ...s, length: pathLength(s.path) },
      optimal: {
        sequence: best,
        path: tourPath(best, layout),
        length: tourLength(best, layout),
      },
    }
  }, [picks, layout])
  const active = routes[method]

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced || !playing || active.path.length === 0) return
    const startAt = performance.now()
    const duration = Math.min(14000, 2500 + active.length * 12)
    const tick = (now: number) => {
      const t = ((now - startAt) % (duration + 1200)) / duration
      setProgress(Math.min(1, t))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [playing, active])

  const toggle = (l: Location) => {
    const has = picks.some((p) => p.aisle === l.aisle && p.bay === l.bay)
    const next = has
      ? picks.filter((p) => !(p.aisle === l.aisle && p.bay === l.bay))
      : [...picks, l]
    patch({ list: next.map(formatLocation).join(', ') })
  }

  const shuffle = () => {
    const seed = r.seed + 1
    patch({
      seed,
      list: randomPicks(14, layout, seed).map(formatLocation).join(', '),
    })
  }

  const minutes = (m: number) => m / r.speed / 60
  const saved = routes.list.length - routes.optimal.length
  const savedPct =
    routes.list.length > 0 ? (saved / routes.list.length) * 100 : 0
  const savedVsS = routes.sshape.length - routes.optimal.length
  const kmPerShift = (saved * r.ordersPerShift) / 1000

  const methods: { value: Method; label: string }[] = [
    { value: 'list', label: tr({ es: 'Orden de la lista', en: 'List order' }) },
    { value: 'sshape', label: 'S-shape' },
    { value: 'optimal', label: tr({ es: 'Optimizada', en: 'Optimised' }) },
  ]

  return (
    <>
      <ToolHeader
        title={tr({ es: 'Rutas de picking', en: 'Pick routes' })}
        description={tr({
          es: 'Pega las ubicaciones o pulsa sobre el plano. Se comparan tres recorridos con el mismo plano: como viene la lista, S-shape y vecino más cercano + 2-opt. Es un modelo de pasillos paralelos con dos cabeceras: ajústalo a tu nave.',
          en: 'Paste locations or click the map. Three walks are compared on the same layout: list order, S-shape, and nearest neighbour + 2-opt. It models parallel aisles with two cross aisles: adjust it to your site.',
        })}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={shuffle}>
              <Shuffle />
              {tr({ es: 'Otro pedido', en: 'Another order' })}
            </Button>
            <ShareButton tool="route" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label={tr({ es: 'Recorrido optimizado', en: 'Optimised walk' })}
          value={`${fmt(routes.optimal.length)} m`}
          note={tr({
            es: `${fmt1(minutes(routes.optimal.length))} min caminando`,
            en: `${fmt1(minutes(routes.optimal.length))} min walking`,
          })}
        />
        <Stat
          label={tr({ es: 'Ahorro sobre la lista', en: 'Saved against list' })}
          value={`${fmt(savedPct)} %`}
          tone={saved > 0 ? 'good' : 'neutral'}
          note={`${fmt(saved)} m`}
        />
        <Stat
          label={tr({
            es: 'Ahorro sobre S-shape',
            en: 'Saved against S-shape',
          })}
          value={`${fmt(savedVsS)} m`}
          note={tr({
            es: `S-shape: ${fmt(routes.sshape.length)} m`,
            en: `S-shape: ${fmt(routes.sshape.length)} m`,
          })}
        />
        <Stat
          label={tr({
            es: 'Distancia evitada por turno',
            en: 'Distance avoided per shift',
          })}
          value={`${fmt1(kmPerShift)} km`}
          note={tr({
            es: `Si todos los pedidos fueran como este (${fmt(r.ordersPerShift)})`,
            en: `If all orders were like this one (${fmt(r.ordersPerShift)})`,
          })}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
        <Panel
          className="min-w-0"
          title={tr({ es: 'Plano', en: 'Map' })}
          action={
            <div className="flex items-center gap-2">
              <Segmented
                label={tr({ es: 'Método', en: 'Method' })}
                value={method}
                options={methods}
                onChange={setMethod}
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  playing
                    ? tr({ es: 'Pausar', en: 'Pause' })
                    : tr({ es: 'Reproducir', en: 'Play' })
                }
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause /> : <Play />}
              </Button>
            </div>
          }
        >
          <WarehouseMap
            layout={layout}
            picks={picks}
            path={active.path}
            progress={playing ? progress : 1}
            onToggle={toggle}
            mapLabel={tr({
              es: `Plano con ${picks.length} ubicaciones y un recorrido de ${fmt(active.length)} metros`,
              en: `Map with ${picks.length} locations and a ${fmt(active.length)} metre walk`,
            })}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-foreground" />
              {tr({
                es: 'Ubicación (pulsa para añadir o quitar)',
                en: 'Location (click to add or remove)',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-primary" />
              {tr({ es: 'Salida y llegada', en: 'Start and finish' })}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[var(--chart-plan)]" />
              {tr({ es: 'Operario', en: 'Picker' })}
            </span>
          </div>
        </Panel>

        <div className="min-w-0 space-y-4">
          <Panel
            title={tr({ es: 'Lista de ubicaciones', en: 'Location list' })}
          >
            <textarea
              value={r.list}
              rows={4}
              maxLength={6000}
              onChange={(e) => patch({ list: e.target.value })}
              aria-label={tr({ es: 'Ubicaciones', en: 'Locations' })}
              className="w-full resize-y rounded-md border border-input bg-background/60 p-2.5 font-data text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {tr({
                es: `Formato pasillo-hueco: A03-12. ${picks.length} válidas.`,
                en: `Aisle-bay format: A03-12. ${picks.length} valid.`,
              })}
            </p>
            {invalid.length > 0 && (
              <p className="mt-1 text-xs text-warning">
                {tr({ es: 'No reconocidas: ', en: 'Not recognised: ' })}
                {invalid.slice(0, 6).join(', ')}
              </p>
            )}
          </Panel>

          <Panel
            title={tr({ es: 'Secuencia a seguir', en: 'Sequence to follow' })}
          >
            {active.sequence.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tr({ es: 'Añade ubicaciones.', en: 'Add locations.' })}
              </p>
            ) : (
              <ol className="grid max-h-56 grid-cols-3 gap-1.5 overflow-y-auto font-data text-xs sm:grid-cols-4 xl:grid-cols-3">
                {active.sequence.map((l, i) => (
                  <li
                    key={`${l.aisle}:${l.bay}`}
                    className="rounded-md bg-background/60 px-2 py-1.5"
                  >
                    <span className="mr-1.5 text-muted-foreground">
                      {i + 1}
                    </span>
                    {formatLocation(l)}
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel title={tr({ es: 'Tu nave', en: 'Your site' })}>
            <div className="space-y-4">
              <SliderField
                label={tr({ es: 'Pasillos', en: 'Aisles' })}
                value={r.aisles}
                min={2}
                max={30}
                onChange={(aisles) => patch({ aisles })}
              />
              <SliderField
                label={tr({ es: 'Huecos por pasillo', en: 'Bays per aisle' })}
                value={r.bays}
                min={4}
                max={40}
                onChange={(bays) => patch({ bays })}
              />
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label={tr({ es: 'Entre pasillos', en: 'Between aisles' })}
                  value={r.aisleGap}
                  min={1}
                  max={20}
                  step={0.5}
                  suffix="m"
                  onChange={(aisleGap) => patch({ aisleGap })}
                />
                <NumberField
                  label={tr({ es: 'Largo de hueco', en: 'Bay length' })}
                  value={r.bayLength}
                  min={0.5}
                  max={10}
                  step={0.1}
                  suffix="m"
                  onChange={(bayLength) => patch({ bayLength })}
                />
                <NumberField
                  label={tr({ es: 'Velocidad', en: 'Speed' })}
                  value={r.speed}
                  min={0.1}
                  max={3}
                  step={0.1}
                  suffix="m/s"
                  onChange={(speed) => patch({ speed })}
                />
                <NumberField
                  label={tr({ es: 'Pedidos/turno', en: 'Orders/shift' })}
                  value={r.ordersPerShift}
                  min={1}
                  max={2000}
                  onChange={(ordersPerShift) => patch({ ordersPerShift })}
                />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

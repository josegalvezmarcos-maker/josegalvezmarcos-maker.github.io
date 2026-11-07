import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  Shuffle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SECTORS, type Sector, type SectorId } from '@/data/sectors'
import { sourceById } from '@/data/sources'
import { seededRandom } from '@/lib/algorithms'
import { useLanguage } from '@/lib/i18n'
import {
  planDeliveries,
  planJis,
  planRamp,
  simulateRotation,
  type Lot,
  type Store,
} from '@/lib/scenarios'
import { cn } from '@/lib/utils'
import { kpiPreset, useWorkspace } from '@/lib/workspace'
import { Panel, SliderField, Stat, numberFormat } from '../primitives'

// ---------- N01 Cold chain ----------

function ColdChain() {
  const { tr, lang } = useLanguage()
  const fmt = numberFormat(lang)
  const [shelf, setShelf] = useState(12)
  const [minShelf, setMinShelf] = useState(5)
  const [demand, setDemand] = useState(1000)
  const days = 28

  const result = useMemo(() => {
    const rnd = seededRandom(7)
    const lots: Lot[] = Array.from({ length: days }, (_, d) => {
      // Some lots arrive older because they waited in another warehouse.
      const age = rnd() < 0.35 ? Math.floor(rnd() * shelf * 0.6) : 0
      return {
        id: `L${d}`,
        units: Math.round(demand * (1 + rnd() * 0.35)),
        receivedDay: d,
        expiryDay: d + shelf - age,
      }
    })
    return {
      fifo: simulateRotation(lots, demand, days, minShelf, 'fifo'),
      fefo: simulateRotation(lots, demand, days, minShelf, 'fefo'),
    }
  }, [shelf, minShelf, demand])

  const saved = result.fifo.wasted - result.fefo.wasted
  const max = Math.max(result.fifo.wasted, result.fefo.wasted, 1)

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <Stat
            label={tr({ es: 'Merma con FIFO', en: 'Write-off with FIFO' })}
            value={`${fmt(result.fifo.wasted)} uds.`}
            tone={result.fifo.wasted > 0 ? 'bad' : 'good'}
          />
          <Stat
            label={tr({ es: 'Merma con FEFO', en: 'Write-off with FEFO' })}
            value={`${fmt(result.fefo.wasted)} uds.`}
            tone={result.fefo.wasted > 0 ? 'warn' : 'good'}
          />
          <Stat
            label={tr({ es: 'Unidades salvadas', en: 'Units saved' })}
            value={fmt(saved)}
            tone={saved > 0 ? 'good' : 'neutral'}
            note={tr({
              es: `En ${days} días simulados`,
              en: `Over ${days} simulated days`,
            })}
          />
        </div>
        <Panel
          title={tr({ es: 'Merma acumulada', en: 'Cumulative write-off' })}
          hint={tr({
            es: 'Mismo stock y misma demanda; solo cambia el orden en que se sirven los lotes.',
            en: 'Same stock and demand; only the order lots are shipped in changes.',
          })}
        >
          <ul className="space-y-3">
            {(['fifo', 'fefo'] as const).map((p) => (
              <li
                key={p}
                className="grid grid-cols-[56px_1fr_90px] items-center gap-3 text-sm"
              >
                <span className="font-data text-xs font-bold uppercase">
                  {p}
                </span>
                <span className="h-5 overflow-hidden rounded bg-background/60">
                  <span
                    className="block h-full rounded bg-[var(--chart-actual)]"
                    style={{ width: `${(result[p].wasted / max) * 100}%` }}
                  />
                </span>
                <span className="text-right font-data text-xs">
                  {fmt(result[p].wasted)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {tr({
              es: `Servidas: FIFO ${fmt(result.fifo.served)} · FEFO ${fmt(result.fefo.served)}. Pendientes por falta de vida útil: FIFO ${fmt(result.fifo.short)} · FEFO ${fmt(result.fefo.short)}.`,
              en: `Served: FIFO ${fmt(result.fifo.served)} · FEFO ${fmt(result.fefo.served)}. Short for lack of shelf life: FIFO ${fmt(result.fifo.short)} · FEFO ${fmt(result.fefo.short)}.`,
            })}
          </p>
        </Panel>
      </div>
      <Panel title={tr({ es: 'Condiciones', en: 'Conditions' })}>
        <div className="space-y-5">
          <SliderField
            label={tr({
              es: 'Vida útil del producto',
              en: 'Product shelf life',
            })}
            value={shelf}
            min={6}
            max={30}
            format={(v) => `${v} d`}
            onChange={setShelf}
          />
          <SliderField
            label={tr({
              es: 'Vida mínima que exige el cliente',
              en: 'Minimum life the customer requires',
            })}
            value={minShelf}
            min={1}
            max={Math.max(2, shelf - 2)}
            format={(v) => `${v} d`}
            onChange={setMinShelf}
          />
          <SliderField
            label={tr({ es: 'Demanda diaria', en: 'Daily demand' })}
            value={demand}
            min={200}
            max={5000}
            step={100}
            format={(v) => fmt(v)}
            onChange={setDemand}
          />
          <p className="text-xs text-muted-foreground">
            {tr({
              es: 'Se recibe algo más de lo que se vende y uno de cada tres lotes llega con parte de su vida consumida, como cuando viene de otro almacén.',
              en: 'A bit more is received than sold, and one lot in three arrives with part of its life used, as when it comes from another warehouse.',
            })}
          </p>
        </div>
      </Panel>
    </div>
  )
}

// ---------- N02 Peak ramp-up ----------

function PeakRamp() {
  const { tr, lang } = useLanguage()
  const fmt = numberFormat(lang)
  const [veterans, setVeterans] = useState(120)
  const [peak, setPeak] = useState(70)
  const [learnWeeks, setLearnWeeks] = useState(3)
  const [maxHires, setMaxHires] = useState(40)
  const rate = 4000
  const weeks = 12

  const demand = useMemo(
    () =>
      Array.from({ length: weeks }, (_, w) => {
        const base = veterans * rate * 0.92
        const lift =
          w >= 7 && w <= 10
            ? 1 + peak / 100
            : w === 6 || w === 11
              ? 1 + peak / 250
              : 1
        return Math.round(base * lift)
      }),
    [veterans, peak],
  )
  const curve = useMemo(
    () =>
      Array.from({ length: learnWeeks }, (_, i) => (i + 1) / (learnWeeks + 1)),
    [learnWeeks],
  )
  const plan = useMemo(
    () =>
      planRamp({
        demand,
        ratePerWeek: rate,
        veterans,
        curve,
        maxHiresPerWeek: maxHires,
      }),
    [demand, veterans, curve, maxHires],
  )

  const W = 720
  const H = 220
  const pad = { l: 8, r: 8, t: 10, b: 26 }
  const top = Math.max(...demand, ...plan.capacity) * 1.08
  const band = (W - pad.l - pad.r) / weeks
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b)
  const firstHire = plan.hires.findIndex((h) => h > 0)

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <Stat
            label={tr({ es: 'Contrataciones', en: 'Hires' })}
            value={fmt(plan.totalHires)}
            tone={plan.feasible ? 'good' : 'bad'}
            note={
              plan.feasible
                ? tr({
                    es: 'Para cubrir toda la campaña',
                    en: 'To cover the whole peak',
                  })
                : tr({
                    es: 'No llega con este tope semanal',
                    en: 'Not enough with this weekly cap',
                  })
            }
          />
          <Stat
            label={tr({ es: 'Primera contratación', en: 'First hire' })}
            value={firstHire >= 0 ? `S${firstHire + 1}` : '—'}
            note={tr({
              es: 'Semanas antes del pico por la curva de aprendizaje',
              en: 'Weeks before the peak because of the learning curve',
            })}
          />
          <Stat
            label={tr({ es: 'Peor semana', en: 'Worst week' })}
            value={`${fmt(Math.min(...plan.gap))} uds.`}
            tone={Math.min(...plan.gap) < 0 ? 'bad' : 'good'}
            note={tr({
              es: 'Capacidad menos demanda',
              en: 'Capacity minus demand',
            })}
          />
        </div>
        <Panel
          title={tr({
            es: 'Capacidad frente a demanda',
            en: 'Capacity against demand',
          })}
          hint={tr({
            es: 'Las barras son la capacidad con las incorporaciones; la línea, la demanda semanal.',
            en: 'Bars are capacity including new starters; the line is weekly demand.',
          })}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={tr({
              es: 'Capacidad y demanda por semana',
              en: 'Capacity and demand by week',
            })}
          >
            {plan.capacity.map((c, w) => (
              <g key={w}>
                <rect
                  x={pad.l + w * band + 2}
                  y={y(c)}
                  width={band - 4}
                  height={H - pad.b - y(c)}
                  rx={3}
                  fill="var(--chart-actual)"
                  opacity={plan.gap[w] < 0 ? 0.45 : 0.9}
                />
                {plan.hires[w] > 0 && (
                  <text
                    x={pad.l + w * band + band / 2}
                    y={y(c) - 5}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--foreground)"
                  >
                    +{plan.hires[w]}
                  </text>
                )}
                <text
                  x={pad.l + w * band + band / 2}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--muted-foreground)"
                >
                  S{w + 1}
                </text>
              </g>
            ))}
            <path
              d={demand
                .map(
                  (d, w) =>
                    `${w ? 'L' : 'M'}${pad.l + w * band + band / 2},${y(d)}`,
                )
                .join(' ')}
              fill="none"
              stroke="var(--chart-plan)"
              strokeWidth={2.5}
              strokeDasharray="6 5"
            />
          </svg>
          <ul className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[var(--chart-actual)]" />
              {tr({
                es: 'Capacidad (+ altas de la semana)',
                en: 'Capacity (+ hires that week)',
              })}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-0 w-4 border-t-2 border-dashed border-[var(--chart-plan)]" />
              {tr({ es: 'Demanda', en: 'Demand' })}
            </li>
          </ul>
        </Panel>
      </div>
      <Panel title={tr({ es: 'Campaña', en: 'Peak season' })}>
        <div className="space-y-5">
          <SliderField
            label={tr({ es: 'Plantilla estable', en: 'Steady headcount' })}
            value={veterans}
            min={20}
            max={400}
            step={10}
            onChange={setVeterans}
          />
          <SliderField
            label={tr({ es: 'Subida en el pico', en: 'Peak uplift' })}
            value={peak}
            min={10}
            max={150}
            step={5}
            format={(v) => `+${v} %`}
            onChange={setPeak}
          />
          <SliderField
            label={tr({
              es: 'Semanas hasta ritmo pleno',
              en: 'Weeks to full pace',
            })}
            value={learnWeeks}
            min={1}
            max={6}
            onChange={setLearnWeeks}
          />
          <SliderField
            label={tr({
              es: 'Máximo de altas por semana',
              en: 'Max hires per week',
            })}
            value={maxHires}
            min={5}
            max={150}
            step={5}
            onChange={setMaxHires}
          />
          <p className="text-xs text-muted-foreground">
            {tr({
              es: 'Una incorporación rinde de forma progresiva hasta llegar al 100 %. El algoritmo contrata lo más tarde posible para que cada persona llegue a ritmo justo cuando hace falta.',
              en: 'A new starter ramps up progressively to 100%. The algorithm hires as late as possible so each person reaches pace just when needed.',
            })}
          </p>
        </div>
      </Panel>
    </div>
  )
}

// ---------- N03 Store deliveries ----------

function StoreDeliveries() {
  const { tr, lang } = useLanguage()
  const fmt = numberFormat(lang)
  const fmt1 = numberFormat(lang, 1)
  const [seed, setSeed] = useState(3)
  const [capacity, setCapacity] = useState(26)
  const [range, setRange] = useState(220)
  const depot = { x: 0, y: 0 }

  const stores = useMemo(() => {
    const rnd = seededRandom(seed)
    return Array.from({ length: 26 }, (_, i): Store => {
      const angle = rnd() * Math.PI * 2
      const r = 8 + rnd() * 70
      return {
        id: `T${i + 1}`,
        name: `T${String(i + 1).padStart(2, '0')}`,
        x: Math.cos(angle) * r * 1.4,
        y: Math.sin(angle) * r * 0.75,
        pallets: 2 + Math.floor(rnd() * 9),
      }
    })
  }, [seed])

  const plan = useMemo(
    () => planDeliveries(stores, depot, capacity, range),
    // depot is a constant origin
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stores, capacity, range],
  )

  const S = 4
  const W = 820
  const H = 420
  const sx = (x: number) => W / 2 + x * S
  const sy = (y: number) => H / 2 - y * S

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Stat
            label={tr({ es: 'Camiones', en: 'Trucks' })}
            value={fmt(plan.routes.length)}
            note={tr({
              es: `para ${stores.length} tiendas`,
              en: `for ${stores.length} stores`,
            })}
          />
          <Stat
            label={tr({ es: 'Kilómetros', en: 'Kilometres' })}
            value={fmt(plan.totalKm)}
            tone="good"
            note={tr({
              es: `${fmt(plan.baselineKm)} si cada tienda tuviera camión`,
              en: `${fmt(plan.baselineKm)} with one truck per store`,
            })}
          />
          <Stat
            label={tr({ es: 'Llenado medio', en: 'Average fill' })}
            value={`${fmt1(plan.fill * 100)} %`}
            tone={plan.fill >= 0.85 ? 'good' : 'warn'}
          />
          <Stat
            label={tr({ es: 'Fuera de alcance', en: 'Out of reach' })}
            value={fmt(plan.unassigned.length)}
            tone={plan.unassigned.length ? 'bad' : 'good'}
            note={tr({
              es: 'Tiendas que no caben con esta autonomía',
              en: 'Stores that do not fit this range',
            })}
          />
        </div>
        <Panel
          title={tr({
            es: 'Rutas desde la plataforma',
            en: 'Routes from the platform',
          })}
          hint={tr({
            es: 'Algoritmo de ahorros (Clarke-Wright): une tiendas si ahorra kilómetros y el camión no supera su carga ni su autonomía. Tiendas y distancias inventadas.',
            en: 'Savings algorithm (Clarke-Wright): joins stores when it saves kilometres and the truck stays within load and range. Stores and distances are made up.',
          })}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSeed(seed + 1)}
            >
              <Shuffle />
              {tr({ es: 'Otro día', en: 'Another day' })}
            </Button>
          }
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={tr({
              es: `${plan.routes.length} rutas, ${fmt(plan.totalKm)} km`,
              en: `${plan.routes.length} routes, ${fmt(plan.totalKm)} km`,
            })}
          >
            {plan.routes.map((r, i) => {
              const pts = [depot, ...r.stops, depot]
              const mid = r.stops[Math.floor(r.stops.length / 2)]
              return (
                <g key={i}>
                  <polyline
                    points={pts.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
                    fill="none"
                    stroke="var(--chart-actual)"
                    strokeWidth={2}
                    strokeOpacity={0.85}
                    strokeLinejoin="round"
                  />
                  <text
                    x={sx(mid.x) + 8}
                    y={sy(mid.y) - 8}
                    fontSize={11}
                    fill="var(--muted-foreground)"
                  >
                    R{i + 1}
                  </text>
                </g>
              )
            })}
            {stores.map((s) => {
              const out = plan.unassigned.includes(s)
              return (
                <g key={s.id}>
                  <circle
                    cx={sx(s.x)}
                    cy={sy(s.y)}
                    r={3 + s.pallets * 0.6}
                    fill={out ? 'var(--destructive)' : 'var(--foreground)'}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    <title>{`${s.name}: ${s.pallets}`}</title>
                  </circle>
                </g>
              )
            })}
            <rect
              x={sx(0) - 9}
              y={sy(0) - 9}
              width={18}
              height={18}
              rx={3}
              fill="var(--primary)"
            />
          </svg>
          <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2 xl:grid-cols-3">
            {plan.routes.map((r, i) => (
              <li
                key={i}
                className="flex justify-between gap-2 rounded bg-background/60 px-2 py-1.5 font-data"
              >
                <span>
                  R{i + 1} · {r.stops.length}{' '}
                  {tr({ es: 'tiendas', en: 'stores' })}
                </span>
                <span className="text-muted-foreground">
                  {r.pallets}/{capacity} · {fmt(r.km)} km
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title={tr({ es: 'Flota', en: 'Fleet' })}>
        <div className="space-y-5">
          <SliderField
            label={tr({ es: 'Palets por camión', en: 'Pallets per truck' })}
            value={capacity}
            min={12}
            max={33}
            onChange={setCapacity}
          />
          <SliderField
            label={tr({ es: 'Autonomía por ruta', en: 'Range per route' })}
            value={range}
            min={100}
            max={500}
            step={10}
            format={(v) => `${v} km`}
            onChange={setRange}
          />
          <p className="text-xs text-muted-foreground">
            {tr({
              es: 'Baja la autonomía para simular un camión eléctrico: aparecen más rutas y alguna tienda deja de ser alcanzable.',
              en: 'Lower the range to simulate an electric truck: more routes appear and some stores become unreachable.',
            })}
          </p>
        </div>
      </Panel>
    </div>
  )
}

// ---------- N04 Just in sequence ----------

function JustInSequence() {
  const { tr, lang } = useLanguage()
  const fmt1 = numberFormat(lang, 1)
  const [line, setLine] = useState(48)
  const [rackSize, setRackSize] = useState(12)
  const [prep, setPrep] = useState(1.6)
  const [transit, setTransit] = useState(15)
  const [racks, setRacks] = useState(4)
  const [preparers, setPreparers] = useState(1)

  const r = planJis({
    linePerHour: line,
    rackSize,
    prepMinPerUnit: prep,
    transitMin: transit,
    racks,
    preparers,
  })

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl border p-4',
            r.ok
              ? 'border-success/40 bg-success/10'
              : 'border-destructive/50 bg-destructive/10',
          )}
        >
          {r.ok ? (
            <CircleCheck className="size-6 shrink-0 text-success" />
          ) : (
            <CircleAlert className="size-6 shrink-0 text-destructive" />
          )}
          <div>
            <p className="font-display font-bold">
              {r.ok
                ? tr({
                    es: 'La línea está cubierta',
                    en: 'The line is covered',
                  })
                : tr({
                    es: 'Riesgo de parar la línea',
                    en: 'Risk of stopping the line',
                  })}
            </p>
            <p className="text-sm text-muted-foreground">
              {r.ok
                ? tr({
                    es: `Quedan ${fmt1(r.slackMin)} minutos de margen en cada ciclo.`,
                    en: `${fmt1(r.slackMin)} minutes of slack per cycle.`,
                  })
                : tr({
                    es: `Hacen falta ${r.racksNeeded} racks y ${r.preparersNeeded} preparadores; tienes ${racks} y ${preparers}.`,
                    en: `It needs ${r.racksNeeded} racks and ${r.preparersNeeded} preparers; you have ${racks} and ${preparers}.`,
                  })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Stat
            label={tr({ es: 'Cobertura de un rack', en: 'One rack covers' })}
            value={`${fmt1(r.coverageMin)} min`}
          />
          <Stat
            label={tr({ es: 'Preparar un rack', en: 'Preparing one rack' })}
            value={`${fmt1(r.prepMinPerRack)} min`}
            tone={preparers >= r.preparersNeeded ? 'good' : 'bad'}
          />
          <Stat
            label={tr({ es: 'Ciclo completo', en: 'Full cycle' })}
            value={`${fmt1(r.cycleMin)} min`}
            note={tr({
              es: 'Preparar, llevar y volver',
              en: 'Prepare, deliver and return',
            })}
          />
          <Stat
            label={tr({ es: 'Racks necesarios', en: 'Racks needed' })}
            value={String(r.racksNeeded)}
            tone={racks >= r.racksNeeded ? 'good' : 'bad'}
          />
        </div>
        <Panel
          title={tr({ es: 'Circuito de racks', en: 'Rack loop' })}
          hint={tr({
            es: 'Uno se consume en línea mientras el resto se prepara o viaja. Si el ciclo dura más que lo que cubren los racks en espera, la línea se queda sin piezas.',
            en: 'One is used on the line while the rest are prepared or travelling. If the cycle lasts longer than the waiting racks cover, the line runs out of parts.',
          })}
        >
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.max(racks, r.racksNeeded) }, (_, i) => {
              const missing = i >= racks
              const label =
                i === 0
                  ? tr({ es: 'En línea', en: 'On line' })
                  : i === 1
                    ? tr({ es: 'Preparando', en: 'Preparing' })
                    : tr({ es: 'En tránsito', en: 'In transit' })
              return (
                <div
                  key={i}
                  className={cn(
                    'grid h-20 w-24 place-items-center rounded-lg border text-center text-xs',
                    missing
                      ? 'border-dashed border-destructive/60 text-destructive-foreground'
                      : i === 0
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background/60',
                  )}
                >
                  <span>
                    <span className="block font-data text-sm font-bold">
                      #{i + 1}
                    </span>
                    {missing ? tr({ es: 'Falta', en: 'Missing' }) : label}
                  </span>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
      <Panel title={tr({ es: 'Línea y suministro', en: 'Line and supply' })}>
        <div className="space-y-5">
          <SliderField
            label={tr({ es: 'Coches por hora', en: 'Cars per hour' })}
            value={line}
            min={10}
            max={80}
            onChange={setLine}
          />
          <SliderField
            label={tr({ es: 'Piezas por rack', en: 'Parts per rack' })}
            value={rackSize}
            min={4}
            max={30}
            onChange={setRackSize}
          />
          <SliderField
            label={tr({
              es: 'Minutos por pieza al preparar',
              en: 'Minutes per part to prepare',
            })}
            value={prep}
            min={0.5}
            max={4}
            step={0.1}
            format={(v) => fmt1(v)}
            onChange={setPrep}
          />
          <SliderField
            label={tr({ es: 'Trayecto a la planta', en: 'Trip to the plant' })}
            value={transit}
            min={2}
            max={60}
            format={(v) => `${v} min`}
            onChange={setTransit}
          />
          <SliderField
            label={tr({
              es: 'Racks en circulación',
              en: 'Racks in circulation',
            })}
            value={racks}
            min={2}
            max={14}
            onChange={setRacks}
          />
          <SliderField
            label={tr({ es: 'Preparadores', en: 'Preparers' })}
            value={preparers}
            min={1}
            max={8}
            onChange={setPreparers}
          />
        </div>
      </Panel>
    </div>
  )
}

// ---------- N05 Multi-client provider ----------

function MultiClient() {
  const { tr } = useLanguage()
  const links: {
    to: '/app/kpis' | '/app/turno' | '/app/slotting'
    label: string
    text: string
  }[] = [
    {
      to: '/app/kpis',
      label: tr({ es: 'Un tablero por cliente', en: 'One board per client' }),
      text: tr({
        es: 'Mismas definiciones para todos; descarga una copia por cliente.',
        en: 'Same definitions for all; download one copy per client.',
      }),
    },
    {
      to: '/app/turno',
      label: tr({
        es: 'Reparto de personas por carga',
        en: 'Staffing by load',
      }),
      text: tr({
        es: 'Cada cliente como una zona: mueve gente donde está la carga del día.',
        en: 'Each client as a zone: move people where today’s load is.',
      }),
    },
    {
      to: '/app/slotting',
      label: tr({ es: 'Ubicación por rotación', en: 'Slotting by turnover' }),
      text: tr({
        es: 'Acerca lo que más sale de cada cliente sin mezclar contratos.',
        en: 'Bring each client’s fast movers closer without mixing contracts.',
      }),
    },
  ]
  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {links.map((l) => (
        <li key={l.to}>
          <Link
            to={l.to}
            className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-display font-bold">{l.label}</span>
            <span className="mt-1.5 flex-1 text-sm text-muted-foreground">
              {l.text}
            </span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary">
              {tr({ es: 'Abrir', en: 'Open' })}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const SCENARIOS: Record<SectorId, () => React.ReactNode> = {
  frio: ColdChain,
  ecom: PeakRamp,
  retail: StoreDeliveries,
  jis: JustInSequence,
  tpl: MultiClient,
}

function FactStrip({ sector }: { sector: Sector }) {
  const { tr } = useLanguage()
  return (
    <div className="mt-5">
      <p className="mb-2 font-data text-[10px] tracking-widest text-muted-foreground uppercase">
        {tr({
          es: 'Datos públicos de la región',
          en: 'Public data from the region',
        })}
      </p>
      <ul className="grid gap-2 sm:grid-cols-3">
        {sector.facts.map((f) => {
          const src = sourceById(f.source)
          return (
            <li
              key={f.label.es}
              className="rounded-lg border border-border bg-card p-3"
            >
              <p className="font-data text-lg font-bold text-primary">
                {f.value}
              </p>
              <p className="mt-0.5 text-xs leading-snug">{tr(f.label)}</p>
              {src && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  {src.publisher}
                  <ArrowUpRight className="size-3" />
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function SectorIntro({ sector }: { sector: Sector }) {
  const { tr } = useLanguage()
  const { update } = useWorkspace()
  const navigate = useNavigate()
  return (
    <div className="mb-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="font-data text-xs tracking-widest text-primary uppercase">
          {sector.code}
        </p>
        <h2 className="signage mt-2 text-2xl sm:text-3xl">{tr(sector.name)}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{tr(sector.where)}</p>
        <p className="mt-2 text-sm leading-relaxed">{tr(sector.how)}</p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1 text-xs">
          <CircleAlert className="size-3.5 text-warning" />
          {tr({ es: 'Lo que más duele:', en: 'What hurts most:' })}{' '}
          {tr(sector.pressure)}
        </p>
        <FactStrip sector={sector} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {tr({
            es: 'Lo que haría el primer mes',
            en: 'What I would do in the first month',
          })}
        </p>
        <ol className="mt-3 space-y-2">
          {sector.firstMonth.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm">
              <span className="font-data text-primary">0{i + 1}</span>
              {tr(step)}
            </li>
          ))}
        </ol>
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => {
            update((w) => ({ ...w, kpis: kpiPreset(sector.id) }))
            void navigate({ to: '/app/kpis' })
          }}
        >
          {tr({ es: 'Ver sus KPIs', en: 'See its KPIs' })}
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export function SectorCases() {
  const { tr } = useLanguage()
  const search = useSearch({ from: '/app/casos' })
  const [chosen, setActive] = useState<SectorId | null>(null)
  const active: SectorId = chosen ?? search.caso ?? 'frio'
  const sector = SECTORS.find((s) => s.id === active) ?? SECTORS[0]
  const Scenario = SCENARIOS[active]

  return (
    <>
      <div className="mb-5 max-w-3xl">
        <h1 className="signage text-3xl leading-[0.95] sm:text-4xl">
          {tr({ es: 'Casos del norte', en: 'Northern cases' })}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {tr({
            es: 'Cinco tipos de operación habituales en Asturias, Galicia, Cantabria y León. Cada uno con datos públicos de la región, cómo trabaja, qué le duele, un escenario que puedes mover y sus indicadores. Los escenarios son modelos simplificados con datos de ejemplo; las cifras públicas enlazan a su fuente.',
            en: 'Five types of operation common in Asturias, Galicia, Cantabria and León. Each with public data from the region, how it works, what hurts, a scenario you can play with and its indicators. Scenarios are simplified models with example data; public figures link to their source.',
          })}
        </p>
      </div>
      <div
        role="tablist"
        aria-label={tr({ es: 'Tipo de operación', en: 'Type of operation' })}
        className="mb-6 flex gap-2 overflow-x-auto pb-1"
      >
        {SECTORS.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={s.id === active}
            onClick={() => setActive(s.id)}
            className={cn(
              'shrink-0 rounded-lg border px-3 py-2 text-left text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
              s.id === active
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
      <div role="tabpanel">
        <SectorIntro sector={sector} />
        <Scenario />
      </div>
    </>
  )
}

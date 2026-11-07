// Pure planning logic: no React, no browser APIs, covered by algorithms.test.ts.

// ---------- Shift planner ----------

export interface Zone {
  id: string
  name: string
  demand: number
  rate: number
  workers: number
}

export interface ShiftParams {
  hours: number
  breakMin: number
  absenteeism: number
  margin: number
}

export interface ZonePlan {
  id: string
  name: string
  capacity: number
  load: number
  suggested: number
  suggestedLoad: number
}

export interface Move {
  from: string
  to: string
  count: number
}

export interface ShiftPlan {
  rows: ZonePlan[]
  moves: Move[]
  effectiveHours: number
  totalDemand: number
  totalCapacity: number
  load: number
  peakLoad: number
  peakLoadAfter: number
  rosterNeeded: number
  roster: number
}

export function planShift(zones: Zone[], p: ShiftParams): ShiftPlan {
  const effectiveHours = Math.max(0, p.hours - p.breakMin / 60)
  const presence = Math.max(0, 1 - p.absenteeism / 100)
  const headroom = Math.max(0, 1 - p.margin / 100)
  const perHead = (z: Zone) => effectiveHours * z.rate * headroom * presence
  const loadOf = (z: Zone, n: number) => {
    if (z.demand <= 0) return 0
    const cap = n * perHead(z)
    return cap > 0 ? z.demand / cap : Infinity
  }

  const roster = zones.reduce((s, z) => s + z.workers, 0)
  // Giving the next person to the most loaded zone minimises the peak load.
  const suggested = new Map(zones.map((z) => [z.id, 0]))
  for (let i = 0; i < roster; i++) {
    let worst: Zone | undefined
    let worstLoad = -1
    for (const z of zones) {
      if (z.demand <= 0) continue
      const load = loadOf(z, suggested.get(z.id) ?? 0)
      const rank = load === Infinity ? Number.MAX_VALUE - z.demand : load
      if (rank > worstLoad) {
        worstLoad = rank
        worst = z
      }
    }
    if (!worst) break
    suggested.set(worst.id, (suggested.get(worst.id) ?? 0) + 1)
  }

  const rows = zones.map((z) => {
    const n = suggested.get(z.id) ?? 0
    return {
      id: z.id,
      name: z.name,
      capacity: z.workers * perHead(z),
      load: loadOf(z, z.workers),
      suggested: n,
      suggestedLoad: loadOf(z, n),
    }
  })

  const surplus = zones
    .map((z) => ({ name: z.name, n: z.workers - (suggested.get(z.id) ?? 0) }))
    .filter((x) => x.n > 0)
  const deficit = zones
    .map((z) => ({ name: z.name, n: (suggested.get(z.id) ?? 0) - z.workers }))
    .filter((x) => x.n > 0)
  const moves: Move[] = []
  for (const d of deficit) {
    for (const s of surplus) {
      if (d.n === 0) break
      const count = Math.min(d.n, s.n)
      if (count > 0) {
        moves.push({ from: s.name, to: d.name, count })
        d.n -= count
        s.n -= count
      }
    }
  }

  const totalDemand = zones.reduce((s, z) => s + z.demand, 0)
  const totalCapacity = rows.reduce((s, r) => s + r.capacity, 0)
  const rosterNeeded = zones.reduce((s, z) => {
    if (z.demand <= 0) return s
    const unit = perHead(z)
    return unit > 0 ? s + Math.ceil(z.demand / unit) : s
  }, 0)

  return {
    rows,
    moves,
    effectiveHours,
    totalDemand,
    totalCapacity,
    load: totalCapacity > 0 ? totalDemand / totalCapacity : Infinity,
    peakLoad: Math.max(0, ...rows.map((r) => r.load)),
    peakLoadAfter: Math.max(0, ...rows.map((r) => r.suggestedLoad)),
    rosterNeeded,
    roster,
  }
}

export interface PaceReport {
  plan: number[]
  actual: number[]
  done: number
  hoursLogged: number
  recentRate: number
  projected: number
  gap: number
  neededRate: number
}

// `logged` holds units completed in each shift hour; null means not reported yet.
export function trackPace(
  demand: number,
  hours: number,
  logged: (number | null)[],
): PaceReport {
  const slots = Math.max(1, Math.ceil(hours))
  const plan = Array.from(
    { length: slots },
    (_, i) => (demand * Math.min(i + 1, hours)) / hours,
  )
  const entries: number[] = []
  for (let i = 0; i < slots; i++) {
    const v = logged[i]
    if (v === null || v === undefined) break
    entries.push(v)
  }
  const actual: number[] = []
  let done = 0
  for (const v of entries) {
    done += v
    actual.push(done)
  }
  const recent = entries.slice(-2)
  const recentRate = recent.length
    ? recent.reduce((s, v) => s + v, 0) / recent.length
    : 0
  const remaining = Math.max(0, hours - entries.length)
  const projected = done + recentRate * remaining
  return {
    plan,
    actual,
    done,
    hoursLogged: entries.length,
    recentRate,
    projected,
    gap: projected - demand,
    neededRate: remaining > 0 ? Math.max(0, demand - done) / remaining : 0,
  }
}

// ---------- Pick routes ----------

export interface WarehouseLayout {
  aisles: number
  bays: number
  aisleGap: number
  bayLength: number
}

export interface Location {
  aisle: number
  bay: number
}

export interface Point {
  x: number
  y: number
}

export const DEPOT: Location = { aisle: -1, bay: -1 }

const isDepot = (l: Location) => l.aisle < 0
const xOf = (l: Location, w: WarehouseLayout) => (l.aisle + 1) * w.aisleGap
const yOf = (l: Location, w: WarehouseLayout) =>
  isDepot(l) ? 0 : (l.bay + 0.5) * w.bayLength
export const aisleHeight = (w: WarehouseLayout) => w.bays * w.bayLength

export function toPoint(l: Location, w: WarehouseLayout): Point {
  return { x: xOf(l, w), y: yOf(l, w) }
}

export function distance(a: Location, b: Location, w: WarehouseLayout): number {
  const ya = yOf(a, w)
  const yb = yOf(b, w)
  if (a.aisle === b.aisle) return Math.abs(ya - yb)
  const h = aisleHeight(w)
  return Math.abs(xOf(a, w) - xOf(b, w)) + Math.min(ya + yb, 2 * h - ya - yb)
}

function legPath(a: Location, b: Location, w: WarehouseLayout): Point[] {
  const pa = toPoint(a, w)
  const pb = toPoint(b, w)
  if (a.aisle === b.aisle) return [pa, pb]
  const h = aisleHeight(w)
  const cross = pa.y + pb.y <= 2 * h - pa.y - pb.y ? 0 : h
  return [pa, { x: pa.x, y: cross }, { x: pb.x, y: cross }, pb]
}

export function tourLength(seq: Location[], w: WarehouseLayout): number {
  if (seq.length === 0) return 0
  let total = distance(DEPOT, seq[0], w)
  for (let i = 1; i < seq.length; i++) total += distance(seq[i - 1], seq[i], w)
  return total + distance(seq[seq.length - 1], DEPOT, w)
}

export function tourPath(seq: Location[], w: WarehouseLayout): Point[] {
  if (seq.length === 0) return []
  const stops = [DEPOT, ...seq, DEPOT]
  const path: Point[] = []
  for (let i = 1; i < stops.length; i++) {
    path.push(...legPath(stops[i - 1], stops[i], w))
  }
  return path
}

export function pathLength(path: Point[]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) {
    total +=
      Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y)
  }
  return total
}

// Classic S-shape: walk every aisle with picks end to end, then return.
export function sShapeRoute(
  picks: Location[],
  w: WarehouseLayout,
): { sequence: Location[]; path: Point[] } {
  const aisles = [...new Set(picks.map((p) => p.aisle))].sort((a, b) => a - b)
  if (aisles.length === 0) return { sequence: [], path: [] }
  const h = aisleHeight(w)
  const sequence: Location[] = []
  const path: Point[] = [toPoint(DEPOT, w)]
  aisles.forEach((aisle, i) => {
    const x = xOf({ aisle, bay: 0 }, w)
    const inAisle = picks
      .filter((p) => p.aisle === aisle)
      .sort((a, b) => a.bay - b.bay)
    const goingUp = i % 2 === 0
    sequence.push(...(goingUp ? inAisle : [...inAisle].reverse()))
    const isLastOdd = i === aisles.length - 1 && goingUp
    if (isLastOdd) {
      const top = yOf(inAisle[inAisle.length - 1], w)
      path.push({ x, y: 0 }, { x, y: top }, { x, y: 0 })
    } else {
      path.push({ x, y: goingUp ? 0 : h }, { x, y: goingUp ? h : 0 })
    }
  })
  path.push(toPoint(DEPOT, w))
  return { sequence, path }
}

function nearestNeighbour(picks: Location[], w: WarehouseLayout): Location[] {
  const left = [...picks]
  const out: Location[] = []
  let at = DEPOT
  while (left.length) {
    let best = 0
    let bestD = Infinity
    left.forEach((p, i) => {
      const d = distance(at, p, w)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    at = left[best]
    out.push(at)
    left.splice(best, 1)
  }
  return out
}

function twoOpt(seq: Location[], w: WarehouseLayout): Location[] {
  const route = [...seq]
  const at = (i: number) => (i < 0 || i >= route.length ? DEPOT : route[i])
  let improved = true
  while (improved) {
    improved = false
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 1; j < route.length; j++) {
        const before =
          distance(at(i - 1), at(i), w) + distance(at(j), at(j + 1), w)
        const after =
          distance(at(i - 1), at(j), w) + distance(at(i), at(j + 1), w)
        if (after + 1e-9 < before) {
          const head = route.slice(i, j + 1).reverse()
          route.splice(i, head.length, ...head)
          improved = true
        }
      }
    }
  }
  return route
}

// Seeding 2-opt with the S-shape order guarantees the result never loses to it.
export function optimiseRoute(
  picks: Location[],
  w: WarehouseLayout,
): Location[] {
  if (picks.length < 2) return [...picks]
  const fromNearest = twoOpt(nearestNeighbour(picks, w), w)
  const fromSShape = twoOpt(sShapeRoute(picks, w).sequence, w)
  return tourLength(fromNearest, w) <= tourLength(fromSShape, w)
    ? fromNearest
    : fromSShape
}

export function formatLocation(l: Location): string {
  return `A${String(l.aisle + 1).padStart(2, '0')}-${String(l.bay + 1).padStart(2, '0')}`
}

export function parseLocations(
  text: string,
  w: WarehouseLayout,
): { picks: Location[]; invalid: string[] } {
  const picks: Location[] = []
  const invalid: string[] = []
  const seen = new Set<string>()
  for (const raw of text.split(/[\n,;]+/)) {
    const token = raw.trim()
    if (!token) continue
    const m = /^[a-z]*\s*(\d{1,3})[\s\-/.:]+(\d{1,3})$/i.exec(token)
    const aisle = m ? Number(m[1]) - 1 : -1
    const bay = m ? Number(m[2]) - 1 : -1
    if (aisle < 0 || bay < 0 || aisle >= w.aisles || bay >= w.bays) {
      invalid.push(token)
      continue
    }
    const key = `${aisle}:${bay}`
    if (!seen.has(key)) {
      seen.add(key)
      picks.push({ aisle, bay })
    }
  }
  return { picks, invalid }
}

export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomPicks(
  count: number,
  w: WarehouseLayout,
  seed: number,
): Location[] {
  const rnd = seededRandom(seed)
  const seen = new Set<string>()
  const out: Location[] = []
  const max = Math.min(count, w.aisles * w.bays)
  while (out.length < max) {
    const l = {
      aisle: Math.floor(rnd() * w.aisles),
      bay: Math.floor(rnd() * w.bays),
    }
    const key = `${l.aisle}:${l.bay}`
    if (!seen.has(key)) {
      seen.add(key)
      out.push(l)
    }
  }
  return out
}

// ---------- ABC slotting ----------

export interface SkuRow {
  sku: string
  picks: number
}

export type AbcClass = 'A' | 'B' | 'C'

export interface SlottedSku extends SkuRow {
  rank: number
  share: number
  cumulative: number
  abc: AbcClass
  current: string
  proposed: string
  gain: number
}

export interface SlottingResult {
  rows: SlottedSku[]
  moves: SlottedSku[]
  counts: Record<AbcClass, number>
  picksByClass: Record<AbcClass, number>
  avgTravelNow: number
  avgTravelProposed: number
  totalPicks: number
}

export function parseSkus(text: string): {
  rows: SkuRow[]
  invalid: string[]
} {
  const rows: SkuRow[] = []
  const invalid: string[] = []
  const seen = new Set<string>()
  text.split(/\r?\n/).forEach((line, i) => {
    const raw = line.trim()
    if (!raw) return
    const parts = raw.split(/[;,\t]+/).map((s) => s.trim())
    const picks = Number(parts[parts.length - 1])
    const sku = parts[0]
    if (parts.length < 2 || !Number.isFinite(picks) || picks < 0) {
      // A header row is not a data error.
      if (i !== 0) invalid.push(raw)
      return
    }
    if (seen.has(sku)) {
      invalid.push(raw)
      return
    }
    seen.add(sku)
    rows.push({ sku, picks })
  })
  return { rows, invalid }
}

export function slotSkus(
  skus: SkuRow[],
  w: WarehouseLayout,
  thresholds: { a: number; b: number },
): SlottingResult {
  const capacity = w.aisles * w.bays
  const slots: Location[] = []
  for (let a = 0; a < w.aisles; a++) {
    for (let b = 0; b < w.bays; b++) slots.push({ aisle: a, bay: b })
  }
  const list = skus.slice(0, capacity)
  // The order of the list stands for where each SKU sits today.
  const currentSlots = list.map(
    (_, i) => slots[Math.floor((i * capacity) / Math.max(list.length, 1))],
  )
  const closest = [...slots]
    .sort((p, q) => distance(DEPOT, p, w) - distance(DEPOT, q, w))
    .slice(0, list.length)

  const totalPicks = list.reduce((s, r) => s + r.picks, 0)
  const order = list
    .map((row, i) => ({ row, current: currentSlots[i] }))
    .sort((p, q) => q.row.picks - p.row.picks)

  let running = 0
  let avgNow = 0
  let avgNew = 0
  const counts: Record<AbcClass, number> = { A: 0, B: 0, C: 0 }
  const picksByClass: Record<AbcClass, number> = { A: 0, B: 0, C: 0 }
  const rows = order.map(({ row, current }, i) => {
    const startShare = totalPicks > 0 ? (running / totalPicks) * 100 : 0
    running += row.picks
    const abc: AbcClass =
      startShare < thresholds.a ? 'A' : startShare < thresholds.b ? 'B' : 'C'
    const target = closest[i]
    const dNow = 2 * distance(DEPOT, current, w)
    const dNew = 2 * distance(DEPOT, target, w)
    avgNow += row.picks * dNow
    avgNew += row.picks * dNew
    counts[abc] += 1
    picksByClass[abc] += row.picks
    return {
      ...row,
      rank: i + 1,
      share: totalPicks > 0 ? (row.picks / totalPicks) * 100 : 0,
      cumulative: totalPicks > 0 ? (running / totalPicks) * 100 : 0,
      abc,
      current: formatLocation(current),
      proposed: formatLocation(target),
      gain: row.picks * (dNow - dNew),
    }
  })

  return {
    rows,
    moves: rows
      .filter((r) => r.gain > 0)
      .sort((p, q) => q.gain - p.gain)
      .slice(0, 12),
    counts,
    picksByClass,
    avgTravelNow: totalPicks > 0 ? avgNow / totalPicks : 0,
    avgTravelProposed: totalPicks > 0 ? avgNew / totalPicks : 0,
    totalPicks,
  }
}

// ---------- Cutoff planner ----------

export interface Wave {
  id: string
  name: string
  units: number
  cutoff: string
}

export interface ScheduledWave extends Wave {
  start: number
  end: number
  due: number
  slack: number
}

export interface CutoffPlan {
  fifo: ScheduledWave[]
  edd: ScheduledWave[]
  lateFifo: number
  lateEdd: number
  minimumRate: number
}

export function toMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0
}

export function formatClock(minutes: number): string {
  const total = ((Math.round(minutes) % 1440) + 1440) % 1440
  const h = Math.floor(total / 60)
  return `${String(h).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function planCutoffs(
  waves: Wave[],
  start: string,
  rate: number,
): CutoffPlan {
  const startMin = toMinutes(start)
  // A cutoff earlier than the shift start belongs to the next day (night shifts).
  const dueOf = (w: Wave) => {
    const due = toMinutes(w.cutoff)
    return due <= startMin ? due + 1440 : due
  }
  const run = (list: Wave[]) => {
    let clock = startMin
    return list.map((w) => {
      const begin = clock
      clock += rate > 0 ? (w.units / rate) * 60 : 0
      const due = dueOf(w)
      return { ...w, start: begin, end: clock, due, slack: due - clock }
    })
  }
  const byDue = [...waves].sort((a, b) => dueOf(a) - dueOf(b))
  const fifo = run(waves)
  const edd = run(byDue)
  let cumulative = 0
  let minimumRate = 0
  for (const w of byDue) {
    cumulative += w.units
    minimumRate = Math.max(
      minimumRate,
      cumulative / ((dueOf(w) - startMin) / 60),
    )
  }
  return {
    fifo,
    edd,
    lateFifo: fifo.filter((w) => w.slack < 0).length,
    lateEdd: edd.filter((w) => w.slack < 0).length,
    minimumRate,
  }
}

// Pure logic for the sector scenarios, covered by scenarios.test.ts.

// ---------- Cold chain: FIFO vs FEFO ----------

export interface Lot {
  id: string
  units: number
  receivedDay: number
  expiryDay: number
}

export interface RotationResult {
  served: number
  short: number
  wasted: number
  daily: { day: number; served: number; wasted: number }[]
}

// A lot can only be shipped while it still has `minShelfDays` of life left,
// which is how retail customers usually reject short-dated stock.
export function simulateRotation(
  lots: Lot[],
  demandPerDay: number,
  days: number,
  minShelfDays: number,
  policy: 'fifo' | 'fefo',
): RotationResult {
  const stock = lots.map((l) => ({ ...l, left: l.units, written: false }))
  const order = (a: (typeof stock)[number], b: (typeof stock)[number]) =>
    policy === 'fefo'
      ? a.expiryDay - b.expiryDay || a.receivedDay - b.receivedDay
      : a.receivedDay - b.receivedDay || a.expiryDay - b.expiryDay
  let served = 0
  let short = 0
  let wasted = 0
  const daily: RotationResult['daily'] = []
  for (let day = 0; day < days; day++) {
    let need = demandPerDay
    let servedToday = 0
    const sellable = stock
      .filter(
        (l) =>
          l.left > 0 &&
          l.receivedDay <= day &&
          l.expiryDay - day >= minShelfDays,
      )
      .sort(order)
    for (const l of sellable) {
      if (need <= 0) break
      const take = Math.min(need, l.left)
      l.left -= take
      need -= take
      servedToday += take
    }
    served += servedToday
    short += need
    let wastedToday = 0
    for (const l of stock) {
      if (!l.written && l.left > 0 && l.expiryDay - (day + 1) < minShelfDays) {
        l.written = true
        wastedToday += l.left
      }
    }
    wasted += wastedToday
    daily.push({ day, served: servedToday, wasted: wastedToday })
  }
  return { served, short, wasted, daily }
}

// ---------- Peak season ramp-up ----------

export interface RampInput {
  demand: number[]
  ratePerWeek: number
  veterans: number
  curve: number[]
  maxHiresPerWeek: number
}

export interface RampResult {
  hires: number[]
  capacity: number[]
  gap: number[]
  totalHires: number
  feasible: boolean
}

// New people reach full pace following `curve`, so a shortfall in week w is
// covered by hiring as late as possible while still being up to speed.
export function planRamp(input: RampInput): RampResult {
  const weeks = input.demand.length
  const hires = Array<number>(weeks).fill(0)
  const full = input.curve.length
  const capacityAt = (w: number) => {
    let c = input.veterans
    for (let s = 0; s <= w; s++) {
      const age = w - s
      c += hires[s] * (age < full ? input.curve[age] : 1)
    }
    return c * input.ratePerWeek
  }
  let feasible = true
  for (let w = 0; w < weeks; w++) {
    let guard = 0
    while (capacityAt(w) + 1e-9 < input.demand[w] && guard++ < 10000) {
      let s = Math.max(0, w - full + 1)
      while (s <= w && hires[s] >= input.maxHiresPerWeek) s++
      if (s > w) {
        feasible = false
        break
      }
      hires[s] += 1
    }
  }
  const capacity = input.demand.map((_, w) => capacityAt(w))
  return {
    hires,
    capacity,
    gap: capacity.map((c, w) => c - input.demand[w]),
    totalHires: hires.reduce((a, b) => a + b, 0),
    feasible,
  }
}

// ---------- Store delivery: Clarke-Wright savings ----------

export interface Store {
  id: string
  name: string
  x: number
  y: number
  pallets: number
}

export interface TruckRoute {
  stops: Store[]
  pallets: number
  km: number
}

export interface DeliveryPlan {
  routes: TruckRoute[]
  unassigned: Store[]
  totalKm: number
  baselineKm: number
  fill: number
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y)

export function routeKm(stops: Store[], depot: { x: number; y: number }) {
  if (!stops.length) return 0
  let km = dist(depot, stops[0]) + dist(stops[stops.length - 1], depot)
  for (let i = 1; i < stops.length; i++) km += dist(stops[i - 1], stops[i])
  return km
}

export function planDeliveries(
  stores: Store[],
  depot: { x: number; y: number },
  capacity: number,
  maxKm: number,
): DeliveryPlan {
  const fits = (s: Store) =>
    s.pallets <= capacity && routeKm([s], depot) <= maxKm
  const unassigned = stores.filter((s) => !fits(s))
  let routes: Store[][] = stores.filter(fits).map((s) => [s])

  const savings: { i: Store; j: Store; s: number }[] = []
  const ok = stores.filter(fits)
  for (let a = 0; a < ok.length; a++) {
    for (let b = a + 1; b < ok.length; b++) {
      const i = ok[a]
      const j = ok[b]
      savings.push({ i, j, s: dist(depot, i) + dist(depot, j) - dist(i, j) })
    }
  }
  savings.sort((p, q) => q.s - p.s)

  const pallets = (r: Store[]) => r.reduce((t, s) => t + s.pallets, 0)
  for (const { i, j, s } of savings) {
    if (s <= 0) break
    const ri = routes.find((r) => r.includes(i))
    const rj = routes.find((r) => r.includes(j))
    if (!ri || !rj || ri === rj) continue
    if (pallets(ri) + pallets(rj) > capacity) continue
    let merged: Store[] | null = null
    if (ri[ri.length - 1] === i && rj[0] === j) merged = [...ri, ...rj]
    else if (rj[rj.length - 1] === j && ri[0] === i) merged = [...rj, ...ri]
    else if (ri[0] === i && rj[0] === j) merged = [...[...ri].reverse(), ...rj]
    else if (ri[ri.length - 1] === i && rj[rj.length - 1] === j)
      merged = [...ri, ...[...rj].reverse()]
    if (!merged || routeKm(merged, depot) > maxKm) continue
    const mergedRoute = merged
    routes = [...routes.filter((r) => r !== ri && r !== rj), mergedRoute]
  }

  const result = routes.map((r) => ({
    stops: r,
    pallets: pallets(r),
    km: routeKm(r, depot),
  }))
  const totalKm = result.reduce((t, r) => t + r.km, 0)
  return {
    routes: result,
    unassigned,
    totalKm,
    baselineKm: ok.reduce((t, s) => t + routeKm([s], depot), 0),
    fill: result.length
      ? result.reduce((t, r) => t + r.pallets, 0) / (result.length * capacity)
      : 0,
  }
}

// ---------- Just-in-sequence supply ----------

export interface JisInput {
  linePerHour: number
  rackSize: number
  prepMinPerUnit: number
  transitMin: number
  racks: number
  preparers: number
}

export interface JisResult {
  coverageMin: number
  prepMinPerRack: number
  cycleMin: number
  racksNeeded: number
  preparersNeeded: number
  ok: boolean
  slackMin: number
}

// One rack feeds the line while the others are being prepared or travelling.
export function planJis(i: JisInput): JisResult {
  const coverageMin = i.linePerHour > 0 ? (i.rackSize / i.linePerHour) * 60 : 0
  const prepMinPerRack = i.rackSize * i.prepMinPerUnit
  const cycleMin = prepMinPerRack / Math.max(1, i.preparers) + 2 * i.transitMin
  const racksNeeded =
    coverageMin > 0 ? Math.ceil(cycleMin / coverageMin) + 1 : Infinity
  const preparersNeeded =
    coverageMin > 0 ? Math.ceil(prepMinPerRack / coverageMin) : Infinity
  const ok = i.racks >= racksNeeded && i.preparers >= preparersNeeded
  return {
    coverageMin,
    prepMinPerRack,
    cycleMin,
    racksNeeded,
    preparersNeeded,
    ok,
    slackMin: (i.racks - 1) * coverageMin - cycleMin,
  }
}

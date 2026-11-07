import { describe, expect, it } from 'vitest'
import {
  DEPOT,
  distance,
  optimiseRoute,
  parseLocations,
  parseSkus,
  pathLength,
  planCutoffs,
  planShift,
  randomPicks,
  sShapeRoute,
  slotSkus,
  tourLength,
  tourPath,
  trackPace,
} from './algorithms'

const layout = { aisles: 10, bays: 20, aisleGap: 3, bayLength: 1.5 }

describe('planShift', () => {
  const params = { hours: 8, breakMin: 30, absenteeism: 0, margin: 0 }

  it('computes capacity from present hours and rate', () => {
    const plan = planShift(
      [{ id: 'a', name: 'A', demand: 750, rate: 100, workers: 1 }],
      params,
    )
    expect(plan.rows[0].capacity).toBe(750)
    expect(plan.load).toBe(1)
    expect(plan.rosterNeeded).toBe(1)
  })

  it('moves people to the overloaded zone without changing the roster', () => {
    const plan = planShift(
      [
        { id: 'a', name: 'A', demand: 6000, rate: 100, workers: 2 },
        { id: 'b', name: 'B', demand: 750, rate: 100, workers: 6 },
      ],
      params,
    )
    expect(plan.rows.map((r) => r.suggested)).toEqual([7, 1])
    expect(plan.moves).toEqual([{ from: 'B', to: 'A', count: 5 }])
    expect(plan.peakLoadAfter).toBeLessThan(plan.peakLoad)
  })

  it('does not crash without people', () => {
    const plan = planShift(
      [{ id: 'a', name: 'A', demand: 100, rate: 100, workers: 0 }],
      params,
    )
    expect(plan.load).toBe(Infinity)
    expect(plan.moves).toEqual([])
  })
})

describe('trackPace', () => {
  it('projects from the last two reported hours', () => {
    const r = trackPace(800, 8, [100, 80, 120, null, 500])
    expect(r.hoursLogged).toBe(3)
    expect(r.done).toBe(300)
    expect(r.recentRate).toBe(100)
    expect(r.projected).toBe(800)
    expect(r.gap).toBe(0)
    expect(r.neededRate).toBe(100)
  })
})

describe('routes', () => {
  it('routes between aisles through the closest cross aisle', () => {
    const near = distance({ aisle: 0, bay: 0 }, { aisle: 1, bay: 0 }, layout)
    expect(near).toBeCloseTo(3 + 1.5)
    const far = distance({ aisle: 0, bay: 19 }, { aisle: 1, bay: 19 }, layout)
    expect(far).toBeCloseTo(3 + 1.5)
  })

  it('keeps drawn paths and measured distance equal', () => {
    const picks = randomPicks(25, layout, 7)
    const route = optimiseRoute(picks, layout)
    expect(pathLength(tourPath(route, layout))).toBeCloseTo(
      tourLength(route, layout),
    )
  })

  it('never loses to the list order or to S-shape, and visits every pick', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const picks = randomPicks(5 + (seed % 30), layout, seed)
      const route = optimiseRoute(picks, layout)
      const best = tourLength(route, layout)
      expect(route).toHaveLength(picks.length)
      expect(best).toBeLessThanOrEqual(tourLength(picks, layout) + 1e-6)
      expect(best).toBeLessThanOrEqual(
        pathLength(sShapeRoute(picks, layout).path) + 1e-6,
      )
    }
  })

  it('handles empty and single-pick orders', () => {
    expect(tourLength(optimiseRoute([], layout), layout)).toBe(0)
    const one = [{ aisle: 2, bay: 3 }]
    expect(tourLength(one, layout)).toBeCloseTo(
      2 * distance(DEPOT, one[0], layout),
    )
    expect(pathLength(sShapeRoute(one, layout).path)).toBeCloseTo(
      tourLength(one, layout),
    )
  })

  it('parses location codes and reports the bad ones', () => {
    const { picks, invalid } = parseLocations(
      'A03-12\n3-12\nB4/1; 99-1, nonsense',
      layout,
    )
    expect(picks).toEqual([
      { aisle: 2, bay: 11 },
      { aisle: 3, bay: 0 },
    ])
    expect(invalid).toEqual(['99-1', 'nonsense'])
  })
})

describe('slotting', () => {
  it('classifies by cumulative share and never worsens travel', () => {
    const { rows } = parseSkus('sku,picks\nC1,10\nA1,800\nB1,100\nC2,5\nC3,85')
    const r = slotSkus(rows, layout, { a: 80, b: 95 })
    expect(r.rows[0].sku).toBe('A1')
    expect(r.rows[0].abc).toBe('A')
    expect(r.rows.find((x) => x.sku === 'B1')?.abc).toBe('B')
    expect(r.rows.find((x) => x.sku === 'C2')?.abc).toBe('C')
    expect(r.avgTravelProposed).toBeLessThanOrEqual(r.avgTravelNow)
    expect(r.totalPicks).toBe(1000)
  })

  it('reports invalid and duplicated lines', () => {
    const { rows, invalid } = parseSkus('X,1\nX,2\nbad line\nY;abc\nZ\t4')
    expect(rows.map((r) => r.sku)).toEqual(['X', 'Z'])
    expect(invalid).toEqual(['X,2', 'bad line', 'Y;abc'])
  })
})

describe('planCutoffs', () => {
  const waves = [
    { id: '1', name: 'Late', units: 200, cutoff: '12:00' },
    { id: '2', name: 'Early', units: 100, cutoff: '09:00' },
  ]

  it('earliest cutoff first rescues what list order would miss', () => {
    const plan = planCutoffs(waves, '08:00', 100)
    expect(plan.lateFifo).toBe(1)
    expect(plan.lateEdd).toBe(0)
    expect(plan.edd.map((w) => w.name)).toEqual(['Early', 'Late'])
  })

  it('finds the minimum rate that makes every cutoff', () => {
    const plan = planCutoffs(waves, '08:00', 50)
    expect(plan.minimumRate).toBe(100)
    expect(planCutoffs(waves, '08:00', plan.minimumRate).lateEdd).toBe(0)
  })

  it('treats a cutoff before the start as next day', () => {
    const plan = planCutoffs(
      [{ id: '1', name: 'Night', units: 100, cutoff: '02:00' }],
      '22:00',
      100,
    )
    expect(plan.edd[0].slack).toBe(180)
  })
})

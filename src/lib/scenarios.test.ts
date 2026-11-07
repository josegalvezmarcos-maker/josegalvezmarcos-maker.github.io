import { describe, expect, it } from 'vitest'
import {
  planDeliveries,
  planJis,
  planRamp,
  routeKm,
  simulateRotation,
  type Store,
} from './scenarios'

describe('simulateRotation', () => {
  // The older lot was received first but expires last.
  const lots = [
    { id: 'old', units: 100, receivedDay: 0, expiryDay: 20 },
    { id: 'short', units: 100, receivedDay: 1, expiryDay: 6 },
  ]

  it('FEFO ships the short-dated lot first and wastes less', () => {
    const fifo = simulateRotation(lots, 30, 10, 2, 'fifo')
    const fefo = simulateRotation(lots, 30, 10, 2, 'fefo')
    expect(fefo.wasted).toBeLessThan(fifo.wasted)
    expect(fefo.served).toBeGreaterThan(fifo.served - 1)
    expect(fifo.served + fifo.short).toBe(300)
  })

  it('never ships stock below the minimum shelf life', () => {
    const r = simulateRotation(
      [{ id: 'a', units: 50, receivedDay: 0, expiryDay: 3 }],
      10,
      6,
      3,
      'fefo',
    )
    expect(r.served).toBe(10)
    expect(r.wasted).toBe(40)
  })
})

describe('planRamp', () => {
  const base = {
    ratePerWeek: 100,
    veterans: 10,
    curve: [0.5, 0.75],
    maxHiresPerWeek: 20,
  }

  it('meets every week when hiring is possible', () => {
    const r = planRamp({ ...base, demand: [1000, 1000, 1500, 2000] })
    expect(r.feasible).toBe(true)
    r.gap.forEach((g) => expect(g).toBeGreaterThanOrEqual(-1e-9))
    expect(r.hires[0]).toBe(0)
  })

  it('reports when the hiring cap makes a week impossible', () => {
    const r = planRamp({
      ...base,
      maxHiresPerWeek: 2,
      demand: [1000, 5000],
    })
    expect(r.feasible).toBe(false)
  })
})

describe('planDeliveries', () => {
  const depot = { x: 0, y: 0 }
  const stores: Store[] = [
    { id: '1', name: 'A', x: 10, y: 0, pallets: 6 },
    { id: '2', name: 'B', x: 12, y: 2, pallets: 6 },
    { id: '3', name: 'C', x: -10, y: 0, pallets: 6 },
    { id: '4', name: 'D', x: -11, y: -2, pallets: 6 },
    { id: '5', name: 'E', x: 0, y: 40, pallets: 40 },
  ]

  it('merges nearby stores within capacity and range', () => {
    const plan = planDeliveries(stores, depot, 14, 100)
    expect(plan.unassigned.map((s) => s.name)).toEqual(['E'])
    expect(plan.routes).toHaveLength(2)
    plan.routes.forEach((r) => {
      expect(r.pallets).toBeLessThanOrEqual(14)
      expect(r.km).toBeLessThanOrEqual(100)
      expect(r.km).toBeCloseTo(routeKm(r.stops, depot))
    })
    expect(plan.totalKm).toBeLessThan(plan.baselineKm)
  })

  it('keeps the range limit for electric trucks', () => {
    const plan = planDeliveries(stores.slice(0, 4), depot, 30, 25)
    plan.routes.forEach((r) => expect(r.km).toBeLessThanOrEqual(25))
    expect(
      plan.routes.reduce((t, r) => t + r.stops.length, 0) +
        plan.unassigned.length,
    ).toBe(4)
  })
})

describe('planJis', () => {
  it('sizes racks and preparers from line pace', () => {
    const r = planJis({
      linePerHour: 60,
      rackSize: 10,
      prepMinPerUnit: 1.5,
      transitMin: 10,
      racks: 4,
      preparers: 2,
    })
    expect(r.coverageMin).toBe(10)
    expect(r.prepMinPerRack).toBe(15)
    expect(r.preparersNeeded).toBe(2)
    expect(r.cycleMin).toBe(27.5)
    expect(r.racksNeeded).toBe(4)
    expect(r.ok).toBe(true)
  })

  it('flags a line stop risk when racks are short', () => {
    const r = planJis({
      linePerHour: 60,
      rackSize: 10,
      prepMinPerUnit: 1.5,
      transitMin: 10,
      racks: 3,
      preparers: 2,
    })
    expect(r.ok).toBe(false)
    expect(r.slackMin).toBeLessThan(0)
  })
})

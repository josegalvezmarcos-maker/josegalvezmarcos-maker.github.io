import { describe, expect, it } from 'vitest'
import { EVENTS, PLAN_UNITS, START, applyChoices, myRoute } from './shift-game'

describe('shift game', () => {
  it('every event offers three choices and a valid recommended one', () => {
    EVENTS.forEach((e) => {
      expect(e.choices).toHaveLength(3)
      expect(e.choices.some((c) => c.id === e.mine)).toBe(true)
    })
  })

  it('starts from the base state and adds the planned hourly pace', () => {
    expect(applyChoices([])).toEqual(START)
    const first = applyChoices(['prioritise'])
    expect(first.units).toBe(PLAN_UNITS / 8 - 200)
  })

  it('the recommended route keeps people safe and the team engaged', () => {
    const mine = applyChoices(myRoute())
    const shortcuts = applyChoices([
      'move',
      'paper',
      'substitute',
      'queue',
      'overtime',
      'log',
      'push',
      'skip',
    ])
    expect(mine.safety).toBeGreaterThan(shortcuts.safety)
    expect(mine.morale).toBeGreaterThan(shortcuts.morale)
    expect(mine.accuracy).toBeGreaterThan(shortcuts.accuracy)
    expect(mine.overtime).toBe(0)
  })

  it('keeps scores within range', () => {
    const worst = applyChoices([
      'move',
      'paper',
      'substitute',
      'reject',
      'ignore',
      'blame',
      'push',
      'skip',
    ])
    for (const k of ['accuracy', 'otif', 'safety', 'morale'] as const) {
      expect(worst[k]).toBeGreaterThanOrEqual(0)
      expect(worst[k]).toBeLessThanOrEqual(100)
    }
  })
})

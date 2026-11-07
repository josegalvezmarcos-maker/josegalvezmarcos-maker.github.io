import { describe, expect, it } from 'vitest'
import { SECTORS } from './sectors'
import { SOURCES, sourceById } from './sources'

describe('sources', () => {
  it('every public figure points to a listed source', () => {
    for (const sector of SECTORS) {
      for (const fact of sector.facts) {
        expect(
          sourceById(fact.source),
          `${sector.id}: ${fact.value}`,
        ).toBeDefined()
      }
    }
  })

  it('sources are unique and use https', () => {
    const ids = SOURCES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    SOURCES.forEach((s) => expect(s.url.startsWith('https://')).toBe(true))
  })
})

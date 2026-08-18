import { describe, it, expect } from 'vitest'
import { daysUntil, daysRemaining, isPastDeadline, monthsRemaining } from './dates'

const now = new Date('2026-01-01T00:00:00Z')

describe('daysUntil', () => {
  it('compte les jours à venir', () => {
    expect(daysUntil('2026-01-11T00:00:00Z', now)).toBe(10)
  })
  it('est négatif pour une date passée', () => {
    expect(daysUntil('2025-12-22T00:00:00Z', now)).toBe(-10)
  })
})

describe('daysRemaining', () => {
  it('borne à 0 pour une échéance dépassée', () => {
    expect(daysRemaining('2025-12-01T00:00:00Z', now)).toBe(0)
  })
  it('renvoie les jours restants sinon', () => {
    expect(daysRemaining('2026-01-06T00:00:00Z', now)).toBe(5)
  })
})

describe('isPastDeadline', () => {
  it('détecte une échéance dépassée', () => {
    expect(isPastDeadline('2025-12-31T00:00:00Z', now)).toBe(true)
    expect(isPastDeadline('2026-02-01T00:00:00Z', now)).toBe(false)
  })
})

describe('monthsRemaining', () => {
  it('convertit ~3 mois', () => {
    expect(monthsRemaining('2026-04-01T00:00:00Z', now)).toBe(3)
  })
  it('borne à 0 si dépassé', () => {
    expect(monthsRemaining('2025-11-01T00:00:00Z', now)).toBe(0)
  })
})

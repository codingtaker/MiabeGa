import { describe, it, expect } from 'vitest'
import { sum, safeDivide, percentage, clamp, clampPercent, roundMoney, formatFCFA, splitAmount } from './money'

describe('sum', () => {
  it('additionne une liste', () => expect(sum([100, 200, 50])).toBe(350))
  it('renvoie 0 pour une liste vide', () => expect(sum([])).toBe(0))
  it('gère les négatifs', () => expect(sum([100, -30])).toBe(70))
})

describe('safeDivide', () => {
  it('divise normalement', () => expect(safeDivide(10, 2)).toBe(5))
  it('renvoie 0 si dénominateur nul', () => expect(safeDivide(10, 0)).toBe(0))
})

describe('percentage', () => {
  it('calcule un pourcentage', () => expect(percentage(25, 200)).toBe(12.5))
  it('renvoie 0 si le tout est nul', () => expect(percentage(10, 0)).toBe(0))
})

describe('clamp / clampPercent', () => {
  it('borne dans un intervalle', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })
  it('borne un pourcentage à [0,100]', () => {
    expect(clampPercent(150)).toBe(100)
    expect(clampPercent(-20)).toBe(0)
  })
})

describe('roundMoney / formatFCFA', () => {
  it('arrondit à l\'entier', () => expect(roundMoney(1499.6)).toBe(1500))
  it('formate en FCFA', () => {
    expect(formatFCFA(1500000)).toMatch(/1.500.000 FCFA/)
    expect(formatFCFA(0)).toBe('0 FCFA')
  })
})

describe('splitAmount', () => {
  it('répartit également quand divisible', () => {
    expect(splitAmount(300, 3)).toEqual([100, 100, 100])
  })
  it('distribue le reste aux premières parts', () => {
    expect(splitAmount(100, 3)).toEqual([34, 33, 33])
  })
  it('la somme vaut toujours la cible', () => {
    const parts = splitAmount(1000, 7)
    expect(sum(parts)).toBe(1000)
    expect(parts).toHaveLength(7)
  })
  it('renvoie [] si parts <= 0', () => expect(splitAmount(100, 0)).toEqual([]))
})

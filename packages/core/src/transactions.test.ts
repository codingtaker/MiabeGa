import { describe, it, expect } from 'vitest'
import type { Transaction } from '@miabega/shared'
import {
  totalByType,
  totalIncome,
  totalExpense,
  netBalance,
  monthlySavings,
  savingsRate,
  spendingByCategory,
  projectedSavings,
} from './transactions'

function tx(over: Partial<Transaction> = {}): Transaction {
  return {
    id: 't',
    type: 'expense',
    amount: 1000,
    description: '',
    category: 'nourriture',
    date: '2026-01-05',
    userId: 'u1',
    ...over,
  }
}

const sample: Transaction[] = [
  tx({ id: 't1', type: 'income', amount: 50000, category: 'salaire' }),
  tx({ id: 't2', type: 'expense', amount: 12000, category: 'nourriture' }),
  tx({ id: 't3', type: 'expense', amount: 8000, category: 'transport' }),
  tx({ id: 't4', type: 'expense', amount: 3000, category: 'nourriture' }),
]

describe('totalByType / income / expense', () => {
  it('somme par type', () => {
    expect(totalByType(sample, 'income')).toBe(50000)
    expect(totalByType(sample, 'expense')).toBe(23000)
  })
  it('helpers dédiés', () => {
    expect(totalIncome(sample)).toBe(50000)
    expect(totalExpense(sample)).toBe(23000)
  })
  it('0 sur liste vide', () => expect(totalIncome([])).toBe(0))
})

describe('netBalance', () => {
  it('revenus - dépenses', () => expect(netBalance(sample)).toBe(27000))
})

describe('monthlySavings', () => {
  it('revenus - dépenses', () => expect(monthlySavings(50000, 23000)).toBe(27000))
  it('négatif en déficit', () => expect(monthlySavings(20000, 30000)).toBe(-10000))
})

describe('savingsRate', () => {
  it('calcule le taux', () => expect(savingsRate(50000, 23000)).toBe(54))
  it('négatif en déficit', () => expect(savingsRate(20000, 30000)).toBe(-50))
  it('0 si revenus nuls', () => expect(savingsRate(0, 10000)).toBe(0))
})

describe('spendingByCategory', () => {
  it('agrège les dépenses par catégorie, triées', () => {
    expect(spendingByCategory(sample)).toEqual([
      { category: 'nourriture', total: 15000 },
      { category: 'transport', total: 8000 },
    ])
  })
  it('ignore les revenus', () => {
    expect(spendingByCategory([tx({ type: 'income', amount: 9999, category: 'salaire' })])).toEqual([])
  })
})

describe('projectedSavings', () => {
  it('modèle linéaire', () => expect(projectedSavings(10000, 5000, 6)).toBe(40000))
  it('0 mois = solde actuel', () => expect(projectedSavings(10000, 5000, 0)).toBe(10000))
})

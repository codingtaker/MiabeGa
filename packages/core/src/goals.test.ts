import { describe, it, expect } from 'vitest'
import type { Goal } from '@miabega/shared'
import {
  goalProgress,
  goalRawProgress,
  goalRemaining,
  isGoalComplete,
  isGoalOverdue,
  requiredMonthlySaving,
  averageGoalsProgress,
  goalsByStatus,
} from './goals'

const now = new Date('2026-01-01T00:00:00Z')

function makeGoal(over: Partial<Goal> = {}): Goal {
  return {
    id: 'g1',
    name: 'Ordinateur',
    description: '',
    targetAmount: 12000,
    currentAmount: 3000,
    deadline: '2026-04-01T00:00:00Z',
    category: 'tech',
    priority: 'medium',
    status: 'active',
    ...over,
  }
}

describe('goalProgress', () => {
  it('calcule le %', () => expect(goalProgress(makeGoal())).toBe(25))
  it('borne à 100 si sur-financé', () =>
    expect(goalProgress(makeGoal({ currentAmount: 15000 }))).toBe(100))
  it('renvoie 0 si cible nulle', () =>
    expect(goalProgress(makeGoal({ targetAmount: 0 }))).toBe(0))
})

describe('goalRawProgress', () => {
  it('dépasse 100 sans borne', () =>
    expect(goalRawProgress(makeGoal({ currentAmount: 24000 }))).toBe(200))
})

describe('goalRemaining', () => {
  it('montant restant', () => expect(goalRemaining(makeGoal())).toBe(9000))
  it('jamais négatif', () =>
    expect(goalRemaining(makeGoal({ currentAmount: 20000 }))).toBe(0))
})

describe('isGoalComplete', () => {
  it('vrai quand atteint', () =>
    expect(isGoalComplete(makeGoal({ currentAmount: 12000 }))).toBe(true))
  it('faux sinon', () => expect(isGoalComplete(makeGoal())).toBe(false))
})

describe('isGoalOverdue', () => {
  it('vrai si dépassé et non atteint', () =>
    expect(isGoalOverdue(makeGoal({ deadline: '2025-12-01T00:00:00Z' }), now)).toBe(true))
  it('faux si atteint même après échéance', () =>
    expect(
      isGoalOverdue(makeGoal({ deadline: '2025-12-01T00:00:00Z', currentAmount: 12000 }), now),
    ).toBe(false))
})

describe('requiredMonthlySaving', () => {
  it('répartit le restant sur les mois', () =>
    expect(requiredMonthlySaving(makeGoal({ currentAmount: 0 }), now)).toBe(4000)) // 12000/3
  it('0 si objectif atteint', () =>
    expect(requiredMonthlySaving(makeGoal({ currentAmount: 12000 }), now)).toBe(0))
  it('renvoie tout le restant si échéance dépassée', () =>
    expect(
      requiredMonthlySaving(makeGoal({ currentAmount: 2000, deadline: '2025-12-01T00:00:00Z' }), now),
    ).toBe(10000))
})

describe('averageGoalsProgress', () => {
  it('moyenne des progressions', () => {
    const goals = [makeGoal({ currentAmount: 3000 }), makeGoal({ currentAmount: 9000 })] // 25% et 75%
    expect(averageGoalsProgress(goals)).toBe(50)
  })
  it('0 pour liste vide', () => expect(averageGoalsProgress([])).toBe(0))
})

describe('goalsByStatus', () => {
  it('filtre par statut', () => {
    const goals = [makeGoal(), makeGoal({ status: 'completed' })]
    expect(goalsByStatus(goals, 'completed')).toHaveLength(1)
  })
})

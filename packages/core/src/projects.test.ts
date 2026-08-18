import { describe, it, expect } from 'vitest'
import type { Project, Contribution } from '@miabega/shared'
import {
  contributionsTotal,
  projectProgress,
  projectRemaining,
  isProjectComplete,
  contributionsByUser,
  topContributor,
  equalShares,
  applyContribution,
} from './projects'
import { sum } from './money'

function contrib(over: Partial<Contribution> = {}): Contribution {
  return { id: 'c', userId: 'u1', userName: 'Ama', amount: 1000, date: '2026-01-01', ...over }
}

function makeProject(over: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Voyage',
    description: '',
    targetAmount: 10000,
    currentAmount: 4000,
    deadline: '2026-06-01T00:00:00Z',
    category: 'voyage',
    participants: 3,
    isAdmin: true,
    status: 'active',
    contributions: [
      contrib({ id: 'c1', userId: 'u1', userName: 'Ama', amount: 1000 }),
      contrib({ id: 'c2', userId: 'u2', userName: 'Koffi', amount: 2000 }),
      contrib({ id: 'c3', userId: 'u1', userName: 'Ama', amount: 1000 }),
    ],
    ...over,
  }
}

describe('contributionsTotal', () => {
  it('somme les contributions', () => expect(contributionsTotal(makeProject())).toBe(4000))
  it('0 sans contribution', () =>
    expect(contributionsTotal(makeProject({ contributions: [] }))).toBe(0))
})

describe('projectProgress', () => {
  it('calcule le %', () => expect(projectProgress(makeProject())).toBe(40))
  it('borne à 100', () =>
    expect(projectProgress(makeProject({ currentAmount: 15000 }))).toBe(100))
})

describe('projectRemaining', () => {
  it('restant à collecter', () => expect(projectRemaining(makeProject())).toBe(6000))
  it('jamais négatif', () =>
    expect(projectRemaining(makeProject({ currentAmount: 20000 }))).toBe(0))
})

describe('isProjectComplete', () => {
  it('vrai quand atteint', () =>
    expect(isProjectComplete(makeProject({ currentAmount: 10000 }))).toBe(true))
})

describe('contributionsByUser', () => {
  it('agrège et trie par montant décroissant', () => {
    const ranked = contributionsByUser(makeProject())
    expect(ranked).toEqual([
      { userId: 'u1', userName: 'Ama', total: 2000 },
      { userId: 'u2', userName: 'Koffi', total: 2000 },
    ])
  })
})

describe('topContributor', () => {
  it('renvoie le premier', () => expect(topContributor(makeProject())?.userId).toBe('u1'))
  it('null sans contribution', () =>
    expect(topContributor(makeProject({ contributions: [] }))).toBeNull())
})

describe('equalShares', () => {
  it('répartit le restant entre membres', () => {
    const shares = equalShares(makeProject(), 3) // restant 6000 / 3
    expect(shares).toEqual([2000, 2000, 2000])
    expect(sum(shares)).toBe(6000)
  })
  it('gère un reste non divisible', () => {
    const shares = equalShares(makeProject({ currentAmount: 3000 }), 3) // restant 7000
    expect(sum(shares)).toBe(7000)
  })
})

describe('applyContribution', () => {
  it('ajoute la contribution de façon immuable', () => {
    const project = makeProject()
    const updated = applyContribution(project, contrib({ id: 'c4', amount: 500 }))
    expect(updated.currentAmount).toBe(4500)
    expect(updated.contributions).toHaveLength(4)
    // immuabilité : l'original n'a pas changé
    expect(project.currentAmount).toBe(4000)
    expect(project.contributions).toHaveLength(3)
  })
})

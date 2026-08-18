import type { Project, Contribution } from '@miabega/shared'
import { clampPercent, percentage, sum, splitAmount } from './money'

/** Total réellement contribué (somme des contributions enregistrées). */
export function contributionsTotal(project: Project): number {
  return sum(project.contributions.map((c) => c.amount))
}

/** Progression d'un projet en %, bornée à [0, 100] (basée sur currentAmount). */
export function projectProgress(project: Project): number {
  return clampPercent(percentage(project.currentAmount, project.targetAmount))
}

/** Montant restant à collecter (jamais négatif). */
export function projectRemaining(project: Project): number {
  return Math.max(0, project.targetAmount - project.currentAmount)
}

/** Vrai si l'objectif du projet est atteint. */
export function isProjectComplete(project: Project): boolean {
  return project.currentAmount >= project.targetAmount
}

export interface UserContribution {
  userId: string
  userName: string
  total: number
}

/** Agrège les contributions par utilisateur, triées par montant décroissant. */
export function contributionsByUser(project: Project): UserContribution[] {
  const map = new Map<string, UserContribution>()
  for (const c of project.contributions) {
    const existing = map.get(c.userId)
    if (existing) {
      existing.total += c.amount
    } else {
      map.set(c.userId, { userId: c.userId, userName: c.userName, total: c.amount })
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
}

/** Plus gros contributeur, ou null si aucune contribution. */
export function topContributor(project: Project): UserContribution | null {
  const ranked = contributionsByUser(project)
  return ranked.length > 0 ? ranked[0] : null
}

/**
 * Part égale par membre pour atteindre l'objectif restant du projet.
 * Retourne un tableau de `memberCount` montants entiers dont la somme vaut
 * exactement le montant restant (le reste d'arrondi est réparti équitablement).
 */
export function equalShares(project: Project, memberCount: number): number[] {
  return splitAmount(projectRemaining(project), memberCount)
}

/** Ajoute une contribution et renvoie un nouveau projet (immuable). */
export function applyContribution(project: Project, contribution: Contribution): Project {
  return {
    ...project,
    currentAmount: project.currentAmount + contribution.amount,
    contributions: [...project.contributions, contribution],
  }
}

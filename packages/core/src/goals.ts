import type { Goal } from '@miabega/shared'
import { clampPercent, percentage, safeDivide, roundMoney } from './money'
import { monthsRemaining, isPastDeadline } from './dates'

/** Progression d'un objectif en %, bornée à [0, 100]. */
export function goalProgress(goal: Goal): number {
  return clampPercent(percentage(goal.currentAmount, goal.targetAmount))
}

/** Progression brute (non bornée) — peut dépasser 100 si sur-financé. */
export function goalRawProgress(goal: Goal): number {
  return percentage(goal.currentAmount, goal.targetAmount)
}

/** Montant restant à épargner (jamais négatif). */
export function goalRemaining(goal: Goal): number {
  return Math.max(0, goal.targetAmount - goal.currentAmount)
}

/** Vrai si l'objectif est atteint. */
export function isGoalComplete(goal: Goal): boolean {
  return goal.currentAmount >= goal.targetAmount
}

/** Vrai si l'objectif est en retard (échéance dépassée et non atteint). */
export function isGoalOverdue(goal: Goal, now: Date = new Date()): boolean {
  return !isGoalComplete(goal) && isPastDeadline(goal.deadline, now)
}

/**
 * Épargne mensuelle requise pour atteindre l'objectif à l'échéance.
 * 0 si l'objectif est déjà atteint. Si l'échéance est dépassée mais l'objectif
 * non atteint, renvoie le montant restant complet (à épargner immédiatement).
 */
export function requiredMonthlySaving(goal: Goal, now: Date = new Date()): number {
  const remaining = goalRemaining(goal)
  if (remaining === 0) return 0
  const months = monthsRemaining(goal.deadline, now)
  if (months === 0) return roundMoney(remaining)
  return roundMoney(safeDivide(remaining, months))
}

/** Progression moyenne d'une liste d'objectifs, en % (0 si liste vide). */
export function averageGoalsProgress(goals: Goal[]): number {
  if (goals.length === 0) return 0
  const total = goals.reduce((acc, g) => acc + goalProgress(g), 0)
  return total / goals.length
}

/** Filtre les objectifs par statut. */
export function goalsByStatus(goals: Goal[], status: Goal['status']): Goal[] {
  return goals.filter((g) => g.status === status)
}

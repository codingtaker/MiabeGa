// Utilitaires de dates (purs, testables avec un `now` injectable).

export const MS_PER_DAY = 1000 * 60 * 60 * 24
const DAYS_PER_MONTH = 30.44 // moyenne, pour estimer un nombre de mois

/**
 * Nombre de jours entre maintenant et une échéance (ISO).
 * Positif = à venir, négatif = dépassé. Arrondi au jour supérieur.
 */
export function daysUntil(deadlineISO: string, now: Date = new Date()): number {
  const deadline = new Date(deadlineISO).getTime()
  return Math.ceil((deadline - now.getTime()) / MS_PER_DAY)
}

/** Jours restants avant l'échéance, borné à 0 (jamais négatif). */
export function daysRemaining(deadlineISO: string, now: Date = new Date()): number {
  return Math.max(0, daysUntil(deadlineISO, now))
}

/** Vrai si l'échéance est dépassée. */
export function isPastDeadline(deadlineISO: string, now: Date = new Date()): boolean {
  return daysUntil(deadlineISO, now) < 0
}

/** Nombre de mois (entier, arrondi au supérieur) restant avant l'échéance, borné à 0. */
export function monthsRemaining(deadlineISO: string, now: Date = new Date()): number {
  return Math.max(0, Math.ceil(daysRemaining(deadlineISO, now) / DAYS_PER_MONTH))
}

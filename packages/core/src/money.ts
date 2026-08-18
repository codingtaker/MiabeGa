// Utilitaires monétaires — Miabé Ga utilise le FCFA (XOF), sans sous-unité.
// Les montants sont donc manipulés comme des entiers (arrondis).

/** Somme d'une liste de montants (retourne 0 pour une liste vide). */
export function sum(amounts: number[]): number {
  return amounts.reduce((total, n) => total + n, 0)
}

/** Division sûre : renvoie 0 si le dénominateur est 0 (évite NaN/Infinity). */
export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator
}

/** Pourcentage d'une part par rapport à un tout (0 si le tout vaut 0). */
export function percentage(part: number, whole: number): number {
  return safeDivide(part, whole) * 100
}

/** Borne une valeur dans l'intervalle [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Borne un pourcentage dans [0, 100]. */
export function clampPercent(value: number): number {
  return clamp(value, 0, 100)
}

/** Arrondit un montant à l'entier FCFA le plus proche. */
export function roundMoney(amount: number): number {
  return Math.round(amount)
}

/** Formate un montant en FCFA, ex: 1500000 → "1 500 000 FCFA". */
export function formatFCFA(amount: number): string {
  return `${roundMoney(amount).toLocaleString('fr-FR')} FCFA`
}

/**
 * Répartit un montant cible en `parts` contributions entières égales.
 * Le reste (dû à l'arrondi) est distribué 1 par 1 aux premières parts,
 * de sorte que la somme du tableau retourné vaut exactement `target`.
 */
export function splitAmount(target: number, parts: number): number[] {
  if (parts <= 0) return []
  const base = Math.floor(target / parts)
  let remainder = target - base * parts
  return Array.from({ length: parts }, () => {
    if (remainder > 0) {
      remainder -= 1
      return base + 1
    }
    return base
  })
}

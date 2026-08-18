import type { Transaction } from '@miabega/shared'
import { percentage, sum } from './money'

type TxType = Transaction['type'] // 'income' | 'expense'

/** Total des montants d'un type donné (income/expense). */
export function totalByType(transactions: Transaction[], type: TxType): number {
  return sum(transactions.filter((t) => t.type === type).map((t) => t.amount))
}

/** Total des revenus. */
export function totalIncome(transactions: Transaction[]): number {
  return totalByType(transactions, 'income')
}

/** Total des dépenses. */
export function totalExpense(transactions: Transaction[]): number {
  return totalByType(transactions, 'expense')
}

/** Solde net issu des transactions (revenus − dépenses). */
export function netBalance(transactions: Transaction[]): number {
  return totalIncome(transactions) - totalExpense(transactions)
}

/** Épargne mensuelle = revenus − dépenses. */
export function monthlySavings(monthlyIncome: number, monthlyExpenses: number): number {
  return monthlyIncome - monthlyExpenses
}

/**
 * Taux d'épargne en % = (revenus − dépenses) / revenus × 100.
 * Peut être négatif (déficit). Renvoie 0 si les revenus sont nuls.
 */
export function savingsRate(monthlyIncome: number, monthlyExpenses: number): number {
  return percentage(monthlyIncome - monthlyExpenses, monthlyIncome)
}

/** Dépenses agrégées par catégorie, triées par montant décroissant. */
export function spendingByCategory(transactions: Transaction[]): Array<{ category: string; total: number }> {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

/**
 * Projection d'épargne : solde actuel + épargne mensuelle × nombre de mois.
 * (Modèle linéaire simple, sans intérêts.)
 */
export function projectedSavings(
  currentBalance: number,
  monthlySavingsAmount: number,
  months: number,
): number {
  return currentBalance + monthlySavingsAmount * months
}

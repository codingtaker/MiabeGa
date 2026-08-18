// Types partagés de l'application Miabé Ga.
// Réutilisables par le web (apps/web) et le mobile (apps/mobile).

export type Screen =
  | 'dashboard'
  | 'projects'
  | 'goals'
  | 'profile'
  | 'ai-assistant'
  | 'create-project'
  | 'create-goal'
  | 'active-project'
  | 'personal-goal'
  | 'personal-goal-detail'
  | 'add-transaction'
  | 'account-statistics'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  streak: number
  badges: string[]
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
}

export interface Project {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  participants: number
  isAdmin: boolean
  status: 'active' | 'completed' | 'cancelled'
  contributions: Contribution[]
}

export interface Goal {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'paused'
}

export interface Contribution {
  id: string
  userId: string
  userName: string
  amount: number
  date: string
  message?: string
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
  userId: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense' | 'both'
  color: string
}

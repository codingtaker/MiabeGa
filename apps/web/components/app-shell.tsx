'use client'

import { useState, useEffect } from 'react'
import BottomNavigation from '@/components/bottom-navigation'
import Dashboard from '@/components/screens/dashboard'
import Projects from '@/components/screens/projects'
import Goals from '@/components/screens/goals'
import Profile from '@/components/screens/profile'
import AIAssistant from '@/components/screens/ai-assistant'
import CreateProject from '@/components/screens/create-project'
import CreateGoal from '@/components/screens/create-goal'
import ActiveProject from '@/components/screens/active-project'
import PersonalGoal from '@/components/screens/personal-goal'
import PersonalGoalDetail from '@/components/screens/personal-goal-detail'
import AddTransaction from '@/components/screens/add-transaction'
import AccountStatistics from '@/components/screens/account-statistics'

import type {
  Screen,
  User,
  Project,
  Goal,
  Contribution,
  Transaction,
  Category,
} from '@miabega/shared'

interface AppProps {
  onLogout: () => void
}

function loadPersisted<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const initialProjects: Project[] = [
    {
      id: '1',
      name: 'Voyage Sénégal 2024',
      description: 'Voyage d\'études au Sénégal pour découvrir les entreprises locales',
      targetAmount: 500000,
      currentAmount: 320000,
      deadline: '2024-07-15',
      category: 'Voyage',
      participants: 8,
      isAdmin: true,
      status: 'active',
      contributions: [
        { id: '1', userId: '1', userName: 'Rachid K.', amount: 50000, date: '2024-01-15', message: 'Premier versement !' },
        { id: '2', userId: '2', userName: 'Charbel D.', amount: 40000, date: '2024-01-16' },
        { id: '3', userId: '3', userName: 'Fabrice S.', amount: 45000, date: '2024-01-17', message: 'Hâte de partir !' }
      ]
    },
    {
      id: '2',
      name: 'Ordinateur Portable',
      description: 'Achat groupé d\'ordinateurs portables pour les études',
      targetAmount: 800000,
      currentAmount: 800000,
      deadline: '2024-03-01',
      category: 'Équipement',
      participants: 5,
      isAdmin: false,
      status: 'completed',
      contributions: []
    }
]

const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Frais de scolarité',
    description: 'Économiser pour les frais de scolarité du prochain semestre',
    targetAmount: 200000,
    currentAmount: 150000,
    deadline: '2024-08-01',
    category: 'Éducation',
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    name: 'Nouveau téléphone',
    description: 'Remplacer mon téléphone actuel',
    targetAmount: 150000,
    currentAmount: 75000,
    deadline: '2024-06-01',
    category: 'Technologie',
    priority: 'medium',
    status: 'active'
  }
]

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 50000,
    description: 'Salaire étudiant',
    category: 'Travail',
    date: '2024-02-01',
    userId: '1'
  },
  {
    id: '2',
    type: 'expense',
    amount: 15000,
    description: 'Courses alimentaires',
    category: 'Alimentation',
    date: '2024-02-02',
    userId: '1'
  },
  {
    id: '3',
    type: 'expense',
    amount: 8000,
    description: 'Transport bus',
    category: 'Transport',
    date: '2024-02-03',
    userId: '1'
  }
]

const initialCategories: Category[] = [
  { id: '1', name: 'Alimentation', type: 'expense', color: '#ef4444' },
  { id: '2', name: 'Transport', type: 'expense', color: '#3b82f6' },
  { id: '3', name: 'Loisirs', type: 'expense', color: '#8b5cf6' },
  { id: '4', name: 'Éducation', type: 'expense', color: '#10b981' },
  { id: '5', name: 'Travail', type: 'income', color: '#f59e0b' },
  { id: '6', name: 'Bourse', type: 'income', color: '#06b6d4' }
]

export default function App({ onLogout }: AppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)

  const [user] = useState<User>({
    id: '1',
    name: 'Ais Emperios',
    email: 'aisemperios@gmail.com',
    avatar: '/placeholder-user.jpg',
    level: 3,
    xp: 2450,
    streak: 15,
    badges: ['Économe', 'Motivateur', 'Organisateur', 'Persévérant'],
    balance: 125000,
    monthlyIncome: 50000,
    monthlyExpenses: 35000
  })

  const [projects, setProjects] = useState<Project[]>(() => loadPersisted('miabe-projects', initialProjects))
  const [goals, setGoals] = useState<Goal[]>(() => loadPersisted('miabe-goals', initialGoals))
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadPersisted('miabe-transactions', initialTransactions))
  const [categories] = useState<Category[]>(initialCategories)

  useEffect(() => {
    localStorage.setItem('miabe-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('miabe-goals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem('miabe-transactions', JSON.stringify(transactions))
  }, [transactions])

  const addProject = (data: { name: string; description: string; targetAmount: number; category: string; deadline: string }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      deadline: data.deadline,
      category: data.category,
      participants: 1,
      isAdmin: true,
      status: 'active',
      contributions: []
    }
    setProjects(prev => [newProject, ...prev])
  }

  const addGoal = (data: { name: string; description: string; targetAmount: number; category: string; priority: 'low' | 'medium' | 'high'; deadline: string }) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      deadline: data.deadline,
      category: data.category,
      priority: data.priority,
      status: 'active'
    }
    setGoals(prev => [newGoal, ...prev])
  }

  const addTransaction = (data: { type: 'income' | 'expense'; amount: number; description: string; category: string; date: string }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: data.type,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: data.date,
      userId: user.id
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const navigateToScreen = (screen: Screen, projectId?: string, goalId?: string) => {
    try {
      setCurrentScreen(screen)
      if (projectId) setSelectedProjectId(projectId)
      if (goalId) setSelectedGoalId(goalId)
    } catch (error) {
      console.error("Navigation error:", error)

      setCurrentScreen('dashboard')
    }
  }

  const goBack = () => {
    if (currentScreen === 'create-project' || currentScreen === 'active-project') {
      setCurrentScreen('projects')
    } else if (currentScreen === 'create-goal' || currentScreen === 'personal-goal' || currentScreen === 'personal-goal-detail') {
      setCurrentScreen('goals')
    } else {
      setCurrentScreen('dashboard')
    }
  }

  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'dashboard':
          return (
            <Dashboard
              user={user}
              projects={projects}
              goals={goals}
              transactions={transactions}
              onNavigate={navigateToScreen}
            />
          )
        case 'projects':
          return (
            <Projects
              projects={projects}
              onNavigate={navigateToScreen}
            />
          )
        case 'goals':
          return (
            <Goals
              goals={goals}
              onNavigate={navigateToScreen}
            />
          )
        case 'profile':
          return (
            <Profile
              user={user}
              transactions={transactions}
              categories={categories}
              onLogout={onLogout}
              onNavigate={navigateToScreen}
            />
          )
        case 'ai-assistant':
          return <AIAssistant user={user} />
        case 'create-project':
          return <CreateProject onBack={goBack} onCreate={addProject} />
        case 'create-goal':
          return <CreateGoal onBack={goBack} onCreate={addGoal} />
        case 'active-project':
          const selectedProject = projects.find(p => p.id === selectedProjectId)
          return selectedProject ? (
            <ActiveProject
              project={selectedProject}
              onBack={goBack}
            />
          ) : <div>Project not found</div>
        case 'personal-goal':
          const selectedGoal = goals.find(g => g.id === selectedGoalId)
          return selectedGoal ? (
            <PersonalGoal
              goal={selectedGoal}
              onBack={goBack}
              onNavigate={navigateToScreen}
            />
          ) : <div>Goal not found</div>
        case 'personal-goal-detail':
          const selectedGoalDetail = goals.find(g => g.id === selectedGoalId)
          return selectedGoalDetail ? (
            <PersonalGoalDetail
              goal={selectedGoalDetail}
              onBack={goBack}
            />
          ) : <div>Goal detail not found</div>
        case 'add-transaction':
          return <AddTransaction onBack={goBack} categories={categories} onCreate={addTransaction} />
        case 'account-statistics':
          return <AccountStatistics transactions={transactions} categories={categories} onBack={goBack} />
        default:
          return (
            <Dashboard
              user={user}
              projects={projects}
              goals={goals}
              transactions={transactions}
              onNavigate={navigateToScreen}
            />
          )
      }
    } catch (error) {
      console.error("Error rendering screen:", error)
      return <div>Error: Could not render this screen.</div>
    }
  }

  const showBottomNav = !['create-project', 'create-goal', 'active-project', 'personal-goal', 'personal-goal-detail'].includes(currentScreen)

  return (
    <div className="flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ">
      <div className="max-w-sm mx-auto bg-white min-h-screen relative">
        {renderScreen()}
        {showBottomNav && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={navigateToScreen}
          />
        )}
      </div>
    </div>
  )
}

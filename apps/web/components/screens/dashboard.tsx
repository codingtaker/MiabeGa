'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Wallet, TrendingUp, TrendingDown, Plus, Users, Target, Calendar, Bot, ArrowRight, Zap } from 'lucide-react'
import type { User, Project, Goal, Screen, Transaction } from '@miabega/shared'
import { savingsRate, monthlySavings, projectProgress, goalProgress } from '@miabega/core'

interface DashboardProps {
  user: User
  projects: Project[]
  goals: Goal[]
  transactions: Transaction[]
  onNavigate: (screen: Screen, projectId?: string, goalId?: string) => void
}

export default function Dashboard({ user, projects, goals, transactions, onNavigate }: DashboardProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const activeGoals = goals.filter(g => g.status === 'active')
  const totalSavings = user.balance
  const monthlyProgress = savingsRate(user.monthlyIncome, user.monthlyExpenses)

  return (
    <div className="pb-20 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Salut {user.name.split(' ')[0]} !</h1>
              <div className="flex items-center space-x-2">
                <span className="text-white/90 text-sm">Niveau {user.level}</span>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-200" />
                  <span className="text-white/90 text-sm">{user.streak} jours</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('ai-assistant')}
            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full p-3"
          >
            <Bot className="w-5 h-5" />
          </Button>
        </div>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Solde total</p>
                <p className="text-3xl font-bold">{totalSavings.toLocaleString()} FCFA</p>
              </div>
              <Wallet className="w-8 h-8 text-white/80" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <div>
                  <p className="text-xs text-white/80">Revenus</p>
                  <p className="font-semibold">{user.monthlyIncome.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-300" />
                <div>
                  <p className="text-xs text-white/80">Dépenses</p>
                  <p className="font-semibold">{user.monthlyExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 -mt-4 space-y-6">
                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onNavigate('create-project')}
                className="miabe-button h-auto py-4 flex-col space-y-2"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm">Nouveau projet</span>
              </Button>
              <Button
                onClick={() => onNavigate('add-transaction')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-auto flex-col space-y-2"
              >
                <Wallet className="w-6 h-6" />
                <span className="text-sm">+ Transaction</span>
              </Button>
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Progression mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                            <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Épargne ce mois</span>
                  <span className="font-semibold text-green-600">
                    +{monthlySavings(user.monthlyIncome, user.monthlyExpenses).toLocaleString()} FCFA
                  </span>
                </div>
                <div className="relative">
                  <Progress value={monthlyProgress} className="h-3" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow-sm">
                      {monthlyProgress.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {monthlyProgress.toFixed(1)}% de vos revenus épargnés ce mois
                </p>
              </div>

                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Activité des 7 derniers jours</p>
                <div className="flex items-end justify-between space-x-1 h-16">
                  {[12, 8, 15, 6, 18, 22, 9].map((value, index) => {
                    const height = (value / 22) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-yellow-400 to-amber-500 rounded-t-sm min-h-[4px] transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`${value}k FCFA`}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Projets actifs
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('projects')}
                className="text-yellow-600 hover:text-yellow-700"
              >
                Voir tout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <div className="space-y-4">
                {activeProjects.slice(0, 2).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onNavigate('active-project', project.id)}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{project.name}</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {project.participants} membres
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress
                        value={projectProgress(project)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {project.currentAmount.toLocaleString()} / {project.targetAmount.toLocaleString()} FCFA
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(project.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun projet actif</p>
                <Button
                  onClick={() => onNavigate('create-project')}
                  className="miabe-button"
                >
                  Créer un projet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Objectifs personnels
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('goals')}
                className="text-yellow-600 hover:text-yellow-700"
              >
                Voir tout <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {activeGoals.slice(0, 2).map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => onNavigate('personal-goal', undefined, goal.id)}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{goal.name}</h3>
                      <Badge
                        variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {goal.priority === 'high' ? 'Urgent' : goal.priority === 'medium' ? 'Important' : 'Normal'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress
                        value={goalProgress(goal)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} FCFA
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun objectif défini</p>
                <Button
                  onClick={() => onNavigate('goals')}
                  className="miabe-button"
                >
                  Définir un objectif
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

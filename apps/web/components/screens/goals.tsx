'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Search, Filter, Plus, Target, Calendar, TrendingUp, CheckCircle, Clock, Pause, AlertTriangle, Laptop, GraduationCap, Plane, Heart, Music, Gamepad2, Car, Home } from 'lucide-react'
import type { Goal, Screen } from '@miabega/shared'
import { goalsByStatus, averageGoalsProgress, goalProgress, goalRemaining, daysUntil } from '@miabega/core'

interface GoalsProps {
  goals: Goal[]
  onNavigate: (screen: Screen, projectId?: string, goalId?: string) => void
}

export default function Goals({ goals, onNavigate }: GoalsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const allGoals = goals
  const statuses = ['all', 'active', 'completed', 'paused']

  const filteredGoals = allGoals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const activeGoals = goalsByStatus(allGoals, 'active')
  const completedGoals = goalsByStatus(allGoals, 'completed')
  const totalProgress = averageGoalsProgress(allGoals)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'paused':
        return <Pause className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'paused':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Urgent'
      case 'medium':
        return 'Important'
      case 'low':
        return 'Normal'
      default:
        return 'Normal'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technologie':
        return <Laptop className="w-5 h-5" />
      case 'éducation':
      case 'formation':
        return <GraduationCap className="w-5 h-5" />
      case 'voyage':
        return <Plane className="w-5 h-5" />
      case 'loisirs':
        return <Gamepad2 className="w-5 h-5" />
      case 'santé':
        return <Heart className="w-5 h-5" />
      case 'musique':
        return <Music className="w-5 h-5" />
      case 'transport':
        return <Car className="w-5 h-5" />
      case 'logement':
        return <Home className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const isDeadlineClose = (deadline: string) => {
    const diffDays = daysUntil(deadline)
    return diffDays <= 30 && diffDays > 0
  }

  return (
    <div className="pb-24 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 min-h-screen relative">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Mes Objectifs</h1>
            <p className="text-white/90">Atteignez vos rêves étape par étape</p>
          </div>
          <Button
  onClick={() => onNavigate('create-goal')}
  className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
>
  <Plus className="w-6 h-6" />
</Button>
        </div>

                <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un objectif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/90 dark:bg-gray-800/90 border-0 h-12 rounded-xl text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
                <div className="grid grid-cols-3 gap-3">
          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{activeGoals.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Actifs</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{completedGoals.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Terminés</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalProgress.toFixed(0)}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Progression</p>
            </CardContent>
          </Card>
        </div>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par statut</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status
                    ? "miabe-button text-xs py-1 px-3 h-auto"
                    : "text-xs py-1 px-3 h-auto border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                >
                  {status === 'all' ? 'Tous' :
                   status === 'active' ? 'Actifs' :
                   status === 'completed' ? 'Terminés' : 'En pause'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

                <div className="space-y-4">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => {
              const progressPercentage = goalProgress(goal)
              const remainingAmount = goalRemaining(goal)

              return (
                <Card
                  key={goal.id}
                  className="miabe-card dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
                  onClick={() => onNavigate('personal-goal', undefined, goal.id)}
                >
                  <CardContent className="p-0">
                                        <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            {getCategoryIcon(goal.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">
                                {goal.name}
                              </h3>
                              {isDeadlineClose(goal.deadline) && goal.status === 'active' && (
                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 items-stretch ml-0 mr-px">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(goal.status)}
                            <Badge className={`text-xs ${getStatusColor(goal.status)}`}>
                              {goal.status === 'active' ? 'Actif' :
                               goal.status === 'completed' ? 'Terminé' : 'En pause'}
                            </Badge>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
                            {getPriorityLabel(goal.priority)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                                        <div className="px-6 pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progression</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                              {progressPercentage.toFixed(1)}%
                            </span>
                            {goal.status === 'completed' && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>

                        <div className="relative">
                          <Progress
                            value={progressPercentage}
                            className="h-3 bg-gray-200 dark:bg-gray-700"
                          />
                          {progressPercentage > 15 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium drop-shadow-sm text-emerald-500">
                                {progressPercentage.toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {goal.currentAmount.toLocaleString()} FCFA épargnés
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">
                            {goal.status === 'completed' ? 'Objectif atteint !' :
                             `Reste: ${remainingAmount.toLocaleString()} FCFA`}
                          </span>
                        </div>
                      </div>
                    </div>

                                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                            </span>
                            {isDeadlineClose(goal.deadline) && goal.status === 'active' && (
                              <span className="text-xs text-orange-600 dark:text-orange-400 ml-2 font-medium">
                                (Bientôt !)
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {goal.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Aucun objectif trouvé</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {searchTerm || selectedStatus !== 'all'
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Définissez votre premier objectif personnel'
                  }
                </p>
                <Button
                  onClick={() => onNavigate('create-goal')}
                  className="miabe-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un objectif
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

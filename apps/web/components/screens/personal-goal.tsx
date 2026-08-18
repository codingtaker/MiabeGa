'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Target, Calendar, Plus, TrendingUp, Clock, AlertTriangle, Play, Pause, Settings, BarChart3 } from 'lucide-react'
import type { Goal, Screen } from '@miabega/shared'
import { goalProgress, goalRemaining, daysUntil } from '@miabega/core'

interface PersonalGoalProps {
  goal: Goal
  onBack: () => void
  onNavigate: (screen: Screen, projectId?: string, goalId?: string) => void
}

export default function PersonalGoal({ goal, onBack, onNavigate }: PersonalGoalProps) {
  const [contributionAmount, setContributionAmount] = useState('')
  const [isContributing, setIsContributing] = useState(false)
  const [showContributionForm, setShowContributionForm] = useState(false)

  const progressPercentage = goalProgress(goal)
  const remainingAmount = goalRemaining(goal)
  const daysRemaining = daysUntil(goal.deadline)

  const handleContribution = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return

    setIsContributing(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Goal contribution:', {
      amount: parseFloat(contributionAmount),
      goalId: goal.id
    })

    setIsContributing(false)
    setShowContributionForm(false)
    setContributionAmount('')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'paused':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const isDeadlineClose = daysRemaining <= 30 && daysRemaining > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{goal.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getStatusColor(goal.status)}`}>
                  {goal.status === 'active' ? 'Actif' :
                   goal.status === 'completed' ? 'Terminé' : 'En pause'}
                </Badge>
                <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
                  {getPriorityLabel(goal.priority)}
                </Badge>
                {isDeadlineClose && (
                  <AlertTriangle className="w-4 h-4 text-orange-200" />
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => onNavigate('personal-goal-detail', undefined, goal.id)}
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/90">Progression</span>
                <span className="font-bold text-xl">{progressPercentage.toFixed(1)}%</span>
              </div>

              <Progress value={progressPercentage} className="h-3 bg-white/20" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/80">Épargné</p>
                  <p className="font-semibold text-lg">{goal.currentAmount.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-white/80">Objectif</p>
                  <p className="font-semibold text-lg">{goal.targetAmount.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 -mt-4 pb-8 space-y-6">
                <div className="grid grid-cols-3 gap-3">
          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{progressPercentage.toFixed(0)}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Complété</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{daysRemaining}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Jours restants</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{remainingAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">FCFA restants</p>
            </CardContent>
          </Card>
        </div>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Description de l'objectif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{goal.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}</span>
                {isDeadlineClose && (
                  <span className="text-orange-600 ml-2">(Bientôt !)</span>
                )}
              </div>
              <Badge variant="outline">{goal.category}</Badge>
            </div>
          </CardContent>
        </Card>

                {goal.status === 'active' && (
          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-500" />
                  Ajouter à l'épargne
                </CardTitle>
                {!showContributionForm && (
                  <Button
                    onClick={() => setShowContributionForm(true)}
                    className="miabe-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Épargner
                  </Button>
                )}
              </div>
            </CardHeader>

            {showContributionForm && (
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Montant à épargner (FCFA)
                  </label>
                  <Input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="5000"
                    className="miabe-input"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleContribution}
                    disabled={isContributing || !contributionAmount}
                    className="flex-1 miabe-button"
                  >
                    {isContributing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Ajout...
                      </div>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowContributionForm(false)}
                    variant="outline"
                    className="px-6"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onNavigate('personal-goal-detail', undefined, goal.id)}
                variant="outline"
                className="h-auto py-4 flex-col space-y-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <span className="text-sm">Voir détails</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col space-y-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {goal.status === 'active' ? (
                  <>
                    <Pause className="w-6 h-6 text-orange-500" />
                    <span className="text-sm">Mettre en pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 text-green-500" />
                    <span className="text-sm">Reprendre</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

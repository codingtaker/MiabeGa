'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Target, Calendar, TrendingUp, Clock, AlertTriangle, Award, Zap, Star, Trophy, Gift, CheckCircle, Plus } from 'lucide-react'
import type { Goal } from '@miabega/shared'
import { goalProgress, goalRemaining, daysUntil } from '@miabega/core'

interface PersonalGoalDetailProps {
  goal: Goal
  onBack: () => void
}

export default function PersonalGoalDetail({ goal, onBack }: PersonalGoalDetailProps) {
  const progressPercentage = goalProgress(goal)
  const remainingAmount = goalRemaining(goal)
  const daysRemaining = daysUntil(goal.deadline)
  const isDeadlineClose = daysRemaining <= 30 && daysRemaining > 0

  const contributionHistory = [
    { date: '2024-01-15', amount: 25000, type: 'manual', description: 'Épargne mensuelle' },
    { date: '2024-01-20', amount: 15000, type: 'automatic', description: 'Virement automatique' },
    { date: '2024-01-25', amount: 10000, type: 'bonus', description: 'Bonus challenge' },
    { date: '2024-02-01', amount: 20000, type: 'manual', description: 'Épargne supplémentaire' },
    { date: '2024-02-10', amount: 15000, type: 'automatic', description: 'Virement automatique' },
  ]

  const milestones = [
    { percentage: 25, amount: goal.targetAmount * 0.25, reached: true, reward: '🎯 Badge Premier Pas', date: '2024-01-20' },
    { percentage: 50, amount: goal.targetAmount * 0.5, reached: true, reward: '⭐ +50 XP', date: '2024-02-05' },
    { percentage: 75, amount: goal.targetAmount * 0.75, reached: progressPercentage >= 75, reward: '🏆 Badge Persévérant', date: progressPercentage >= 75 ? '2024-02-15' : null },
    { percentage: 100, amount: goal.targetAmount, reached: false, reward: '🎉 Badge Objectif Atteint + 200 XP', date: null },
  ]

  const tips = [
    {
      icon: Zap,
      title: 'Automatisez vos virements',
      description: 'Configurez un virement automatique pour atteindre votre objectif plus facilement',
      color: 'text-yellow-500'
    },
    {
      icon: Target,
      title: 'Divisez votre objectif',
      description: 'Créez des sous-objectifs mensuels pour rester motivé',
      color: 'text-blue-500'
    },
    {
      icon: Gift,
      title: 'Récompensez-vous',
      description: 'Célébrez chaque étape franchie avec une petite récompense',
      color: 'text-pink-500'
    }
  ]

  const getContributionTypeColor = (type: string) => {
    switch (type) {
      case 'manual':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'automatic':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'bonus':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getContributionTypeLabel = (type: string) => {
    switch (type) {
      case 'manual':
        return 'Manuel'
      case 'automatic':
        return 'Automatique'
      case 'bonus':
        return 'Bonus'
      default:
        return 'Autre'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{goal.name}</h1>
            <p className="text-white/90">Analyse détaillée</p>
          </div>
        </div>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold mb-2">{progressPercentage.toFixed(1)}%</div>
              <p className="text-white/90">de votre objectif atteint</p>
            </div>

            <Progress value={progressPercentage} className="h-4 bg-white/20 mb-4" />

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-white/80">Épargné</p>
                <p className="font-semibold">{goal.currentAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/80">Restant</p>
                <p className="font-semibold">{remainingAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/80">Jours</p>
                <p className="font-semibold">{daysRemaining}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 -mt-4 pb-8 space-y-6">
                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Étapes et récompenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                    milestone.reached
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                      : progressPercentage >= milestone.percentage - 10
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.reached
                      ? 'bg-green-100 dark:bg-green-900/40'
                      : progressPercentage >= milestone.percentage - 10
                      ? 'bg-yellow-100 dark:bg-yellow-900/40'
                      : 'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    {milestone.reached ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <span className={`font-bold text-sm ${
                        progressPercentage >= milestone.percentage - 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                      }`}>
                        {milestone.percentage}%
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${
                        milestone.reached ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-gray-100'
                      }`}>
                        {milestone.percentage}% - {milestone.amount.toLocaleString()} FCFA
                      </span>
                      {milestone.reached && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
                          Atteint
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${
                      milestone.reached ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {milestone.reward}
                    </p>
                    {milestone.date && (
                      <p className="text-xs mt-1 text-slate-950 dark:text-gray-400">
                        {new Date(milestone.date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Historique des contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contributionHistory.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{contribution.description}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contribution.date).toLocaleDateString('fr-FR')}
                        </p>
                        <Badge className={`text-xs ${getContributionTypeColor(contribution.type)}`}>
                          {getContributionTypeLabel(contribution.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    +{contribution.amount.toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-500" />
              Conseils personnalisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                    <tip.icon className={`w-5 h-5 ${tip.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="miabe-button h-auto py-4 flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Ajouter épargne</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col space-y-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Zap className="w-6 h-6 text-yellow-500" />
                <span className="text-sm">Virement auto</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Users, Calendar, Target, Plus, Send, Settings, Share2, TrendingUp, Clock, Heart, MessageCircle } from 'lucide-react'
import type { Project } from '@miabega/shared'
import { projectProgress, projectRemaining, daysUntil } from '@miabega/core'

interface ActiveProjectProps {
  project: Project
  onBack: () => void
}

export default function ActiveProject({ project, onBack }: ActiveProjectProps) {
  const [contributionAmount, setContributionAmount] = useState('')
  const [contributionMessage, setContributionMessage] = useState('')
  const [isContributing, setIsContributing] = useState(false)
  const [showContributionForm, setShowContributionForm] = useState(false)

  const progressPercentage = projectProgress(project)
  const remainingAmount = projectRemaining(project)
  const daysRemaining = daysUntil(project.deadline)

  const handleContribution = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return

    setIsContributing(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Contribution:', {
      amount: parseFloat(contributionAmount),
      message: contributionMessage,
      projectId: project.id
    })

    setIsContributing(false)
    setShowContributionForm(false)
    setContributionAmount('')
    setContributionMessage('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

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
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                  {project.status === 'active' ? 'Actif' : 'Terminé'}
                </Badge>
                {project.isAdmin && (
                  <Badge className="bg-white/20 text-white text-xs">
                    Administrateur
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {project.isAdmin && (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
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
                  <p className="text-white/80">Collecté</p>
                  <p className="font-semibold text-lg">{project.currentAmount.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p className="text-white/80">Objectif</p>
                  <p className="font-semibold text-lg">{project.targetAmount.toLocaleString()} FCFA</p>
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
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{project.participants}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Participants</p>
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
                <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{remainingAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">FCFA restants</p>
            </CardContent>
          </Card>
        </div>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Description du projet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{project.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
              </div>
              <Badge variant="outline">{project.category}</Badge>
            </div>
          </CardContent>
        </Card>

                {project.status === 'active' && (
          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Contribuer au projet
                </CardTitle>
                {!showContributionForm && (
                  <Button
                    onClick={() => setShowContributionForm(true)}
                    className="miabe-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Contribuer
                  </Button>
                )}
              </div>
            </CardHeader>

            {showContributionForm && (
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Montant (FCFA)
                  </label>
                  <Input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="10000"
                    className="miabe-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message (optionnel)
                  </label>
                  <Input
                    value={contributionMessage}
                    onChange={(e) => setContributionMessage(e.target.value)}
                    placeholder="Encouragez l'équipe..."
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
                        Contribution...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Contribuer
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
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Contributions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.contributions.length > 0 ? (
              <div className="space-y-4">
                {project.contributions.map((contribution) => (
                  <div key={contribution.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                        {contribution.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{contribution.userName}</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          +{contribution.amount.toLocaleString()} FCFA
                        </span>
                      </div>
                      {contribution.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{contribution.message}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(contribution.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucune contribution pour le moment</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Soyez le premier à contribuer !</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

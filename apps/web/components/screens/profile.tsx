'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Trophy, Zap, Target, Users, Wallet, Star, Award, TrendingUp, Calendar, Heart, Edit, ChevronRight, BarChart3 } from 'lucide-react'
import ThemeSelector from '@/components/theme-selector'
import ProfileSettings from '@/components/profile-settings'
import type { User as UserType, Transaction, Category, Screen } from '@miabega/shared'

interface ProfileProps {
  user: UserType
  transactions: Transaction[]
  categories: Category[]
  onLogout: () => void
  onNavigate: (screen: Screen) => void
}

export default function Profile({ user, transactions, categories, onLogout, onNavigate }: ProfileProps) {
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  const nextLevelXP = (currentUser.level + 1) * 1000
  const currentLevelXP = currentUser.level * 1000
  const progressToNextLevel = ((currentUser.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  const achievements = [
    { id: 1, name: 'Premier pas', description: 'Créer votre premier objectif', icon: Target, earned: true },
    { id: 2, name: 'Économe', description: 'Épargner 50 000 FCFA', icon: Wallet, earned: true },
    { id: 3, name: 'Motivateur', description: 'Aider 5 amis dans leurs projets', icon: Heart, earned: true },
    { id: 4, name: 'Organisateur', description: 'Créer un projet collectif', icon: Users, earned: true },
    { id: 5, name: 'Persévérant', description: 'Maintenir un streak de 30 jours', icon: Zap, earned: false },
    { id: 6, name: 'Expert', description: 'Atteindre le niveau 20', icon: Star, earned: false },
  ]

  const earnedBadges = achievements.filter(a => a.earned)
  const stats = [
    { label: 'Projets créés', value: '3', icon: Users, color: 'text-blue-600' },
    { label: 'Montant économisé', value: '125K FCFA', icon: Wallet, color: 'text-green-600' },
    { label: 'Amis aidés', value: '8', icon: Heart, color: 'text-pink-600' },
    { label: 'Objectifs atteints', value: '5', icon: Target, color: 'text-purple-600' },
  ]

  const handleUpdateProfile = (data: { name: string; email: string }) => {
    setCurrentUser(prev => ({
      ...prev,
      name: data.name,
      email: data.email
    }))
  }

  if (showProfileSettings) {
    return (
      <ProfileSettings
        user={currentUser}
        onBack={() => setShowProfileSettings(false)}
        onUpdateProfile={handleUpdateProfile}
      />
    )
  }

  return (
    <div className="pb-20 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h1>
          <p className="text-white/90 mb-4">{currentUser.email}</p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm">Niveau {currentUser.level}</span>
              <span className="text-white/90 text-sm">{currentUser.xp} / {nextLevelXP} XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2 bg-white/20" />
            <div className="flex items-center justify-center mt-3 space-x-4">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-200" />
                <span className="text-white/90 text-sm">{currentUser.streak} jours</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-200" />
                <span className="text-white/90 text-sm">{earnedBadges.length} badges</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2 ${
                    stat.color === 'text-blue-600' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    stat.color === 'text-green-600' ? 'bg-green-100 dark:bg-green-900/30' :
                    stat.color === 'text-pink-600' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    <stat.icon className={`w-5 h-5 ${stat.color} dark:${stat.color.replace('600', '400')}`} />
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

                <ThemeSelector />

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Badges débloqués
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2 ${
                    achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    <achievement.icon className={`w-5 h-5 ${
                      achievement.earned ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className={`font-semibold text-sm text-center mb-1 ${
                    achievement.earned ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs text-center ${
                    achievement.earned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-500" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setShowProfileSettings(true)}
              variant="ghost"
              className="w-full justify-between h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <Edit className="w-5 h-5 mr-3" />
                Modifier le profil
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => onNavigate('account-statistics')}
              variant="ghost"
              className="w-full justify-between h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-3" />
                Mes Statistiques
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Shield className="w-5 h-5 mr-3" />
              Confidentialité
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Aide et support
            </Button>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start h-12 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

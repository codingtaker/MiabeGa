'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Search, Filter, Plus, Users, Calendar, TrendingUp, CheckCircle, Clock, MapPin } from 'lucide-react'
import type { Project, Screen } from '@miabega/shared'
import { projectProgress, projectRemaining } from '@miabega/core'

interface ProjectsProps {
  projects: Project[]
  onNavigate: (screen: Screen, projectId?: string) => void
}

export default function Projects({ projects, onNavigate }: ProjectsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'Voyage', 'Équipement', 'Éducation', 'Événement']

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const activeProjects = filteredProjects.filter(p => p.status === 'active')
  const completedProjects = filteredProjects.filter(p => p.status === 'completed')
  const adminProjects = filteredProjects.filter(p => p.isAdmin)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
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
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="pb-20 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Projets collectifs</h1>
            <p className="text-white/90">Épargnez ensemble pour vos rêves</p>
          </div>
          <Button
            onClick={() => onNavigate('create-project')}
            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full p-3"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

                <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un projet..."
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
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{activeProjects.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Actifs</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{completedProjects.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Terminés</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mx-auto mb-2">
                <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{adminProjects.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Administrés</p>
            </CardContent>
          </Card>
        </div>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Catégories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category
                    ? "miabe-button text-xs py-1 px-3 h-auto"
                    : "text-xs py-1 px-3 h-auto border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                >
                  {category === 'all' ? 'Tous' : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

                <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="miabe-card dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => onNavigate('active-project', project.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex space-x-2 mb-2 items-start mr-0.5">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{project.name}</h3>
                        {project.isAdmin && (
                          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(project.status)}
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status === 'active' ? 'Actif' :
                         project.status === 'completed' ? 'Terminé' : 'Annulé'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progression</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {projectProgress(project).toFixed(1)}%
                      </span>
                    </div>

                    <Progress
                      value={projectProgress(project)}
                      className="h-3"
                    />

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {project.currentAmount.toLocaleString()} / {project.targetAmount.toLocaleString()} FCFA
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Reste: {projectRemaining(project).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-4 items-center px-0.5">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm text-left">{project.participants}membres</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(project.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Créez votre premier projet collectif'
                  }
                </p>
                <Button
                  onClick={() => onNavigate('create-project')}
                  className="miabe-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un projet
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

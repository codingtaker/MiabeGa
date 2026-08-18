'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ArrowLeft, CalendarIcon, Users, Target, MapPin, Laptop, GraduationCap, Plane, Heart, Music } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CreateProjectProps {
  onBack: () => void
  onCreate: (data: { name: string; description: string; targetAmount: number; category: string; deadline: string }) => void
}

export default function CreateProject({ onBack, onCreate }: CreateProjectProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    category: '',
    deadline: undefined as Date | undefined,
    isPublic: true
  })
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { value: 'voyage', label: 'Voyage', icon: Plane, color: 'text-blue-500' },
    { value: 'equipement', label: 'Équipement', icon: Laptop, color: 'text-purple-500' },
    { value: 'education', label: 'Éducation', icon: GraduationCap, color: 'text-green-500' },
    { value: 'evenement', label: 'Événement', icon: Music, color: 'text-pink-500' },
    { value: 'sante', label: 'Santé', icon: Heart, color: 'text-red-500' },
    { value: 'autre', label: 'Autre', icon: Target, color: 'text-gray-500' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.deadline) return
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    onCreate({
      name: formData.name,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      category: selectedCategory?.label ?? formData.category,
      deadline: format(formData.deadline, 'yyyy-MM-dd')
    })

    setIsLoading(false)
    onBack()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedCategory = categories.find(cat => cat.value === formData.category)

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
            <h1 className="text-2xl font-bold text-white">Nouveau projet</h1>
            <p className="text-white/90">Créez un projet collectif</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-8">
        <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-500" />
              Informations du projet
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom du projet *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Voyage d'études au Sénégal"
                  className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                />
              </div>

                            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre projet en détail..."
                  className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 min-h-[100px] resize-none"
                  required
                />
              </div>

                            <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Montant objectif (FCFA) *
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                  placeholder="500000"
                  className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                />
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                    <SelectValue placeholder="Choisir une catégorie">
                      {selectedCategory && (
                        <div className="flex items-center space-x-2">
                          <selectedCategory.icon className={`w-4 h-4 ${selectedCategory.color}`} />
                          <span>{selectedCategory.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <category.icon className={`w-4 h-4 ${category.color}`} />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date limite *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline ? (
                        format(formData.deadline, 'PPP', { locale: fr })
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => handleInputChange('deadline', date)}
                      disabled={(date) => date < new Date()}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

                            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visibilité du projet
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="public"
                      name="visibility"
                      checked={formData.isPublic}
                      onChange={() => handleInputChange('isPublic', true)}
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                    />
                    <div>
                      <Label htmlFor="public" className="font-medium text-gray-800 dark:text-gray-100">
                        Public
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visible par tous les utilisateurs de Miabé Ga
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="private"
                      name="visibility"
                      checked={!formData.isPublic}
                      onChange={() => handleInputChange('isPublic', false)}
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                    />
                    <div>
                      <Label htmlFor="private" className="font-medium text-gray-800 dark:text-gray-100">
                        Privé
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Accessible uniquement sur invitation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

                            <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name || !formData.description || !formData.targetAmount || !formData.category || !formData.deadline}
                  className="w-full miabe-button h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Création en cours...
                    </div>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      Créer le projet
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

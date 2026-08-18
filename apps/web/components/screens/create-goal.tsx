'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ArrowLeft, CalendarIcon, Target, Laptop, GraduationCap, Plane, Heart, Music, Gamepad2, Car, Home, Wallet, Sparkles, AlertCircle, Check } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CreateGoalProps {
  onBack: () => void
  onCreate: (data: { name: string; description: string; targetAmount: number; category: string; priority: 'low' | 'medium' | 'high'; deadline: string }) => void
}

export default function CreateGoal({ onBack, onCreate }: CreateGoalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    deadline: undefined as Date | undefined,
    icon: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { value: 'technologie', label: 'Technologie', icon: Laptop, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'education', label: 'Éducation', icon: GraduationCap, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { value: 'voyage', label: 'Voyage', icon: Plane, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    { value: 'loisirs', label: 'Loisirs', icon: Gamepad2, color: 'text-pink-500', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
    { value: 'sante', label: 'Santé', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    { value: 'musique', label: 'Musique', icon: Music, color: 'text-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { value: 'transport', label: 'Transport', icon: Car, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    { value: 'logement', label: 'Logement', icon: Home, color: 'text-teal-500', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  ]

  const priorities = [
    { value: 'low', label: 'Normal', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { value: 'medium', label: 'Important', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'high', label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'objectif est obligatoire'
    }
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Le montant doit être supérieur à 0'
    }
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie'
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Veuillez choisir une date limite'
    } else if (formData.deadline <= new Date()) {
      newErrors.deadline = 'La date limite doit être dans le futur'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !formData.deadline) return

    setIsLoading(true)

    try {

      await new Promise(resolve => setTimeout(resolve, 2000))

      onCreate({
        name: formData.name,
        description: formData.description,
        targetAmount: parseFloat(formData.targetAmount),
        category: selectedCategory?.label ?? formData.category,
        priority: formData.priority,
        deadline: format(formData.deadline, 'yyyy-MM-dd')
      })

      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        onBack()
      }, 2500)

    } catch (error) {
      console.error('Erreur lors de la création de l\'objectif:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const selectedCategory = categories.find(cat => cat.value === formData.category)
  const selectedPriority = priorities.find(p => p.value === formData.priority)

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
        <Card className="w-full max-w-sm text-center miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            {selectedCategory && (
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <selectedCategory.icon className="w-6 h-6 text-white" />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Objectif créé !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <span className="font-semibold">{formData.name}</span> a été ajouté à vos objectifs.
              Objectif : {parseFloat(formData.targetAmount).toLocaleString()} FCFA
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-white">Nouvel objectif</h1>
            <p className="text-white/90">Définissez votre prochain défi</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-8">
        <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
              Créer un objectif d'épargne
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Définissez un objectif clair pour rester motivé dans votre épargne
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom de l'objectif *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Nouveau MacBook Pro, Voyage au Japon..."
                  className={`miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                    errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

                            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (optionnel)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez pourquoi cet objectif est important pour vous..."
                  className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 min-h-[80px] resize-none"
                />
              </div>

                            <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Montant à atteindre (FCFA) *
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                    className={`pl-10 pr-16 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                      errors.targetAmount ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    placeholder="500000"
                    min="1"
                    step="1000"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    FCFA
                  </span>
                </div>
                {errors.targetAmount && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.targetAmount}</span>
                  </div>
                )}
                {formData.targetAmount && parseFloat(formData.targetAmount) > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Montant formaté : {parseFloat(formData.targetAmount).toLocaleString()} FCFA
                  </p>
                )}
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie *
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    const isSelected = formData.category === category.value

                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => handleInputChange('category', category.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-500'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected ? category.bgColor : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              isSelected ? category.color : 'text-gray-500 dark:text-gray-400'
                            }`} />
                          </div>
                          <span className={`text-sm font-medium ${
                            isSelected
                              ? 'text-gray-800 dark:text-gray-100'
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {category.label}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {errors.category && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priorité
                </Label>
                <div className="flex space-x-3">
                  {priorities.map((priority) => {
                    const isSelected = formData.priority === priority.value

                    return (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-500'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${
                            isSelected ? priority.bgColor : 'bg-gray-100 dark:bg-gray-600'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            isSelected
                              ? 'text-gray-800 dark:text-gray-100'
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {priority.label}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date limite *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`miabe-input justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                        errors.deadline ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
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
                      disabled={(date) => date <= new Date()}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.deadline && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.deadline}</span>
                  </div>
                )}
              </div>

                            {formData.name && formData.targetAmount && formData.category && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-600">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                    Aperçu de votre objectif
                  </h3>
                  <div className="flex items-center space-x-3">
                    {selectedCategory && (
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                        <selectedCategory.icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{formData.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {parseFloat(formData.targetAmount).toLocaleString()} FCFA • {selectedPriority?.label}
                      </p>
                    </div>
                  </div>
                </div>
              )}

                            <div className="flex space-x-3 pt-6">
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 miabe-button h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Création...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Target className="w-5 h-5 mr-2" />
                      Créer l'objectif
                    </div>
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

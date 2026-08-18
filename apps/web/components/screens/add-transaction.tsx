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
import { ArrowLeft, CalendarIcon, Plus, Minus, Wallet, TrendingUp, TrendingDown, AlertCircle, Check } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Category } from '@miabega/shared'

interface AddTransactionProps {
  onBack: () => void
  categories: Category[]
  onCreate: (data: { type: 'income' | 'expense'; amount: number; description: string; category: string; date: string }) => void
}

export default function AddTransaction({ onBack, categories, onCreate }: AddTransactionProps) {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date()
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const filteredCategories = categories.filter(cat =>
    cat.type === formData.type || cat.type === 'both'
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire'
    }
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {

      await new Promise(resolve => setTimeout(resolve, 1500))

      onCreate({
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: format(formData.date, 'yyyy-MM-dd')
      })

      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        onBack()
      }, 2000)

    } catch (error) {
      console.error('Error creating transaction:', error)
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

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {

      console.log('New category:', newCategoryName)
      setFormData(prev => ({ ...prev, category: newCategoryName }))
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
        <Card className="w-full max-w-sm text-center miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Transaction ajoutée !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Votre {formData.type === 'income' ? 'revenu' : 'dépense'} de {parseFloat(formData.amount).toLocaleString()} FCFA a été enregistré.
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
            <h1 className="text-2xl font-bold text-white">Nouvelle transaction</h1>
            <p className="text-white/90">Ajouter un revenu ou une dépense</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-8">
        <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type de transaction *
                </Label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'expense')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-medium">Dépense</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'income')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                      formData.type === 'income'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Revenu</span>
                  </button>
                </div>
              </div>

                            <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Montant *
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`pl-10 pr-16 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                      errors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    FCFA
                  </span>
                </div>
                {errors.amount && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.amount}</span>
                  </div>
                )}
              </div>

                            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 min-h-[80px] resize-none ${
                    errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                  placeholder="Ex: Courses alimentaires, Salaire étudiant..."
                />
                {errors.description && (
                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie *
                </Label>
                {!showNewCategory ? (
                  <div className="space-y-3">
                    <Select value={formData.category} onValueChange={(value) => {
                      if (value === 'new') {
                        setShowNewCategory(true)
                      } else {
                        handleInputChange('category', value)
                      }
                    }}>
                      <SelectTrigger className={`miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                        errors.category ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center space-x-2">
                            <Plus className="w-3 h-3" />
                            <span>Nouvelle catégorie</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.category}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      placeholder="Nom de la nouvelle catégorie"
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="miabe-button flex-1"
                        disabled={!newCategoryName.trim()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowNewCategory(false)
                          setNewCategoryName('')
                        }}
                        variant="outline"
                        className="px-6"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>

                            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="miabe-input justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.date, 'PPP', { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleInputChange('date', date)}
                      disabled={(date) => date > new Date()}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

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
                      Ajout...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Ajouter
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

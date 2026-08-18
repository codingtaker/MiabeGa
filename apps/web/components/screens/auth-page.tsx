'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Smartphone, Users, Target, TrendingUp } from 'lucide-react'
import { createClient } from '@miabega/api'

interface AuthPageProps {
  onLogin: () => void
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email ou mot de passe incorrect.',
  'User already registered': 'Un compte existe déjà avec cet email.',
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      setIsLoading(false)
      if (signInError) {
        setError(AUTH_ERROR_MESSAGES[signInError.message] ?? signInError.message)
        return
      }
      onLogin()
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } },
      })
      setIsLoading(false)
      if (signUpError) {
        setError(AUTH_ERROR_MESSAGES[signUpError.message] ?? signUpError.message)
        return
      }
      if (!data.session) {
        setConfirmationSent(true)
        return
      }
      onLogin()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex flex-col">
            <div className="text-center pt-12 pb-8 px-6">
        <div className="w-full flex justify-center mb-4">
          <img
            src="/images/miabe-ga-logo.png"
            alt="Logo MiabéGa"
            className="w-36 max-w-[150px] h-auto object-contain drop-shadow-md"
          />
        </div>
        <p className="text-gray-600 text-lg">Épargne collaborative intelligente</p>
      </div>

            <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Projets collectifs</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <Target className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Objectifs personnels</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Suivi intelligent</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <Smartphone className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Assistant IA</p>
          </div>
        </div>
      </div>

            <div className="flex-1 px-6">
        <Card className="w-full max-w-sm mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => { setIsLogin(true); setError(null); setConfirmationSent(false) }}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    isLogin
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Connexion
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(null); setConfirmationSent(false) }}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    !isLogin
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Inscription
                </button>
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {isLogin ? 'Bon retour !' : 'Créer un compte'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin
                ? 'Connectez-vous pour accéder à vos projets'
                : 'Rejoignez la communauté Miabé Ga'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {confirmationSent ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-gray-800 font-medium">Vérifiez votre boîte mail</p>
                <p className="text-sm text-gray-600">
                  Un email de confirmation a été envoyé à {formData.email}. Cliquez sur le lien pour activer votre compte.
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom complet"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 pr-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    required={!isLogin}
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Connexion...' : 'Création...'}
                  </div>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer le compte'
                )}
              </Button>
            </form>
            )}

            {isLogin && !confirmationSent && (
              <div className="mt-4 text-center">
                <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                  Mot de passe oublié ?
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

            <div className="text-center py-6 px-6">
        <p className="text-xs text-gray-500">
          En continuant, vous acceptez nos{' '}
          <button className="text-yellow-600 hover:underline">Conditions d'utilisation</button>
          {' '}et notre{' '}
          <button className="text-yellow-600 hover:underline">Politique de confidentialité</button>
        </p>
      </div>
    </div>
  )
}

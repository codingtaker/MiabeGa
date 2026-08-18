'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, User, Lock, Eye, EyeOff, Check, AlertCircle, Mail, Save, Shield } from 'lucide-react'
import type { User as UserType } from '@miabega/shared'

interface ProfileSettingsProps {
  user: UserType
  onBack: () => void
  onUpdateProfile: (data: { name: string; email: string }) => void
}

export default function ProfileSettings({ user, onBack, onUpdateProfile }: ProfileSettingsProps) {

  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)

    return {
      minLength,
      hasUppercase,
      hasNumber,
      isValid: minLength && hasUppercase && hasNumber
    }
  }

  const passwordValidation = validatePassword(passwordForm.newPassword)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess(false)

    try {

      await new Promise(resolve => setTimeout(resolve, 1500))

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileForm.email)) {
        throw new Error('Format d\'email invalide')
      }

      onUpdateProfile(profileForm)
      setProfileSuccess(true)

      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess(false)

    try {

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas')
      }

      if (!passwordValidation.isValid) {
        throw new Error('Le mot de passe ne respecte pas les critères de sécurité')
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      setPasswordSuccess(true)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe')
    } finally {
      setPasswordLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
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
            <h1 className="text-2xl font-bold text-white">Paramètres du profil</h1>
            <p className="text-white/90">Modifiez vos informations personnelles</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-8 space-y-6">
                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Modifier mes informations
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mettez à jour votre nom et votre adresse e-mail
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prénom et nom *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse e-mail *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

                            {profileSuccess && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Informations mises à jour avec succès !
                  </span>
                </div>
              )}

              {profileError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {profileError}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={profileLoading || !profileForm.name.trim() || !profileForm.email.trim()}
                className="w-full miabe-button h-12"
              >
                {profileLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enregistrement...
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-red-500" />
              Changer mon mot de passe
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assurez-vous d&apos;utiliser un mot de passe sécurisé
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe actuel *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="pl-10 pr-12 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

                            <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nouveau mot de passe *
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="pl-10 pr-12 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                                {passwordForm.newPassword && (
                  <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Critères de sécurité :</p>
                    <div className="space-y-1">
                      <div className={`flex items-center space-x-2 text-xs ${
                        passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                        <span>Au moins 6 caractères</span>
                      </div>
                      <div className={`flex items-center space-x-2 text-xs ${
                        passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          passwordValidation.hasUppercase ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                        <span>Une majuscule</span>
                      </div>
                      <div className={`flex items-center space-x-2 text-xs ${
                        passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                        <span>Un chiffre</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

                            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmer le nouveau mot de passe *
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 pr-12 miabe-input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                                {passwordForm.confirmPassword && (
                  <div className={`flex items-center space-x-2 text-xs ${
                    passwordForm.newPassword === passwordForm.confirmPassword
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {passwordForm.newPassword === passwordForm.confirmPassword ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>
                      {passwordForm.newPassword === passwordForm.confirmPassword
                        ? 'Les mots de passe correspondent'
                        : 'Les mots de passe ne correspondent pas'
                      }
                    </span>
                  </div>
                )}
              </div>

                            {passwordSuccess && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Mot de passe mis à jour avec succès !
                  </span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {passwordError}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  passwordLoading ||
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword ||
                  passwordForm.newPassword !== passwordForm.confirmPassword ||
                  !passwordValidation.isValid
                }
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-12"
              >
                {passwordLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Mise à jour...
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Mettre à jour le mot de passe
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react'

export default function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="miabe-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-500" />
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
            <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
            <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const themeOptions = [
    {
      value: 'light',
      label: 'Mode clair',
      icon: Sun,
      description: 'Interface claire et lumineuse',
      emoji: '🌞'
    },
    {
      value: 'dark',
      label: 'Mode sombre',
      icon: Moon,
      description: 'Interface sombre pour vos yeux',
      emoji: '🌚'
    },
    {
      value: 'system',
      label: 'Automatique',
      icon: Monitor,
      description: 'Suit les préférences du système',
      emoji: '🌓'
    }
  ]

  return (
    <Card className="miabe-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-purple-500" />
          Apparence
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Choisissez le thème de l&apos;application
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isSelected = theme === option.value

          return (
            <Button
              key={option.value}
              onClick={() => setTheme(option.value)}
              variant="ghost"
              className={`w-full h-auto p-4 justify-start transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-600'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className={`rounded-full flex items-center justify-center w-12 h-12 ${
                  isSelected
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {isSelected ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className={`w-6 h-6 ${
                      isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    }`} />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${
                      isSelected
                        ? 'text-gray-800 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {option.label}
                    </span>
                    <span className="text-lg">{option.emoji}</span>
                  </div>
                  <p className={`text-sm ${
                    isSelected
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {option.description}
                  </p>
                </div>
              </div>
            </Button>
          )
        })}

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            Aperçu du thème actuel
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="text-sm dark:text-gray-300 text-black">Thème actuel</span>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {resolvedTheme === 'light' ? 'Clair 🌞' : 'Sombre 🌚'}
              </span>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

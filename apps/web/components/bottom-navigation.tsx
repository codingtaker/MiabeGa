'use client'

import { Home, FolderOpen, Target, Bot, User } from 'lucide-react'
import type { Screen } from '@miabega/shared'

interface BottomNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export default function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard' as Screen, label: 'Accueil', icon: Home },
    { id: 'projects' as Screen, label: 'Projets', icon: FolderOpen },
    { id: 'goals' as Screen, label: 'Objectifs', icon: Target },
    { id: 'ai-assistant' as Screen, label: 'Assistant', icon: Bot },
    { id: 'profile' as Screen, label: 'Profil', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 py-2 bottom-nav-safe border-b-0 border-t-0 rounded-sm">
      <div className="flex justify-around items-center my-[-10px] py-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentScreen === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 min-w-[60px] px-2 mx-0 rounded-2xl my-2 py-2 ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

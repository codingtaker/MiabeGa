'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Mic, Paperclip, TrendingUp, Target, Lightbulb, PiggyBank, Sparkles, User as UserIcon, Clock, Zap } from 'lucide-react'
import type { User } from '@miabega/shared'
import { monthlySavings, savingsRate, projectedSavings } from '@miabega/core'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIAssistantProps {
  user: User
}

export default function AIAssistant({ user }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Salut ${user.name.split(' ')[0]} ! 👋 Je suis votre assistant IA personnel pour vous aider avec vos finances. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
      suggestions: [
        'Analyser mes dépenses',
        'Conseils d\'épargne',
        'Optimiser mon budget',
        'Prédire mes économies'
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickSuggestions = [
    {
      text: 'Analyser mes dépenses',
      icon: TrendingUp,
      bgLight: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800',
      bgDark: 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-500 dark:text-white',
      iconBg: 'bg-blue-500 dark:bg-blue-400'
    },
    {
      text: 'Atteindre mes objectifs',
      icon: Target,
      bgLight: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-800',
      bgDark: 'dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-500 dark:text-white',
      iconBg: 'bg-green-500 dark:bg-green-400'
    },
    {
      text: 'Prédire mes économies',
      icon: PiggyBank,
      bgLight: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800',
      bgDark: 'dark:bg-purple-600 dark:hover:bg-purple-700 dark:border-purple-500 dark:text-white',
      iconBg: 'bg-purple-500 dark:bg-purple-400'
    },
    {
      text: 'Conseils d\'épargne',
      icon: Lightbulb,
      bgLight: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800',
      bgDark: 'dark:bg-amber-600 dark:hover:bg-amber-700 dark:border-amber-500 dark:text-white',
      iconBg: 'bg-amber-500 dark:bg-amber-400'
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('dépense') || lowerMessage.includes('analyser')) {
      return `📊 **Analyse de vos dépenses**

Basé sur vos données, voici ce que je constate :

• **Dépenses mensuelles** : ${user.monthlyExpenses.toLocaleString()} FCFA
• **Revenus mensuelles** : ${user.monthlyIncome.toLocaleString()} FCFA
• **Épargne mensuelle** : ${monthlySavings(user.monthlyIncome, user.monthlyExpenses).toLocaleString()} FCFA

**Recommandations :**
✅ Vous épargnez ${savingsRate(user.monthlyIncome, user.monthlyExpenses).toFixed(1)}% de vos revenus - c'est excellent !
💡 Essayez de réduire vos dépenses de 5% pour augmenter votre épargne
🎯 Concentrez-vous sur vos objectifs prioritaires`
    }

    if (lowerMessage.includes('objectif') || lowerMessage.includes('atteindre')) {
      return `🎯 **Stratégie pour vos objectifs**

Vous avez 2 objectifs actifs. Voici mes conseils :

**Frais de scolarité (75% complété)**
• Il vous reste 50 000 FCFA à épargner
• À votre rythme actuel : 3-4 mois
• 💡 Augmentez de 5 000 FCFA/mois pour finir plus tôt

**Nouveau téléphone (50% complété)**
• Objectif moins urgent, parfait pour la flexibilité
• Considérez l'achat pendant les promotions

**Conseil IA :** Priorisez l'éducation, c'est un investissement à long terme ! 📚`
    }

    if (lowerMessage.includes('épargne') || lowerMessage.includes('conseil')) {
      return `💰 **Conseils d'épargne personnalisés**

Basé sur votre profil d'étudiant :

**Stratégies immédiates :**
• 🍽️ Cuisinez plus souvent (économie : ~10 000 FCFA/mois)
• 📱 Utilisez les apps de cashback
• 🚌 Optimisez vos transports

**Habitudes à long terme :**
• 📊 Règle 50/30/20 : 50% besoins, 30% envies, 20% épargne
• 🎯 Automatisez vos virements d'épargne
• 💡 Créez un fonds d'urgence (3 mois de dépenses)

Votre streak de ${user.streak} jours montre que vous êtes discipliné ! 🔥`
    }

    if (lowerMessage.includes('prédire') || lowerMessage.includes('économie')) {
      return `🔮 **Prédictions financières**

Basé sur vos habitudes actuelles :

**Dans 6 mois :**
• Épargne totale : ~${projectedSavings(user.balance, monthlySavings(user.monthlyIncome, user.monthlyExpenses), 6).toLocaleString()} FCFA
• Objectifs complétés : 2/2 ✅

**Dans 1 an :**
• Épargne totale : ~${projectedSavings(user.balance, monthlySavings(user.monthlyIncome, user.monthlyExpenses), 12).toLocaleString()} FCFA
• Nouveau niveau : ${user.level + 3} 🆙

**Facteurs d'amélioration :**
• Augmentation revenus : +20% possible avec jobs étudiants
• Réduction dépenses : 10% réalisable sans impact lifestyle

Continuez comme ça ! 🚀`
    }

    return `Je comprends votre question ! Voici quelques suggestions pour vous aider :

• Consultez votre tableau de bord pour un aperçu complet
• Utilisez les filtres dans vos projets et objectifs
• N'hésitez pas à me poser des questions plus spécifiques

Comment puis-je mieux vous assister ? 😊`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: [
          'Autre question ?',
          'Analyser autre chose',
          'Voir mes projets',
          'Conseils avancés'
        ]
      }

      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className={line.trim() === '' ? 'h-3' : ''}>
        {line.includes('**') ? (
          <div className="font-bold text-gray-900 dark:text-gray-100 text-base leading-relaxed">
            {line.replace(/\*\*(.*?)\*\*/g, '$1')}
          </div>
        ) : line.startsWith('•') ? (
          <div className="ml-3 dark:text-gray-200 text-sm leading-relaxed text-black">{line}</div>
        ) : line.startsWith('✅') || line.startsWith('💡') || line.startsWith('🎯') ? (
          <div className="ml-3 text-gray-800 dark:text-gray-200 font-medium text-sm leading-relaxed">{line}</div>
        ) : (
          <div className="dark:text-gray-200 text-sm leading-relaxed text-black">{line}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="pb-20 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 px-4 sm:px-6 pt-12 pb-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">Assistant IA</h1>
              <p className="text-white/90 text-sm sm:text-base">Votre conseiller financier personnel</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-100 border-green-400/30 backdrop-blur-sm shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            En ligne
          </Badge>
        </div>
      </div>

            {messages.length === 1 && (
        <div className="px-4 sm:px-6 py-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Suggestions rapides
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choisissez un sujet pour commencer
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
  {quickSuggestions.map((suggestion, index) => (
    <Button
      key={index}
      variant="outline"
      onClick={() => handleSuggestionClick(suggestion.text)}
      className={`h-auto py-5 px-5 text-left justify-start border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg active:shadow-md ${suggestion.bgLight} ${suggestion.bgDark}`}
    >
      <div className="flex items-center space-x-4 w-full">
        <div className={`w-12 h-12 rounded-2xl ${suggestion.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <suggestion.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-base font-semibold leading-tight block">
            {suggestion.text}
          </span>
        </div>
      </div>
    </Button>
  ))}
</div>
        </div>
      )}

            <div className="flex-1 px-4 sm:px-6 py-4 space-y-6 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
                        <div className="flex-shrink-0">
              {message.type === 'user' ? (
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

                        <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                    : 'bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Assistant IA</span>
                  </div>
                )}

                <div className={`leading-relaxed ${
                  message.type === 'user' ? 'text-white text-base' : ''
                }`}>
                  {message.type === 'assistant' ?
                    formatMessageContent(message.content) :
                    <div className="text-white text-base">{message.content}</div>
                  }
                </div>

                <div className={`flex items-center space-x-1 mt-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <Clock className={`w-3 h-3 ${
                    message.type === 'user' ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className={`text-xs ${
                    message.type === 'user' ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

                            {message.type === 'assistant' && message.suggestions && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-8 px-3 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 backdrop-blur-sm shadow-sm"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

                {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Assistant en train d'écrire...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

            <div className="px-4 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 bg-transparent border-t-0 sm:px-5 py-0 my-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="p-3 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 backdrop-blur-sm shadow-sm"
          >
            <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Posez votre question..."
              className="pr-12 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-400/20 dark:focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm shadow-sm text-base h-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

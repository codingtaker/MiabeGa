'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Calendar, PieChart, BarChart3, Activity } from 'lucide-react'
import type { Transaction, Category } from '@miabega/shared'
import { totalIncome, totalExpense, netBalance } from '@miabega/core'

interface AccountStatisticsProps {
  transactions: Transaction[]
  categories: Category[]
  onBack: () => void
}

const SimpleBarChart = ({ data, height = 200 }: { data: any[], height?: number }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.expenses || 0, d.income || 0)))

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[300px] p-4">
        <div className="flex items-end justify-between space-x-2" style={{ height: `${height}px` }}>
          {data.map((item, index) => {
            const expenseHeight = (item.expenses / maxValue) * (height - 40)
            const incomeHeight = (item.income / maxValue) * (height - 40)

            return (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <div className="flex flex-col items-center space-y-1 w-full">
                  {item.income > 0 && (
                    <div
                      className="w-full bg-green-500 rounded-t-sm min-h-[4px] relative group"
                      style={{ height: `${incomeHeight}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        +{item.income.toLocaleString()} FCFA
                      </div>
                    </div>
                  )}
                  {item.expenses > 0 && (
                    <div
                      className="w-full bg-red-500 rounded-b-sm min-h-[4px] relative group"
                      style={{ height: `${expenseHeight}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        -{item.expenses.toLocaleString()} FCFA
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {item.day || item.month}
                </span>
              </div>
            )
          })}
        </div>

                <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Revenus</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Dépenses</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const SimplePieChart = ({ data }: { data: any[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const radius = 80
  const centerX = 100
  const centerY = 100

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="max-w-full h-auto">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (item.value / total) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle

            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

            currentAngle += angle

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                {percentage > 8 && (
                  <text
                    x={centerX + (radius * 0.6) * Math.cos(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                    y={centerY + (radius * 0.6) * Math.sin(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-semibold fill-white"
                  >
                    {percentage.toFixed(0)}%
                  </text>
                )}
              </g>
            )
          })}

                    <circle
            cx={centerX}
            cy={centerY}
            r="30"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            className="text-sm font-bold fill-gray-800"
          >
            Total
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {total.toLocaleString()}
          </text>
        </svg>
      </div>
    </div>
  )
}

export default function AccountStatistics({ transactions, categories, onBack }: AccountStatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  const stats = useMemo(() => ({
    totalIncome: totalIncome(transactions),
    totalExpenses: totalExpense(transactions),
    balance: netBalance(transactions),
  }), [transactions])

  const weeklyData = useMemo(() => {
    return [
      { day: 'Lun', expenses: 12000, income: 0 },
      { day: 'Mar', expenses: 8500, income: 0 },
      { day: 'Mer', expenses: 15000, income: 25000 },
      { day: 'Jeu', expenses: 6000, income: 0 },
      { day: 'Ven', expenses: 18000, income: 0 },
      { day: 'Sam', expenses: 22000, income: 0 },
      { day: 'Dim', expenses: 9500, income: 0 }
    ]
  }, [])

  const monthlyData = useMemo(() => {
    return [
      { month: 'Jan', expenses: 65000, income: 80000 },
      { month: 'Fév', expenses: 58000, income: 75000 },
      { month: 'Mar', expenses: 72000, income: 85000 },
      { month: 'Avr', expenses: 61000, income: 78000 },
      { month: 'Mai', expenses: 69000, income: 82000 },
      { month: 'Jun', expenses: 64000, income: 80000 }
    ]
  }, [])

  const categoryData = useMemo(() => {

    const mockCategoryData = [
      { name: 'Alimentation', value: 45000, color: '#ef4444' },
      { name: 'Transport', value: 25000, color: '#3b82f6' },
      { name: 'Loisirs', value: 18000, color: '#8b5cf6' },
      { name: 'Éducation', value: 32000, color: '#10b981' },
      { name: 'Autres', value: 12000, color: '#f59e0b' }
    ]

    return mockCategoryData
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-600 px-4 sm:px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Mes Statistiques</h1>
            <p className="text-white/90 text-sm sm:text-base">Analyse de vos finances</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 -mt-4 pb-8 space-y-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-100">
                {(stats.totalIncome / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Revenus</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-2">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-100">
                {(stats.totalExpenses / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Dépenses</p>
            </CardContent>
          </Card>

          <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4 text-center">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mx-auto mb-2 ${
                stats.balance >= 0
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-orange-100 dark:bg-orange-900/30'
              }`}>
                <Wallet className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  stats.balance >= 0
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`} />
              </div>
              <p className={`text-sm sm:text-lg font-bold ${
                stats.balance >= 0
                  ? 'text-gray-800 dark:text-gray-100'
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {(stats.balance / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Solde</p>
            </CardContent>
          </Card>
        </div>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Période d'analyse</span>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              {[
                { key: 'week', label: 'Semaine' },
                { key: 'month', label: 'Mois' },
                { key: 'year', label: 'Année' }
              ].map((period) => (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key as any)}
                  className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedPeriod === period.key
                      ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
              {selectedPeriod === 'week' ? 'Évolution hebdomadaire' :
               selectedPeriod === 'month' ? 'Évolution mensuelle' : 'Évolution annuelle'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="w-full">
              <SimpleBarChart
                data={selectedPeriod === 'week' ? weeklyData : monthlyData}
                height={180}
              />
            </div>

                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Moyenne dépenses</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    {selectedPeriod === 'week'
                      ? (weeklyData.reduce((sum, d) => sum + d.expenses, 0) / weeklyData.length / 1000).toFixed(0)
                      : (monthlyData.reduce((sum, d) => sum + d.expenses, 0) / monthlyData.length / 1000).toFixed(0)
                    }k FCFA
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Moyenne revenus</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {selectedPeriod === 'week'
                      ? (weeklyData.reduce((sum, d) => sum + d.income, 0) / weeklyData.length / 1000).toFixed(0)
                      : (monthlyData.reduce((sum, d) => sum + d.income, 0) / monthlyData.length / 1000).toFixed(0)
                    }k FCFA
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500" />
              Répartition des dépenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                            <div className="flex-shrink-0">
                <SimplePieChart data={categoryData} />
              </div>

                            <div className="flex-1 w-full">
                <div className="space-y-3">
                  {categoryData.map((category, index) => {
                    const total = categoryData.reduce((sum, c) => sum + c.value, 0)
                    const percentage = ((category.value / total) * 100).toFixed(1)

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              {category.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {percentage}% du total
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            {(category.value / 1000).toFixed(0)}k
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">FCFA</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
              Transactions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl py-3 px-3 mx-0">
                  <div className="flex items-center space-x-3 flex-1 min-w-0 mx-0 px-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate tracking-tight">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`font-bold text-sm sm:text-base ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{(transaction.amount / 1000).toFixed(0)}k
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

                <Card className="miabe-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
              Analyse et conseils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                      Excellente gestion !
                    </h3>
                    <p className="text-sm dark:text-green-300 text-black">
                      Vous épargnez {((stats.balance / stats.totalIncome) * 100).toFixed(0)}% de vos revenus.
                      Continuez sur cette lancée pour atteindre vos objectifs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                      Optimisation possible
                    </h3>
                    <p className="text-sm dark:text-blue-300 text-black">
                      Vos dépenses en alimentation représentent {((45000 / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(0)}% du budget.
                      Essayez de cuisiner plus souvent pour économiser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

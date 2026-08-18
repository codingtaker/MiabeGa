import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'

import type { User, Goal } from '@miabega/shared'
import {
  savingsRate,
  monthlySavings,
  goalProgress,
  goalRemaining,
  requiredMonthlySaving,
  formatFCFA,
} from '@miabega/core'

// Données de démonstration — seront remplacées par des données Supabase.
const user: User = {
  id: 'demo',
  name: 'Ama Koffi',
  email: 'ama@example.com',
  avatar: '',
  level: 3,
  xp: 1200,
  streak: 7,
  badges: [],
  balance: 85000,
  monthlyIncome: 60000,
  monthlyExpenses: 38000,
}

const goal: Goal = {
  id: 'g1',
  name: 'Ordinateur portable',
  description: 'Pour les cours',
  targetAmount: 250000,
  currentAmount: 90000,
  deadline: '2026-12-31T00:00:00Z',
  category: 'technologie',
  priority: 'high',
  status: 'active',
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%` }]} />
    </View>
  )
}

export default function SavingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="small" themeColor="textSecondary">
            Solde total
          </ThemedText>
          <ThemedText type="subtitle">{formatFCFA(user.balance)}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">Épargne mensuelle</ThemedText>
          <ThemedText type="title" style={styles.savings}>
            +{formatFCFA(monthlySavings(user.monthlyIncome, user.monthlyExpenses))}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Taux d'épargne : {savingsRate(user.monthlyIncome, user.monthlyExpenses).toFixed(1)}% des revenus
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">{goal.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.spaceBelow}>
            {goal.description}
          </ThemedText>
          <ProgressBar value={goalProgress(goal)} />
          <View style={styles.row}>
            <ThemedText type="small">{goalProgress(goal).toFixed(0)}% atteint</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Reste {formatFCFA(goalRemaining(goal))}
            </ThemedText>
          </View>
          <ThemedText type="small" style={styles.required}>
            À épargner : {formatFCFA(requiredMonthlySaving(goal))} / mois
          </ThemedText>
        </ThemedView>

        <ThemedText type="small" themeColor="textSecondary" style={styles.footer}>
          Logique partagée via @miabega/core — même code que le web.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.one,
  },
  savings: { fontSize: 32, lineHeight: 40, color: '#16a34a' },
  spaceBelow: { marginBottom: Spacing.two },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E1E6',
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  required: { marginTop: Spacing.two, color: '#F59E0B' },
  footer: { textAlign: 'center', marginTop: Spacing.two },
})

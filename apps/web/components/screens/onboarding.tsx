'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Bell, Bot, HandCoins, LineChart, PiggyBank, Users, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

type Answers = {
  objectif: string | null
  frequence: string | null
  idee: string | null
  rappels: boolean | null
}

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>(1)
  const [answers, setAnswers] = useState<Answers>({
    objectif: null,
    frequence: null,
    idee: '',
    rappels: null,
  })

  const [visible, setVisible] = useState(false)
  useEffect(() => setVisible(true), [])
  useEffect(() => {

    localStorage.setItem('miabe-onboarding-draft', JSON.stringify(answers))
  }, [answers])

  const progress = useMemo(() => {
    if (step === 5) return 100
    return Math.round(((step - 1) / 4) * 100)
  }, [step])

  const canNext = useMemo(() => {
    if (step === 1) return !!answers.objectif
    if (step === 2) return !!answers.frequence
    if (step === 3) return (answers?.idee?.length ?? 0) > 0 || true
    if (step === 4) return answers.rappels !== null
    return true
  }, [step, answers])

  function next() {
    if (step < 4) setStep((s) => (s + 1) as Step)
    else setStep(5)
  }

  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  function finish() {
    const payload = {
      ...answers,
      finishedAt: new Date().toISOString(),
    }
    localStorage.setItem('miabe-onboarding-answers', JSON.stringify(payload))
    onDone()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex flex-col px-4 py-6">
      <header className={`flex items-center justify-center mb-4 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src="/images/miabe-ga-logo.png"
          alt="Logo MiabéGa"
          className="h-10 w-auto object-contain"
        />
      </header>

      <div className="w-full max-w-md mx-auto">
        <div className="mb-3">
          <Progress value={progress} />
          <div className="mt-2 text-xs text-gray-600 text-right">{progress}%</div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle as="h1" className="text-xl text-gray-900">
              {step === 1 && 'Quel est ton objectif principal avec MiabéGa ?'}
              {step === 2 && "Tu reçois de l'argent chaque…"}
              {step === 3 && "As-tu déjà une idée d’épargne en tête ?"}
              {step === 4 && 'Souhaites-tu recevoir des rappels ou conseils personnalisés ?'}
              {step === 5 && 'Bienvenue sur MiabéGa 🎉'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 1 && 'Choisis une option ci-dessous'}
              {step === 2 && 'Cela nous aide à adapter le suivi'}
              {step === 3 && 'Tu peux ignorer si tu préfères'}
              {step === 4 && 'Tu pourras changer plus tard'}
              {step === 5 && 'Voici un récapitulatif rapide'}
            </CardDescription>
          </CardHeader>

          <CardContent>
                        <div key={step} className="transition-all duration-300 ease-out opacity-100 translate-x-0">
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  <SelectableCard
                    icon={<LineChart className="w-6 h-6 text-emerald-600" />}
                    label="Gérer mes dépenses"
                    selected={answers.objectif === 'Gérer mes dépenses'}
                    onClick={() => setAnswers((a) => ({ ...a, objectif: 'Gérer mes dépenses' }))}
                  />
                  <SelectableCard
                    icon={<PiggyBank className="w-6 h-6 text-yellow-600" />}
                    label="Épargner pour un objectif"
                    selected={answers.objectif === 'Épargner pour un objectif'}
                    onClick={() => setAnswers((a) => ({ ...a, objectif: 'Épargner pour un objectif' }))}
                  />
                  <SelectableCard
                    icon={<Users className="w-6 h-6 text-amber-700" />}
                    label="Participer à un projet collectif"
                    selected={answers.objectif === 'Participer à un projet collectif'}
                    onClick={() => setAnswers((a) => ({ ...a, objectif: 'Participer à un projet collectif' }))}
                  />
                  <SelectableCard
                    icon={<HandCoins className="w-6 h-6 text-orange-600" />}
                    label="Améliorer mes finances en général"
                    selected={answers.objectif === 'Améliorer mes finances en général'}
                    onClick={() => setAnswers((a) => ({ ...a, objectif: 'Améliorer mes finances en général' }))}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-wrap gap-2">
                  {['Jour', 'Semaine', 'Mois', "C’est irrégulier", 'Je ne sais pas encore'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, frequence: opt }))}
                      className={`px-3 py-2 rounded-full text-sm border transition-all ${
                        answers.frequence === opt
                          ? 'bg-amber-500 text-white border-amber-500 shadow'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <Input
                    placeholder="Un nouveau téléphone, un voyage, des fournitures…"
                    value={answers.idee ?? ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, idee: e.target.value }))}
                    className="h-12 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                  <div className="flex gap-2">
                    <Badge
                      className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200"
                      onClick={() => setAnswers((a) => ({ ...a, idee: '' }))}
                    >
                      Je verrai plus tard
                    </Badge>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <ToggleChoice
                      label="Oui"
                      selected={answers.rappels === true}
                      onClick={() => setAnswers((a) => ({ ...a, rappels: true }))}
                      color="yes"
                      icon={<Bell className="w-5 h-5" />}
                    />
                    <ToggleChoice
                      label="Non"
                      selected={answers.rappels === false}
                      onClick={() => setAnswers((a) => ({ ...a, rappels: false }))}
                      color="no"
                      icon={<Bell className="w-5 h-5" />}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bot className="w-4 h-4 text-amber-600" />
                    <span>Tu peux changer plus tard dans les paramètres.</span>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-sm">Ton profil est prêt.</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-800">
                    <p><span className="font-medium">Objectif principal:</span> {answers.objectif || '—'}</p>
                    <p><span className="font-medium">Fréquence:</span> {answers.frequence || '—'}</p>
                    <p><span className="font-medium">Idée d’épargne:</span> {answers.idee ? `"${answers.idee}"` : '—'}</p>
                    <p><span className="font-medium">Rappels:</span> {answers.rappels === null ? '—' : answers.rappels ? 'Oui' : 'Non'}</p>
                  </div>
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-600"
                    onClick={finish}
                  >
                    Aller au tableau de bord
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

                {step <= 4 && (
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="ghost"
              className="gap-1"
              onClick={back}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              onClick={next}
              disabled={!canNext}
              className="gap-1 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600"
            >
              {step < 4 ? (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>Terminer</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function SelectableCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border text-center transition-all min-h-[92px] ${
        selected
          ? 'bg-amber-50 border-amber-500 shadow text-gray-900'
          : 'bg-white border-gray-200 hover:border-amber-300 text-gray-800'
      }`}
    >
      {icon}
      <span className="text-sm font-medium leading-tight">{label}</span>
    </button>
  )
}

function ToggleChoice({
  label,
  selected,
  onClick,
  color,
  icon,
}: {
  label: string
  selected: boolean
  onClick: () => void
  color: 'yes' | 'no'
  icon?: React.ReactNode
}) {
  const base =
    'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all'
  const cls =
    color === 'yes'
      ? selected
        ? 'bg-emerald-500 border-emerald-500 text-white shadow'
        : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-400'
      : selected
      ? 'bg-red-500 border-red-500 text-white shadow'
      : 'bg-white border-gray-200 text-gray-800 hover:border-red-400'
  return (
    <button type="button" className={`${base} ${cls}`} onClick={onClick}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}

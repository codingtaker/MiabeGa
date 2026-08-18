# Miabé Ga

Plateforme d'épargne collaborative pour étudiants et jeunes communautés.
Monorepo **web + mobile + Supabase**. Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour les décisions techniques.

## Structure

```
miabeGa/
├── apps/
│   ├── web/        Next.js 15 + React 19 + Tailwind v4 + shadcn/ui
│   └── mobile/     Expo SDK 57 + expo-router (structure src/)
├── packages/
│   ├── shared/     Types TypeScript + schémas Zod
│   ├── core/       Logique métier pure (testée, 64 tests)
│   ├── api/        Couche d'accès Supabase
│   └── config/     tsconfig partagé
├── supabase/
│   └── migrations/ Schéma SQL versionné (0001–0005)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Démarrage

```bash
pnpm install
pnpm web        # lance l'app web (apps/web)
```

Copier `apps/web/.env.local.example` en `apps/web/.env.local` et renseigner les clés Supabase.

## Logique métier partagée

`@miabega/core` centralise tous les calculs (progression d'objectifs/projets,
épargne, taux, jours restants, contributions, projection) — code pur, testé
(64 tests unitaires vitest). Le web (`apps/web`) et le mobile (`apps/mobile`)
consomment exactement les mêmes fonctions : zéro duplication.

```bash
pnpm --filter @miabega/core test        # lance les tests
pnpm --filter @miabega/web dev          # app web
pnpm --filter @miabega/mobile start     # app mobile (Expo)
```

## Env

- Web : `apps/web/.env.local` (`NEXT_PUBLIC_SUPABASE_*`)
- Mobile : `apps/mobile/.env` (`EXPO_PUBLIC_SUPABASE_*`)

Des valeurs fictives sont fournies ; les remplacer par les vraies clés Supabase
avant tout test réel. Après un `pnpm install`, pour le mobile aligner les deps
natives avec `cd apps/mobile && npx expo install`.
# MiabeGa

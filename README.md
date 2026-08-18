# Miabé Ga

Plateforme d'épargne collaborative pour étudiants et jeunes communautés.
Monorepo **web + mobile + Supabase**. Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour les décisions techniques.

## Structure

```
miabeGa/
├── apps/
│   ├── web/        Next.js 15 + React 19 + Tailwind v4 + shadcn/ui (existant)
│   └── mobile/     Expo + React Native (à initialiser)
├── packages/
│   ├── shared/     Types TypeScript + schémas Zod
│   ├── core/       Logique métier pure
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

## Migration depuis miabeGa2

Le code Next.js existant a été placé tel quel dans `apps/web` (il reste fonctionnel).
Les `packages/*` sont des squelettes : en Phase 2, on y migre progressivement les
types (`apps/web/lib/types.ts` → `packages/shared`) et le client Supabase
(`apps/web/lib/supabase` → `packages/api`) pour les partager avec le mobile.

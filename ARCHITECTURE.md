# Architecture — Miabé Ga

> Plateforme d'épargne collaborative pour étudiants et jeunes communautés.
> **Contexte de décision :** Mobile d'abord · Développement solo (toi + Claude) · Backend Supabase · Fondation solide long terme.

---

## 1. Résumé des décisions

| Question | Décision | Pourquoi |
|---|---|---|
| Web ou mobile d'abord ? | **Mobile d'abord** (Expo) | Les étudiants africains sont majoritairement sur smartphone. On lance là où sont les utilisateurs. |
| Backend ou frontend d'abord ? | **Le modèle de données d'abord**, puis le mobile | Avec Supabase, la base de données + les règles de sécurité (RLS) *sont* le backend. On la pose d'abord, l'app se branche dessus. |
| Quel backend ? | **Supabase** | PostgreSQL + Auth + Storage + API auto + Realtime, sans serveur à maintenir. Scalable et suffisant pour la V1 comme pour la croissance. |
| Structure du code ? | **Monorepo** (Turborepo + pnpm) | Permet d'ajouter le web plus tard en **réutilisant** la logique métier et les types, sans réécrire. C'est ce qui donne la « fondation solide ». |
| Frontend mobile ? | **Expo (React Native) + TypeScript** | Un seul code pour iOS + Android, écosystème mûr, déploiement OTA. |

---

## 2. Vue d'ensemble de l'architecture

L'application est organisée en **couches** clairement séparées. Chaque couche ne connaît que celle du dessous.

```
┌──────────────────────────────────────────────────────┐
│  APP MOBILE (Expo / React Native)                      │
│  Écrans · Navigation · Composants UI                   │
└───────────────────────┬──────────────────────────────┘
                        │  appelle
┌───────────────────────▼──────────────────────────────┐
│  COUCHE MÉTIER PARTAGÉE (packages/core, shared)        │
│  Logique d'épargne · Validation (Zod) · Types          │
│  → réutilisable par le web plus tard                   │
└───────────────────────┬──────────────────────────────┘
                        │  accès données
┌───────────────────────▼──────────────────────────────┐
│  COUCHE ACCÈS DONNÉES (packages/api)                   │
│  Client Supabase · Requêtes · Abonnements temps réel   │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│  SUPABASE (le « backend »)                             │
│  • PostgreSQL  (données)                               │
│  • Auth        (comptes, sessions)                     │
│  • Row Level Security  (qui voit quoi)                 │
│  • Storage     (avatars, justificatifs)               │
│  • Realtime    (contributions live des projets)       │
│  • Edge Functions (logique sensible + appels IA)      │
└───────────────────────┬──────────────────────────────┘
                        │  clé API côté serveur uniquement
┌───────────────────────▼──────────────────────────────┐
│  FOURNISSEUR IA (Claude / OpenAI)                      │
│  Conseils budgétaires · Analyse des dépenses           │
└──────────────────────────────────────────────────────┘
```

**Principe clé :** l'app mobile ne parle **jamais directement** à l'IA ni aux opérations sensibles. Tout ce qui touche à l'argent ou aux clés secrètes passe par une **Edge Function** (code exécuté côté serveur Supabase). L'app ne fait que lire/écrire des données autorisées par les règles de sécurité.

---

## 3. Structure du monorepo

```
miabega/
├── apps/
│   ├── mobile/              # Application Expo (on commence ici)
│   │   ├── app/             # Écrans (Expo Router)
│   │   ├── components/      # Composants UI
│   │   ├── hooks/           # Hooks (useWallet, useGoals…)
│   │   └── lib/             # Config Supabase client
│   │
│   └── web/                 # Next.js — AJOUTÉ PLUS TARD (dossier vide au début)
│
├── packages/
│   ├── shared/              # Types TypeScript + schémas Zod (validation)
│   ├── core/                # Logique métier pure (calculs, règles épargne)
│   ├── api/                 # Fonctions d'accès Supabase (getWallet, addTransaction…)
│   └── config/              # tsconfig, eslint partagés
│
├── supabase/
│   ├── migrations/          # Schéma SQL versionné (le cœur du backend)
│   ├── functions/           # Edge Functions (IA, opérations sensibles)
│   └── seed.sql             # Données de test
│
├── turbo.json               # Config Turborepo
└── package.json             # Workspace pnpm
```

Même si on commence par le mobile, on met en place `packages/shared`, `core` et `api` **dès le départ**. C'est peu de travail au début et ça évite de tout réécrire quand on ajoutera le web. C'est le choix « fondation solide ».

---

## 4. Stack technique détaillée

### Mobile (à construire en premier)
- **Expo + React Native + TypeScript** — un seul code iOS/Android
- **Expo Router** — navigation par fichiers, simple et moderne
- **NativeWind** — Tailwind CSS adapté au mobile (styles rapides et cohérents)
- **TanStack Query** — cache, synchronisation et rechargement des données Supabase
- **Zustand** — état global léger (session, préférences)
- **React Hook Form + Zod** — formulaires et validation

### Backend — Supabase
- **PostgreSQL** — base de données relationnelle
- **Supabase Auth** — inscription, connexion, réinitialisation mot de passe, sessions
- **Row Level Security (RLS)** — chaque utilisateur ne voit que ses données (critique pour la finance)
- **Storage** — avatars, justificatifs de transactions
- **Realtime** — mises à jour live (contributions d'un projet collaboratif)
- **Edge Functions (Deno / TypeScript)** — logique sensible et appels IA

### IA
- **Claude ou OpenAI**, appelé **uniquement** depuis une Edge Function (la clé API ne quitte jamais le serveur)
- Versionnage des prompts + suivi de la consommation

### Web (phase 2)
- **Next.js + TypeScript + Tailwind + shadcn/ui**, qui réutilisera `packages/core`, `shared` et `api`

### Outils
- **pnpm** (gestion des paquets) · **Turborepo** (orchestration) · **EAS Build** (build mobile) · **GitHub** (versioning)

---

## 5. Modèle de base de données

Tables principales et leurs relations :

```
users ──┬── wallets ──── transactions ──── categories
        │
        ├── saving_goals ──── milestones
        │
        ├── project_members ──┐
        │                     ├── project_groups ──── project_contributions
        │  (créateur)─────────┘                            │
        │                                                  └── (lié à un wallet/transaction)
        │
        ├── notifications
        │
        └── ai_conversations ──── ai_messages
```

### Tables

| Table | Rôle | Champs clés |
|---|---|---|
| `users` | Profil utilisateur (étendu de Supabase Auth) | id, nom, avatar_url, rôle, préférences |
| `wallets` | Portefeuille / solde d'un utilisateur | id, user_id, solde, devise |
| `transactions` | Revenus et dépenses | id, wallet_id, montant, type (income/expense), category_id, note, justificatif_url, date |
| `categories` | Catégories de dépenses | id, nom, icône, type |
| `saving_goals` | Objectifs d'épargne | id, user_id, titre, montant_cible, montant_actuel, échéance |
| `milestones` | Étapes d'un objectif ou projet | id, goal_id/project_id, titre, montant, atteint |
| `project_groups` | Projets d'épargne collaboratifs | id, créateur_id, titre, description, montant_cible, échéance |
| `project_members` | Membres d'un projet + rôle | id, project_id, user_id, rôle (admin/membre) |
| `project_contributions` | Contributions à un projet | id, project_id, user_id, montant, date |
| `notifications` | Rappels et alertes | id, user_id, type, message, lu, date |
| `ai_conversations` | Sessions avec l'assistant IA | id, user_id, titre, date |
| `ai_messages` | Messages d'une conversation IA | id, conversation_id, rôle, contenu, date |

### Rôles
`student` (par défaut) · `project_manager` (gère un projet) · `admin` (administration plateforme).

---

## 6. Sécurité (priorité absolue en FinTech)

- **Row Level Security activée sur TOUTES les tables.** Règle de base : un utilisateur ne lit/écrit que les lignes où `user_id = auth.uid()`. Pour les projets, seuls les membres accèdent au projet.
- **Aucune clé secrète dans l'app mobile.** Les clés IA et opérations sensibles vivent dans les Edge Functions (variables d'environnement Supabase).
- **Validation systématique** des entrées avec Zod, côté client *et* côté Edge Function.
- **Auth gérée par Supabase** (mots de passe hachés, sessions, tokens JWT) — on ne réinvente jamais l'authentification.
- **Journal d'audit** sur les opérations financières sensibles (contributions, retraits).
- **HTTPS partout** (fourni par Supabase et Expo).

---

## 7. Ordre de développement recommandé

**Réponse directe à ta question « frontend ou backend d'abord ? » :**
avec Supabase on commence par **le modèle de données et l'authentification** (un « backend » léger, surtout du SQL et des règles RLS), puis on construit l'app mobile écran par écran par-dessus. On ne construit pas un gros backend séparé avant l'app.

### Phase 0 — Fondations (1 semaine)
1. Initialiser le monorepo (pnpm + Turborepo)
2. Créer le projet Supabase + premières migrations SQL (tables `users`, `wallets`)
3. Activer RLS + Auth
4. Créer l'app Expo vide connectée à Supabase

### Phase 1 — MVP (l'ordre des modules)
1. **Authentification** — inscription, connexion, onboarding
2. **Profil + Wallet** — voir son solde, son compte
3. **Transactions** — ajouter revenus/dépenses, catégories
4. **Objectifs d'épargne** — créer un objectif, suivre la progression
5. **Dashboard** — vue d'ensemble (solde, objectifs, dépenses du mois)
6. **Projets collaboratifs** — créer, inviter, contribuer (Realtime ici)
7. **Statistiques** — tendances, catégories de dépenses
8. **Notifications** — rappels et alertes
9. **Assistant IA** — conseils budgétaires via Edge Function

### Phase 2 et au-delà
- App **web** Next.js (réutilise la logique déjà écrite)
- Notifications push
- Analytics avancées, coach financier prédictif, mode hors-ligne

---

## 8. Coûts (démarrage)

Tout démarre **gratuitement** :
- **Supabase** : plan gratuit (base 500 Mo, auth, storage) — largement suffisant pour tester
- **Expo / EAS** : gratuit pour le développement, build payant à la demande
- **GitHub** : gratuit
- **IA** : facturé à l'usage (prévoir un plafond + suivi de consommation dès le début)

On ne paie que lorsque le nombre d'utilisateurs grandit — le modèle scale avec le succès.

---

## 9. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Fuite de données financières | RLS sur toutes les tables, validation double, secrets côté serveur |
| Coûts IA incontrôlés | Plafonds, suivi de consommation, cache des réponses fréquentes |
| Complexité du monorepo pour un solo | Turborepo simple, on commence petit (mobile + 3 packages) |
| Dette technique | Types partagés + Zod dès le départ, logique métier hors de l'UI |
| Dépendance à Supabase | PostgreSQL standard = portable ; on peut migrer si besoin |

---

## 10. Prochaine étape concrète

Si tu es d'accord avec cette architecture, la première action est de **poser les fondations (Phase 0)** : je peux générer pour toi le squelette du monorepo, la config Supabase, et les premières migrations SQL (tables + RLS) pour l'authentification et le wallet. Il te suffira de créer ton projet Supabase et de connecter les clés.

// Lecture centralisée des variables d'environnement Supabase.
// Les mêmes noms sont utilisés côté web (Next: NEXT_PUBLIC_*) et peuvent être
// mappés côté mobile (Expo: EXPO_PUBLIC_*) dans apps/mobile.

export function getSupabaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.EXPO_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('SUPABASE_URL manquant (NEXT_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_URL)')
  return url
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('SUPABASE_ANON_KEY manquant (NEXT_PUBLIC_SUPABASE_ANON_KEY / EXPO_PUBLIC_SUPABASE_ANON_KEY)')
  return key
}

import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { getSupabaseUrl, getSupabaseAnonKey } from './env'

// Factory de client Supabase côté serveur, agnostique du framework.
// L'appelant (Next.js dans apps/web) fournit l'adaptateur de cookies
// afin que la dépendance à `next/headers` reste dans la couche web.
export function createServerSupabaseClient(cookies: CookieMethodsServer) {
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), { cookies })
}

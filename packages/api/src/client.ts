import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseUrl, getSupabaseAnonKey } from './env'

// Client Supabase côté navigateur (composants client web).
// Pour le mobile, on fournira un client dédié (@supabase/supabase-js + AsyncStorage).
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}

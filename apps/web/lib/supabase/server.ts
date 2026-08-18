import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@miabega/api"

// Wrapper Next.js : fournit l'adaptateur de cookies (next/headers) à la
// factory partagée de @miabega/api. La logique Supabase vit dans le package.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerSupabaseClient({
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      } catch {
        // appelé depuis un Server Component ; sûr à ignorer (le middleware rafraîchit la session)
      }
    },
  })
}

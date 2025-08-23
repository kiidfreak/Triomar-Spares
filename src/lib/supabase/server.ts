import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    'https://rjgooqmfjkfsyjqhdwp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZ29vcW1mamtmc3lqeXFoZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjQ0NzksImV4cCI6MjA2NzIwMDQ3OX0.OejmlFf9fwE-Tpl4DEzNW2NsMZnSfWnzJEkrPhupL1Y',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

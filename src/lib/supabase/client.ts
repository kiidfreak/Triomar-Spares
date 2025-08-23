import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    'https://rjgooqmfjkfsyjqhdwp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZ29vcW1mamtmc3lqeXFoZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjQ0NzksImV4cCI6MjA2NzIwMDQ3OX0.OejmlFf9fwE-Tpl4DEzNW2NsMZnSfWnzJEkrPhupL1Y'
  )
}

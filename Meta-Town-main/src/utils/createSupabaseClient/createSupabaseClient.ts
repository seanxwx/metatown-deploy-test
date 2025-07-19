import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../../../database.types'

export type { Database, Tables } from '../../../database.types'

/* eslint-disable no-var */
declare global {
  var _supabaseClient: SupabaseClient<Database> | undefined
}
/* eslint-enable no-var */

const createSupabaseClient = (): SupabaseClient<Database> => {
  if (global._supabaseClient) {
    return global._supabaseClient
  }

  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  global._supabaseClient = supabaseClient

  return global._supabaseClient
}

export default createSupabaseClient

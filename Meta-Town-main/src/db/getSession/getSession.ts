import { Session } from '@supabase/supabase-js'
import createSupabaseClient from '@/utils/createSupabaseClient'

const getSession = async (): Promise<Session | null> => {
  const supabaseClient = createSupabaseClient()

  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  return session
}

export default getSession

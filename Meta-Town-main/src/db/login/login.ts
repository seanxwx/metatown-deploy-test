import { AuthResponse } from '@supabase/supabase-js'
import createSupabaseClient from '@/utils/createSupabaseClient'

interface Data {
  email: string
  password: string
}

interface Result {
  data?: AuthResponse['data']
  error?: AuthResponse['error']
}

const login = async ({ email, password }: Data): Promise<Result> => {
  const supabaseClient = createSupabaseClient()

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error }
  }

  return {}
}

export default login

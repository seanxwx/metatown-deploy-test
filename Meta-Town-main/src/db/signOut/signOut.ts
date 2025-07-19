import createSupabaseClient from '@/utils/createSupabaseClient'

const signOut = async (): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient.auth.signOut()
}

export default signOut

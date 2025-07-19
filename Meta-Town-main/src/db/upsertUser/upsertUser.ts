import createSupabaseClient from '@/utils/createSupabaseClient'

interface Data {
  displayName: string
  avatar: string
  authId: string
}

const upsertUser = async (data: Data): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient.from('users').upsert(
    {
      display_name: data.displayName,
      avatar: data.avatar,
      auth_id: data.authId,
    },
    { onConflict: 'auth_id' }
  )
}

export default upsertUser

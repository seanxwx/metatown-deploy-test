import createSupabaseClient from '@/utils/createSupabaseClient'

interface Data {
  userId: string
  spaceId: string
}

const leaveSpace = async (data: Data): Promise<void> => {
  const supabaseClient = createSupabaseClient()
  await supabaseClient.from('_users_joined_spaces').delete().match({
    A: data.spaceId,
    B: data.userId,
  })
}

export default leaveSpace

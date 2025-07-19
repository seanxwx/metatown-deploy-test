import createSupabaseClient from '@/utils/createSupabaseClient'

const deleteSpace = async (spaceId: string): Promise<void> => {
  const supabaseClient = createSupabaseClient()
  await supabaseClient.from('spaces').delete().eq('id', spaceId)
}

export default deleteSpace

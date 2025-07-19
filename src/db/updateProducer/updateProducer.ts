import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

interface Data {
  state: Tables<'user_space_mediasoup'>['state']
}

const updateProducer = async (id: string, { state }: Data): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient
    .from('user_space_mediasoup')
    .update({ state })
    .eq('id', id)
}

export default updateProducer

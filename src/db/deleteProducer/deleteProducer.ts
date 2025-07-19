import createSupabaseClient from '@/utils/createSupabaseClient'

const deleteProducer = async (producerId: string): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient
    .from('user_space_mediasoup')
    .delete()
    .eq('producer_id', producerId)
}

export default deleteProducer

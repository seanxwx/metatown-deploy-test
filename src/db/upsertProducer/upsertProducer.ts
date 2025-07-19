import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

interface Data {
  userId: string
  spaceId: string
  producerId: string
  state: Tables<'user_space_mediasoup'>['state']
  kind: Tables<'user_space_mediasoup'>['kind']
}

const upsertProducer = async ({
  userId,
  spaceId,
  producerId,
  state,
  kind,
}: Data): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient.from('user_space_mediasoup').upsert(
    {
      user_id: userId,
      space_id: spaceId,
      producer_id: producerId,
      state,
      kind,
    },
    { onConflict: 'user_id, space_id, kind' }
  )
}

export default upsertProducer

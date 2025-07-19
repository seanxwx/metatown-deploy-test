import { mutate } from 'swr'
import { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'
import createSubscriptionMutatorCallback from '@/utils/createSubscriptionMutatorCallback'

type SpaceProducer = CamelCaseKeys<
  Pick<
    Tables<'user_space_mediasoup'>,
    'id' | 'producer_id' | 'user_id' | 'state' | 'kind'
  >
>

export const transformSpaceProducers = (
  row: Tables<'user_space_mediasoup'>
): SpaceProducer => ({
  id: row.id,
  producerId: row.producer_id,
  userId: row.user_id,
  state: row.state,
  kind: row.kind,
})

const subscribeProducers = (key: [string, string]) => {
  const [, spaceId] = key
  const supabaseClient = createSupabaseClient()

  const channel = supabaseClient
    .channel(`space-producers:${spaceId}`)
    .on<Tables<'user_space_mediasoup'>>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_space_mediasoup',
        filter: `space_id=eq.${spaceId}`,
      },
      (payload) => {
        const subscriptionMutatorCallback = createSubscriptionMutatorCallback(
          payload,
          transformSpaceProducers
        )

        void mutate(key, subscriptionMutatorCallback, { revalidate: false })
      }
    )
    .subscribe()

  return (): void => {
    void supabaseClient.removeChannel(channel)
  }
}

export default subscribeProducers

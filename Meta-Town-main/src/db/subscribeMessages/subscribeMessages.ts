import { mutate } from 'swr'
import { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'
import createSubscriptionMutatorCallback from '@/utils/createSubscriptionMutatorCallback'

type Data = CamelCaseKeys<
  Pick<Tables<'messages'>, 'id' | 'created_at' | 'content' | 'sender_id'>
>

export const transformSpaceMessages = (row: Tables<'messages'>): Data => ({
  id: row.id,
  createdAt: row.created_at,
  content: row.content,
  senderId: row.sender_id,
})

const subscribeMessages = (key: [string, string]) => {
  const [, spaceId] = key
  const supabaseClient = createSupabaseClient()

  const channel = supabaseClient
    .channel(`space-messages:${spaceId}`)
    .on<Tables<'messages'>>(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `space_id=eq.${spaceId}`,
      },
      (payload) => {
        const subscriptionMutatorCallback = createSubscriptionMutatorCallback(
          payload,
          transformSpaceMessages
        )

        void mutate(key, subscriptionMutatorCallback, { revalidate: false })
      }
    )
    .subscribe()

  return (): void => {
    void supabaseClient.removeChannel(channel)
  }
}

export default subscribeMessages

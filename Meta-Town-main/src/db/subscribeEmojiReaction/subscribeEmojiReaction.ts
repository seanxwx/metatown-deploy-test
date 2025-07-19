import { type SWRSubscriptionOptions } from 'swr/subscription'
import createSupabaseClient from '@/utils/createSupabaseClient'

interface Payload {
  emoji: {
    label: string
    unicode: string
  }
  userId: string
  createdAt: string
}

const subscribeEmojiReaction = (
  [, spaceId]: [string, string],
  { next }: SWRSubscriptionOptions<Payload, Error>
) => {
  const supabaseClient = createSupabaseClient()

  const channel = supabaseClient
    .channel(`emoji-reactions:${spaceId}`)
    .on<Payload>('broadcast', { event: 'emoji' }, (payload) => {
      next(null, payload.payload)
    })
    .subscribe()

  return (): void => {
    void supabaseClient.removeChannel(channel)
  }
}

export default subscribeEmojiReaction

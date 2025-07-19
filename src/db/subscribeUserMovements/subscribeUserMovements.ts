import { SWRSubscriptionOptions } from 'swr/subscription'
import { Indexed, Movement } from '@/app/types'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getUserPositions from '@/db/getUserPositions'
import createPayloadHandler from './utils/createPayloadHandler'

type Payload = Indexed<Movement & { userId: string; spaceId: string }>

const subscribeUserMovements = (
  key: [string, string],
  { next }: SWRSubscriptionOptions<Payload[]>
): (() => void) => {
  const supabaseClient = createSupabaseClient()

  const [, spaceId] = key

  const channel = supabaseClient
    .channel(`user-movements:${spaceId}`, {
      config: {
        broadcast: { self: true },
      },
    })
    .subscribe()

  const handlePayload = createPayloadHandler({ next })

  const handleSubscribe = async (): Promise<void> => {
    const userPositions = await getUserPositions(key)

    next(
      null,
      userPositions?.map((item) => ({ ...item, isMoving: false }))
    )

    channel.on<Payload>('broadcast', { event: 'update' }, handlePayload)
  }

  void handleSubscribe()

  return (): void => {
    void supabaseClient.removeChannel(channel)
  }
}

export default subscribeUserMovements

import { Indexed, Movement } from '@/app/types'
import createSupabaseClient from '@/utils/createSupabaseClient'

const broadcastUserMovement = async (
  payload: Indexed<Movement & { userId: string; spaceId: string }>
): Promise<void> => {
  const channelName = `user-movements:${payload.spaceId}`

  const supabaseClient = createSupabaseClient()

  const subscribedChannel = supabaseClient
    .getChannels()
    .find((channel) => channel.subTopic === channelName)

  const channel =
    subscribedChannel ??
    supabaseClient.channel(channelName, {
      config: {
        broadcast: { self: true },
      },
    })

  await channel.send({
    type: 'broadcast',
    event: 'update',
    payload,
  })
}

export default broadcastUserMovement

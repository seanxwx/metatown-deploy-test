import { RealtimeChannel } from '@supabase/supabase-js'
import { SWRSubscriptionOptions } from 'swr/subscription'

const createSyncHandler =
  ({ next }: SWRSubscriptionOptions<string[]>, channel: RealtimeChannel) =>
  (): void => {
    const state = channel.presenceState<{ userId: string }>()

    const onlineUsers = Object.values(state)
      .flat()
      .map((onlineUser) => onlineUser.userId)

    next(null, onlineUsers)
  }

export default createSyncHandler

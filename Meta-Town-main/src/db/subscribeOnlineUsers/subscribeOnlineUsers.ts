import { SWRSubscriptionOptions } from 'swr/subscription'
import getSession from '@/db/getSession'
import getSessionUser from '@/db/getSessionUser'
import createSupabaseClient from '@/utils/createSupabaseClient'
import createSyncHandler from './utils/createSyncHandler'

const subscribeOnlineUsers = (
  key: [string, string],
  { next }: SWRSubscriptionOptions<string[]>
) => {
  const [, spaceId] = key

  const supabaseClient = createSupabaseClient()

  const channel = supabaseClient.channel(`online-users:${spaceId}`).subscribe()

  const handleSync = createSyncHandler({ next }, channel)

  const handleSubscribe = async (): Promise<void> => {
    const session = await getSession()

    if (!session) {
      return
    }

    const sessionUser = await getSessionUser(['session-user', session.user.id])

    if (!sessionUser) {
      return
    }

    void channel.on('presence', { event: 'sync' }, handleSync).track({
      userId: sessionUser.id,
    })
  }

  void handleSubscribe()

  return (): void => {
    void supabaseClient.removeChannel(channel)
  }
}

export default subscribeOnlineUsers

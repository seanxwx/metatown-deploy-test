import useSWRSubscription, { SWRSubscriptionResponse } from 'swr/subscription'
import subscribeOnlineUsers from '@/db/subscribeOnlineUsers'

const useOnlineUsers = (spaceId?: string): SWRSubscriptionResponse<string[]> =>
  useSWRSubscription(
    spaceId ? ['online-users', spaceId] : null,
    subscribeOnlineUsers
  )

export default useOnlineUsers

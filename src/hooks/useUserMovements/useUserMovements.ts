import useSWRSubscription, { SWRSubscriptionResponse } from 'swr/subscription'
import { Indexed, Movement } from '@/app/types'
import subscribeUserMovements from '@/db/subscribeUserMovements'

const useUserMovements = (
  spaceId?: string
): SWRSubscriptionResponse<
  Indexed<Movement & { userId: string; spaceId: string }>[] | null
> =>
  useSWRSubscription(
    spaceId ? ['user-movements', spaceId] : null,
    subscribeUserMovements
  )

export default useUserMovements

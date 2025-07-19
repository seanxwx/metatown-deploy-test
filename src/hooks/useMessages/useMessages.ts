import useSWR, { SWRResponse } from 'swr'
import useSWRSubscription from 'swr/subscription'
import getMessages from '@/db/getMessages'
import subscribeMessages from '@/db/subscribeMessages'

type SpaceMessages = Awaited<ReturnType<typeof getMessages>>

const useMessages = (spaceId?: string): SWRResponse<SpaceMessages> => {
  useSWRSubscription(spaceId ? ['messages', spaceId] : null, subscribeMessages)

  return useSWR(spaceId ? ['messages', spaceId] : null, getMessages, {
    revalidateOnFocus: false,
  })
}

export default useMessages

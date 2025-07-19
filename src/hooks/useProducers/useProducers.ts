import useSWR, { SWRResponse } from 'swr'
import useSWRSubscription from 'swr/subscription'
import getProducers from '@/db/getProducers'
import subscribeProducers from '@/db/subscribeProducers'

type SpaceProducers = Awaited<ReturnType<typeof getProducers>>

const useProducers = (spaceId?: string): SWRResponse<SpaceProducers> => {
  useSWRSubscription(
    spaceId ? ['producers', spaceId] : null,
    subscribeProducers
  )

  return useSWR(spaceId ? ['producers', spaceId] : null, getProducers, {
    revalidateOnFocus: false,
  })
}

export default useProducers

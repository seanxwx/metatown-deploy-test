import useSWR, { SWRResponse } from 'swr'
import getSpacePresences from '@/db/getSpacePresences'
import useSessionUser from '@/hooks/useSessionUser'

type SpacePresence = Awaited<ReturnType<typeof getSpacePresences>>

const useSpacePresences = (): SWRResponse<SpacePresence> => {
  const { data: user } = useSessionUser()

  return useSWR(user ? ['space-presences', user.id] : null, getSpacePresences)
}

export default useSpacePresences

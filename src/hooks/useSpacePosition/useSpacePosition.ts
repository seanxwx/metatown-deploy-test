import useSWR, { SWRResponse } from 'swr'
import getSpacePosition from '@/db/getSpacePosition'
import useSessionUser from '@/hooks/useSessionUser'

type SpacePosition = Awaited<ReturnType<typeof getSpacePosition>>

const useSpacePosition = (spaceId?: string): SWRResponse<SpacePosition> => {
  const { data: user } = useSessionUser()

  return useSWR(
    user && spaceId ? ['space-position', user.id, spaceId] : null,
    getSpacePosition
  )
}

export default useSpacePosition

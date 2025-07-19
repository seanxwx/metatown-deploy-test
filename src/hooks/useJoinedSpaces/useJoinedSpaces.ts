import useSWR, { SWRResponse } from 'swr'
import getJoinedSpaces from '@/db/getJoinedSpaces'
import useSessionUser from '@/hooks/useSessionUser'

type JoinedSpaces = Awaited<ReturnType<typeof getJoinedSpaces>>

const useJoinedSpaces = (): SWRResponse<JoinedSpaces> => {
  const { data: user } = useSessionUser()

  return useSWR(user ? ['joined-spaces', user.id] : null, getJoinedSpaces)
}

export default useJoinedSpaces

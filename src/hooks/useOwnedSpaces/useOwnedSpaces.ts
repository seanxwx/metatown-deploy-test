import useSWR, { SWRResponse } from 'swr'
import getOwnedSpaces from '@/db/getOwnedSpaces'
import useSessionUser from '@/hooks/useSessionUser'

type OwnedSpaces = Awaited<ReturnType<typeof getOwnedSpaces>>

const useOwnedSpaces = (): SWRResponse<OwnedSpaces> => {
  const { data: user } = useSessionUser()

  return useSWR(user ? ['owned-spaces', user.id] : null, getOwnedSpaces)
}

export default useOwnedSpaces

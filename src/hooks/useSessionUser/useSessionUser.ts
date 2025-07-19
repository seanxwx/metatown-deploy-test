import useSWR, { SWRResponse } from 'swr'
import useSession from '@/hooks/useSession'
import getSessionUser from '@/db/getSessionUser'

type User = Awaited<ReturnType<typeof getSessionUser>>

const useSessionUser = (): SWRResponse<User> => {
  const { data: session } = useSession()

  return useSWR(
    session ? ['session-user', session.user.id] : null,
    getSessionUser
  )
}

export default useSessionUser

import { useEffect } from 'react'
import useSWR, { SWRResponse } from 'swr'
import navigate from '@/utils/navigate'
import getSession from '@/db/getSession'

type Session = Awaited<ReturnType<typeof getSession>>

const useSession = (skipCheck = false): SWRResponse<Session> => {
  const result = useSWR('session', getSession)

  useEffect(() => {
    const { isLoading, data } = result

    if (isLoading || !!data || skipCheck) {
      return
    }

    navigate('/authentication/login')
  }, [result, skipCheck])

  return result
}

export default useSession

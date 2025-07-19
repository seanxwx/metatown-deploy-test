import useSWR, { SWRResponse } from 'swr'
import getUser from '@/db/getUser'

type User = Awaited<ReturnType<typeof getUser>>

const useUser = (userId?: string): SWRResponse<User> =>
  useSWR(userId ? ['user', userId] : null, getUser)

export default useUser

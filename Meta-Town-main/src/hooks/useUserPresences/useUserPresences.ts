import useSWR, { SWRResponse } from 'swr'
import getUserPresences from '@/db/getUserPresences'

type UserPresences = Awaited<ReturnType<typeof getUserPresences>>

const useUserPresences = (spaceId?: string): SWRResponse<UserPresences> =>
  useSWR(spaceId ? ['user-presences', spaceId] : null, getUserPresences)

export default useUserPresences

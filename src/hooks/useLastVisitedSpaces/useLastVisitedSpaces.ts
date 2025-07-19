import useSWR, { SWRResponse } from 'swr'
import getLastVisitedSpaces from '@/db/getLastVisitedSpaces'

type LastVisitedSpaces = Awaited<ReturnType<typeof getLastVisitedSpaces>>

const useLastVisitedSpaces = (): SWRResponse<LastVisitedSpaces> =>
  useSWR('last-visited-spaces', getLastVisitedSpaces)

export default useLastVisitedSpaces

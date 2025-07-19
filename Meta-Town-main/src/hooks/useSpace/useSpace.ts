import useSWR, { SWRResponse } from 'swr'
import getSpace from '@/db/getSpace'

type Space = Awaited<ReturnType<typeof getSpace>>

const useSpace = (spaceId?: string): SWRResponse<Space> =>
  useSWR(spaceId ? ['space', spaceId] : null, getSpace)

export default useSpace

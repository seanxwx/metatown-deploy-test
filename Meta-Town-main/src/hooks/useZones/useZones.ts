import useSWR, { SWRResponse } from 'swr'
import getZones from '@/db/getZones'

type Zones = Awaited<ReturnType<typeof getZones>>

const useZones = (spaceId?: string): SWRResponse<Zones> =>
  useSWR(spaceId ? ['zones', spaceId] : null, getZones)

export default useZones

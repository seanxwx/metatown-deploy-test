import useSWR, { SWRResponse } from 'swr'
import getStageConfig from '@/db/getStageConfig'

type StageConfigs = Awaited<ReturnType<typeof getStageConfig>>

const useStageConfig = (spaceId?: string | null): SWRResponse<StageConfigs> =>
  useSWR(spaceId ? ['stage-config', spaceId] : null, getStageConfig)

export default useStageConfig

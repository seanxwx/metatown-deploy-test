import { ConfigPosition } from '@/app/types'
import upsertStageConfig from '@/db/upsertStageConfig'
import useStageConfig from '@/hooks/useStageConfig'
import createOptimisticDataCallback from '../createOptimisticDataCallback'

type StageConfigData = ReturnType<typeof useStageConfig>['data']

const createStageConfigMutatorCallback =
  (spaceId: string, configPosition: ConfigPosition) =>
  (stageConfigData: StageConfigData): null => {
    const optimisticData =
      createOptimisticDataCallback(configPosition)(stageConfigData)

    if (!optimisticData) {
      return null
    }

    void upsertStageConfig({
      spaceId,
      ...optimisticData,
    })

    return null
  }

export default createStageConfigMutatorCallback

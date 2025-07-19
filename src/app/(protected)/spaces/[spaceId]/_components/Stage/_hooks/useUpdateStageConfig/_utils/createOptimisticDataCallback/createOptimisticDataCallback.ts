import { omit } from 'lodash'
import { ConfigPosition } from '@/app/types'
import useStageConfig from '@/hooks/useStageConfig'
import deleteLast from './_utils/deleteLast'

type StageConfigData = ReturnType<typeof useStageConfig>['data']

const addCreatedItem = <T extends { type: string }>(
  data: (Omit<T, 'type'> & { createdAt?: string })[] | null,
  item: T
): (Omit<T, 'type'> & { createdAt?: string })[] => [
  ...(data ?? []),
  {
    ...omit(item, 'type'),
    createdAt: new Date().toISOString(),
  },
]

const createOptimisticDataCallback =
  (configPosition: ConfigPosition) =>
  (stageConfigData: StageConfigData): Exclude<StageConfigData, undefined> => {
    if (!stageConfigData) {
      return null
    }

    const data: StageConfigData = {
      ...stageConfigData,
    }

    if (configPosition.type === 'zone') {
      data.zones = addCreatedItem(stageConfigData.zones, configPosition)
    }

    if (configPosition.type === 'grounds') {
      data.grounds = addCreatedItem(stageConfigData.grounds, configPosition)
    }

    if (configPosition.type === 'entry') {
      data.entry = omit(configPosition, 'type')
    }

    if (configPosition.type === 'blocks') {
      data.blocks = addCreatedItem(stageConfigData.blocks, configPosition)
    }

    if (configPosition.type === 'delete') {
      data.blocks = deleteLast(stageConfigData.blocks, configPosition)
      data.zones = deleteLast(stageConfigData.zones, configPosition)
      data.grounds = deleteLast(stageConfigData.grounds, configPosition)
    }

    return data
  }

export default createOptimisticDataCallback

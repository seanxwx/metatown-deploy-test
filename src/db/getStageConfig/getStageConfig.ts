import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'
import { Block, Ground, Indexed, Position } from '@/app/types'

type TimeStamped<T> = T & { createdAt?: string }

export interface OverrideConfig {
  blocks: TimeStamped<Block>[] | null
  entry: TimeStamped<Position>
  zones: Indexed<TimeStamped<Position>>[] | null
  grounds: TimeStamped<Ground>[] | null
}

type StageConfigs = CamelCaseKeys<
  Pick<Tables<'stage_configs'>, 'id' | 'rows' | 'columns'> & OverrideConfig
>

const getStageConfig = async ([, spaceId]: [
  string,
  string,
]): Promise<StageConfigs | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: stageConfig } = await supabaseClient
    .from('stage_configs')
    .select(
      `
      id, 
      rows, 
      columns, 
      blocks,
      entry,
      zones,
      grounds
    `
    )
    .eq('space_id', spaceId)
    .single()
    .overrideTypes<OverrideConfig>()

  if (!stageConfig) {
    return null
  }

  return camelcaseKeys(stageConfig)
}

export default getStageConfig

import createSupabaseClient from '@/utils/createSupabaseClient'
import { Position } from '@/app/types'

interface Data {
  spaceId: string
  userId: string
}

const joinSpace = async (data: Data): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient
    .from('_users_joined_spaces')
    .insert({ A: data.spaceId, B: data.userId })

  const { data: stageConfig } = await supabaseClient
    .from('stage_configs')
    .select('entry')
    .eq('space_id', data.spaceId)
    .single()
    .overrideTypes<{ entry: Position }>()

  if (!stageConfig?.entry) {
    throw new Error('SPACE_STAGE_ENTRY_NOT_FOUND')
  }

  await supabaseClient.from('user_space_positions').insert({
    space_id: data.spaceId,
    user_id: data.userId,
    x: stageConfig.entry.x,
    y: stageConfig.entry.y,
    direction: stageConfig.entry.direction,
  })
}

export default joinSpace

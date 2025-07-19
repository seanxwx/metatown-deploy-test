import { Position } from '@/app/types'
import createSupabaseClient from '@/utils/createSupabaseClient'

const upsertSpacePosition = async (
  data: Position & { id?: string; userId: string; spaceId: string }
): Promise<void> => {
  const supabaseClient = createSupabaseClient()

  await supabaseClient.from('user_space_positions').upsert({
    id: data.id,
    user_id: data.userId,
    space_id: data.spaceId,
    x: data.x,
    y: data.y,
    direction: data.direction,
  })
}

export default upsertSpacePosition

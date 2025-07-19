import { Indexed, Position } from '@/app/types'
import createSupabaseClient from '@/utils/createSupabaseClient'

type JsonCoordinates =
  | {
      [K in keyof Position]: Position[K]
    }
  | {
      [K in keyof Indexed<Position>]: Indexed<Position>[K]
    }

interface Data {
  spaceId: string
  rows: number
  columns: number
  blocks?: JsonCoordinates[] | null
  entry: JsonCoordinates
  zones?: JsonCoordinates[] | null
  grounds?: JsonCoordinates[] | null
}

const upsertStageConfig = async ({
  spaceId,
  rows,
  columns,
  blocks = null,
  entry,
  zones = null,
  grounds = null,
}: Data): Promise<void> => {
  const SupabaseClient = createSupabaseClient()

  await SupabaseClient.from('stage_configs').upsert(
    {
      space_id: spaceId,
      rows,
      columns,
      blocks,
      entry,
      zones,
      grounds,
    },
    {
      onConflict: 'space_id',
    }
  )
}

export default upsertStageConfig

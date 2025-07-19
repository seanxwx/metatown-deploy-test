import { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type Zone = CamelCaseKeys<Pick<Tables<'zones'>, 'id'>>

interface Data {
  id?: string
  spaceId: string
  name: string
  type: Tables<'zones'>['type']
  size?: number
}

const upsertSpace = async (data: Data): Promise<Zone | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: space } = await supabaseClient
    .from('zones')
    .upsert(
      {
        id: data.id,
        space_id: data.spaceId,
        name: data.name,
        type: data.type,
        size: data.size,
      },
      {
        onConflict: 'id',
      }
    )
    .select('id')
    .single()

  return space
}

export default upsertSpace

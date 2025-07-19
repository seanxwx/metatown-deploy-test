import { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type Space = CamelCaseKeys<Pick<Tables<'spaces'>, 'id'>>

interface Data {
  name: string
  ownerId: string
  id?: string
}

const upsertSpace = async (data: Data): Promise<Space | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: space } = await supabaseClient
    .from('spaces')
    .upsert(
      {
        id: data.id,
        name: data.name,
        owner_id: data.ownerId,
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

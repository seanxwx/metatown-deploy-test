import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

export type Data = Pick<Tables<'zones'>, 'id' | 'name' | 'size'>

type Zone = CamelCaseKeys<Data>

const getZones = async ([, spaceId]: [string, string]): Promise<
  Zone[] | null
> => {
  const supabaseClient = createSupabaseClient()

  const { data: zones } = await supabaseClient
    .from('zones')
    .select('id, name, size')
    .eq('space_id', spaceId)

  if (!zones) {
    return null
  }

  return camelcaseKeys(zones)
}

export default getZones

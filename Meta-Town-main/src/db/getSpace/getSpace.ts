import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type Space = CamelCaseKeys<Pick<Tables<'spaces'>, 'id' | 'name'>>

const getSpace = async ([, spaceId]: [
  string,
  string,
]): Promise<Space | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: space } = await supabaseClient
    .from('spaces')
    .select('id, name')
    .eq('id', spaceId)
    .single()

  if (!space) {
    return null
  }

  return camelcaseKeys(space)
}

export default getSpace

import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type Spaces = CamelCaseKeys<Pick<Tables<'spaces'>, 'id' | 'name'>>[]

const searchSpaces = async ([, query]: [
  string,
  string,
]): Promise<Spaces | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: spaces } = await supabaseClient
    .from('spaces')
    .select('id, name')
    .ilike('name', `%${query}%`)

  if (!spaces) {
    return null
  }

  return camelcaseKeys(spaces)
}

export default searchSpaces

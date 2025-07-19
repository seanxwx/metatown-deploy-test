import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type OwnedSpaces = CamelCaseKeys<Pick<Tables<'spaces'>, 'id' | 'name'>>[]

const getOwnedSpaces = async ([, ownerId]: [
  string,
  string,
]): Promise<OwnedSpaces | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: spaces } = await supabaseClient
    .from('spaces')
    .select('id, name')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (!spaces) {
    return null
  }

  return camelcaseKeys(spaces)
}

export default getOwnedSpaces

import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type SpacePresence = CamelCaseKeys<
  Pick<Tables<'user_space_presences'>, 'space_id' | 'status' | 'last_seen_at'>
>

const getSpacePresences = async ([, userId]: [string, string]): Promise<
  SpacePresence[] | null
> => {
  const supabaseClient = createSupabaseClient()

  const { data: spacePresences } = await supabaseClient
    .from('user_space_presences')
    .select('space_id, status, last_seen_at')
    .eq('user_id', userId)

  if (!spacePresences) {
    return null
  }

  return camelcaseKeys(spacePresences)
}

export default getSpacePresences

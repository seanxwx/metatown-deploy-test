import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type UserPresences = CamelCaseKeys<
  Pick<
    Tables<'user_space_presences'>,
    'id' | 'space_id' | 'user_id' | 'status' | 'last_seen_at'
  >
>

const getUserPresences = async ([, spaceId]: [string, string]): Promise<
  UserPresences[] | null
> => {
  const supabaseClient = createSupabaseClient()

  const { data: userPresences } = await supabaseClient
    .from('user_space_presences')
    .select('id, space_id, user_id, status, last_seen_at')
    .eq('space_id', spaceId)

  if (!userPresences) {
    return null
  }

  return camelcaseKeys(userPresences)
}

export default getUserPresences

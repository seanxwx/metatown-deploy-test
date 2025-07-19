import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type JoinedSpaces = CamelCaseKeys<Pick<Tables<'spaces'>, 'id' | 'name'>[]>

const getJoinedSpaces = async ([, userId]: [
  string,
  string,
]): Promise<JoinedSpaces | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: joinedSpaces } = await supabaseClient
    .from('spaces')
    .select(
      `
    id, name,
    _users_joined_spaces!inner (B),
    user_space_presences!inner (last_seen_at)
  `
    )
    .match({
      '_users_joined_spaces.B': userId,
      'user_space_presences.user_id': userId,
    })

  if (!joinedSpaces) {
    return null
  }

  return camelcaseKeys(joinedSpaces).map(({ id, name }) => ({
    id,
    name,
  }))
}

export default getJoinedSpaces

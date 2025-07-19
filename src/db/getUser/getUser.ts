import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type User = CamelCaseKeys<
  Pick<Tables<'users'>, 'id' | 'display_name' | 'avatar'>
>

const getUser = async ([, id]: [string, string]): Promise<User | null> => {
  const supabaseClient = createSupabaseClient()

  const { data: user } = await supabaseClient
    .from('users')
    .select('id, display_name, avatar')
    .eq('id', id)
    .single()

  if (!user) {
    return null
  }

  return camelcaseKeys(user)
}

export default getUser

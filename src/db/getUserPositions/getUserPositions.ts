import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type UserPosition = CamelCaseKeys<
  Pick<
    Tables<'user_space_positions'>,
    'id' | 'user_id' | 'space_id' | 'x' | 'y' | 'direction'
  >
>

const getUserPositions = async ([, spaceId]: [string, string]): Promise<
  UserPosition[] | null
> => {
  const SupabaseClient = createSupabaseClient()

  const { data: userPositions } = await SupabaseClient.from(
    'user_space_positions'
  )
    .select(
      `
        id,
        user_id,
        space_id,
        x,
        y,
        direction
      `
    )
    .eq('space_id', spaceId)

  if (!userPositions) {
    return null
  }

  return camelcaseKeys(userPositions)
}

export default getUserPositions

import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type UserPosition = CamelCaseKeys<
  Pick<
    Tables<'user_space_positions'>,
    'id' | 'space_id' | 'user_id' | 'x' | 'y' | 'direction'
  >
>

const getSpacePosition = async ([, userId, spaceId]: [
  string,
  string,
  string,
]): Promise<UserPosition | null> => {
  const SupabaseClient = createSupabaseClient()

  const { data: spacePosition } = await SupabaseClient.from(
    'user_space_positions'
  )
    .select(
      `
        id,
        space_id,
        user_id,
        x,
        y,
        direction
      `
    )
    .match({
      space_id: spaceId,
      user_id: userId,
    })
    .single()

  if (!spacePosition) {
    return null
  }

  return camelcaseKeys(spacePosition)
}

export default getSpacePosition

import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

export type Data = Pick<
  Tables<'user_space_mediasoup'>,
  'id' | 'producer_id' | 'user_id' | 'state' | 'kind'
>

type SpaceProducer = CamelCaseKeys<Data>

const getProducers = async ([, spaceId]: [string, string]): Promise<
  SpaceProducer[] | null
> => {
  const supabaseClient = createSupabaseClient()

  const { data: spaceProducers } = await supabaseClient
    .from('user_space_mediasoup')
    .select('id, producer_id, user_id, state, kind')
    .eq('space_id', spaceId)

  if (!spaceProducers) {
    return null
  }

  return camelcaseKeys(spaceProducers)
}

export default getProducers

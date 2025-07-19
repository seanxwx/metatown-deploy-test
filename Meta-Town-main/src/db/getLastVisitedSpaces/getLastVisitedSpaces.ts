import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type LastVisitedSpaces = CamelCaseKeys<Pick<Tables<'spaces'>, 'id' | 'name'>>[]

const getLastVisitedSpaces = async (): Promise<LastVisitedSpaces | null> => {
  const supabaseClient = createSupabaseClient()

  const recentDateRange = new Date()
  recentDateRange.setDate(recentDateRange.getDate() - 3)

  const { data: spaces } = await supabaseClient
    .from('spaces')
    .select(
      `
    id, name,
    user_space_presences!inner (last_seen_at)
  `
    )
    .gte('user_space_presences.last_seen_at', recentDateRange.toISOString())

  if (!spaces) {
    return null
  }

  return camelcaseKeys(spaces).map(({ id, name }) => ({
    id,
    name,
  }))
}

export default getLastVisitedSpaces

import camelcaseKeys, { CamelCaseKeys } from 'camelcase-keys'
import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type LastVisitedSpaces = CamelCaseKeys<Pick<Tables<'spaces'>, 'id' | 'name'>>[]

const getLastVisitedSpaces = async (): Promise<LastVisitedSpaces | null> => {
  const supabaseClient = createSupabaseClient()

  const recentDateRange = new Date()
  recentDateRange.setDate(recentDateRange.getDate() - 3)

  const { data: spaces, error } = await supabaseClient
    .from('spaces')
    .select(
      `
    id, name,
    user_space_presences!inner (last_seen_at)
  `
    )
    .gte('user_space_presences.last_seen_at', recentDateRange.toISOString())

  if (error) {
    return null
  }

  if (Array.isArray(spaces)) {
    return (camelcaseKeys(spaces) as { id: string; name: string }[]).map(
      (space) => ({
        id: space.id,
        name: space.name,
      })
    )
  }

  return null
}

export default getLastVisitedSpaces

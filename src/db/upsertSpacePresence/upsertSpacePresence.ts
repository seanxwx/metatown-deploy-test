import createSupabaseClient, { Tables } from '@/utils/createSupabaseClient'

type Status = Tables<'user_space_presences'>['status']

interface Props {
  userId: string
  spaceId: string
  status: Status
}

const upsertSpacePresence = async ({
  userId,
  spaceId,
  status,
}: Props): Promise<void> => {
  const SupabaseClient = createSupabaseClient()

  await SupabaseClient.from('user_space_presences').upsert(
    {
      user_id: userId,
      space_id: spaceId,
      status,
      last_seen_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,space_id',
    }
  )
}

export default upsertSpacePresence

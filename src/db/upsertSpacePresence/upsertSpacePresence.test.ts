import createSupabaseClient from '@/utils/createSupabaseClient'
import upsertSpacePresence from './upsertSpacePresence'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('upsertSpacePresence', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls supabase upsert with data', async () => {
    const date = new Date(2025, 3, 3, 13)
    vi.setSystemTime(date)

    const data = {
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      status: 'ONLINE' as const,
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnValue(undefined),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await upsertSpacePresence(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_presences')
    expect(
      supabaseClient.from('user_space_presences').upsert
    ).toHaveBeenCalledWith(
      {
        user_id: data.userId,
        space_id: data.spaceId,
        status: data.status,
        last_seen_at: date.toISOString(),
      },
      {
        onConflict: 'user_id,space_id',
      }
    )
  })
})

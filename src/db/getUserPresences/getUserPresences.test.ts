import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getUserPresences from './getUserPresences'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getUserPresences', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns user presences', async () => {
    const SPACE_ID = 'SPACE_ID'

    const data = [
      {
        id: 'ID',
        space_id: 'SPACE_ID',
        user_id: 'USER_ID',
        status: 'ONLINE',
        last_seen_at: '2021-01-01T00:00:00.000Z',
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ data }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const users = await getUserPresences(['user-presences', SPACE_ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_presences')

    expect(
      supabaseClient.from('user_space_presences').select
    ).toHaveBeenCalledWith('id, space_id, user_id, status, last_seen_at')

    expect(
      supabaseClient.from('user_space_presences').select().eq
    ).toHaveBeenCalledWith('space_id', SPACE_ID)

    expect(users).toEqual(camelcaseKeys(data))
  })

  test('returns null if users not found', async () => {
    const SPACE_ID = 'SPACE_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ data: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const users = await getUserPresences(['user-presences', SPACE_ID])

    expect(users).toEqual(null)
  })
})

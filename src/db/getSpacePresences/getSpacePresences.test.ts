import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getSpacePresences from './getSpacePresences'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getSpacePresences', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns space presences', async () => {
    const userId = 'USER_ID'

    const data = [
      {
        space_id: 'SPACE_ID',
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

    const spacePresences = await getSpacePresences(['space-presences', userId])

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_presences')

    expect(
      supabaseClient.from('user_space_presences').select
    ).toHaveBeenCalledWith('space_id, status, last_seen_at')

    expect(
      supabaseClient
        .from('user_space_presences')
        .select('space_id, status, last_seen_at').eq
    ).toHaveBeenCalledWith('user_id', userId)

    expect(spacePresences).toEqual(camelcaseKeys(data))
  })

  test('returns null if spacePresences not found', async () => {
    const userId = 'USER_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ data: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spacePresences = await getSpacePresences(['space-presences', userId])

    expect(spacePresences).toEqual(null)
  })
})

import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getJoinedSpaces from './getJoinedSpaces'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getJoinedSpaces', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns joined spaces', async () => {
    const userId = 'ID'

    const data = [
      {
        id: 'Space_ID',
        name: 'Space Name',
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          match: vi.fn().mockReturnValue({ data }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const joinedSpaces = await getJoinedSpaces(['joined-spaces', userId])

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      `
    id, name,
    _users_joined_spaces!inner (B),
    user_space_presences!inner (last_seen_at)
  `
    )

    expect(supabaseClient.from('spaces').select().match).toHaveBeenCalledWith({
      '_users_joined_spaces.B': userId,
      'user_space_presences.user_id': userId,
    })

    expect(joinedSpaces).toEqual(camelcaseKeys(data))
  })

  test('returns null if no joined spaces found', async () => {
    const userId = 'ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          match: vi.fn().mockReturnValue({ data: null }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const joinedSpaces = await getJoinedSpaces(['joined-spaces', userId])

    expect(supabaseClient.from).toHaveBeenCalledWith('spaces')

    expect(supabaseClient.from('spaces').select).toHaveBeenCalledWith(
      `
    id, name,
    _users_joined_spaces!inner (B),
    user_space_presences!inner (last_seen_at)
  `
    )

    expect(supabaseClient.from('spaces').select().match).toHaveBeenCalledWith({
      '_users_joined_spaces.B': userId,
      'user_space_presences.user_id': userId,
    })

    expect(joinedSpaces).toEqual(null)
  })
})

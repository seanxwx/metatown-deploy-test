import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getSessionUser from './getSessionUser'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getSessionUser', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns user', async () => {
    const AUTH_ID = 'AUTH_ID'

    const data = {
      id: 'ID',
      display_name: 'John Doe',
      avatar: 'dog',
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const user = await getSessionUser(['session-user', AUTH_ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('users')

    expect(supabaseClient.from('users').select).toHaveBeenCalledWith(
      'id, display_name, avatar'
    )

    expect(supabaseClient.from('users').select().eq).toHaveBeenCalledWith(
      'auth_id',
      AUTH_ID
    )

    expect(
      supabaseClient.from('users').select().eq('auth_id', AUTH_ID).single
    ).toHaveBeenCalled()

    expect(user).toEqual(camelcaseKeys(data))
  })

  test('returns null if user not found', async () => {
    const AUTH_ID = 'AUTH_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const user = await getSessionUser(['session-user', AUTH_ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('users')

    expect(supabaseClient.from('users').select).toHaveBeenCalledWith(
      'id, display_name, avatar'
    )

    expect(supabaseClient.from('users').select().eq).toHaveBeenCalledWith(
      'auth_id',
      AUTH_ID
    )

    expect(
      supabaseClient.from('users').select().eq('auth_id', AUTH_ID).single
    ).toHaveBeenCalled()

    expect(user).toBeNull()
  })
})

import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getUser from './getUser'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getUser', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns user', async () => {
    const ID = 'ID'

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

    const user = await getUser(['user', ID])

    expect(supabaseClient.from).toHaveBeenCalledWith('users')

    expect(supabaseClient.from('users').select).toHaveBeenCalledWith(
      'id, display_name, avatar'
    )

    expect(supabaseClient.from('users').select().eq).toHaveBeenCalledWith(
      'id',
      ID
    )

    expect(
      supabaseClient.from('users').select().eq('id', ID).single
    ).toHaveBeenCalled()

    expect(user).toEqual(camelcaseKeys(data))
  })

  test('returns null if user not found', async () => {
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

    const user = await getUser(['user', 'id'])

    expect(user).toBeNull()
  })
})

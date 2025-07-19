import createSupabaseClient from '@/utils/createSupabaseClient'
import upsertUser from './upsertUser'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('upsertUser', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls the supabase upsert with data', async () => {
    const data = {
      displayName: 'John Doe',
      avatar: 'dog',
      authId: 'AUTH_ID',
    }

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await upsertUser(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('users')

    expect(supabaseClient.from('users').upsert).toHaveBeenCalledWith(
      {
        display_name: data.displayName,
        avatar: data.avatar,
        auth_id: data.authId,
      },
      { onConflict: 'auth_id' }
    )
  })
})

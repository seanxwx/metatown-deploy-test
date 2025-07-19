import createSupabaseClient from '@/utils/createSupabaseClient'
import signOut from './signOut'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('signOut', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls supabase auth signOut', async () => {
    const supabaseClient = {
      auth: {
        signOut: vi.fn(),
      },
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await signOut()

    expect(supabaseClient.auth.signOut).toHaveBeenCalled()
  })
})

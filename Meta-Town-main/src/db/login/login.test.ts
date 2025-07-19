import createSupabaseClient from '@/utils/createSupabaseClient'
import login from './login'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('login', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls supabase auth signInWithPassword', async () => {
    const supabaseClient = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: {} as unknown,
          error: null,
        }),
      },
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await login({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  test('returns error after unsuccessful login', async () => {
    const supabaseClient = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Invalid login credentials' },
        }),
      },
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const { error } = await login({
      email: 'invalid@email.com',
      password: 'password',
    })

    expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'invalid@email.com',
      password: 'password',
    })

    expect(error).toEqual({ message: 'Invalid login credentials' })
  })
})

import { createClient } from '@supabase/supabase-js'
import createSupabaseClient from './createSupabaseClient'

vi.mock('@supabase/supabase-js')

const createClientMock = vi.mocked(createClient)

describe('createSupabaseClient', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls createClient with the correct environment variables', () => {
    createSupabaseClient()

    expect(createClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key'
    )
  })

  test('returns the client created by createSupabaseClient', () => {
    const supabaseClient = {} as ReturnType<typeof createClient>

    createClientMock.mockReturnValue(supabaseClient)

    const client = createSupabaseClient()

    expect(client).toBe(supabaseClient)
  })

  test('renders singleton client when called multiple times', () => {
    const supabaseClient = {} as ReturnType<typeof createClient>

    createClientMock.mockReturnValue(supabaseClient)

    const client1 = createSupabaseClient()
    const client2 = createSupabaseClient()

    expect(client1).toBe(client2)
  })
})

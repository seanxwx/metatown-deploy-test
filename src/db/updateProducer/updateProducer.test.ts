import createSupabaseClient from '@/utils/createSupabaseClient'
import updateProducer from './updateProducer'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('updateProducer', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls the supabase update with provided id and data', async () => {
    const id = 'PRODUCER_ID'

    const data = {
      state: 'ACTIVE',
    } as const

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn(),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await updateProducer(id, data)

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_mediasoup')

    expect(
      supabaseClient.from('user_space_mediasoup').update
    ).toHaveBeenCalledWith({ state: data.state })

    expect(
      supabaseClient.from('user_space_mediasoup').update({ state: data.state })
        .eq
    ).toHaveBeenCalledWith('id', id)
  })
})

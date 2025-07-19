import createSupabaseClient from '@/utils/createSupabaseClient'
import upsertProducer from './upsertProducer'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('upsertProducer', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls the supabase upsert with provided data', async () => {
    const data = {
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      producerId: 'PRODUCER_ID',
      state: 'ACTIVE',
      kind: 'video',
    } as const

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await upsertProducer(data)

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_mediasoup')
    expect(
      supabaseClient.from('user_space_mediasoup').upsert
    ).toHaveBeenCalledWith(
      {
        user_id: data.userId,
        space_id: data.spaceId,
        producer_id: data.producerId,
        state: data.state,
        kind: data.kind,
      },
      { onConflict: 'user_id, space_id, kind' }
    )
  })
})

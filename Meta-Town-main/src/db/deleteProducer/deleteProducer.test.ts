import createSupabaseClient from '@/utils/createSupabaseClient'
import deleteProducer from './deleteProducer'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('deleteProducer', () => {
  test('calls supabase to delete a producer', async () => {
    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>
    createSupabaseClientMock.mockReturnValue(supabaseClient)
    const producerId = 'PRODUCER_ID'
    await deleteProducer(producerId)

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_mediasoup')
    expect(
      supabaseClient.from('user_space_mediasoup').delete
    ).toHaveBeenCalled()

    expect(
      supabaseClient.from('user_space_mediasoup').delete().eq
    ).toHaveBeenCalledWith('producer_id', producerId)
  })
})

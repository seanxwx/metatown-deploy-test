import camelcaseKeys from 'camelcase-keys'
import createSupabaseClient from '@/utils/createSupabaseClient'
import getProducers, { Data } from './getProducers'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('getProducers', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns producers of a space', async () => {
    const spaceId = 'SPACE_ID'

    const data: Data[] = [
      {
        id: 'ID_A',
        producer_id: 'Producer_A',
        user_id: 'User_B',
        state: 'ACTIVE',
        kind: 'video',
      },
      {
        id: 'ID_B',
        producer_id: 'Producer_B',
        user_id: 'User_B',
        state: 'PAUSED',
        kind: 'video',
      },
    ]

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data,
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spaceProducers = await getProducers(['producers', spaceId])

    expect(supabaseClient.from).toHaveBeenCalledWith('user_space_mediasoup')

    expect(
      supabaseClient.from('user_space_mediasoup').select
    ).toHaveBeenCalledWith('id, producer_id, user_id, state, kind')

    expect(
      supabaseClient
        .from('user_space_mediasoup')
        .select('id, producer_id, user_id, state').eq
    ).toHaveBeenCalledWith('space_id', spaceId)

    expect(spaceProducers).toEqual(camelcaseKeys(data))
  })

  test('returns null if producers not found', async () => {
    const spaceId = 'SPACE_ID'

    const supabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data: null,
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const spaceProducers = await getProducers(['producers', spaceId])

    expect(spaceProducers).toBeNull()
  })
})

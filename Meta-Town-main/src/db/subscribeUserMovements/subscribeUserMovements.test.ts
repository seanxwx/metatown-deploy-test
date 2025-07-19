import createSupabaseClient from '@/utils/createSupabaseClient'
import getUserPositions from '@/db/getUserPositions'
import subscribeUserMovements from './subscribeUserMovements'
import createPayloadHandler from './utils/createPayloadHandler'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

vi.mock('@/db/getUserPositions')
const getUserPositionsMock = vi.mocked(getUserPositions)

vi.mock('./utils/createPayloadHandler')
const createPayloadHandlerMock = vi.mocked(createPayloadHandler)

describe('subscribeUserMovements', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('subscribes to `user-movements:spaceId` channel', async () => {
    const spaceId = 'SPACE_ID'

    const channel = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    }

    const supabaseClient = {
      channel: vi.fn().mockReturnValue(channel),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const userPositions: Awaited<ReturnType<typeof getUserPositions>> = [
      {
        id: 'USER_POSITION_ID',
        userId: 'USER_ID',
        spaceId: 'SPACE_ID',
        x: 10,
        y: 20,
        direction: 'N' as const,
      },
    ]

    getUserPositionsMock.mockResolvedValue(userPositions)

    const handlePayload = vi.fn()
    createPayloadHandlerMock.mockReturnValue(handlePayload)

    const next = vi.fn()

    const key: [string, string] = ['user-movements', spaceId]

    const unsubscribe = subscribeUserMovements(key, { next })

    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `user-movements:${spaceId}`,
      {
        config: {
          broadcast: { self: true },
        },
      }
    )

    expect(channel.subscribe).toHaveBeenCalled()

    expect(createPayloadHandlerMock).toHaveBeenCalledWith({ next })

    expect(getUserPositionsMock).toHaveBeenCalledWith(key)

    await vi.waitFor(() =>
      expect(next).toHaveBeenCalledWith(
        null,
        userPositions.map((item) => ({ ...item, isMoving: false }))
      )
    )

    expect(channel.on).toHaveBeenCalledWith(
      'broadcast',
      { event: 'update' },
      handlePayload
    )

    unsubscribe()

    expect(supabaseClient.removeChannel).toHaveBeenCalled()
  })
})

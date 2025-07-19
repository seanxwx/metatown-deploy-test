import createSupabaseClient from '@/utils/createSupabaseClient'
import broadcastUserMovement from './broadcastUserMovement'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('broadcastUserMovement', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('broadcasts user movement to the existing channel', async () => {
    const spaceId = 'SPACE_ID'

    const channel = {
      subTopic: `user-movements:${spaceId}`,
      send: vi.fn(),
    }

    const supabaseClient = {
      getChannels: vi.fn().mockReturnValue([channel]),
      channel: vi.fn(),
    }

    createSupabaseClientMock.mockReturnValue(
      supabaseClient as unknown as ReturnType<typeof createSupabaseClient>
    )

    const payload = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId,
      x: 0,
      y: 0,
      direction: 'S' as const,
      isMoving: true,
    }

    await broadcastUserMovement(payload)

    expect(supabaseClient.getChannels).toHaveBeenCalled()
    expect(supabaseClient.channel).not.toHaveBeenCalled()

    expect(channel.send).toHaveBeenCalledWith({
      type: 'broadcast',
      event: 'update',
      payload,
    })
  })

  test('creates a new channel if it does not exist', async () => {
    const channel = {
      send: vi.fn(),
    }

    const supabaseClient = {
      getChannels: vi.fn().mockReturnValue([]),
      channel: vi.fn().mockReturnValue(channel),
    }

    createSupabaseClientMock.mockReturnValue(
      supabaseClient as unknown as ReturnType<typeof createSupabaseClient>
    )

    const payload = {
      id: 'USER_POSITION_ID',
      userId: 'USER_ID',
      spaceId: 'SPACE_ID',
      x: 0,
      y: 0,
      direction: 'S' as const,
      isMoving: true,
    }

    await broadcastUserMovement(payload)

    await broadcastUserMovement(payload)

    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `user-movements:${payload.spaceId}`,
      {
        config: {
          broadcast: { self: true },
        },
      }
    )

    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `user-movements:${payload.spaceId}`,
      {
        config: {
          broadcast: { self: true },
        },
      }
    )

    expect(channel.send).toHaveBeenCalledWith({
      type: 'broadcast',
      event: 'update',
      payload,
    })
  })
})

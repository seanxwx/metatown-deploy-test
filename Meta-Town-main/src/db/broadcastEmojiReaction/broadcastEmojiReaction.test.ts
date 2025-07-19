import createSupabaseClient from '@/utils/createSupabaseClient'
import broadcastEmojiReaction from './broadcastEmojiReaction'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('broadcastEmojiReaction', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('broadcasts emoji reaction', async () => {
    vi.useFakeTimers()
    const channelId = 'ChannelId'
    const emoji = { unicode: '😀', label: 'smile' }
    const userId = 'userId'
    const createdAt = new Date().toISOString()

    const supabaseClient = {
      channel: vi.fn().mockReturnValue({
        send: vi.fn(),
      }),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    await broadcastEmojiReaction(channelId, { emoji, userId })

    expect(createSupabaseClientMock).toHaveBeenCalled()
    expect(createSupabaseClientMock().channel).toHaveBeenCalledWith(
      `emoji-reactions:${channelId}`,
      {
        config: {
          broadcast: { self: true },
        },
      }
    )

    expect(
      createSupabaseClientMock().channel(`emoji-reactions:${channelId}`, {
        config: {
          broadcast: { self: true },
        },
      }).send
    ).toHaveBeenCalledWith({
      type: 'broadcast',
      event: 'emoji',
      payload: { emoji, userId, createdAt },
    })
    vi.useRealTimers()
  })
})

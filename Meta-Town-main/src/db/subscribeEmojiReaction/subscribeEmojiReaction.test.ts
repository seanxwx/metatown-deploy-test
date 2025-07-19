import createSupabaseClient from '@/utils/createSupabaseClient'
import subscribeEmojiReaction from './subscribeEmojiReaction'

vi.mock('@/utils/createSupabaseClient')
const createSupabaseClientMock = vi.mocked(createSupabaseClient)

describe('subscribeEmojiReaction', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('subscribes to emoji-reactions:SPACE_ID channel', () => {
    const SPACE_ID = 'SPACE_ID'
    const next = vi.fn()

    const supabaseClient = {
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnValue({
          subscribe: vi.fn(),
        }),
      }),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    const unsubscribe = subscribeEmojiReaction(['emoji-reactions', SPACE_ID], {
      next,
    })

    expect(createSupabaseClientMock).toHaveBeenCalledTimes(1)
    expect(supabaseClient.channel).toHaveBeenCalledWith(
      `emoji-reactions:${SPACE_ID}`
    )

    expect(
      supabaseClient.channel(`emoji-reactions:${SPACE_ID}`).on
    ).toHaveBeenCalledWith(
      'broadcast',
      { event: 'emoji' },
      expect.any(Function)
    )
    unsubscribe()
    expect(supabaseClient.removeChannel).toBeCalled()
  })

  test('calls next with the payload on emoji-reactions subscribed', () => {
    const SPACE_ID = 'SPACE_ID'
    const next = vi.fn()

    const payload = {
      payload: {
        emoji: '👍',
        userId: 'userId',
        createdAt: '2023-05-22T15:30:00Z',
      },
    }

    const supabaseClient = {
      channel: vi.fn().mockReturnValue({
        on: vi
          .fn()
          .mockImplementation((_, __, onEmoji: (payload: unknown) => void) => {
            onEmoji(payload)

            return {
              subscribe: vi.fn(),
            }
          }),
      }),
      removeChannel: vi.fn(),
    } as unknown as ReturnType<typeof createSupabaseClient>

    createSupabaseClientMock.mockReturnValue(supabaseClient)

    subscribeEmojiReaction(['emoji-reactions', SPACE_ID], { next })

    expect(next).toHaveBeenCalledWith(null, payload.payload)
  })
})

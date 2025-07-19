import useSWRSubscription from 'swr/subscription'
import { renderHook } from '@testing-library/react'
import subscribeEmojiReaction from '@/db/subscribeEmojiReaction'
import useEmojiReaction from './useEmojiReaction'

vi.mock('swr/subscription')
const useSWRSubscriptionMock = vi.mocked(useSWRSubscription)

describe('useEmojiReaction', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWRSubscription with null key if channelId is undefined', () => {
    useSWRSubscriptionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSWRSubscription>
    )

    renderHook(() => useEmojiReaction())

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      null,
      subscribeEmojiReaction
    )
  })

  test('calls useSWRSubscription with spaceId', () => {
    const spaceId = 'SPACE_ID'
    const key = ['emoji-reactions', spaceId]

    renderHook(() => useEmojiReaction(spaceId))

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      key,
      subscribeEmojiReaction
    )
  })
})

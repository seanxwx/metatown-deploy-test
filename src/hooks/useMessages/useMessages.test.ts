import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import useSWRSubscription from 'swr/subscription'
import getMessages from '@/db/getMessages'
import subscribeMessages from '@/db/subscribeMessages'
import useMessages from './useMessages'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('swr/subscription')
const useSWRSubscriptionMock = vi.mocked(useSWRSubscription)

describe('useMessages', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR and useSWRSubscription with null key if spaceId is undefined', () => {
    useSWRMock.mockReturnValue({} as unknown as ReturnType<typeof useSWR>)
    useSWRSubscriptionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSWRSubscription>
    )

    renderHook(() => useMessages())

    expect(useSWRMock).toHaveBeenCalledWith(null, getMessages, {
      revalidateOnFocus: false,
    })

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(null, subscribeMessages)
  })

  test('returns result from useSWR', () => {
    const spaceId = 'SPACE_ID'
    const key = ['messages', spaceId]

    const data: Awaited<ReturnType<typeof getMessages>> = [
      {
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
        createdAt: '2021-01-01T00:00:00.000Z',
        id: 'ID',
        senderId: 'SENDER_ID',
      },
    ]

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    useSWRSubscriptionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSWRSubscription>)

    const { result } = renderHook(() => useMessages('SPACE_ID'))

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(key, subscribeMessages)

    expect(useSWRMock).toHaveBeenCalledWith(key, getMessages, {
      revalidateOnFocus: false,
    })

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

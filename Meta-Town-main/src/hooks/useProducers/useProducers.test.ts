import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import useSWRSubscription from 'swr/subscription'
import getProducers from '@/db/getProducers'
import subscribeProducers from '@/db/subscribeProducers'
import useProducers from './useProducers'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('swr/subscription')
const useSWRSubscriptionMock = vi.mocked(useSWRSubscription)

describe('useProducers', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR and useSWRSubscription with null key if spaceId is undefined', () => {
    useSWRMock.mockReturnValue({} as unknown as ReturnType<typeof useSWR>)
    useSWRSubscriptionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSWRSubscription>
    )

    renderHook(() => useProducers())

    expect(useSWRMock).toHaveBeenCalledWith(null, getProducers, {
      revalidateOnFocus: false,
    })

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      null,
      subscribeProducers
    )
  })

  test('returns results from useSWR', () => {
    const spaceId = 'SPACE_ID'
    const key = ['producers', spaceId]

    const data: Awaited<ReturnType<typeof getProducers>> = [
      {
        id: 'ID_A',
        producerId: 'Producer_A',
        userId: 'User_B',
        state: 'ACTIVE',
        kind: 'video',
      },
      {
        id: 'ID_B',
        producerId: 'Producer_B',
        userId: 'User_B',
        state: 'PAUSED',
        kind: 'video',
      },
    ]

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    useSWRSubscriptionMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSWRSubscription>)

    const { result } = renderHook(() => useProducers(spaceId))

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(key, subscribeProducers)

    expect(useSWRMock).toHaveBeenCalledWith(key, getProducers, {
      revalidateOnFocus: false,
    })

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

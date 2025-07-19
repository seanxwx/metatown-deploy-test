import { renderHook } from '@testing-library/react'
import useSWRSubscription from 'swr/subscription'
import { Indexed, Movement } from '@/app/types'
import subscribeUserMovements from '@/db/subscribeUserMovements'
import useUserMovements from './useUserMovements'

vi.mock('swr/subscription')
const useSWRSubscriptionMock = vi.mocked(useSWRSubscription)

describe('useUserMovements', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWRSubscription with null key if spaceId is undefined', () => {
    useSWRSubscriptionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSWRSubscription>
    )

    renderHook(() => useUserMovements())

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      null,
      subscribeUserMovements
    )
  })

  test('renders result from useSWRSubscription', () => {
    const spaceId = 'SPACE_ID'
    const key = ['user-movements', spaceId]

    const data: Indexed<Movement & { userId: string; spaceId: string }>[] = [
      {
        id: 'USER_POSITION_ID',
        userId: 'USER_ID',
        spaceId: 'SPACE_ID',
        x: 10,
        y: 20,
        direction: 'N' as const,
        isMoving: false,
      },
    ]

    useSWRSubscriptionMock.mockReturnValue({
      data,
    } as unknown as ReturnType<typeof useSWRSubscription>)

    const { result } = renderHook(() => useUserMovements('SPACE_ID'))

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      key,
      subscribeUserMovements
    )

    expect(result.current).toEqual({ data })
  })
})

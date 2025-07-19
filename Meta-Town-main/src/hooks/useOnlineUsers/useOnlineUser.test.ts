import { renderHook } from '@testing-library/react'
import useSWRSubscription from 'swr/subscription'
import subscribeOnlineUsers from '@/db/subscribeOnlineUsers'
import useOnlineUsers from './useOnlineUsers'

vi.mock('swr/subscription')
const useSWRSubscriptionMock = vi.mocked(useSWRSubscription)

describe('useOnlineUsers', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWRSubscription with null key if spaceId is undefined', () => {
    useSWRSubscriptionMock.mockReturnValue(
      {} as unknown as ReturnType<typeof useSWRSubscription>
    )

    renderHook(() => useOnlineUsers())

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      null,
      subscribeOnlineUsers
    )
  })

  test('renders result from useSWRSubscription', () => {
    const spaceId = 'SPACE_ID'
    const key = ['online-users', spaceId]

    const data = ['USER_ID_1', 'USER_ID_2']

    useSWRSubscriptionMock.mockReturnValue({
      data,
    } as unknown as ReturnType<typeof useSWRSubscription>)

    const { result } = renderHook(() => useOnlineUsers(spaceId))

    expect(useSWRSubscriptionMock).toHaveBeenCalledWith(
      key,
      subscribeOnlineUsers
    )

    expect(result.current).toEqual({ data })
  })
})

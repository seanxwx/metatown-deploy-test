import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getUserPresences from '@/db/getUserPresences'
import useUserPresences from './useUserPresences'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

describe('useUserPresences', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR and useSWRSubscription with null key if spaceId is undefined', () => {
    useSWRMock.mockReturnValue({} as unknown as ReturnType<typeof useSWR>)

    renderHook(() => useUserPresences())

    expect(useSWRMock).toHaveBeenCalledWith(null, getUserPresences)
  })

  test('renders result from useSWR', () => {
    const data: Awaited<ReturnType<typeof getUserPresences>> = [
      {
        id: 'ID',
        spaceId: 'SPACE_ID',
        userId: 'USER_ID',
        status: 'OFFLINE',
        lastSeenAt: 'LAST_SEEN_AT',
      },
    ]

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useUserPresences('SPACE_ID'))

    expect(result.current).toEqual({ data, isLoading: false })
  })
})

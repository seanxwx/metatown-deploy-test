import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getSpacePresences from '@/db/getSpacePresences'
import useSessionUser from '@/hooks/useSessionUser'
import useSpacePresences from './useSpacePresences'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('useSpacePresences', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null if user is null', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useSpacePresences())

    expect(useSWRMock).toHaveBeenCalledWith(null, getSpacePresences)
  })

  test('calls useSWR with key and fetcher', () => {
    const user = {
      id: 'USER_ID',
    }
    useSessionUserMock.mockReturnValue({
      data: user,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useSpacePresences())

    expect(useSessionUserMock).toHaveBeenCalled()

    expect(useSWRMock).toHaveBeenCalledWith(
      ['space-presences', user.id],
      getSpacePresences
    )
  })

  test('returns result from useSWR', () => {
    const data = {
      spaceId: 'SPACE_ID04',
      status: 'OFFLINE',
      lastSeenAt: '2021-01-01T00:00:00.000Z',
    }

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'USER_ID',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useSpacePresences())

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getJoinedSpaces from '@/db/getJoinedSpaces'
import useSessionUser from '@/hooks/useSessionUser'
import useJoinedSpaces from './useJoinedSpaces'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('useJoinedSpaces', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if user is null', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useJoinedSpaces())

    expect(useSWRMock).toHaveBeenCalledWith(null, getJoinedSpaces)
  })

  test('calls useSWR with key and fetcher', () => {
    const user = {
      id: 'userId',
    }

    useSessionUserMock.mockReturnValue({
      data: user,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useJoinedSpaces())

    expect(useSWRMock).toHaveBeenCalledWith(
      ['joined-spaces', user.id],
      getJoinedSpaces
    )
  })

  test('returns result from useSWR', () => {
    const user = {
      id: 'userId',
    }

    const data = [
      {
        id: 'Space_ID',
        name: 'Space Name',
        lastSeenAt: '2021-01-01T00:00:00.000Z',
      },
    ]

    useSessionUserMock.mockReturnValue({
      data: user,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useJoinedSpaces())

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

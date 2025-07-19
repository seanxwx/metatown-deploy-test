import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getSpacePosition from '@/db/getSpacePosition'
import useSessionUser from '@/hooks/useSessionUser'
import useSpacePosition from './useSpacePosition'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

describe('useSpacePosition', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if user is null', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useSpacePosition('SPACE_ID'))

    expect(useSWRMock).toHaveBeenCalledWith(null, getSpacePosition)
  })

  test('calls useSWR with null key if spaceId is undefined', () => {
    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useSpacePosition())

    expect(useSWRMock).toHaveBeenCalledWith(null, getSpacePosition)
  })

  test('calls useSWR with key and fetcher', () => {
    const user = {
      id: 'USER_ID',
    }

    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue({
      data: user,
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    renderHook(() => useSpacePosition(spaceId))

    expect(useSWRMock).toHaveBeenCalledWith(
      ['space-position', user.id, spaceId],
      getSpacePosition
    )
  })

  test('returns result from useSWR', () => {
    const data = {
      x: 10,
      y: 20,
      direction: 'N',
    }

    useSessionUserMock.mockReturnValue({
      data: { id: 'USER_ID' },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useSpacePosition('SPACE_ID'))

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

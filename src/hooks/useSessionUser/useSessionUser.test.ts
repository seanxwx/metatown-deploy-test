import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getUser from '@/db/getSessionUser'
import useSession from '@/hooks/useSession'
import useSessionUser from './useSessionUser'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('@/hooks/useSession')
const useSessionMock = vi.mocked(useSession)

describe('useSessionUser', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if session is false', () => {
    useSessionMock.mockReturnValue({
      data: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    renderHook(() => useSessionUser())

    expect(useSWRMock).toHaveBeenCalledWith(null, getUser)
  })

  test('calls useSWR with key and fetcher', () => {
    const session = {
      user: {
        id: 'AUTH_ID',
      },
    }

    useSessionMock.mockReturnValue({
      data: session,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    renderHook(() => useSessionUser())

    expect(useSWRMock).toHaveBeenCalledWith(
      ['session-user', session.user.id],
      getUser
    )
  })

  test('returns result from useSWR', () => {
    const session = {
      user: {
        id: 'AUTH_ID',
      },
    }

    const data = {
      id: 'ID',
      displayName: 'John Doe',
      avatar: 'dog',
    }

    useSessionMock.mockReturnValue({
      data: session,
      isLoading: false,
    } as unknown as ReturnType<typeof useSession>)

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useSessionUser())

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

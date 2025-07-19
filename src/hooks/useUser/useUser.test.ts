import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getUser from '@/db/getUser'
import useUser from './useUser'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

describe('useUser', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if session is false', () => {
    renderHook(() => useUser())

    expect(useSWRMock).toHaveBeenCalledWith(null, getUser)
  })

  test('calls useSWR with key and fetcher', () => {
    const USER_ID = 'USER_ID'

    renderHook(() => useUser(USER_ID))

    expect(useSWRMock).toHaveBeenCalledWith(['user', USER_ID], getUser)
  })

  test('returns result from useSWR', () => {
    const USER_ID = 'USER_ID'

    const data = {
      id: 'ID',
      displayName: 'John Doe',
      avatar: 'dog',
    }

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useUser(USER_ID))

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

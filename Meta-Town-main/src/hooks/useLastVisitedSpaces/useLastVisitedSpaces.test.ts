import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getLastVisitedSpaces from '@/db/getLastVisitedSpaces'
import useLastVisitedSpaces from './useLastVisitedSpaces'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

describe('useLastVisitedSpaces', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with key and fetcher', () => {
    renderHook(() => useLastVisitedSpaces())

    expect(useSWRMock).toHaveBeenCalledWith(
      'last-visited-spaces',
      getLastVisitedSpaces
    )
  })

  test('returns result from useSWR', () => {
    const data = [
      {
        id: 'Space_ID',
        name: 'Space Name',
      },
    ]

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useLastVisitedSpaces())

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

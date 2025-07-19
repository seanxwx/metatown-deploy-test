import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import searchSpaces from '@/db/searchSpaces'
import useSearchedSpaces from './useSearchSpaces'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

describe('useSearchedSpaces', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if query is empty', () => {
    renderHook(() => useSearchedSpaces(''))

    expect(useSWRMock).toHaveBeenCalledWith(null, searchSpaces)
  })

  test('calls useSWR with key and fetcher', () => {
    renderHook(() => useSearchedSpaces('search query'))

    expect(useSWRMock).toHaveBeenCalledWith(
      ['search-spaces', 'search query'],
      searchSpaces
    )
  })

  test('returns result from useSWR', () => {
    const query = 'search query'

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

    const { result } = renderHook(() => useSearchedSpaces(query))

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

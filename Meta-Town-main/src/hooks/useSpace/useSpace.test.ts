import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getSpace from '@/db/getSpace'
import useSpace from './useSpace'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

vi.mock('@/db/getSpace')

describe('useSpace', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if spaceId is undefined', () => {
    renderHook(() => useSpace())

    expect(useSWRMock).toHaveBeenCalledWith(null, getSpace)
  })

  test('calls useSWR with key and fetcher when spaceId exists', () => {
    const spaceId = 'SPACE_ID'

    renderHook(() => useSpace(spaceId))

    expect(useSWRMock).toHaveBeenCalledWith(['space', spaceId], getSpace)
  })

  test('returns result from useSWR', () => {
    const spaceId = 'SPACE_ID'

    const data = { id: spaceId, name: 'Test Space' }

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useSpace(spaceId))

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

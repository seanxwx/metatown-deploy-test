import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getZones from '@/db/getZones'
import useZones from './useZones'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

describe('useZones', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key if spaceId is undefined', () => {
    renderHook(() => useZones())

    expect(useSWRMock).toHaveBeenCalledWith(null, getZones)
  })

  test('calls useSWR with key and fetcher when spaceId exists', () => {
    const spaceId = 'SPACE_ID'

    renderHook(() => useZones(spaceId))

    expect(useSWRMock).toHaveBeenCalledWith(['zones', spaceId], getZones)
  })

  test('returns result from useSWR', () => {
    const data = [{ id: 'ID', name: 'ZONE_NAME' }]

    useSWRMock.mockReturnValue({
      data,
      isLoading: false,
    } as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useZones('SPACE_ID'))

    expect(result.current).toEqual({
      data,
      isLoading: false,
    })
  })
})

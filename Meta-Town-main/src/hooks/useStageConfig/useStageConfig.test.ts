import { renderHook } from '@testing-library/react'
import useSWR from 'swr'
import getStageConfig from '@/db/getStageConfig'
import useStageConfig from './useStageConfig'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

describe('useStageConfig', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls useSWR with null key without spaceId', () => {
    renderHook(() => useStageConfig())

    expect(useSWRMock).toHaveBeenCalledWith(null, getStageConfig)
  })

  test('calls SWR with key and fetcher', () => {
    renderHook(() => useStageConfig('SPACE_ID'))

    expect(useSWRMock).toHaveBeenCalledWith(
      ['stage-config', 'SPACE_ID'],
      getStageConfig
    )
  })

  test('returns result from useSWR', () => {
    useSWRMock.mockReturnValue({
      data: {
        id: 'STAGE_CONFIGS_ID',
        rows: 10,
        columns: 10,
        blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
        entry: [{ x: 2, y: 2 }],
        grounds: [{ x: 3, y: 3, direction: 'N', texture: 'grass' }],
        zones: [{ id: 'ZONE_1', x: 4, y: 4, direction: 'N' }],
      },
    } as unknown as ReturnType<typeof useSWR>)

    const { result } = renderHook(() => useStageConfig('SPACE_ID'))

    expect(result.current).toEqual({
      data: {
        id: 'STAGE_CONFIGS_ID',
        rows: 10,
        columns: 10,
        blocks: [{ x: 1, y: 1, direction: 'N', element: 'wall' }],
        entry: [{ x: 2, y: 2 }],
        grounds: [{ x: 3, y: 3, direction: 'N', texture: 'grass' }],
        zones: [{ id: 'ZONE_1', x: 4, y: 4, direction: 'N' }],
      },
    })
  })
})

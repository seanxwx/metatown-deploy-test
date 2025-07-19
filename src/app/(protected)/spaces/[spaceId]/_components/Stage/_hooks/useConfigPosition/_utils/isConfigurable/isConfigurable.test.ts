import { ConfigItem, Block, Position, Ground, Indexed } from '@/app/types'
import isBlocked from '../../../../_utils/isBLocked'
import isConfigurable from './isConfigurable'

vi.mock('../../../../_utils/isBLocked')
const isBlockedMock = vi.mocked(isBlocked)

describe('isConfigurable', () => {
  const entry: Position = { x: 0, y: 0, direction: 'N' }

  const blocks: Block[] = [{ x: 1, y: 1, direction: 'N', element: 'wall' }]

  const grounds: Ground[] = [
    { x: 1, y: 0, direction: 'N', texture: 'grass' },
    { x: 2, y: 0, direction: 'N', texture: 'wood' },
  ]

  const zones: Indexed<Position>[] = []

  const coordinates = { x: 1, y: 1 }

  const data = { entry, blocks, grounds, zones }

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns true for coordinate when blocks is blocked', () => {
    isBlockedMock.mockReturnValue(true)

    const result = isConfigurable(
      { type: 'blocks' } as ConfigItem,
      coordinates,
      data
    )

    expect(result).toBe(false)

    expect(isBlocked).toHaveBeenCalledWith(
      coordinates,
      blocks,
      entry,
      grounds,
      zones
    )
  })

  test('returns true for grounds when blocks is blocked', () => {
    isBlockedMock.mockReturnValue(true)

    const texture = 'grass'

    const result = isConfigurable(
      { type: 'grounds', texture } as ConfigItem,
      coordinates,
      data
    )

    expect(result).toBe(false)

    expect(isBlocked).toHaveBeenCalledWith(
      coordinates,
      blocks,
      grounds.filter((ground) => ground.texture === texture)
    )
  })

  test('returns true for entry when blocks is blocked', () => {
    isBlockedMock.mockReturnValue(true)

    const result = isConfigurable(
      { type: 'entry' } as ConfigItem,
      coordinates,
      data
    )

    expect(result).toBe(false)

    expect(isBlocked).toHaveBeenCalledWith(coordinates, blocks, entry)
  })

  test('returns true for zone when blocks is blocked', () => {
    isBlockedMock.mockReturnValue(true)

    const result = isConfigurable(
      { type: 'zone' } as ConfigItem,
      coordinates,
      data
    )

    expect(result).toBe(false)

    expect(isBlocked).toHaveBeenCalledWith(coordinates, blocks, zones)
  })

  test('returns false for delete when blocks is blocked', () => {
    isBlockedMock.mockReturnValue(true)

    const result = isConfigurable(
      { type: 'delete' } as ConfigItem,
      coordinates,
      data
    )

    expect(result).toBe(true)
    expect(isBlocked).toHaveBeenCalledWith(coordinates, blocks, zones, grounds)
  })
})

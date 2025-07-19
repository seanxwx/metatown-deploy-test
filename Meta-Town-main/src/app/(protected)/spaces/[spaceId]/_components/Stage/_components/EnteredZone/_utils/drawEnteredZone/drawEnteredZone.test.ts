import { Dimensions, Indexed, Position } from '@/app/types'
import { TILE_SIZE } from '../../../../consts'
import drawEnteredZone from './drawEnteredZone'

describe('drawEnteredZone', () => {
  test('draws gray overlay on all tiles except enteredZone', () => {
    const context = {
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const dimensions: Dimensions = { rows: 2, columns: 2 }

    const enteredZone: Indexed<Position> = {
      id: 'zone1',
      x: 1,
      y: 0,
      direction: 'N',
    }

    const zones: Indexed<Position>[] = [
      { id: 'zone1', x: 1, y: 0, direction: 'N' },
      { id: 'zone2', x: 0, y: 1, direction: 'N' },
    ]

    drawEnteredZone(context, enteredZone, dimensions, zones)

    expect(context.save).toHaveBeenCalled()

    expect(context.fillRect).toHaveBeenCalledTimes(3)

    expect(context.fillRect).toHaveBeenCalledWith(
      0 * TILE_SIZE,
      0 * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )

    expect(context.fillRect).toHaveBeenCalledWith(
      0 * TILE_SIZE,
      1 * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )

    expect(context.fillRect).toHaveBeenCalledWith(
      1 * TILE_SIZE,
      1 * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )

    expect(context.fillRect).not.toHaveBeenCalledWith(
      1 * TILE_SIZE,
      0 * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )

    expect(context.restore).toHaveBeenCalled()
  })
})

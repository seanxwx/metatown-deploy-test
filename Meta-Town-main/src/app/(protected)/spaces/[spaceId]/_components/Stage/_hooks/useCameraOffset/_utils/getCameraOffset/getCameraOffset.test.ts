import { Direction } from '@/app/types'
import { TILE_SIZE } from '../../../../consts'
import getCameraOffset from './getCameraOffset'

describe('getCameraOffset', () => {
  test('centers user when map is larger than canvas', () => {
    const canvas = {
      width: 1000,
      height: 1000,
    } as HTMLCanvasElement

    const zoom = 1
    const dimensions = { rows: 50, columns: 50 }
    const userPosition = { x: 25, y: 25, direction: 'N' as Direction }

    const result = getCameraOffset(canvas, {
      zoom,
      dimensions,
      userPosition,
    })

    const tileSize = TILE_SIZE * zoom

    const character = {
      left: userPosition.x * tileSize + tileSize / 2,
      top: userPosition.y * tileSize + tileSize / 2,
    }

    expect(result.left).toBe(-(character.left - canvas.width / 2))

    expect(result.top).toBe(-(character.top - canvas.height / 2))
  })

  test('does not offset if canvas is on the edge', () => {
    const canvas = {
      width: 1000,
      height: 1000,
    } as HTMLCanvasElement

    const zoom = 1
    const dimensions = { rows: 30, columns: 30 }
    const userPosition = { x: 0, y: 0, direction: 'N' as Direction }

    const result = getCameraOffset(canvas, {
      zoom,
      dimensions,
      userPosition,
    })

    expect(result.left).toBe(-0)
    expect(result.top).toBe(-0)
  })

  test('centers canvas if map is smaller than canvas', () => {
    const canvas = {
      width: 1000,
      height: 1000,
    } as HTMLCanvasElement

    const zoom = 1
    const dimensions = { rows: 10, columns: 10 }

    const result = getCameraOffset(canvas, {
      zoom,
      dimensions,
      userPosition: { x: 3, y: 3, direction: 'N' },
    })

    const tileSize = TILE_SIZE * zoom
    const { rows, columns } = dimensions

    const map = {
      width: columns * tileSize,
      height: rows * tileSize,
    }

    expect(result.left).toBe(-((map.width - canvas.width) / 2))
    expect(result.top).toBe(-((map.height - canvas.height) / 2))
  })

  test('returns offset when canvas is null', () => {
    const result = getCameraOffset(null, {
      zoom: 1,
      dimensions: { rows: 10, columns: 10 },
      userPosition: { x: 3, y: 3, direction: 'N' },
    })
    expect(result.left).toBe(0)
    expect(result.top).toBe(0)
  })
})

import { TILE_SIZE } from '../../../../consts'
import drawTiledMap from './drawTiledMap'

describe('drawTiledMap', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws tiled map', () => {
    const context = {
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const dimensions = { rows: 2, columns: 2 }

    drawTiledMap(context, dimensions)

    expect(context.save).toHaveBeenCalled()

    expect(context.fillStyle).toBe('white')

    expect(context.fillRect).toHaveBeenCalledWith(
      0,
      0,
      dimensions.columns * TILE_SIZE,
      dimensions.rows * TILE_SIZE
    )

    expect(context.restore).toHaveBeenCalled()
  })
})

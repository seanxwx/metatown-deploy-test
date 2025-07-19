import { Position } from '@/app/types'
import { TILE_SIZE } from '../../../../../../../../consts'
import drawDisplayName from './drawDisplayName'

describe('drawDisplayName', () => {
  test('draws displayName on the canvas', () => {
    const context = {
      measureText: vi.fn().mockReturnValue({ width: 100 }),
      save: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D

    const displayName = 'Test User'
    const position: Position = { x: 1, y: 1, direction: 'E' }
    const cx = position.x * TILE_SIZE + TILE_SIZE / 2
    const cy = position.y * TILE_SIZE - TILE_SIZE / 10

    drawDisplayName(context, displayName, position)

    expect(context.save).toHaveBeenCalled()
    expect(context.measureText).toHaveBeenCalledWith(displayName)
    expect(context.beginPath).toHaveBeenCalled()
    expect(context.roundRect).toHaveBeenCalledWith(
      cx - 60,
      cy - TILE_SIZE / 4,
      120,
      TILE_SIZE / 2,
      5
    )
    expect(context.fillStyle).toBeDefined()
    expect(context.fill).toHaveBeenCalled()
    expect(context.textAlign).toBe('center')
    expect(context.textBaseline).toBe('middle')
    expect(context.fillStyle).toBeDefined()
    expect(context.fillText).toHaveBeenCalledWith(displayName, cx, cy)
    expect(context.restore).toHaveBeenCalled()
  })
})

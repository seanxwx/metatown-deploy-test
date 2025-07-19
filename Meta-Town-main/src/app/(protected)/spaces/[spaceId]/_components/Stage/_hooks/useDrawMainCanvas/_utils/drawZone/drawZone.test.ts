import { ConfigPosition, Indexed, Position } from '@/app/types'
import getDeterministicColorStyle from '@/utils/getDeterministicColorStyle'
import { TILE_SIZE } from '../../../../consts'
import drawLucideIcon from '../drawLucideIcon'
import drawZone from './drawZone'

vi.mock('../drawLucideIcon')

describe('drawZone', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws zone', () => {
    const context = {
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D

    const position: Indexed<Position> = {
      id: 'ZONE_ID',
      x: 1,
      y: 1,
      direction: 'N',
    }

    drawZone(context, position)

    expect(context.save).toHaveBeenCalled()
    expect(context.fillStyle).toBe(
      getDeterministicColorStyle(position.id).backgroundColor
    )

    expect(context.fillRect).toHaveBeenCalledWith(
      position.x * TILE_SIZE,
      position.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )

    expect(context.restore).toHaveBeenCalled()
  })

  test('draws trash icon if delete config position is provided', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const position: Indexed<Position> = {
      id: 'ZONE_ID',
      x: 1,
      y: 1,
      direction: 'N',
    }

    const configPosition: ConfigPosition = {
      ...position,
      type: 'delete',
    }

    drawZone(context, position, configPosition)

    expect(drawLucideIcon).toHaveBeenCalledWith(
      context,
      'trash-2',
      configPosition
    )
  })
})

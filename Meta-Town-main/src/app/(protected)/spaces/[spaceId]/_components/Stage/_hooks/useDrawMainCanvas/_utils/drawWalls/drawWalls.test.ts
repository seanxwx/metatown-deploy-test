import { Block, ConfigPosition } from '@/app/types'
import drawDirectionalAsset from '../drawDirectionalAsset'
import drawWalls from './drawWalls'

vi.mock('../drawDirectionalAsset')

describe('drawWalls', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws walls', () => {
    const context = {} as CanvasRenderingContext2D

    const walls: Block[] = [
      { x: 10, y: 20, direction: 'E', element: 'wall' },
      { x: 30, y: 40, direction: 'N', element: 'wall' },
    ]

    const configPosition: ConfigPosition = {
      x: 10,
      y: 20,
      direction: 'E',
      type: 'delete',
    }

    drawWalls(context, walls, configPosition)

    expect(drawDirectionalAsset).toHaveBeenCalledWith(
      context,
      'wall',
      walls[0],
      configPosition
    )

    expect(drawDirectionalAsset).toHaveBeenCalledWith(
      context,
      'wall',
      walls[1],
      configPosition
    )
  })
})

import { ConfigPosition, Ground } from '@/app/types'
import drawDirectionalAsset from '../drawDirectionalAsset'
import drawGroundFloor from '../drawGroundFloor'
import drawGrounds from './drawGrounds'

vi.mock('../drawGroundFloor')
vi.mock('../drawDirectionalAsset')

describe('drawGrounds', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws grounds', () => {
    const context = {} as CanvasRenderingContext2D

    const grounds: Ground[] = [
      { x: 10, y: 20, direction: 'E', texture: 'grass' },
      { x: 30, y: 40, direction: 'N', texture: 'wood' },
      { x: 50, y: 60, direction: 'W', texture: 'chair' },
    ]

    const configPosition: ConfigPosition = {
      x: 10,
      y: 20,
      direction: 'E',
      type: 'delete',
    }

    drawGrounds(context, grounds, configPosition)

    expect(drawGroundFloor).toHaveBeenCalledWith(
      context,
      grounds[0],
      configPosition
    )

    expect(drawGroundFloor).toHaveBeenCalledWith(
      context,
      grounds[1],
      configPosition
    )

    expect(drawDirectionalAsset).toHaveBeenCalledWith(
      context,
      'chair',
      grounds[2],
      configPosition
    )
  })
})

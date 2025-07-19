import { ConfigPosition } from '@/app/types'
import drawLucideIcon from '../drawLucideIcon'
import drawDirectionalAsset from '../drawDirectionalAsset'
import drawZone from '../drawZone'
import drawGroundFloor from '../drawGroundFloor'
import drawConfiguration from './drawConfiguration'

vi.mock('../drawLucideIcon')
vi.mock('../drawDirectionalAsset')
vi.mock('../drawZone')
vi.mock('../drawGroundFloor')

describe('setConfiguration', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws entry with lucide icon when config entry', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const configPosition: ConfigPosition = {
      type: 'entry',
      x: 0,
      y: 0,
      direction: 'N',
    }

    drawConfiguration(context, configPosition)

    expect(drawLucideIcon).toHaveBeenCalledWith(
      context,
      'door-open',
      configPosition
    )
  })

  test('draws walls when config walls', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const configPosition: ConfigPosition = {
      type: 'blocks',
      element: 'wall',
      x: 0,
      y: 0,
      direction: 'N',
    }

    drawConfiguration(context, configPosition)

    expect(drawDirectionalAsset).toHaveBeenCalledWith(
      context,
      'wall',
      configPosition
    )
  })

  test('draws chair when config chair', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const configPosition: ConfigPosition = {
      type: 'grounds',
      texture: 'chair',
      x: 0,
      y: 0,
      direction: 'N',
    }

    drawConfiguration(context, configPosition)

    expect(drawDirectionalAsset).toHaveBeenCalledWith(
      context,
      'chair',
      configPosition
    )
  })

  test('draws zone when config zone', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const configPosition: ConfigPosition = {
      type: 'zone',
      id: 'ZONE_ID',
      x: 0,
      y: 0,
      direction: 'N',
    }

    drawConfiguration(context, configPosition)

    expect(drawZone).toHaveBeenCalledWith(context, configPosition)
  })

  test('draws grounds when config grounds', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const configPosition: ConfigPosition = {
      type: 'grounds',
      x: 0,
      y: 0,
      direction: 'N',
      texture: 'grass',
    }

    drawConfiguration(context, configPosition)

    expect(drawGroundFloor).toHaveBeenCalledWith(context, configPosition)
  })

  test('does not draw anything when configPosition is null', () => {
    drawConfiguration({} as CanvasRenderingContext2D, null)

    expect(drawLucideIcon).not.toHaveBeenCalled()
    expect(drawDirectionalAsset).not.toHaveBeenCalled()
    expect(drawZone).not.toHaveBeenCalled()
    expect(drawGroundFloor).not.toHaveBeenCalled()
  })
})

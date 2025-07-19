import { ConfigPosition, Indexed, Position } from '@/app/types'
import drawZone from '../drawZone'
import drawZones from './drawZones'

vi.mock('../drawZone')

describe('drawZones', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws zones', () => {
    const context = {} as CanvasRenderingContext2D

    const zones: Indexed<Position>[] = [
      { id: 'ZONE_1', x: 10, y: 20, direction: 'E' },
      { id: 'ZONE_2', x: 30, y: 40, direction: 'N' },
    ]

    const configPosition: ConfigPosition = {
      x: 10,
      y: 20,
      direction: 'E',
      type: 'delete',
    }

    drawZones(context, zones, configPosition)

    expect(drawZone).toHaveBeenCalledWith(context, zones[0], configPosition)
    expect(drawZone).toHaveBeenCalledWith(context, zones[1], configPosition)
  })
})

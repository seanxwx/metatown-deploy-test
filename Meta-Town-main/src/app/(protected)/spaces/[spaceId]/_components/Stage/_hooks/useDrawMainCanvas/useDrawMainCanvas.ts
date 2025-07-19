import {
  Block,
  CameraOffset,
  ConfigPosition,
  Dimensions,
  Ground,
  Indexed,
  Position,
} from '@/app/types'
import useDrawCanvas from '../useDrawCanvas'
import drawConfiguration from './_utils/drawConfiguration'
import drawEntry from './_utils/drawEntry'
import drawGrounds from './_utils/drawGrounds'
import drawTiledMap from './_utils/drawTiledMap'
import drawWalls from './_utils/drawWalls'
import drawZones from './_utils/drawZones'

const useDrawMainCanvas = (
  canvas: HTMLCanvasElement | null,
  config: {
    zoom: number
    cameraOffset: CameraOffset
  },
  {
    isConfiguring,
    dimensions,
    zones,
    walls,
    entry,
    grounds,
    configPosition,
  }: {
    isConfiguring: boolean
    dimensions: Dimensions
    zones: Indexed<Position>[] | null
    walls: Block[] | null
    entry: Position
    grounds: Ground[] | null
    configPosition: ConfigPosition | null
  }
): void =>
  useDrawCanvas(canvas, config, (context) => {
    drawTiledMap(context, dimensions)

    if (grounds) {
      drawGrounds(context, grounds, configPosition)
    }

    if (isConfiguring && zones) {
      drawZones(context, zones, configPosition)
    }

    if (walls) {
      drawWalls(context, walls, configPosition)
    }

    drawEntry(context, entry)

    if (isConfiguring) {
      drawConfiguration(context, configPosition)
    }
  })

export default useDrawMainCanvas

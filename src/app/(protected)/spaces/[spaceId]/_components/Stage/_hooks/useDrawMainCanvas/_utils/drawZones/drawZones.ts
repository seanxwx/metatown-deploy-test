import { ConfigPosition, Indexed, Position } from '@/app/types'
import drawZone from '../drawZone'

const drawZones = (
  context: CanvasRenderingContext2D,
  zones: Indexed<Position>[],
  configPosition?: ConfigPosition | null
): void => zones.forEach((zone) => drawZone(context, zone, configPosition))

export default drawZones

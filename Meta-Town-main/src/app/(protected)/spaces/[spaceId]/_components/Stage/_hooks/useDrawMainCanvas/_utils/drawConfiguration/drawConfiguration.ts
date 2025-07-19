import { ConfigPosition } from '@/app/types'
import drawGroundFloor from '../drawGroundFloor'
import drawLucideIcon from '../drawLucideIcon'
import drawDirectionalAsset from '../drawDirectionalAsset'
import drawZone from '../drawZone'

const drawConfiguration = (
  context: CanvasRenderingContext2D,
  configPosition?: ConfigPosition | null
): void => {
  if (!configPosition) {
    return
  }

  if (configPosition.type === 'blocks') {
    drawDirectionalAsset(context, 'wall', configPosition)
  }

  if (
    configPosition.type === 'grounds' &&
    (configPosition.texture === 'grass' || configPosition.texture === 'wood')
  ) {
    drawGroundFloor(context, configPosition)
  }

  if (configPosition.type === 'grounds' && configPosition.texture === 'chair') {
    drawDirectionalAsset(context, 'chair', configPosition)
  }

  if (configPosition.type === 'entry') {
    drawLucideIcon(context, 'door-open', configPosition)
  }

  if (configPosition.type === 'zone') {
    drawZone(context, configPosition)
  }
}

export default drawConfiguration

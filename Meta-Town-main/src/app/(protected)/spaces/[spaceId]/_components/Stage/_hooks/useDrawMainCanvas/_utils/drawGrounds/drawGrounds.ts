import { ConfigPosition, Ground } from '@/app/types'
import drawGroundFloor from '../drawGroundFloor'
import drawDirectionalAsset from '../drawDirectionalAsset'

const drawGrounds = (
  context: CanvasRenderingContext2D,
  grounds: Ground[],
  configPosition?: ConfigPosition | null
): void =>
  grounds.forEach((ground) => {
    if (ground.texture === 'chair') {
      drawDirectionalAsset(context, 'chair', ground, configPosition)

      return
    }

    drawGroundFloor(context, ground, configPosition)
  })

export default drawGrounds

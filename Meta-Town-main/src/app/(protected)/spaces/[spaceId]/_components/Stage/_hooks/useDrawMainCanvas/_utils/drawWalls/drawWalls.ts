import { ConfigPosition, Block } from '@/app/types'
import drawDirectionalAsset from '../drawDirectionalAsset'

const drawWalls = (
  context: CanvasRenderingContext2D,
  walls: Block[],
  configPosition?: ConfigPosition | null
): void =>
  walls.forEach((position) =>
    drawDirectionalAsset(context, 'wall', position, configPosition)
  )

export default drawWalls

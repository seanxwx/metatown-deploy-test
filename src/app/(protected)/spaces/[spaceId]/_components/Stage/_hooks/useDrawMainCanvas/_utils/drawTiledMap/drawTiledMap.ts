import { Dimensions } from '@/app/types'
import { TILE_SIZE } from '../../../../consts'

const drawTiledMap = (
  context: CanvasRenderingContext2D,
  dimensions: Dimensions
): void => {
  const { rows, columns } = dimensions

  context.save()
  context.fillStyle = 'white'
  context.fillRect(0, 0, columns * TILE_SIZE, rows * TILE_SIZE)
  context.restore()
}

export default drawTiledMap

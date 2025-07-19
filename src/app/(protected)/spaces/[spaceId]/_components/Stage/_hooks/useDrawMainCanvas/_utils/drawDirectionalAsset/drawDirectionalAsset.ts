import { ConfigPosition, Position } from '@/app/types'
import getAsset, { SPRITE_SIZE } from '@/utils/getAsset'
import { TILE_SIZE } from '../../../../consts'
import drawLucideIcon from '../drawLucideIcon'
import isDeleting from '../isDeleting'

const drawDirectionalAsset = (
  context: CanvasRenderingContext2D,
  name: 'wall' | 'chair',
  position: Position,
  configPosition?: ConfigPosition | null
): void => {
  if (isDeleting(position, configPosition)) {
    drawLucideIcon(context, 'trash-2', configPosition)

    return
  }

  const { x, y, direction } = position

  const image = getAsset(name)

  if (image instanceof Promise) {
    return
  }

  const sx = 0
  const sy = ['N', 'E', 'S', 'W'].indexOf(direction) * SPRITE_SIZE

  const cx = x * TILE_SIZE + TILE_SIZE / 2
  const cy = y * TILE_SIZE + TILE_SIZE / 2

  context.save()
  context.translate(cx, cy)

  context.drawImage(
    image,
    sx,
    sy,
    SPRITE_SIZE,
    SPRITE_SIZE,
    SPRITE_SIZE / -2,
    SPRITE_SIZE / -2,
    SPRITE_SIZE,
    SPRITE_SIZE
  )

  context.restore()
}

export default drawDirectionalAsset

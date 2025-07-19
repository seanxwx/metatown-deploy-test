import { ConfigPosition, Ground } from '@/app/types'
import getAsset, { SPRITE_SIZE } from '@/utils/getAsset'
import { TILE_SIZE } from '../../../../consts'
import idDeleting from '../isDeleting'
import drawLucideIcon from '../drawLucideIcon'

const drawGround = (
  context: CanvasRenderingContext2D,
  ground: Ground,
  configPosition?: ConfigPosition | null
): void => {
  if (idDeleting({ x: ground.x, y: ground.y }, configPosition)) {
    drawLucideIcon(context, 'trash-2', configPosition)

    return
  }

  const { x, y, texture } = ground

  const image = getAsset('ground')

  if (image instanceof Promise) {
    return
  }

  const sx = 0
  const sy = ['wood', 'grass'].indexOf(texture) * SPRITE_SIZE

  const cx = x * TILE_SIZE + TILE_SIZE / 2
  const cy = y * TILE_SIZE + TILE_SIZE / 2

  context.save()
  context.translate(cx, cy)

  const shouldRotate = (x + y) % 2 === 1

  if (shouldRotate) {
    context.rotate(Math.PI)
  }

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

export default drawGround

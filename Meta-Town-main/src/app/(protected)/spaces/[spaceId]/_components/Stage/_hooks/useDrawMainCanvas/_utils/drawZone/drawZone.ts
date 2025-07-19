import { ConfigPosition, Indexed, Position } from '@/app/types'
import getDeterministicColorStyle from '@/utils/getDeterministicColorStyle'
import isDeleting from '../isDeleting'
import drawLucideIcon from '../drawLucideIcon'
import { TILE_SIZE } from '../../../../consts'

const drawZone = (
  context: CanvasRenderingContext2D,
  position: Indexed<Position>,
  configPosition?: ConfigPosition | null
): void => {
  if (isDeleting(position, configPosition)) {
    drawLucideIcon(context, 'trash-2', configPosition)

    return
  }

  const { x, y } = position

  const cx = x * TILE_SIZE
  const cy = y * TILE_SIZE

  context.save()

  context.globalAlpha = 0.5
  context.fillStyle = getDeterministicColorStyle(position.id).backgroundColor
  context.fillRect(cx, cy, TILE_SIZE, TILE_SIZE)

  context.restore()
}

export default drawZone

import { IconName } from 'lucide-react/dynamic'
import { Position, Direction } from '@/app/types'
import { ICON_SIZE, TILE_SIZE } from '../../../../consts'

const CACHE: Partial<Record<IconName, HTMLImageElement>> = {}

export const FACE_ROTATION: Record<Direction, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
}

const drawLucideIcon = (
  context: CanvasRenderingContext2D,
  name: IconName,
  position: Position
): void => {
  const { x, y, direction } = position
  const cx = x * TILE_SIZE + TILE_SIZE / 2
  const cy = y * TILE_SIZE + TILE_SIZE / 2
  const angle = (FACE_ROTATION[direction] * Math.PI) / 180

  const draw = (icon: HTMLImageElement): void => {
    context.save()
    context.translate(cx, cy)
    context.rotate(angle)

    context.drawImage(
      icon,
      -ICON_SIZE / 2,
      -ICON_SIZE / 2,
      ICON_SIZE,
      ICON_SIZE
    )

    context.restore()
  }

  if (CACHE[name]) {
    draw(CACHE[name])

    return
  }

  const icon = new Image()
  icon.src = `https://unpkg.com/lucide-static@0.488.0/icons/${name}.svg`
  icon.onload = (): void => {
    CACHE[name] = icon
    draw(icon)
  }
}

export default drawLucideIcon

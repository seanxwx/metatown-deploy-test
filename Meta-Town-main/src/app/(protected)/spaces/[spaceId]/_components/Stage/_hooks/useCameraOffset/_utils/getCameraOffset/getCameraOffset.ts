import { Position, Dimensions, CameraOffset } from '@/app/types'
import clamp from '@/utils/clamp'
import { TILE_SIZE } from '../../../../consts'

const getCameraOffset = (
  canvas: HTMLCanvasElement | null,
  {
    zoom,
    dimensions,
    userPosition,
  }: {
    zoom: number
    dimensions: Dimensions
    userPosition: Position
  }
): CameraOffset => {
  const offset = {
    left: 0,
    top: 0,
  }

  if (!canvas) {
    return offset
  }

  const tileSize = TILE_SIZE * zoom

  const { rows, columns } = dimensions

  const map = {
    width: columns * tileSize,
    height: rows * tileSize,
  }

  const character = {
    left: userPosition.x * tileSize + tileSize / 2,
    top: userPosition.y * tileSize + tileSize / 2,
  }

  if (map.width < canvas.width) {
    offset.left = (map.width - canvas.width) / 2
  } else {
    const offsetLeft = character.left - canvas.width / 2

    offset.left = clamp(offsetLeft, 0, map.width - canvas.width)
  }

  if (map.height < canvas.height) {
    offset.top = (map.height - canvas.height) / 2
  } else {
    const offsetTop = character.top - canvas.height / 2

    offset.top = clamp(offsetTop, 0, map.height - canvas.height)
  }

  return {
    left: -offset.left,
    top: -offset.top,
  }
}

export default getCameraOffset

import { Position } from '@/app/types'
import { TILE_SIZE } from '../../../../../../../../consts'

const drawDisplayName = (
  context: CanvasRenderingContext2D,
  displayName: string,
  position: Position
): void => {
  const { x, y } = position
  const cx = x * TILE_SIZE + TILE_SIZE / 2
  const cy = y * TILE_SIZE - TILE_SIZE / 10
  const padding = 20

  context.save()

  context.font = getComputedStyle(document.body).font
  const textWidth = context.measureText(displayName).width

  context.beginPath()
  context.roundRect(
    cx - (textWidth + padding) / 2,
    cy - TILE_SIZE / 4,
    textWidth + padding,
    TILE_SIZE / 2,
    5
  )
  context.fillStyle = 'lightGray'
  context.fill()

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = 'black'
  context.fillText(displayName, cx, cy)

  context.restore()
}

export default drawDisplayName

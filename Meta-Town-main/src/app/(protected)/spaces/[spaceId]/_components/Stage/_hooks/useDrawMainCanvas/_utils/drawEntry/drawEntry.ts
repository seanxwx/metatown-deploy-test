import { Position } from '@/app/types'
import drawLucideIcon from '../drawLucideIcon'

const drawEntry = (
  context: CanvasRenderingContext2D,
  entry: Position
): void => {
  drawLucideIcon(context, 'door-open', entry)
}

export default drawEntry

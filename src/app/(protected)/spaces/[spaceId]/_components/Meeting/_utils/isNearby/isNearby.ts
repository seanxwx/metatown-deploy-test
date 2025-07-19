import { Coordinates } from '@/app/types'

export type Position = Omit<Coordinates, 'direction'>

function isNearby(
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position,
  threshold: number
): boolean {
  const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

  return distance <= threshold
}

export default isNearby

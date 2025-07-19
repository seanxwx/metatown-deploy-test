import { ConfigPosition, Coordinates } from '@/app/types'

const isDeleting = (
  coordinates: Coordinates,
  configPosition?: ConfigPosition | null
): configPosition is ConfigPosition =>
  configPosition?.type === 'delete' &&
  configPosition.x === coordinates.x &&
  configPosition.y === coordinates.y

export default isDeleting

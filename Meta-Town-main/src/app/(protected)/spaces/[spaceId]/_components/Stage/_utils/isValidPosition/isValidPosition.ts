import { Dimensions, Coordinates } from '@/app/types'

const isValidPosition = (
  dimensions: Dimensions,
  coordinates: Coordinates
): boolean =>
  coordinates.x >= 0 &&
  coordinates.x < dimensions.columns &&
  coordinates.y >= 0 &&
  coordinates.y < dimensions.rows

export default isValidPosition

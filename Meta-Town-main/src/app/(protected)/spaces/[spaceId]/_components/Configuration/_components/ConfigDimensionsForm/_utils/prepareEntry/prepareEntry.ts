import { Position, Dimensions } from '@/app/types'

const prepareEntry = (dimensions: Dimensions, entry?: Position): Position => {
  const { x = 0, y = 0, direction = 'N' } = entry ?? {}

  if (x < dimensions.columns && y < dimensions.rows) {
    return { x, y, direction }
  }

  return { x: 0, y: 0, direction: 'N' }
}

export default prepareEntry

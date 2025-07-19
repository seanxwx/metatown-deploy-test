import { Coordinates } from '@/app/types'

const isBlocked = (
  coordinates: Coordinates,
  ...blocks: (Coordinates | Coordinates[] | null | undefined)[]
): boolean =>
  blocks.some((item) => {
    if (!item) {
      return
    }

    if (!Array.isArray(item)) {
      return item.x === coordinates.x && item.y === coordinates.y
    }

    return isBlocked(coordinates, ...item)
  })

export default isBlocked

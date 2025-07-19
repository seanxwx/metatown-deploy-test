import { Coordinates } from '@/app/types'

const deleteLast = <T extends Coordinates & { createdAt?: string }>(
  data: T[] | null,
  target: Coordinates
): T[] | null => {
  if (!data) {
    return null
  }

  const last = [...data]
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) {
        return 1
      }

      return a.createdAt.localeCompare(b.createdAt)
    })
    .findLast((item) => item.x === target.x && item.y === target.y)

  if (!last) {
    return data
  }

  return data.filter((item) => item !== last)
}

export default deleteLast

import { Dimensions, Indexed, Position } from '@/app/types'
import { TILE_SIZE } from '../../../../consts'

const drawEnteredZone = (
  context: CanvasRenderingContext2D,
  enteredZone: Indexed<Position>,
  dimensions: Dimensions,
  zones: Indexed<Position>[] | null
): void => {
  const { rows, columns } = dimensions
  const sameZones = zones?.filter((zone) => enteredZone.id === zone.id)

  context.save()
  context.fillStyle = 'rgba(0, 0, 0, 0.25)'

  Array.from({ length: rows }).forEach((_row, y) => {
    Array.from({ length: columns }).forEach((_column, x) => {
      if (sameZones?.some((zone) => zone.x === x && zone.y === y)) {
        return
      }

      context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    })
  })

  context.restore()
}

export default drawEnteredZone

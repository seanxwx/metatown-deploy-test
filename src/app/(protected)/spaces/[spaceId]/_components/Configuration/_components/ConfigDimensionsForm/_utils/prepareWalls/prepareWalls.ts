import { Block, Dimensions } from '@/app/types'

const prepareWalls = (
  dimensions: Dimensions,
  walls?: Block[] | null
): Block[] | undefined =>
  walls?.filter(
    (wall) => wall.x < dimensions.columns && wall.y < dimensions.rows
  )

export default prepareWalls

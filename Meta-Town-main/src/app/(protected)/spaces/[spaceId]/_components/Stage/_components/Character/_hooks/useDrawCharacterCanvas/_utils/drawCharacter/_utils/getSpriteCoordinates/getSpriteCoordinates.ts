import { Coordinates, Direction, Movement } from '@/app/types'

const ROW_DIRECTION: Record<Direction, number> = {
  S: 0,
  W: 1,
  E: 2,
  N: 3,
}

export const SPRITE_SIZE = 32

const getSpriteCoordinates = (movement: Movement): Coordinates => {
  const { x, y, direction, isMoving } = movement

  const factor = isMoving ? 1 : 0
  const step = ((x + y) % 2 === 0 ? -1 : 1) * factor

  const row = ROW_DIRECTION[direction]
  const col = step + 1

  return {
    x: col * SPRITE_SIZE,
    y: row * SPRITE_SIZE,
  }
}

export default getSpriteCoordinates

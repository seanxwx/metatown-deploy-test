import { Movement } from '@/app/types'
import getSpriteCoordinates, { SPRITE_SIZE } from './getSpriteCoordinates'

describe('getSpriteCoordinates', () => {
  test.each([
    ['S', 0],
    ['W', 1],
    ['E', 2],
    ['N', 3],
  ] as const)('returns coordinates for facing %s', (direction, row) => {
    const movement: Movement = {
      x: 1,
      y: 1,
      direction,
      isMoving: false,
    }

    const result = getSpriteCoordinates(movement)

    expect(result).toEqual({
      x: (0 + 1) * SPRITE_SIZE,
      y: row * SPRITE_SIZE,
    })
  })

  test('returns coordinates for is moving with left step', () => {
    const movement: Movement = {
      x: 0,
      y: 0,
      direction: 'S',
      isMoving: true,
    }
    const result = getSpriteCoordinates(movement)
    expect(result).toEqual({
      x: (-1 + 1) * SPRITE_SIZE,
      y: 0 * SPRITE_SIZE,
    })
  })

  test('returns coordinates for is moving with right step', () => {
    const movement: Movement = {
      x: 0,
      y: 1,
      direction: 'S',
      isMoving: true,
    }
    const result = getSpriteCoordinates(movement)
    expect(result).toEqual({
      x: (1 + 1) * SPRITE_SIZE,
      y: 0 * SPRITE_SIZE,
    })
  })
})

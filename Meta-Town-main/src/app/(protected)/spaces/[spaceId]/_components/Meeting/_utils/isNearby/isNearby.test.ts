import isNearby, { Position } from './isNearby'

describe('isNearby', () => {
  test('returns true if the distance of two given points is less than or equal to the threshold', () => {
    const threshold = 5

    const position1: Position = {
      x: 0,
      y: 0,
    }

    const position2: Position = {
      x: 0,
      y: 2,
    }

    expect(isNearby(position1, position2, threshold)).toBeTruthy()

    const equalDistancePosition: Position = {
      x: 0,
      y: threshold,
    }

    expect(isNearby(position1, equalDistancePosition, threshold)).toBeTruthy()
  })

  test('returns false if the distance of two given points is larger than threshold', () => {
    const threshold = 5

    const position1: Position = {
      x: 0,
      y: 0,
    }

    const position2: Position = {
      x: 0,
      y: threshold + 1,
    }

    expect(isNearby(position1, position2, threshold)).toBeFalsy()
  })
})

import { Coordinates } from '@/app/types'
import isBlocked from './isBlocked'

describe('isBlocked', () => {
  test('returns true if coordinates are blocked', () => {
    const coordinates: Coordinates = { x: 1, y: 2 }

    const blocks: Coordinates[] = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]

    expect(isBlocked(coordinates, ...blocks)).toBe(true)
  })

  test('returns false if coordinates are not blocked', () => {
    const coordinates: Coordinates = { x: 1, y: 2 }

    const blocks: Coordinates[] = [{ x: 5, y: 6 }]

    expect(isBlocked(coordinates, ...blocks)).toBe(false)
  })

  test('returns false if blocks is null', () => {
    const coordinates: Coordinates = { x: 1, y: 2 }

    const blocks = null

    expect(isBlocked(coordinates, blocks)).toBe(false)
  })

  test('returns false if mixed blocks are all not blocked', () => {
    const coordinates: Coordinates = { x: 1, y: 2 }

    expect(
      isBlocked(coordinates, null, undefined, { x: 3, y: 4 }, [{ x: 5, y: 6 }])
    ).toBe(false)
  })

  test('returns true if mixed blocks are some blocked', () => {
    const coordinates: Coordinates = { x: 1, y: 2 }

    expect(
      isBlocked(coordinates, null, undefined, { x: 3, y: 4 }, [{ x: 1, y: 2 }])
    ).toBe(true)
  })
})

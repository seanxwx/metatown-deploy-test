import { Dimensions, Coordinates } from '@/app/types'
import isValidPosition from './isValidPosition'

describe('isValidPosition', () => {
  test('returns false if coordinates is outside the map', () => {
    const dimensions: Dimensions = { columns: 5, rows: 5 }
    const coordinates: Coordinates = { x: -1, y: -1 }

    expect(isValidPosition(dimensions, coordinates)).toBe(false)
  })

  test('returns true if coordinates is in the map', () => {
    const dimensions: Dimensions = { columns: 5, rows: 5 }
    const coordinates: Coordinates = { x: 1, y: 1 }

    expect(isValidPosition(dimensions, coordinates)).toBe(true)
  })
})

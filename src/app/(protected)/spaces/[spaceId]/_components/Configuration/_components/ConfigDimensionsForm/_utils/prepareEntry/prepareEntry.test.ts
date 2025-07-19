import { Position } from '@/app/types'
import prepareEntry from './prepareEntry'

describe('prepareEntry', () => {
  test('returns entry with default values', () => {
    const dimensions = { columns: 5, rows: 5 }

    const result = prepareEntry(dimensions)

    expect(result).toEqual({ x: 0, y: 0, direction: 'N' })
  })

  test('returns entry with provided values when inside bounds', () => {
    const dimensions = { columns: 5, rows: 5 }
    const entry: Position = { x: 3, y: 3, direction: 'S' }

    const result = prepareEntry(dimensions, entry)

    expect(result).toEqual(entry)
  })

  test('returns entry with default values when out of bounds', () => {
    const dimensions = { columns: 5, rows: 5 }
    const entry: Position = { x: 6, y: 6, direction: 'S' }

    const result = prepareEntry(dimensions, entry)

    expect(result).toEqual({ x: 0, y: 0, direction: 'N' })
  })
})

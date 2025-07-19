import { Block } from '@/app/types'
import prepareWalls from './prepareWalls'

describe('prepareWalls', () => {
  test('returns undefined when walls are not provided', () => {
    const dimensions = { columns: 5, rows: 5 }

    const result = prepareWalls(dimensions)

    expect(result).toBeUndefined()
  })

  test('filters out walls that are out of bounds', () => {
    const dimensions = { columns: 5, rows: 5 }

    const walls: Block[] = [
      { x: 1, y: 1, direction: 'N', element: 'wall' },
      { x: 5, y: 5, direction: 'N', element: 'wall' },
      { x: 6, y: 6, direction: 'N', element: 'wall' },
    ]

    const result = prepareWalls(dimensions, walls)

    expect(result).toEqual([{ x: 1, y: 1, direction: 'N', element: 'wall' }])
  })
})

import { Ground } from '@/app/types'
import prepareGrounds from './prepareGrounds'

describe('prepareGrounds', () => {
  test('returns undefined when grounds are not provided', () => {
    const dimensions = { columns: 5, rows: 5 }

    const result = prepareGrounds(dimensions)

    expect(result).toBeUndefined()
  })

  test('filters out grounds that are out of bounds', () => {
    const dimensions = { columns: 5, rows: 5 }

    const grounds: Ground[] = [
      { x: 1, y: 1, direction: 'N', texture: 'grass' },
      { x: 5, y: 5, direction: 'N', texture: 'grass' },
      { x: 6, y: 6, direction: 'N', texture: 'grass' },
    ]

    const result = prepareGrounds(dimensions, grounds)

    expect(result).toEqual([{ x: 1, y: 1, direction: 'N', texture: 'grass' }])
  })
})

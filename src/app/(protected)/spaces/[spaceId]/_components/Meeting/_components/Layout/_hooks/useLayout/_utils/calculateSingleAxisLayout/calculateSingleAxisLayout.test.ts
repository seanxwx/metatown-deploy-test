import { GAP } from '../../consts'
import calculateSingleAxisLayout from './calculateSingleAxisLayout'

describe('calculateSingleAxisLayout', () => {
  test('returns column layout', () => {
    const width = 800
    const height = 600
    const count = 100

    const result = calculateSingleAxisLayout(width, height, count, 'column')

    expect(result).toEqual({
      columns: 2,
      rows: 1,
      style: {
        gridTemplateColumns: 'repeat(2, 300px)',
        gridTemplateRows: 'repeat(1, 200px)',
        gap: `${GAP}px`,
      },
    })
  })

  test('returns row layout', () => {
    const width = 800
    const height = 800
    const count = 100

    const result = calculateSingleAxisLayout(width, height, count, 'row')

    expect(result).toEqual({
      columns: 1,
      rows: 3,
      style: {
        gridTemplateColumns: 'repeat(1, 300px)',
        gridTemplateRows: 'repeat(3, 200px)',
        gap: `${GAP}px`,
      },
    })
  })
})

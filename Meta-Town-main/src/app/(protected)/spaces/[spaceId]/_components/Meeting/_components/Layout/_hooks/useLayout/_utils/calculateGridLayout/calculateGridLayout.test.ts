import { GAP } from '../../consts'
import calculateGridLayout from './calculateGridLayout'

describe('calculateGridLayout', () => {
  test('returns layout', () => {
    const width = 800
    const height = 400

    const count = 100

    const result = calculateGridLayout(width, height, count)

    expect(result).toEqual({
      columns: 5,
      rows: 4,
      style: {
        gridTemplateColumns: 'repeat(5, 114px)',
        gridTemplateRows: 'repeat(4, 76px)',
        gap: `${GAP}px`,
      },
    })
  })
})

import { TILE_SIZE } from '../../../../consts'
import align from './align'

describe('align', () => {
  test('returns the value aligned to the nearest TILE_SIZE', () => {
    expect(align(TILE_SIZE + TILE_SIZE - 1)).toBe(TILE_SIZE)
  })
})

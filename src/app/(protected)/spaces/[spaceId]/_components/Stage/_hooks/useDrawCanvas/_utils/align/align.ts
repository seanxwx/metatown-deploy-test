import { TILE_SIZE } from '../../../../consts'

const align = (value: number): number =>
  Math.floor(value / TILE_SIZE) * TILE_SIZE

export default align

import { ASPECT_RATIO, GAP } from '../../consts'

const MAX_TILE_WIDTH = 300

const MAX_TILE_HEIGHT = 200

const calculateSingleAxisLayout = (
  width: number,
  height: number,
  count: number,
  axis: 'row' | 'column'
): {
  columns: number
  rows: number
  style: {
    gridTemplateColumns: string
    gridTemplateRows: string
    gap: string
  }
} => {
  const isVerticalAxis = axis === 'row'

  const containerMain = isVerticalAxis ? height : width
  const containerCross = isVerticalAxis ? width : height
  const tileMain = isVerticalAxis ? MAX_TILE_HEIGHT : MAX_TILE_WIDTH

  const tileCross = isVerticalAxis
    ? tileMain * ASPECT_RATIO
    : tileMain / ASPECT_RATIO

  let bestCount = 1

  for (let tiles = 1; tiles <= count; tiles++) {
    const totalMain = tileMain * tiles + GAP * (tiles - 1)
    if (totalMain > containerMain || tileCross > containerCross) {
      break
    }
    bestCount = tiles
  }

  const columns = isVerticalAxis ? 1 : bestCount
  const rows = isVerticalAxis ? bestCount : 1

  return {
    columns,
    rows,
    style: {
      gridTemplateColumns: `repeat(${columns}, ${isVerticalAxis ? tileCross : tileMain}px)`,
      gridTemplateRows: `repeat(${rows}, ${isVerticalAxis ? tileMain : tileCross}px)`,
      gap: `${GAP}px`,
    },
  }
}

export default calculateSingleAxisLayout

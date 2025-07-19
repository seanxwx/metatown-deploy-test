import { ASPECT_RATIO, GAP } from '../../consts'

const MAX_COUNT = 20

const calculateGridLayout = (
  width: number,
  height: number,
  count: number
): {
  columns: number
  rows: number
  style: {
    gridTemplateColumns: string
    gridTemplateRows: string
    gap: string
  }
} => {
  let bestCols = 1
  let bestRows = 1
  let bestTileWidth = 0
  let bestTileHeight = 0
  let maxTileSize = 0

  const limitedCount = Math.min(count, MAX_COUNT)

  for (let cols = 1; cols <= limitedCount; cols++) {
    const rows = Math.ceil(limitedCount / cols)

    const totalGapWidth = GAP * (cols - 1)
    const totalGapHeight = GAP * (rows - 1)

    const maxAvailableWidth = (width - totalGapWidth) / cols
    const maxAvailableHeight = (height - totalGapHeight) / rows

    let tileWidth = maxAvailableWidth
    let tileHeight = tileWidth / ASPECT_RATIO

    if (tileHeight > maxAvailableHeight) {
      tileHeight = maxAvailableHeight
      tileWidth = tileHeight * ASPECT_RATIO
    }

    const tileSize = Math.min(tileWidth, tileHeight)

    if (cols * rows >= limitedCount && tileSize > maxTileSize) {
      maxTileSize = tileSize
      bestCols = cols
      bestRows = rows
      bestTileWidth = tileWidth
      bestTileHeight = tileHeight
    }
  }

  return {
    columns: bestCols,
    rows: bestRows,
    style: {
      gridTemplateColumns: `repeat(${bestCols}, ${bestTileWidth}px)`,
      gridTemplateRows: `repeat(${bestRows}, ${bestTileHeight}px)`,
      gap: `${GAP}px`,
    },
  }
}

export default calculateGridLayout

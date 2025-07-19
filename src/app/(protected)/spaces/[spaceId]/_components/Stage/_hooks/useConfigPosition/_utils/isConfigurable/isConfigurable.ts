import {
  Block,
  ConfigItem,
  Coordinates,
  Ground,
  Indexed,
  Position,
} from '@/app/types'
import isBlocked from '../../../../_utils/isBLocked'

const isConfigurable = (
  configItem: ConfigItem,
  { x, y }: Coordinates,
  {
    blocks,
    entry,
    zones,
    grounds,
  }: {
    entry: Position
    blocks?: Block[] | null
    zones?: Indexed<Position>[] | null
    grounds?: Ground[] | null
  }
): boolean => {
  if (configItem.type === 'blocks') {
    return !isBlocked({ x, y }, blocks, entry, grounds, zones)
  }

  if (configItem.type === 'grounds') {
    return !isBlocked(
      { x, y },
      blocks,
      grounds?.filter((ground) => ground.texture === configItem.texture)
    )
  }

  if (configItem.type === 'entry') {
    return !isBlocked({ x, y }, blocks, entry)
  }

  if (configItem.type === 'zone') {
    return !isBlocked({ x, y }, blocks, zones)
  }

  return isBlocked({ x, y }, blocks, zones, grounds)
}

export default isConfigurable

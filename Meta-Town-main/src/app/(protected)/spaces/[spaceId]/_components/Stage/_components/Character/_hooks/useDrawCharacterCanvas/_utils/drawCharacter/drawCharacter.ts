import { EmojiReaction, Movement } from '@/app/types'
import getCharacter, { isCharacter, SPRITE_SIZE } from '@/utils/getCharacter'
import { TILE_SIZE } from '../../../../../../consts'
import drawDisplayName from './_utils/drawDisplayName'
import drawEmojiReaction from './_utils/drawEmojiReaction'
import getSpriteCoordinates from './_utils/getSpriteCoordinates'

const drawCharacter = (
  context: CanvasRenderingContext2D,
  user: {
    id: string
    displayName: string
    avatar: string
  },
  movement: Movement,
  emojiReaction?: EmojiReaction
): void => {
  drawDisplayName(context, user.displayName, movement)

  drawEmojiReaction(context, user.id, movement, emojiReaction)

  const spriteCoordinates = getSpriteCoordinates(movement)

  if (!isCharacter(user.avatar)) {
    return
  }

  const image = getCharacter(user.avatar)

  if (image instanceof Promise) {
    return
  }

  const cx = movement.x * TILE_SIZE + TILE_SIZE / 2
  const cy = movement.y * TILE_SIZE + TILE_SIZE / 2

  context.save()
  context.translate(cx, cy)

  context.drawImage(
    image,
    spriteCoordinates.x,
    spriteCoordinates.y,
    SPRITE_SIZE,
    SPRITE_SIZE,
    -SPRITE_SIZE / 2,
    -SPRITE_SIZE / 2,
    SPRITE_SIZE,
    SPRITE_SIZE
  )

  context.restore()
}

export default drawCharacter

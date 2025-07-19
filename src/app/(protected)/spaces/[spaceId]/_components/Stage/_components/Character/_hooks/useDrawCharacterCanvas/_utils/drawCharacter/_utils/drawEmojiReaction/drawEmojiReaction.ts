import { EmojiReaction, Position } from '@/app/types'
import { TILE_SIZE } from '../../../../../../../../consts'

const drawEmojiReaction = (
  context: CanvasRenderingContext2D,
  userId: string,
  position: Position,
  emojiReaction?: EmojiReaction
): void => {
  if (
    !emojiReaction ||
    emojiReaction.userId !== userId ||
    Date.now() - new Date(emojiReaction.createdAt).getTime() > 3000
  ) {
    return
  }

  const { x, y } = position
  const cx = x * TILE_SIZE + TILE_SIZE / 2
  const cy = y * TILE_SIZE - TILE_SIZE / 2.5
  context.save()

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = getComputedStyle(document.body).font
  context.fillText(emojiReaction.emoji.unicode, cx, cy)

  context.restore()
}

export default drawEmojiReaction

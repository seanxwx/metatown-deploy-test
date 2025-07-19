import { EmojiReaction, Position } from '@/app/types'
import { TILE_SIZE } from '../../../../../../../../consts'
import drawEmojiReaction from './drawEmojiReaction'

describe('drawEmojiReaction', () => {
  test('draws emoji reaction on the canvas', () => {
    vi.useFakeTimers()

    const context = {
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D

    const position: Position = { x: 1, y: 1, direction: 'E' }
    const cx = position.x * TILE_SIZE + TILE_SIZE / 2
    const cy = position.y * TILE_SIZE - TILE_SIZE / 2.5

    const userId = 'userId'

    const emojiReaction: EmojiReaction = {
      userId,
      emoji: {
        label: 'thumbs up',
        unicode: '👍',
      },
      createdAt: new Date().toISOString(),
    }

    drawEmojiReaction(context, userId, position, emojiReaction)

    expect(context.save).toHaveBeenCalled()
    expect(context.textAlign).toBe('center')
    expect(context.textBaseline).toBe('middle')
    expect(context.fillText).toHaveBeenCalledWith(
      emojiReaction.emoji.unicode,
      cx,
      cy
    )
    expect(context.restore).toHaveBeenCalled()
    vi.useRealTimers()
  })

  test('does not draw emoji if there is no emoji reaction data', () => {
    const context = {
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D

    const position: Position = { x: 1, y: 1, direction: 'E' }

    drawEmojiReaction(context, 'userId', position)

    expect(context.save).not.toHaveBeenCalled()
    expect(context.fillText).not.toHaveBeenCalled()
    expect(context.restore).not.toHaveBeenCalled()
  })

  test('does not draw emoji if the reaction does not belong to the current user', () => {
    vi.useFakeTimers()

    const context = {
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D

    const position: Position = { x: 1, y: 1, direction: 'E' }

    const emojiReaction: EmojiReaction = {
      userId: 'userId',
      emoji: {
        label: 'thumbs up',
        unicode: '👍',
      },
      createdAt: new Date().toISOString(),
    }

    drawEmojiReaction(context, 'otherUserId', position, emojiReaction)

    expect(context.save).not.toHaveBeenCalled()
    expect(context.fillText).not.toHaveBeenCalled()
    expect(context.restore).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  test('does not draw emoji if the reaction is older than 3 seconds', () => {
    vi.useFakeTimers()

    const context = {
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D

    const position: Position = { x: 1, y: 1, direction: 'E' }

    const userId = 'userId'

    const emojiReaction: EmojiReaction = {
      userId,
      emoji: {
        label: 'thumbs up',
        unicode: '👍',
      },
      createdAt: new Date(Date.now() - 3001).toISOString(),
    }

    drawEmojiReaction(context, userId, position, emojiReaction)

    expect(context.save).not.toHaveBeenCalled()
    expect(context.fillText).not.toHaveBeenCalled()
    expect(context.restore).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

import { EmojiReaction, Movement } from '@/app/types'
import getCharacter, { isCharacter, SPRITE_SIZE } from '@/utils/getCharacter'
import { TILE_SIZE } from '../../../../../../consts'
import drawDisplayName from './_utils/drawDisplayName'
import drawEmojiReaction from './_utils/drawEmojiReaction'
import drawCharacter from './drawCharacter'

vi.mock('./_utils/drawDisplayName')

vi.mock('./_utils/drawEmojiReaction')

vi.mock('@/utils/getCharacter')
const getCharacterMock = vi.mocked(getCharacter)
const isCharacterMock = vi.mocked(isCharacter)

describe('drawCharacter', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('draws display name with sessionUser displayName and userPosition', () => {
    const user = {
      id: 'userId',
      displayName: 'Alice',
      avatar: 'FEMALE_01',
    }

    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const movement: Movement = {
      x: 10,
      y: 20,
      direction: 'E',
      isMoving: false,
    }

    getCharacterMock.mockResolvedValue(new Image())

    drawCharacter(context, user, movement)

    expect(drawDisplayName).toHaveBeenCalledWith(
      context,
      user.displayName,
      movement
    )
  })

  test('draw character image', () => {
    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const user = {
      id: 'userId',
      displayName: 'Alice',
      avatar: 'FEMALE_01',
    }

    const movement: Movement = {
      x: 1,
      y: 1,
      direction: 'S',
      isMoving: true,
    }

    const image = new Image()

    getCharacterMock.mockReturnValue(image)
    isCharacterMock.mockReturnValue(true)

    drawCharacter(context, user, movement)

    expect(getCharacter).toHaveBeenCalledWith(user.avatar)

    expect(context.save).toHaveBeenCalled()
    expect(context.translate).toHaveBeenCalledWith(
      movement.x * TILE_SIZE + TILE_SIZE / 2,
      movement.y * TILE_SIZE + TILE_SIZE / 2
    )

    expect(context.drawImage).toHaveBeenCalledWith(
      image,
      0,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      -SPRITE_SIZE / 2,
      -SPRITE_SIZE / 2,
      SPRITE_SIZE,
      SPRITE_SIZE
    )

    expect(context.restore).toHaveBeenCalled()
  })

  test('does not draw character image if avatar is invalid', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const user = {
      id: 'userId',
      displayName: 'Alice',
      avatar: 'INVALID_AVATAR',
    }

    const movement: Movement = {
      x: 1,
      y: 1,
      direction: 'S',
      isMoving: true,
    }

    isCharacterMock.mockReturnValue(false)

    drawCharacter(context, user, movement)

    expect(getCharacter).not.toHaveBeenCalled()
  })

  test('does not draw character image if image is a promise', () => {
    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const image = new Image()
    getCharacterMock.mockResolvedValue(image)

    isCharacterMock.mockReturnValue(true)

    drawCharacter(
      context,
      {
        id: 'userId',
        displayName: 'Alice',
        avatar: 'FEMALE_01',
      },
      {
        x: 1,
        y: 1,
        direction: 'S',
        isMoving: true,
      }
    )

    expect(context.save).not.toHaveBeenCalled()
    expect(context.translate).not.toHaveBeenCalled()
    expect(context.drawImage).not.toHaveBeenCalled()
    expect(context.restore).not.toHaveBeenCalled()
  })

  test('draws emoji reaction', () => {
    const userId = 'userId'

    const user = {
      id: userId,
      displayName: 'Alice',
      avatar: 'FEMALE_01',
    }

    const emojiReaction: EmojiReaction = {
      userId,
      emoji: {
        label: 'thumbs up',
        unicode: '👍',
      },
      createdAt: '2023-05-22T15:30:00Z',
    }

    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const movement: Movement = {
      x: 10,
      y: 20,
      direction: 'E',
      isMoving: false,
    }

    getCharacterMock.mockResolvedValue(new Image())

    drawCharacter(context, user, movement, emojiReaction)

    expect(drawEmojiReaction).toHaveBeenCalledWith(
      context,
      user.id,
      movement,
      emojiReaction
    )
  })
})

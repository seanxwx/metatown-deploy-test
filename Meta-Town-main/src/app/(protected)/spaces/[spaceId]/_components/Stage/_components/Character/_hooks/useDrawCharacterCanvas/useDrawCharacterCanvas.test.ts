import { renderHook } from '@testing-library/react'
import { EmojiReaction, Movement } from '@/app/types'
import drawCharacter from './_utils/drawCharacter'
import useDrawMainCanvas from './useDrawCharacterCanvas'

vi.mock('./_utils/drawCharacter')

describe('useDrawMainCanvas', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('does not draw user if user is undefined', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          user: null,
          movement: { x: 0, y: 0, direction: 'S', isMoving: false },
        }
      )
    )
    expect(drawCharacter).not.toHaveBeenCalled()
  })

  test('does not draw user if the movement is undefined', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          user: { id: 'USER_ID', displayName: 'User', avatar: 'FEMALE_01' },
        }
      )
    )

    expect(drawCharacter).not.toHaveBeenCalled()
  })

  test('draws user', () => {
    const parentElement = document.createElement('div')
    parentElement.style.width = '100px'
    parentElement.style.height = '100px'

    const canvas = document.createElement('canvas')

    const context = {
      clearRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    vi.spyOn(canvas, 'getContext').mockReturnValue(context)

    parentElement.appendChild(canvas)

    const user = {
      id: 'USER_ID',
      displayName: 'User',
      avatar: 'FEMALE_01',
    }

    const emojiReaction: EmojiReaction = {
      emoji: {
        label: 'Thumbs Up',
        unicode: '👍',
      },
      userId: 'user123',
      createdAt: '2023-05-22T15:30:00Z',
    }

    const movement: Movement = { x: 0, y: 0, direction: 'S', isMoving: false }

    renderHook(() =>
      useDrawMainCanvas(
        canvas,
        {
          zoom: 1,
          cameraOffset: { top: 0, left: 0 },
        },
        {
          user,
          movement,
          emojiReaction,
        }
      )
    )

    expect(drawCharacter).toHaveBeenCalledWith(
      context,
      user,
      movement,
      emojiReaction
    )
  })
})

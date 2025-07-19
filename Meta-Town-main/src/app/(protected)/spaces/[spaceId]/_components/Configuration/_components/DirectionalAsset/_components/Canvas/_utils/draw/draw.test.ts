import getAsset, { SPRITE_SIZE } from '@/utils/getAsset'
import draw from '.'

vi.mock('@/utils/getAsset')
const getAssetMock = vi.mocked(getAsset)

describe('draw', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each(['N', 'E', 'S', 'W'] as const)(
    'draws asset in direction %s',
    async (direction) => {
      const canvas = document.createElement('canvas')

      const context = {
        save: jest.fn(),
        drawImage: jest.fn(),
        restore: jest.fn(),
      } as unknown as CanvasRenderingContext2D

      vi.spyOn(canvas, 'getContext').mockReturnValue(context)

      const image = new Image()
      getAssetMock.mockResolvedValue(image)

      const name = 'wall'

      await draw(canvas, name, direction)

      expect(canvas.width).toBe(SPRITE_SIZE)
      expect(canvas.height).toBe(SPRITE_SIZE)

      expect(getAsset).toHaveBeenCalledWith(name)

      expect(context.save).toHaveBeenCalled()

      expect(context.drawImage).toHaveBeenCalledWith(
        image,
        0,
        ['N', 'E', 'S', 'W'].indexOf(direction) * SPRITE_SIZE,
        SPRITE_SIZE,
        SPRITE_SIZE,
        0,
        0,
        SPRITE_SIZE,
        SPRITE_SIZE
      )

      expect(context.restore).toHaveBeenCalled()
    }
  )

  test('does not draw if context is not available', async () => {
    const canvas = document.createElement('canvas')

    vi.spyOn(canvas, 'getContext').mockReturnValue(null)

    await draw(canvas, 'wall', 'N')

    expect(getAsset).not.toHaveBeenCalled()
  })

  test('does not draw if canvas is null', async () => {
    await draw(null, 'chair', 'N')

    expect(getAsset).not.toHaveBeenCalled()
  })
})

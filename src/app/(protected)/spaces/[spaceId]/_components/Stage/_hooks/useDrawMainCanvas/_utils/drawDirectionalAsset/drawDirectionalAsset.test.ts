import { ConfigPosition, Position } from '@/app/types'
import getAsset, { SPRITE_SIZE } from '@/utils/getAsset'
import { TILE_SIZE } from '../../../../consts'
import drawLucideIcon from '../drawLucideIcon'
import drawWall from './drawDirectionalAsset'

vi.mock('@/utils/getAsset')
const getAssetMock = vi.mocked(getAsset)

vi.mock('../drawLucideIcon')

describe('drawDirectionalAsset', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each(['N', 'E', 'S', 'W'] as const)(
    'draws directional asset - %s image',
    (direction) => {
      const context = {
        save: vi.fn(),
        translate: vi.fn(),
        drawImage: vi.fn(),
        restore: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      const position: Position = { x: 1, y: 1, direction }

      const image = new Image()

      getAssetMock.mockReturnValue(image)

      const name = 'wall'
      drawWall(context, name, position)

      expect(getAsset).toHaveBeenCalledWith(name)

      expect(context.save).toHaveBeenCalled()
      expect(context.translate).toHaveBeenCalledWith(
        position.x * TILE_SIZE + TILE_SIZE / 2,
        position.y * TILE_SIZE + TILE_SIZE / 2
      )

      expect(context.drawImage).toHaveBeenCalledWith(
        image,
        0,
        ['N', 'E', 'S', 'W'].indexOf(direction) * SPRITE_SIZE,
        SPRITE_SIZE,
        SPRITE_SIZE,
        SPRITE_SIZE / -2,
        SPRITE_SIZE / -2,
        SPRITE_SIZE,
        SPRITE_SIZE
      )
      expect(context.restore).toHaveBeenCalled()
    }
  )

  test('does not draw directional asset when image is a promise', () => {
    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const position: Position = { x: 1, y: 1, direction: 'N' }

    getAssetMock.mockResolvedValue(new Image())

    drawWall(context, 'wall', position)

    expect(context.save).not.toHaveBeenCalled()
    expect(context.translate).not.toHaveBeenCalled()
    expect(context.drawImage).not.toHaveBeenCalled()
    expect(context.restore).not.toHaveBeenCalled()
  })

  test('draws trash icon if delete config position is provided', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const position: Position = { x: 1, y: 1, direction: 'N' }

    const configPosition: ConfigPosition = {
      ...position,
      type: 'delete',
    }

    drawWall(context, 'wall', position, configPosition)

    expect(drawLucideIcon).toHaveBeenCalledWith(
      context,
      'trash-2',
      configPosition
    )

    expect(getAsset).not.toHaveBeenCalled()
  })
})

import { ConfigPosition, Ground } from '@/app/types'
import getAsset, { SPRITE_SIZE } from '@/utils/getAsset'
import { TILE_SIZE } from '../../../../consts'
import drawLucideIcon from '../drawLucideIcon'
import drawGroundFloor from './drawGroundFloor'

vi.mock('@/utils/getAsset')
const getAssetMock = vi.mocked(getAsset)

vi.mock('../drawLucideIcon')

describe('drawGroundFloor', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test.each(['wood', 'grass'] as const)(
    'draws Ground Floor - %s image',
    (texture) => {
      const context = {
        save: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        drawImage: vi.fn(),
        restore: vi.fn(),
      } as unknown as CanvasRenderingContext2D

      const ground: Ground = { x: 1, y: 1, direction: 'N', texture }

      const image = new Image()

      getAssetMock.mockReturnValue(image)

      drawGroundFloor(context, ground)

      expect(getAsset).toHaveBeenCalled()

      expect(context.save).toHaveBeenCalled()
      expect(context.translate).toHaveBeenCalledWith(
        ground.x * TILE_SIZE + TILE_SIZE / 2,
        ground.y * TILE_SIZE + TILE_SIZE / 2
      )

      expect(context.drawImage).toHaveBeenCalledWith(
        image,
        0,
        ['wood', 'grass'].indexOf(texture) * SPRITE_SIZE,
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

  test('rotates ground if x + y is odd', () => {
    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const ground: Ground = { x: 1, y: 2, direction: 'N', texture: 'grass' }

    const image = new Image()

    getAssetMock.mockReturnValue(image)
    drawGroundFloor(context, ground)

    expect(context.rotate).toHaveBeenCalledWith(Math.PI)
  })

  test('does not rotate ground if x + y is even', () => {
    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const ground: Ground = { x: 2, y: 2, direction: 'N', texture: 'grass' }

    const image = new Image()

    getAssetMock.mockReturnValue(image)
    drawGroundFloor(context, ground)

    expect(context.rotate).not.toHaveBeenCalled()
  })

  test('does not draw ground when image is a promise', () => {
    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const ground: Ground = { x: 1, y: 1, direction: 'N', texture: 'grass' }

    getAssetMock.mockResolvedValue(new Image())

    drawGroundFloor(context, ground)

    expect(context.save).not.toHaveBeenCalled()
    expect(context.translate).not.toHaveBeenCalled()
    expect(context.drawImage).not.toHaveBeenCalled()
    expect(context.restore).not.toHaveBeenCalled()
  })

  test('draws trash icon if delete config position is provided', () => {
    const context = {} as unknown as CanvasRenderingContext2D

    const ground: Ground = { x: 1, y: 1, direction: 'N', texture: 'grass' }

    const configPosition: ConfigPosition = {
      ...ground,
      type: 'delete',
    }

    drawGroundFloor(context, ground, configPosition)

    expect(drawLucideIcon).toHaveBeenCalledWith(
      context,
      'trash-2',
      configPosition
    )

    expect(getAsset).not.toHaveBeenCalled()
  })
})

import { Position } from '@/app/types'
import { ICON_SIZE, TILE_SIZE } from '../../../../consts'

describe('drawLucideIcon', () => {
  afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  test('draws a lucide icon on the canvas', async () => {
    const { default: drawLucideIcon, FACE_ROTATION } = await import(
      './drawLucideIcon'
    )

    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const name = 'cat'
    const position: Position = { x: 10, y: 20, direction: 'E' }

    const cx = position.x * TILE_SIZE + TILE_SIZE / 2
    const cy = position.y * TILE_SIZE + TILE_SIZE / 2
    const angle = (FACE_ROTATION[position.direction] * Math.PI) / 180

    const image = {} as unknown as HTMLImageElement

    const Image = vi.fn().mockReturnValue(image)

    vi.stubGlobal('Image', Image)

    drawLucideIcon(context, name, position)

    expect(image.src).toBe(
      `https://unpkg.com/lucide-static@0.488.0/icons/${name}.svg`
    )

    expect(image.onload).toBeDefined()

    image.onload!({} as Event)

    expect(context.save).toHaveBeenCalled()
    expect(context.translate).toHaveBeenCalledWith(cx, cy)
    expect(context.rotate).toHaveBeenCalledWith(angle)

    expect(context.drawImage).toHaveBeenCalledWith(
      image,
      -ICON_SIZE / 2,
      -ICON_SIZE / 2,
      ICON_SIZE,
      ICON_SIZE
    )
    expect(context.restore).toHaveBeenCalled()
  })

  test('draws a lucide icon from cache', async () => {
    const { default: drawLucideIcon } = await import('./drawLucideIcon')

    const context = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    const name = 'cat'
    const position: Position = { x: 10, y: 20, direction: 'E' }

    const image = {} as unknown as HTMLImageElement

    const Image = vi.fn().mockImplementation(() => image)

    vi.stubGlobal('Image', Image)

    drawLucideIcon(context, name, position)

    expect(image.onload).toBeDefined()
    image.onload!({} as Event)

    drawLucideIcon(context, name, position)

    expect(Image).toHaveBeenCalledTimes(1)

    expect(context.drawImage).toHaveBeenNthCalledWith(
      2,
      image,
      -ICON_SIZE / 2,
      -ICON_SIZE / 2,
      ICON_SIZE,
      ICON_SIZE
    )
  })
})

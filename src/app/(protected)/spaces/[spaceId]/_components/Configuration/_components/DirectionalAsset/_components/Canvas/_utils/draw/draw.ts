import { Direction } from '@/app/types'
import getAsset, { SPRITE_SIZE } from '@/utils/getAsset'

const draw = async (
  canvas: HTMLCanvasElement | null,
  name: 'wall' | 'chair',
  direction: Direction
): Promise<void> => {
  if (!canvas) {
    return
  }

  canvas.width = SPRITE_SIZE
  canvas.height = SPRITE_SIZE

  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  const image = await getAsset(name)

  const sx = 0
  const sy = ['N', 'E', 'S', 'W'].indexOf(direction) * SPRITE_SIZE

  context.save()

  context.drawImage(
    image,
    sx,
    sy,
    SPRITE_SIZE,
    SPRITE_SIZE,
    0,
    0,
    SPRITE_SIZE,
    SPRITE_SIZE
  )

  context.restore()
}

export default draw

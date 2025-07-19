import { CameraOffset, Movement, EmojiReaction } from '@/app/types'
import useDrawCanvas from '../../../../_hooks/useDrawCanvas'
import drawCharacter from './_utils/drawCharacter'

const useDrawCharacterCanvas = (
  canvas: HTMLCanvasElement | null,
  config: {
    zoom: number
    cameraOffset: CameraOffset
  },
  {
    user,
    movement,
    emojiReaction,
  }: {
    user?: {
      id: string
      displayName: string
      avatar: string
    } | null
    movement?: Movement
    emojiReaction?: EmojiReaction
  }
): void =>
  useDrawCanvas(canvas, config, (context) => {
    if (!user || !movement) {
      return
    }

    drawCharacter(context, user, movement, emojiReaction)
  })

export default useDrawCharacterCanvas

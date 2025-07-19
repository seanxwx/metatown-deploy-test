import { useParams } from 'next/navigation'
import { FC, useRef } from 'react'
import { CameraOffset, Movement } from '@/app/types'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useSpace from '@/hooks/useSpace'
import useUser from '@/hooks/useUser'
import Canvas from '../Canvas'
import useDrawCharacterCanvas from './_hooks/useDrawCharacterCanvas'

interface Props {
  userId: string
  movement?: Movement
  canvasConfig: {
    zoom: number
    cameraOffset: CameraOffset
  }
}

const Character: FC<Props> = ({
  userId,
  movement = undefined,
  canvasConfig,
}) => {
  const ref = useRef<HTMLCanvasElement>(null)

  const { data: user } = useUser(userId)

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)

  const { data: emojiReaction } = useEmojiReaction(space?.id)

  useDrawCharacterCanvas(ref.current, canvasConfig, {
    user,
    movement,
    emojiReaction,
  })

  return <Canvas ref={ref} aria-label="Character Canvas" />
}

export default Character

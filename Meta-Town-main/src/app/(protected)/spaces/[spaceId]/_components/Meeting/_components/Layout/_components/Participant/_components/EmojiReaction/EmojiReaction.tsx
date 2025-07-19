import { useParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import useEmojiReaction from '@/hooks/useEmojiReaction'
import useUser from '@/hooks/useUser'
import useSpace from '@/hooks/useSpace'

interface Props {
  userId: string
}

const EmojiReaction: FC<Props> = ({ userId }) => {
  const [isShowEmoji, setIsShowEmoji] = useState(false)
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: user } = useUser(userId)
  const { data: emojiReaction } = useEmojiReaction(space?.id)

  useEffect(() => {
    if (emojiReaction?.userId !== userId) {
      return
    }

    const expireTime = new Date(emojiReaction.createdAt).getTime() + 3000

    if (Date.now() > expireTime) {
      return
    }

    setIsShowEmoji(true)

    const timer = setTimeout(() => {
      setIsShowEmoji(false)
    }, expireTime - Date.now())

    return (): void => clearTimeout(timer)
  }, [emojiReaction, userId])

  if (!emojiReaction || !user || !isShowEmoji || !space) {
    return null
  }

  const { emoji } = emojiReaction

  return (
    <div className="absolute right-4 top-2 h-8 w-8 rounded-full">
      <span
        className="text-2xl"
        role="img"
        aria-label={`${emoji.label} from ${user.displayName}`}
      >
        {emoji.unicode}
      </span>
    </div>
  )
}

export default EmojiReaction

import { FC } from 'react'
import { useParams } from 'next/navigation'
import Dropdown from '@/components/Dropdown'
import IconButton from '@/components/IconButton'
import EmojiPicker from '@/components/EmojiPicker'
import useSpace from '@/hooks/useSpace'
import useSessionUser from '@/hooks/useSessionUser'
import broadcastEmojiReaction from '@/db/broadcastEmojiReaction'

const EmojiTrigger: FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: sessionUser } = useSessionUser()

  if (!sessionUser || !space) {
    return null
  }

  return (
    <Dropdown
      trigger={(toggle, isOpen) => (
        <IconButton
          onClick={toggle}
          icon="smile"
          label="Emoji"
          variant={isOpen ? 'secondary' : 'primary'}
          circle
          tooltip={{ position: 'top' }}
        />
      )}
      size="large"
      position="top-left"
    >
      {(toggle) => (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            void broadcastEmojiReaction(space.id, {
              emoji,
              userId: sessionUser.id,
            })
            toggle()
          }}
        />
      )}
    </Dropdown>
  )
}

export default EmojiTrigger

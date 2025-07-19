import { FC } from 'react'
import { createPortal } from 'react-dom'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import VideoFeed from '@/components/VideoFeed'
import Avatar from '@/components/Avatar'
import useUser from '@/hooks/useUser'
import useConsume from '../../_hooks/useConsume'

interface Props {
  mediasoupClient: MediasoupClient
  producer?: {
    producerId: string
    state: 'ACTIVE' | 'PAUSED'
  }
  userId: string
  portal: HTMLElement | null
}

const Video: FC<Props> = ({
  mediasoupClient,
  producer = undefined,
  userId,
  portal,
}) => {
  const video = useConsume(
    mediasoupClient,
    producer?.state === 'ACTIVE' ? producer.producerId : null
  )

  const { data: user } = useUser(userId)

  if (!portal) {
    return null
  }

  return createPortal(
    video ? (
      <VideoFeed
        className="object-fit absolute inset-0 -z-10 size-full"
        stream={video}
      />
    ) : (
      user && <Avatar character={user.avatar} name={user.displayName} />
    ),
    portal
  )
}

export default Video

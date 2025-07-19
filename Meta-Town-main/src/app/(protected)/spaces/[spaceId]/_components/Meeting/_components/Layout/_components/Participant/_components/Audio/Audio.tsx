import { FC, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import IconButton from '@/components/IconButton'
import VideoFeed from '@/components/VideoFeed'
import updateProducer from '@/db/updateProducer'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useSessionUser from '@/hooks/useSessionUser'
import useConsume from '../../_hooks/useConsume'
import UserInfo from './_components/UserInfo'
import useVolume from './_hooks/useVolume'

export const THRESHOLD = 35

export const ACTIVE = ['ring-2', 'ring-green-500'] as const

interface Props {
  mediasoupClient: MediasoupClient
  recorder?: {
    addTrack: (track: MediaStreamTrack) => void
    removeTrack: (track: MediaStreamTrack) => void
  } | null
  producer?: {
    id: string
    producerId: string
    state: 'ACTIVE' | 'PAUSED'
  }
  userId: string
  onSpeak: (userId: string) => void
  portal: HTMLElement | null
}

const Audio: FC<Props> = ({
  mediasoupClient,
  recorder = undefined,
  producer = undefined,
  userId,
  portal,
  onSpeak,
}) => {
  const { data: sessionUser } = useSessionUser()

  const audio = useConsume(
    mediasoupClient,
    producer?.state === 'ACTIVE' ? producer.producerId : null
  )

  const volume = useVolume(audio)
  const shouldSuppress = volume < THRESHOLD

  const onSpeakRef = useRef(onSpeak)

  useEffect(() => {
    if (!audio || !recorder) {
      return
    }

    const track = audio.getAudioTracks()[0]

    recorder.addTrack(track)

    return (): void => {
      recorder.removeTrack(track)
    }
  }, [audio, recorder])

  useEffect(() => {
    onSpeakRef.current = onSpeak
  }, [onSpeak])

  useEffect(() => {
    if (shouldSuppress) {
      return
    }

    onSpeakRef.current(userId)
  }, [userId, shouldSuppress])

  useEffect(() => {
    if (shouldSuppress) {
      return
    }

    portal?.classList.add(...ACTIVE)

    return (): void => {
      portal?.classList.remove(...ACTIVE)
    }
  }, [portal, shouldSuppress])

  useEffect(() => {
    portal?.classList.add('group/audio')
  }, [portal])

  return (
    <>
      {audio && (
        <VideoFeed
          className="hidden"
          isMuted={sessionUser?.id === userId}
          stream={audio}
        />
      )}
      {portal &&
        createPortal(
          <>
            <UserInfo isMuted={!audio} userId={userId} />
            {producer?.state === 'ACTIVE' && (
              <div className="absolute bottom-2 left-2 hidden group-hover/audio:block">
                <IconButton
                  icon="mic-off"
                  label="Mute"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    void updateProducer(producer.id, { state: 'PAUSED' })
                  }}
                />
              </div>
            )}
          </>,
          portal
        )}
    </>
  )
}

export default Audio

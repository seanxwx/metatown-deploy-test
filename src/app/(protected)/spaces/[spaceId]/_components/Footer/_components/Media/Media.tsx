import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, FC, useEffect, useState } from 'react'
import ButtonConfigurable from '@/components/ButtonConfigurable'
import IconButton from '@/components/IconButton'
import VideoFeed from '@/components/VideoFeed'
import upsertProducer from '@/db/upsertProducer'
import Dropdown from '@/components/Dropdown'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import deleteProducer from '@/db/deleteProducer'
import useProducers from '@/hooks/useProducers'
import AvailableDevices from './_components/AvailableDevices'
import useMedia, { Options } from './_hooks/useMedia'

type Props = {
  mediasoupClient: MediasoupClient
  icon: (
    stream: MediaStream | null
  ) => ComponentProps<typeof IconButton>['icon']
  label: string
} & Options

interface Producer {
  id: string
  replaceStream: (mediaStream: MediaStream) => Promise<void>
}

interface MediaSession {
  stream: MediaStream | null
  producer: Producer
}

const Media: FC<Props> = ({ icon, label, mediasoupClient, ...props }) => {
  const { kind } = props

  const [isLoading, setIsLoading] = useState(false)
  const [deviceId, setDeviceId] = useState<string | null>(null)

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: space } = useSpace(spaceId)
  const { data: sessionUser } = useSessionUser()
  const [mediaSession, setMediaSession] = useState<MediaSession | null>(null)

  const { requestMediaStream, releaseMediaStream } = useMedia(props)

  useEffect(() => {
    if (!mediaSession?.stream) {
      return
    }

    const handleEnded = async (): Promise<void> => {
      await deleteProducer(mediaSession.producer.id)
      setMediaSession(null)
    }

    mediaSession.stream.getTracks().forEach((track) => {
      track.addEventListener('ended', () => {
        void handleEnded()
      })
    })
  }, [mediaSession])

  const { data: producers } = useProducers(space?.id)

  useEffect(() => {
    if (!mediaSession?.producer) {
      return
    }

    const currentProducer = producers?.find(
      (producer) => producer.producerId === mediaSession.producer.id
    )

    if (currentProducer?.state !== 'PAUSED') {
      return
    }

    setMediaSession({
      producer: mediaSession.producer,
      stream: null,
    })
  }, [producers, mediaSession?.producer])

  if (!space || !sessionUser) {
    return null
  }

  const start = async (): Promise<MediaSession | null> => {
    const mediaStream = await requestMediaStream(deviceId)

    if (!mediaStream) {
      return null
    }

    const producer = await mediasoupClient.produce(mediaStream)

    await upsertProducer({
      userId: sessionUser.id,
      spaceId: space.id,
      producerId: producer.id,
      state: 'ACTIVE',
      kind,
    })

    const session = { stream: mediaStream, producer }
    setMediaSession(session)

    return session
  }

  const resume = async (producer: Producer): Promise<void> => {
    const mediaStream = await requestMediaStream(deviceId)

    if (!mediaStream) {
      return
    }

    await producer.replaceStream(mediaStream)

    await upsertProducer({
      userId: sessionUser.id,
      spaceId: space.id,
      producerId: producer.id,
      state: 'ACTIVE',
      kind,
    })

    setMediaSession({
      stream: mediaStream,
      producer,
    })
  }

  const pause = async (
    producer: Producer,
    mediaStream: MediaStream
  ): Promise<void> => {
    releaseMediaStream(mediaStream)

    await upsertProducer({
      userId: sessionUser.id,
      spaceId: space.id,
      producerId: producer.id,
      state: 'PAUSED',
      kind,
    })

    setMediaSession({
      stream: null,
      producer,
    })
  }

  const handleClick = async (): Promise<void> => {
    setIsLoading(true)

    try {
      if (!mediaSession?.producer) {
        await start()

        return
      }

      if (!mediaSession.stream) {
        await resume(mediaSession.producer)

        return
      }

      await pause(mediaSession.producer, mediaSession.stream)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeviceSelect = async (newDeviceId: string): Promise<void> => {
    if (newDeviceId === deviceId) {
      return
    }

    setDeviceId(newDeviceId)
    setIsLoading(true)

    try {
      if (!mediaSession?.stream) {
        return
      }

      releaseMediaStream(mediaSession.stream)

      const mediaStream = await requestMediaStream(newDeviceId)

      if (!mediaStream) {
        return
      }

      await mediaSession.producer.replaceStream(mediaStream)

      setMediaSession({
        ...mediaSession,
        stream: mediaStream,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {kind === 'video' && (isLoading || mediaSession?.stream) && (
        <div className="relative">
          <div className="absolute bottom-full left-1/2 mb-2 flex aspect-video w-[200px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-lg bg-gray-300 shadow-lg">
            {mediaSession?.stream && <VideoFeed stream={mediaSession.stream} />}
            {isLoading && (
              <Loader
                role="status"
                aria-label="Loading"
                className="animate-spin"
                size={32}
              />
            )}
          </div>
        </div>
      )}

      {(kind === 'video' || kind === 'audio') && (
        <Dropdown
          trigger={(toggle) => (
            <ButtonConfigurable
              tooltip={{ position: 'top' }}
              variant={mediaSession?.stream ? 'success' : 'danger'}
              icon={icon(mediaSession?.stream ?? null)}
              label={label}
              onClick={() => void handleClick()}
              disabled={isLoading}
              onConfig={toggle}
            />
          )}
          position="top-left"
        >
          <AvailableDevices
            onSelectDevice={(id) => void handleDeviceSelect(id)}
            selectedDeviceId={deviceId}
            kind={kind}
          />
        </Dropdown>
      )}

      {kind === 'screen' && (
        <IconButton
          tooltip={{ position: 'top' }}
          variant={mediaSession?.stream ? 'success' : 'danger'}
          icon={icon(mediaSession?.stream ?? null)}
          label={label}
          onClick={() => void handleClick()}
          disabled={isLoading}
        />
      )}
    </div>
  )
}

export default Media

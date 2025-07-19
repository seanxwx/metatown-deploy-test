import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import IconButton from '@/components/IconButton'
import VideoFeed from '@/components/VideoFeed'
import useDrag from '@/hooks/useDrag'
import { MediasoupClient } from '@/hooks/useMediasoupClient'
import useConsume from '../../_hooks/useConsume'
import UserSharing from './_components/UserSharing'

interface Props {
  mediasoupClient: MediasoupClient
  recorder?: {
    addTrack: (track: MediaStreamTrack) => void
    removeTrack: (track: MediaStreamTrack) => void
  } | null
  producer?: {
    producerId: string
    state: 'ACTIVE' | 'PAUSED'
  }
  userId: string
  portal: HTMLElement | null
}

const Screen: FC<Props> = ({
  mediasoupClient,
  recorder = undefined,
  producer = undefined,
  userId,
  portal,
}) => {
  const screen = useConsume(
    mediasoupClient,
    producer?.state === 'ACTIVE' ? producer.producerId : null
  )

  useEffect(() => {
    if (!screen || !recorder) {
      return
    }

    const track = screen.getVideoTracks()[0]

    recorder.addTrack(track)

    return (): void => {
      recorder.removeTrack(track)
    }
  }, [recorder, screen])

  const [zoom, setZoom] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const { targetRef, style, reset } = useDrag()

  const handleZoom = (scale: number): void => {
    setIsZoomed(true)

    setZoom((previousZoom) =>
      Math.min(Math.max(previousZoom + scale, 0.5), 1.5)
    )
  }

  const handleResetZoom = (): void => {
    setIsZoomed(false)
    setZoom(1)
    reset()
  }

  if (!portal) {
    return null
  }

  return createPortal(
    <>
      {screen && (
        <>
          <div
            className={clsx(
              'cursor-drag absolute inset-0 -z-10 size-full',
              isZoomed && 'cursor-grab'
            )}
            role="region"
            aria-label="Screen"
            ref={isZoomed ? targetRef : null}
            style={
              isZoomed
                ? {
                    ...style,
                    transform: `scale(${zoom})`,
                  }
                : {}
            }
          >
            <VideoFeed className="size-full" stream={screen} />
          </div>
          <div className="absolute bottom-2 left-2 hidden gap-1 group-hover/placeholder:flex">
            <IconButton
              icon="zoom-out"
              label="Zoom Out"
              tooltip={{ position: 'top-left' }}
              variant="secondary"
              size="small"
              onClick={() => handleZoom(-0.1)}
            />
            <IconButton
              icon="zoom-in"
              label="Zoom In"
              tooltip={{ position: 'top-left' }}
              variant="secondary"
              size="small"
              onClick={() => handleZoom(0.1)}
            />
            {isZoomed && (
              <IconButton
                icon="x-octagon"
                label="Reset Zoom"
                tooltip={{ position: 'top-left' }}
                variant="secondary"
                size="small"
                onClick={handleResetZoom}
              />
            )}
          </div>
        </>
      )}
      <UserSharing userId={userId} />
    </>,
    portal
  )
}

export default Screen

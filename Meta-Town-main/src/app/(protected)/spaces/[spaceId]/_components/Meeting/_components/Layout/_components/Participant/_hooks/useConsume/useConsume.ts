import { Consumer } from 'mediasoup-client/types'
import { useEffect, useState } from 'react'
import { MediasoupClient } from '@/hooks/useMediasoupClient'

const useConsume = (
  mediasoupClient: MediasoupClient,
  producerId: string | null
): MediaStream | null => {
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    let consumer: Consumer | null = null

    const handleConsume = async (): Promise<void> => {
      setStream(null)

      if (!producerId) {
        return
      }

      consumer = await mediasoupClient.consume(producerId)

      if (!consumer) {
        return
      }

      const mediaStream = new MediaStream()
      mediaStream.addTrack(consumer.track)

      setStream(mediaStream)
    }

    void handleConsume()

    return (): void => {
      if (!consumer) {
        return
      }

      consumer.close()
    }
  }, [mediasoupClient, producerId])

  return stream
}

export default useConsume

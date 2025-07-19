import { useEffect, useState } from 'react'
import connectSocket from './utils/connectSocket'
import createConsumeHandler from './utils/createConsumeHandler'
import createDevice from './utils/createDevice'
import createProduceHandler from './utils/createProduceHandler'
import createRecvTransport from './utils/createRecvTransport'
import createSendTransport from './utils/createSendTransport'

export interface MediasoupClient {
  consume: ReturnType<typeof createConsumeHandler>
  produce: ReturnType<typeof createProduceHandler>
}

const useMediasoupClient = (): MediasoupClient | null => {
  const [mediasoupClient, setMediasoupClient] =
    useState<MediasoupClient | null>(null)

  useEffect(() => {
    const handleCreateMediasoupClient = async (): Promise<void> => {
      const socket = await connectSocket()

      if (!socket) {
        return
      }

      const device = await createDevice(socket)
      const sendTransport = await createSendTransport(socket, device)
      const recvTransport = await createRecvTransport(socket, device)

      const produce = createProduceHandler(socket, sendTransport)

      const consume = createConsumeHandler(socket, recvTransport, {
        rtpCapabilities: device.rtpCapabilities,
      })

      setMediasoupClient({
        consume,
        produce,
      })
    }

    void handleCreateMediasoupClient()
  }, [])

  return mediasoupClient
}

export default useMediasoupClient

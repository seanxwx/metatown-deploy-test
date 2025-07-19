import { Consumer, RtpCapabilities, Transport } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import getConsumerOptions from '../getConsumerOptions'

type Consume = (producerId: string) => Promise<Consumer | null>

const createConsumeHandler =
  (
    socket: Socket,
    recvTransport: Transport,
    { rtpCapabilities }: { rtpCapabilities: RtpCapabilities }
  ): Consume =>
  async (producerId) => {
    try {
      const { id, kind, rtpParameters } = await getConsumerOptions(socket, {
        transportId: recvTransport.id,
        producerId,
        rtpCapabilities,
      })

      const consumer = await recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      })

      return consumer
    } catch {
      return null
    }
  }

export default createConsumeHandler

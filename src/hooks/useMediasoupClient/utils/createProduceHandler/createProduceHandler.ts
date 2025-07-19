import { Transport } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import createProducerId from '../createProducerId'

type Produce = (mediaStream: MediaStream) => Promise<{
  id: string
  replaceStream: (newMediaStream: MediaStream) => Promise<void>
}>

const createProduceHandler = (
  socket: Socket,
  sendTransport: Transport
): Produce => {
  sendTransport.on('produce', (data, callback) => {
    const handleProduce = async (): Promise<void> => {
      const producerId = await createProducerId(socket, {
        ...data,
        transportId: sendTransport.id,
      })

      callback({ id: producerId })
    }

    void handleProduce()
  })

  return async (mediaStream) => {
    const track = mediaStream.getTracks()[0]

    const producer = await sendTransport.produce({ track })

    const replaceStream = async (newMediaStream: MediaStream): Promise<void> =>
      producer.replaceTrack({ track: newMediaStream.getTracks()[0] })

    return {
      id: producer.id,
      replaceStream,
    }
  }
}

export default createProduceHandler

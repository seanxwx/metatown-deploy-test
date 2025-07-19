import { MediaKind, RtpParameters } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'

interface Data {
  transportId: string
  kind: MediaKind
  rtpParameters: RtpParameters
}

const createProducerId = async (socket: Socket, data: Data): Promise<string> =>
  new Promise((resolve) => {
    socket.emit('produce', data, ({ id }: { id: string }) => {
      resolve(id)
    })
  })

export default createProducerId

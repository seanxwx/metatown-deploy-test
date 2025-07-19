import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'

interface Data {
  transportId: string
  producerId: string
  rtpCapabilities: RtpCapabilities
}

interface Options {
  id: string
  kind: MediaKind
  rtpParameters: RtpParameters
}

const getConsumerOptions = (socket: Socket, data: Data): Promise<Options> =>
  new Promise((resolve, reject) => {
    socket.emit('consume', data, (response: { error: string } | Options) => {
      if ('error' in response) {
        reject(new Error())

        return
      }

      resolve(response)
    })
  })

export default getConsumerOptions

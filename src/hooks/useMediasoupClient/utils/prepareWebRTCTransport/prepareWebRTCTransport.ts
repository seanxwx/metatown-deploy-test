import { TransportOptions } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'

export const ICE_SERVERS = [
  {
    urls: 'stun:stun.l.google.com:19302',
  },
]

const prepareWebRTCTransport = (socket: Socket): Promise<TransportOptions> =>
  new Promise((resolve) => {
    socket.emit('createTransport', (transportOptions: TransportOptions) => {
      resolve({
        ...transportOptions,
        iceServers: ICE_SERVERS,
      })
    })
  })

export default prepareWebRTCTransport

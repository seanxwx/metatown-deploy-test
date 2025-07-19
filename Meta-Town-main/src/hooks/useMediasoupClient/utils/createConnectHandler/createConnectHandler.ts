import { DtlsParameters } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'

type Connect = (
  params: { dtlsParameters: DtlsParameters },
  callback: () => void
) => void

const createConnectHandler =
  (socket: Socket, transportId: string): Connect =>
  ({ dtlsParameters }, callback) => {
    socket.emit('connectTransport', { transportId, dtlsParameters }, callback)
  }

export default createConnectHandler

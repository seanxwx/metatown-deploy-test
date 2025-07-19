import { Device, Transport } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import prepareWebRTCTransport from '../prepareWebRTCTransport'
import createConnectHandler from '../createConnectHandler'

const createRecvTransport = async (
  socket: Socket,
  device: Device
): Promise<Transport> => {
  const transportOptions = await prepareWebRTCTransport(socket)

  const recvTransport = device.createRecvTransport(transportOptions)

  const connectHandler = createConnectHandler(socket, transportOptions.id)
  recvTransport.on('connect', connectHandler)

  return recvTransport
}

export default createRecvTransport

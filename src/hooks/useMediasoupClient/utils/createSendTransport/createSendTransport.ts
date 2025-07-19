import { Device, Transport } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import prepareWebRTCTransport from '../prepareWebRTCTransport'
import createConnectHandler from '../createConnectHandler'

const createSendTransport = async (
  socket: Socket,
  device: Device
): Promise<Transport> => {
  const transportOptions = await prepareWebRTCTransport(socket)

  const sendTransport = device.createSendTransport(transportOptions)

  const connectHandler = createConnectHandler(socket, transportOptions.id)
  sendTransport.on('connect', connectHandler)

  return sendTransport
}

export default createSendTransport

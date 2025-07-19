import { Socket } from 'socket.io-client'
import { Device, types } from 'mediasoup-client'

const createDevice = async (socket: Socket): Promise<Device> =>
  new Promise((resolve) => {
    socket.emit(
      'getRouterRtpCapabilities',
      async (rtpCapabilities: types.RtpCapabilities) => {
        const device = new Device()
        await device.load({ routerRtpCapabilities: rtpCapabilities })
        resolve(device)
      }
    )
  })

export default createDevice

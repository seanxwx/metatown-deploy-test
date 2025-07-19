import { Socket } from 'socket.io-client'
import { Device } from 'mediasoup-client'
import { RtpCapabilities } from 'mediasoup-client/types'
import createDevice from './createDevice'

vi.mock('mediasoup-client', () => ({
  Device: vi.fn(),
}))
const DeviceMock = vi.mocked(Device)

describe('createDevice', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('creates device by using socket getRouterRtpCapabilities', async () => {
    const routerRtpCapabilities = {}

    const socket = {
      emit: vi.fn(
        (_event, cb: (routerRtpCapabilities: RtpCapabilities) => void) =>
          cb(routerRtpCapabilities)
      ),
    } as unknown as Socket

    const device = {
      load: vi.fn(),
    }

    DeviceMock.mockImplementation(() => device as unknown as Device)

    const result = await createDevice(socket)

    expect(result).toBe(device)
    expect(socket.emit).toBeCalledWith(
      'getRouterRtpCapabilities',
      expect.any(Function)
    )

    expect(socket.emit).toBeCalledWith(
      'getRouterRtpCapabilities',
      expect.any(Function)
    )
    expect(DeviceMock).toHaveBeenCalled()
    expect(device.load).toHaveBeenCalledWith({ routerRtpCapabilities })
  })
})

import { Device } from 'mediasoup-client'
import { TransportOptions } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import createConnectHandler from '../createConnectHandler'
import prepareWebRTCTransport from '../prepareWebRTCTransport'
import createSendTransport from './createSendTransport'

vi.mock('../prepareWebRTCTransport')
const prepareWebRTCTransportMock = vi.mocked(prepareWebRTCTransport)

vi.mock('../createConnectHandler')
const createConnectHandlerMock = vi.mocked(createConnectHandler)

describe('createSendTransport', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('creates send transport', async () => {
    const transportOptions = {} as TransportOptions
    prepareWebRTCTransportMock.mockResolvedValue(transportOptions)

    const connectHandler = vi.fn()
    createConnectHandlerMock.mockReturnValue(connectHandler)

    const sendTransport = {
      on: vi.fn(),
    }

    const device = {
      createSendTransport: vi.fn().mockReturnValue(sendTransport),
    } as unknown as Device

    const socket = {} as Socket

    const result = await createSendTransport(socket, device)

    expect(prepareWebRTCTransport).toHaveBeenCalledWith(socket)
    expect(device.createSendTransport).toHaveBeenCalledWith(transportOptions)
    expect(sendTransport.on).toHaveBeenCalledWith('connect', connectHandler)

    expect(result).toBe(sendTransport)
  })
})

import { Device } from 'mediasoup-client'
import { TransportOptions } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import createConnectHandler from '../createConnectHandler'
import prepareWebRTCTransport from '../prepareWebRTCTransport'
import createRecvTransport from './createRecvTransport'

vi.mock('../prepareWebRTCTransport')
const prepareWebRTCTransportMock = vi.mocked(prepareWebRTCTransport)

vi.mock('../createConnectHandler')
const createConnectHandlerMock = vi.mocked(createConnectHandler)

describe('createRecvTransport', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('creates recv transport', async () => {
    const transportOptions = {} as TransportOptions
    prepareWebRTCTransportMock.mockResolvedValue(transportOptions)

    const connectHandler = vi.fn()
    createConnectHandlerMock.mockReturnValue(connectHandler)

    const recvTransport = {
      on: vi.fn(),
    }

    const device = {
      createRecvTransport: vi.fn().mockReturnValue(recvTransport),
    } as unknown as Device

    const socket = {} as Socket

    const result = await createRecvTransport(socket, device)

    expect(prepareWebRTCTransport).toHaveBeenCalledWith(socket)
    expect(device.createRecvTransport).toHaveBeenCalledWith(transportOptions)
    expect(recvTransport.on).toHaveBeenCalledWith('connect', connectHandler)

    expect(result).toBe(recvTransport)
  })
})

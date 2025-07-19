import { renderHook, waitFor } from '@testing-library/react'
import { Device } from 'mediasoup-client'
import { Transport } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import useMediasoupClient from './useMediasoupClient'
import connectSocket from './utils/connectSocket'
import createConsumeHandler from './utils/createConsumeHandler'
import createDevice from './utils/createDevice'
import createProduceHandler from './utils/createProduceHandler'
import createRecvTransport from './utils/createRecvTransport'
import createSendTransport from './utils/createSendTransport'

vi.mock('./utils/connectSocket')
const connectSocketMock = vi.mocked(connectSocket)

vi.mock('./utils/createDevice')
const createDeviceMock = vi.mocked(createDevice)

vi.mock('./utils/createRecvTransport')
const createRecvTransportMock = vi.mocked(createRecvTransport)

vi.mock('./utils/createSendTransport')
const createSendTransportMock = vi.mocked(createSendTransport)

vi.mock('./utils/createProduceHandler')
const createProduceHandlerMock = vi.mocked(createProduceHandler)

vi.mock('./utils/createConsumeHandler')
const createConsumeHandlerMock = vi.mocked(createConsumeHandler)

describe('useMediasoupClient', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns null if socket is not connected', () => {
    connectSocketMock.mockResolvedValue(null)

    const { result } = renderHook(() => useMediasoupClient())

    expect(result.current).toBeNull()
  })

  test('returns mediasoup client', async () => {
    const socket = {} as Socket
    connectSocketMock.mockResolvedValue(socket)

    const device = {} as Device
    createDeviceMock.mockResolvedValue(device)

    const sendTransport = {
      id: 'SEND_TRANSPORT_ID',
    } as Transport
    createSendTransportMock.mockResolvedValue(sendTransport)

    const recvTransport = {
      id: 'RECV_TRANSPORT_ID',
    } as Transport
    createRecvTransportMock.mockResolvedValue(recvTransport)

    const produce = vi.fn()
    createProduceHandlerMock.mockReturnValue(produce)

    const consume = vi.fn()
    createConsumeHandlerMock.mockReturnValue(consume)

    const { result } = renderHook(() => useMediasoupClient())

    await waitFor(() =>
      expect(result.current).toEqual({
        consume,
        produce,
      })
    )

    expect(createDevice).toHaveBeenCalledWith(socket)
    expect(createSendTransport).toHaveBeenCalledWith(socket, device)
    expect(createRecvTransport).toHaveBeenCalledWith(socket, device)
    expect(createConsumeHandler).toHaveBeenCalledWith(socket, recvTransport, {
      rtpCapabilities: device.rtpCapabilities,
    })
  })
})

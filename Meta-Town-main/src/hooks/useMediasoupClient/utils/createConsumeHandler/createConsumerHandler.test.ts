import {
  RtpCapabilities,
  RtpParameters,
  Transport,
} from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import getConsumerOptions from '../getConsumerOptions'
import createConsumeHandler from './createConsumeHandler'

vi.mock('../getConsumerOptions')
const getConsumerOptionsMock = vi.mocked(getConsumerOptions)

describe('createConsumeHandler', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('creates consume handler', () => {
    const consumeHandler = createConsumeHandler({} as Socket, {} as Transport, {
      rtpCapabilities: {} as RtpCapabilities,
    })

    expect(consumeHandler).toBeInstanceOf(Function)
  })

  test('consumes media', async () => {
    const socket = {} as Socket

    const consumerOptions = {
      id: 'CONSUMER_ID',
      kind: 'video',
      rtpParameters: {} as RtpParameters,
    } as const

    const track = {} as MediaStreamTrack

    const recvTransport = {
      id: 'RECV_TRANSPORT_ID',
      consume: vi.fn().mockResolvedValue({ track }),
    } as unknown as Transport

    const rtpCapabilities = {} as RtpCapabilities

    getConsumerOptionsMock.mockResolvedValue(consumerOptions)

    const consumeHandler = createConsumeHandler(socket, recvTransport, {
      rtpCapabilities,
    })

    const producerId = 'PRODUCER_ID'

    const consumer = await consumeHandler(producerId)

    expect(consumer).toEqual({ track })

    expect(getConsumerOptions).toHaveBeenCalledWith(socket, {
      transportId: recvTransport.id,
      producerId,
      rtpCapabilities,
    })

    expect(recvTransport.consume).toHaveBeenCalledWith({
      id: consumerOptions.id,
      producerId,
      kind: consumerOptions.kind,
      rtpParameters: consumerOptions.rtpParameters,
    })
  })

  test('returns null if can not consume', async () => {
    const socket = {} as Socket

    const recvTransport = {
      id: 'RECV_TRANSPORT_ID',
      consume: vi.fn(),
    } as unknown as Transport

    const rtpCapabilities = {} as RtpCapabilities

    getConsumerOptionsMock.mockRejectedValue(new Error())

    const consumeHandler = createConsumeHandler(socket, recvTransport, {
      rtpCapabilities,
    })

    const producerId = 'PRODUCER_ID'

    const consumer = await consumeHandler(producerId)

    expect(consumer).toBeNull()

    expect(recvTransport.consume).not.toHaveBeenCalled()
  })
})

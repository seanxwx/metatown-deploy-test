import { MediaKind, RtpParameters, Transport } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import createProducerId from '../createProducerId'
import createProduceHandler from './createProduceHandler'

vi.mock('../createProducerId')
const createProducerIdMock = vi.mocked(createProducerId)

describe('createProduceHandler', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('creates produce handler', () => {
    const sendTransport = {
      id: 'SEND_TRANSPORT_ID',
      on: vi.fn(),
      produce: vi.fn(),
    } as unknown as Transport

    const produceHandler = createProduceHandler({} as Socket, sendTransport)

    expect(sendTransport.on).toHaveBeenCalledWith(
      'produce',
      expect.any(Function)
    )

    expect(sendTransport.produce).not.toHaveBeenCalled()

    expect(produceHandler).toBeInstanceOf(Function)
  })

  test.each([['video'], ['audio']] as const)(
    'produces %s media',
    async (kind) => {
      const socket = {} as Socket

      const producerId = 'PRODUCER_ID'
      createProducerIdMock.mockResolvedValue(producerId)

      const data = {
        kind,
        rtpParameters: {} as RtpParameters,
      } as const

      const callback = vi.fn()

      const sendTransport = {
        id: 'SEND_TRANSPORT_ID',
        on: vi
          .fn()
          .mockImplementation(
            (
              _event,
              onProduce: (
                data: { kind: MediaKind; rtpParameters: RtpParameters },
                callback: () => void
              ) => void
            ) => {
              onProduce(data, callback)
            }
          ),
        produce: vi.fn().mockResolvedValue({ id: producerId }),
      } as unknown as Transport

      const produceHandler = createProduceHandler(socket, sendTransport)

      const track = { kind }

      const mediaStream = {
        getTracks: vi.fn().mockReturnValue([track]),
      } as unknown as MediaStream

      const producer = await produceHandler(mediaStream)

      expect(sendTransport.produce).toHaveBeenCalledWith({ track })

      expect(producer.id).toEqual(producerId)

      expect(mediaStream.getTracks).toHaveBeenCalled()

      expect(sendTransport.on).toHaveBeenCalledWith(
        'produce',
        expect.any(Function)
      )

      expect(createProducerId).toHaveBeenCalledWith(socket, {
        ...data,
        transportId: sendTransport.id,
      })

      expect(callback).toHaveBeenCalledWith({ id: producerId })
    }
  )

  test('returns replaceStream function', async () => {
    const socket = {} as Socket

    const producerId = 'PRODUCER_ID'
    createProducerIdMock.mockResolvedValue(producerId)

    const replaceTrack = vi.fn()

    const sendTransport = {
      id: 'SEND_TRANSPORT_ID',
      on: vi.fn(),
      produce: vi.fn().mockResolvedValue({
        id: producerId,
        replaceTrack,
      }),
    } as unknown as Transport

    const produceHandler = createProduceHandler(socket, sendTransport)

    const track = {}

    const mediaStream = {
      getTracks: vi.fn().mockReturnValue([track]),
    } as unknown as MediaStream

    const producer = await produceHandler(mediaStream)

    expect(producer.replaceStream).toBeInstanceOf(Function)

    await producer.replaceStream(mediaStream)

    expect(replaceTrack).toHaveBeenCalledWith({
      track,
    })
  })
})

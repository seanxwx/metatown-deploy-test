import { RtpCapabilities, RtpParameters } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import getConsumerOptions from './getConsumerOptions'

describe('getConsumerOptions', () => {
  test('resolves consumer options', async () => {
    const consumerOptions = {
      id: 'CONSUMER_ID',
      kind: 'video',
      rtpParameters: {} as RtpParameters,
    } as const

    const data = {
      transportId: 'TRANSPORT_ID',
      producerId: 'PRODUCER_ID',
      rtpCapabilities: {} as RtpCapabilities,
    } as const

    const socket = {
      emit: vi
        .fn()
        .mockImplementation(
          (
            _event,
            _data,
            callback: (options: typeof consumerOptions) => void
          ) => {
            callback(consumerOptions)
          }
        ),
    } as unknown as Socket

    const result = await getConsumerOptions(socket, data)

    expect(result).toBe(consumerOptions)

    expect(socket.emit).toHaveBeenCalledWith(
      'consume',
      data,
      expect.any(Function)
    )
  })

  test('rejects with an error', async () => {
    const data = {
      transportId: 'TRANSPORT_ID',
      producerId: 'PRODUCER_ID',
      rtpCapabilities: {} as RtpCapabilities,
    } as const

    const socket = {
      emit: vi
        .fn()
        .mockImplementation(
          (_event, _data, callback: (response: { error: string }) => void) => {
            callback({ error: 'error' })
          }
        ),
    } as unknown as Socket

    await expect(getConsumerOptions(socket, data)).rejects.toThrowError()

    expect(socket.emit).toHaveBeenCalledWith(
      'consume',
      data,
      expect.any(Function)
    )
  })
})

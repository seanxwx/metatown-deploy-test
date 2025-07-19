import { RtpParameters } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import createProducerId from './createProducerId'

describe('createProducerId', () => {
  test('creates producer id', async () => {
    const producerId = 'PRODUCER_ID'

    const data = {
      transportId: 'TRANSPORT_ID',
      kind: 'video',
      rtpParameters: {} as RtpParameters,
    } as const

    const socket = {
      emit: vi
        .fn()
        .mockImplementation(
          (_event, _data, callback: ({ id }: { id: string }) => void) => {
            callback({ id: producerId })
          }
        ),
    } as unknown as Socket

    const id = await createProducerId(socket, data)

    expect(socket.emit).toHaveBeenCalledWith(
      'produce',
      data,
      expect.any(Function)
    )

    expect(id).toBe(producerId)
  })
})

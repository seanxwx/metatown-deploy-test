import { TransportOptions } from 'mediasoup-client/types'
import { Socket } from 'socket.io-client'
import createWebRtcTransport, { ICE_SERVERS } from './prepareWebRTCTransport'

describe('prepareWebRtcTransport', () => {
  test('prepares transport options through socket', async () => {
    const transportOptions = {
      id: 'ID',
    } as unknown as TransportOptions

    const socket = {
      emit: vi.fn((_event, callback: (options: TransportOptions) => void) =>
        callback(transportOptions)
      ),
    } as unknown as Socket

    const result = await createWebRtcTransport(socket)

    expect(socket.emit).toBeCalledWith('createTransport', expect.any(Function))
    expect(result).toEqual({
      ...transportOptions,
      iceServers: ICE_SERVERS,
    })
  })
})

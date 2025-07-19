import { Socket } from 'socket.io-client'
import { DtlsParameters } from 'mediasoup-client/types'
import createConnectHandler from './createConnectHandler'

describe('createConnectHandler', () => {
  test('creates connect handler', () => {
    const socket = {} as Socket
    const transportId = 'ID'

    const connectHandler = createConnectHandler(socket, transportId)

    expect(connectHandler).toBeInstanceOf(Function)
  })

  test('connects transportId', () => {
    const transportId = 'ID'

    const socket = {
      emit: vi.fn((_event, _data, callback: () => void) => callback()),
    } as unknown as Socket

    const connectHandler = createConnectHandler(socket, transportId)

    const dtlsParameters = {} as DtlsParameters
    const callback = vi.fn()

    connectHandler({ dtlsParameters }, callback)

    expect(socket.emit).toBeCalledWith(
      'connectTransport',
      { transportId, dtlsParameters },
      expect.any(Function)
    )
    expect(callback).toBeCalled()
  })
})

import { io, Socket } from 'socket.io-client'
import connectSocket from './connectSocket'

vi.mock('socket.io-client')
const ioMock = vi.mocked(io)

describe('connectSocket', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllEnvs()
  })

  test('resolves connected socket with NEXT_PUBLIC_SOCKET_SERVER_URL', async () => {
    const socket = {
      on: vi.fn(),
    }
    vi.stubEnv('NEXT_PUBLIC_SOCKET_SERVER_URL', 'http://socket-server-url')
    socket.on.mockImplementation((_: unknown, cb: () => void) => cb())
    ioMock.mockReturnValue(socket as unknown as Socket)
    const result = await connectSocket()
    expect(ioMock).toBeCalledWith('http://socket-server-url')
    expect(socket.on).toBeCalled()
    expect(result).toBe(socket)
  })

  test('resolves null if no NEXT_PUBLIC_SOCKET_SERVER_URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_SOCKET_SERVER_URL', undefined)

    const result = await connectSocket()

    expect(ioMock).not.toBeCalled()
    expect(result).toBe(null)
  })
})

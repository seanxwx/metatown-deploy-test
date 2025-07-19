import { io, Socket } from 'socket.io-client'

const connectSocket = (): Promise<Socket | null> =>
  new Promise((resolve) => {
    if (!process.env.NEXT_PUBLIC_SOCKET_SERVER_URL) {
      resolve(null)

      return
    }

    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL)
    socket.on('connect', () => {
      resolve(socket)
    })
  })

export default connectSocket

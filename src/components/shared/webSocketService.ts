import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectWebSocket = (orgId: string): void => {
  if (!orgId) {
    console.error('orgId is required to connect to the WebSocket.')
    return
  }

  if (!socket) {
    socket = io(`${process.env.REACT_APP_SOCKET_URL}/razorpay-webhooks`, {
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket?.id)
      socket?.emit('join-room', orgId) // Join the room based on orgId
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })
  }
}

export const listenToEvent = (
  event: string,
  callback: (data: any) => void
): void => {
  if (socket) {
    socket.on(event, (data) => {
      console.log(`Received event: ${event}`, data)
      if (callback) callback(data)
    })
  } else {
    console.error('WebSocket is not connected. Call connectWebSocket first.')
  }
}

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

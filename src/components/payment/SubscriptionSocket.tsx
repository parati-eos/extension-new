import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL

interface SocketContextValue {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextValue>({ socket: null })

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const razorpaySocket: Socket = io(`${SOCKET_URL}/razorpay-webhooks`, {
      transports: ['websocket'],
    })

    razorpaySocket.on('connect', () => {
      console.log('Connected to Razorpay Webhooks namespace')
    })

    razorpaySocket.on('disconnect', () => {
      console.log('Disconnected from Razorpay Webhooks namespace')
    })

    setSocket(razorpaySocket)

    return () => {
      razorpaySocket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

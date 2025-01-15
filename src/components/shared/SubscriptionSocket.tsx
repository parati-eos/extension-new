import React, { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL // Replace with your server URL

const SocketTest: React.FC = () => {
  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL)

    // Join the room
    const userId: string = 'user_12345' // Test with the userId from your webhook payload
    socket.emit('join-room', userId)

    // Listen for Razorpay events
    socket.on('subscription.authenticated', (data: any) => {
      console.log('Received subscription.authenticated:', data)
    })

    socket.on('subscription.activated', (data: any) => {
      console.log('Received subscription.activated:', data)
    })

    socket.on('payment.authorized', (data: any) => {
      console.log('Received payment.authorized:', data)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  return <div>Check your console for Socket.IO events</div>
}

export default SocketTest

import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SubscriptionUpdate {
  event: string
  orgId: string
  status: string
}

interface PaymentUpdate {
  event: string
  paymentId: string
}

interface RefundUpdate {
  event: string
  refundId: string
}

const WebSocketComponent: React.FC = () => {
  const [subscriptionUpdates, setSubscriptionUpdates] = useState<
    SubscriptionUpdate[]
  >([])
  const [paymentUpdates, setPaymentUpdates] = useState<PaymentUpdate[]>([])
  const [refundUpdates, setRefundUpdates] = useState<RefundUpdate[]>([])
  const [connected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    const socket: Socket = io('http://localhost:5002/payment') // Adjust the URL as per your server

    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to /payment namespace')
      setConnected(true)
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from /payment namespace')
      setConnected(false)
    })

    // Listen for subscription updates
    socket.on('subscription-update', (data: SubscriptionUpdate) => {
      console.log('Received subscription update:', data)
      setSubscriptionUpdates((prev) => [...prev, data])
    })

    // Listen for payment authorization events
    socket.on('payment-authorized', (data: PaymentUpdate) => {
      console.log('Received payment authorization:', data)
      setPaymentUpdates((prev) => [...prev, data])
    })

    // Listen for refund updates
    socket.on('refund-update', (data: RefundUpdate) => {
      console.log('Received refund update:', data)
      setRefundUpdates((prev) => [...prev, data])
    })

    // Cleanup connection on component unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>WebSocket Updates</h1>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>

      <section>
        <h2>Subscription Updates</h2>
        {subscriptionUpdates.length === 0 ? (
          <p>No subscription updates yet.</p>
        ) : (
          <ul>
            {subscriptionUpdates.map((update, index) => (
              <li key={index}>
                <strong>Event:</strong> {update.event} |{' '}
                <strong>Org ID:</strong> {update.orgId} |{' '}
                <strong>Status:</strong> {update.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Payment Updates</h2>
        {paymentUpdates.length === 0 ? (
          <p>No payment updates yet.</p>
        ) : (
          <ul>
            {paymentUpdates.map((update, index) => (
              <li key={index}>
                <strong>Event:</strong> {update.event} |{' '}
                <strong>Payment ID:</strong> {update.paymentId}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Refund Updates</h2>
        {refundUpdates.length === 0 ? (
          <p>No refund updates yet.</p>
        ) : (
          <ul>
            {refundUpdates.map((update, index) => (
              <li key={index}>
                <strong>Event:</strong> {update.event} |{' '}
                <strong>Refund ID:</strong> {update.refundId}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default WebSocketComponent

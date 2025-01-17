import React, { useEffect, useState } from 'react'
import {
  connectWebSocket,
  listenToEvent,
  disconnectWebSocket,
} from './webSocketService'

interface RazorpayWebhooksProps {
  orgId: string
}

interface PaymentData {
  // Define the shape of the payment data based on your backend response
  [key: string]: any
}

interface SubscriptionData {
  // Define the shape of the subscription data based on your backend response
  [key: string]: any
}

const RazorpayWebhooks: React.FC<RazorpayWebhooksProps> = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null)
  const orgId = sessionStorage.getItem('orgId')

  useEffect(() => {
    if (!orgId) {
      console.error('orgId is required to connect WebSocket')
      return
    }

    // Connect to WebSocket
    connectWebSocket(orgId)

    // Listen to payment authorization events
    listenToEvent('payment.authorized', (data: PaymentData) => {
      console.log('Payment authorized:', data)
      setPaymentData(data)
    })

    // Listen to subscription events
    listenToEvent('subscription.authenticated', (data: SubscriptionData) => {
      console.log('Subscription authenticated:', data)
      setSubscriptionData(data)
    })

    // Cleanup WebSocket on unmount
    return () => {
      disconnectWebSocket()
    }
  }, [orgId])

  return (
    <div>
      <h1>Razorpay Webhooks</h1>

      <div>
        <h2>Payment Data</h2>
        {paymentData ? (
          <pre>{JSON.stringify(paymentData, null, 2)}</pre>
        ) : (
          <p>No payment data received yet.</p>
        )}
      </div>

      <div>
        <h2>Subscription Data</h2>
        {subscriptionData ? (
          <pre>{JSON.stringify(subscriptionData, null, 2)}</pre>
        ) : (
          <p>No subscription data received yet.</p>
        )}
      </div>
    </div>
  )
}

export default RazorpayWebhooks

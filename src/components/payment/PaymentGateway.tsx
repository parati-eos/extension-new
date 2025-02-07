import React, { useState, useEffect } from 'react'
import './Modal.css' // Import custom modal CSS
// Declare Razorpay on the window object
declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentGatewayProps {
  productinfo: any
  onSuccess: (result: any) => void
  formId: string
  authToken: string
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  productinfo,
  onSuccess,
  formId,
  authToken,
}) => {
  const [paymentData, setPaymentData] = useState({
    amount: 9, // Default amount for USD
    productinfo,
    firstname: 'Zynth',
    email: localStorage.getItem('userEmail') || '',
    formId,
    currency: 'USD',
  })

  const [countdown, setCountdown] = useState<number | null>(null) // State to hold countdown value
  const [showModal, setShowModal] = useState(false) // State to control modal visibility

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch(
          'https://ipinfo.io/json?token=f0e9cf876d422e'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch location data')
        }
        const data = await response.json()
        const currency = data.country === 'IN' ? 'INR' : 'USD'
        const amount = currency === 'INR' ? 499 : 9

        setPaymentData((prevData) => ({
          ...prevData,
          currency,
          amount,
        }))
      } catch (error) {
        console.error('Error detecting location:', error)
        setPaymentData((prevData) => ({
          ...prevData,
          currency: 'USD',
          amount: 9,
        }))
      }
    }

    detectCurrency()
  }, [])

  const updateOrderId = async (orderId: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/finalsheet/${formId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Order ID updated successfully:', result)
    } catch (error) {
      console.error('Error updating order ID:', error)
    }
  }

  const handlePayment = async () => {
    try {
      // Fetch organization profile using orgId
      const orgResponse = await fetch(
        `http://34.239.191.112:5001/api/v1/data/organizationprofile/organization/${productinfo.orgId}`
      );
      if (!orgResponse.ok) {
        throw new Error(`Failed to fetch organization profile`);
      }
      const orgData = await orgResponse.json();
      const { credits, orgId } = orgData; // Extract credits and orgId
  
      // Define credit value
      const creditValue = paymentData.currency === "INR" ? 250 : 4.5;
      let totalCreditValue = credits * creditValue;
  
      // Calculate how many credits are needed
      let neededCredits = Math.floor(paymentData.amount / creditValue);
      let creditsToUse = Math.min(credits, neededCredits); // Use only required credits
      let creditDiscount = creditsToUse * creditValue; // Discount based on used credits
  
      // Calculate final amount after deducting credit discount
      let finalAmount = paymentData.amount - creditDiscount;
      finalAmount = finalAmount < 0 ? 0 : Math.round(finalAmount);
  
      console.log("Credits Available:", credits);
      console.log("Total Credit Value:", totalCreditValue);
      console.log("Credits Needed:", neededCredits);
      console.log("Credits Used:", creditsToUse);
      console.log("Final Amount after discount:", finalAmount);
  
      // Calculate remaining credits
      let newCredits = credits - creditsToUse;
  
      // Proceed if payment is required, else process as free transaction
      if (finalAmount === 0) {
        console.log("No payment needed, processing as free transaction.");
        
        // Update remaining credits in organization profile
        await fetch(
          `https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/organizationprofile/organizationedit/${orgId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ credits: newCredits }),
          }
        );
  
        return onSuccess({ message: "Payment waived due to credits." });
      }
  
      // Generate Razorpay order
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            amount: finalAmount,
            currency: paymentData.currency,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      const { id: order_id, amount, currency } = result;
  
      // Update the order ID in the backend
      await updateOrderId(order_id);
  
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Zynth",
        description: "Purchase of presentation",
        order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: finalAmount,
                }),
              }
            );
  
            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }
  
            const verifyResult = await verifyResponse.json();
  
            // Update remaining credits in organization profile
            await fetch(
              `https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/organizationprofile/organizationedit/${orgId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ credits: newCredits }),
              }
            );
  
            onSuccess(verifyResult);
            setCountdown(8); // Start countdown
            setShowModal(true); // Show modal
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please try again.");
          }
        },
        theme: { color: "#3399cc" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        "SORRY!\nWe were unable to process your payment\nError Reason: " +
          (error as Error).message
      );
    }
  };
  
  

  useEffect(() => {
    if (countdown === null || countdown === 0) return

    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount !== null ? prevCount - 1 : 0))
    }, 1000)

    return () => clearInterval(timer) // Cleanup the timer
  }, [countdown])

  useEffect(() => {
    if (countdown === 0) {
      setShowModal(false) // Hide the modal once the countdown ends
      console.log('Download starting...')
    }
  }, [countdown])

  return (
    <div>
      <button
        id="payment-button"
        onClick={handlePayment}
        style={{ display: 'none' }}
      >
        Pay and Download
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              Payment successful! Your download will start in {countdown}{' '}
              seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentGateway

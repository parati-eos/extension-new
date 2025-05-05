import React, { useState, useEffect } from 'react';
import './Modal.css';
import { getStaticPricing } from '../../utils/pricingConfig';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentGatewayProps {
  productinfo: any;
  onSuccess: (result: any) => void;
  onFailure?: () => void;
  formId: string;
  authToken: string;
  isDiscounted: boolean;
  discountedAmount: number;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  productinfo,
  onSuccess,
  onFailure,
  formId,
  authToken,
  isDiscounted,
  discountedAmount,
}) => {
  const [paymentData, setPaymentData] = useState({
    amount: isDiscounted ? discountedAmount : 9,
    productinfo,
    firstname: 'Zynth',
    email: localStorage.getItem('userEmail') || '',
    formId,
    currency: 'USD',
  });

  const [countdown, setCountdown] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const orgId = sessionStorage.getItem("orgId");

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://zynth.ai/api/users/ip-info');
        if (!response.ok) throw new Error('Failed to fetch location data');

        const data = await response.json();
        const currency = data.country === 'IN' ? 'INR' : 'USD';
        const pricing = getStaticPricing(currency);
        const amount = isDiscounted ? discountedAmount : pricing.current;

        setPaymentData((prevData) => ({
          ...prevData,
          currency,
          amount,
        }));
      } catch (error) {
        console.error('Error detecting location:', error);
        const fallbackPricing = getStaticPricing('USD');
        setPaymentData((prevData) => ({
          ...prevData,
          currency: 'USD',
          amount: isDiscounted ? discountedAmount : fallbackPricing.current,
        }));
      }
    };

    detectCurrency();
  }, [isDiscounted, discountedAmount]);

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
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log('Order ID updated successfully:', result);
    } catch (error) {
      console.error('Error updating order ID:', error);
    }
  };

  const handlePayment = async () => {
    try {
      const orgResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!orgResponse.ok) throw new Error(`Failed to fetch organization profile`);
      const orgData = await orgResponse.json();
      const { credits } = orgData;

      const creditValue = paymentData.currency === "INR" ? 49 : 1;
      let neededCredits = Math.floor(paymentData.amount / creditValue);
      let creditsToUse = Math.min(credits, neededCredits);
      let creditDiscount = creditsToUse * creditValue;

      let finalAmount = paymentData.amount - creditDiscount;
      finalAmount = finalAmount < 0 ? 0 : Math.round(finalAmount);
      let newCredits = credits - creditsToUse;

      console.log("Credits Available:", credits);
      console.log("Credits Used:", creditsToUse);
      console.log("Final Amount:", finalAmount);
      console.log("Remaining Credits:", newCredits);

      if (finalAmount === 0) {
        await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
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

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            amount: finalAmount,
            currency: paymentData.currency,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      const { id: order_id, amount, currency } = result;

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

            if (!verifyResponse.ok) throw new Error("Payment verification failed");

            const verifyResult = await verifyResponse.json();

            await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
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
            setCountdown(8);
            setShowModal(true);
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please try again.");
            if (onFailure) onFailure();
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
      if (onFailure) onFailure();
    }
  };

  useEffect(() => {
    if (countdown === null || countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      setShowModal(false);
      console.log('Download starting...');
    }
  }, [countdown]);

  return (
    <div>
      <button
        id="payment-button"
        onClick={handlePayment}
        style={{ display: 'none' }}
      >
        Pay and Download
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              Payment successful! Your download will start in {countdown} seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;




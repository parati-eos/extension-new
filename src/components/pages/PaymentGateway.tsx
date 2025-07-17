import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./Modal.css";
import { getStaticPricing } from "../../utils/pricingConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentGatewayRef {
  triggerPayment: (paymentDetails: {
    amount: string;
    currency: "INR" | "USD";
    credits: number;
  }) => void;
}

interface PaymentGatewayProps {
  productinfo: any;
  onSuccess: (result: any) => void;
  onFailure?: () => void;
  authToken: string;
  isDiscounted: boolean;
  discountedAmount: number;
}

const specialEmails = new Set([
  "adarshahalder02@gmail.com",
  "siddharth.gupta@parati.in",
  "siddharthgupta92@gmail.com",
]);

const PaymentGateway = forwardRef<PaymentGatewayRef, PaymentGatewayProps>(
  (
    {
      productinfo,
      onSuccess,
      onFailure,
      authToken,
      isDiscounted,
      discountedAmount,
    },
    ref
  ) => {
    const [paymentData, setPaymentData] = useState({
      amount: isDiscounted ? discountedAmount : 9,
      productinfo,
      firstname: "Zynth",
      email: localStorage.getItem("userEmail") || "",
      currency: "USD",
    });

    const [creditsToAdd, setCreditsToAdd] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const orgId = sessionStorage.getItem("orgId");

    useImperativeHandle(ref, () => ({
      triggerPayment: ({ amount, currency, credits }) => {
        setPaymentData((prev) => ({
          ...prev,
          amount: parseFloat(amount),
          currency,
        }));
        setCreditsToAdd(credits);
        handlePayment(parseFloat(amount), currency, credits);
      },
    }));

    useEffect(() => {
      const detectCurrency = async () => {
        try {
          const response = await fetch("https://zynth.ai/api/users/ip-info");
          if (!response.ok) throw new Error("Failed to fetch location data");

          const data = await response.json();
          const currency = data.country === "IN" ? "INR" : "USD";

          const email = localStorage.getItem("userEmail") || "";
          let amount = isDiscounted ? discountedAmount : getStaticPricing(currency).current;

          if (currency === "INR" && specialEmails.has(email)) {
            amount = 5;
          }

          setPaymentData((prevData) => ({
            ...prevData,
            currency,
            amount,
            email,
          }));
        } catch (error) {
          console.error("Error detecting location:", error);
          const fallbackCurrency = "USD";
          const amount = isDiscounted ? discountedAmount : getStaticPricing(fallbackCurrency).current;
          setPaymentData((prevData) => ({
            ...prevData,
            currency: fallbackCurrency,
            amount,
          }));
        }
      };

      detectCurrency();
    }, [isDiscounted, discountedAmount]);

    const handlePayment = async (amount: number, currency: string, credits: number) => {
      try {
        const finalAmount = Math.round(amount);

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
              currency,
            }),
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        const { id: order_id } = result;

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: finalAmount * 100,
          currency,
          name: "Zynth",
          description: "Credit Purchase",
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
                  body: JSON.stringify({ credits }),
                }
              );

              onSuccess(verifyResult);
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

    return (
      <div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>
                Payment successful! Please go back to Google Slides and refresh
                your credits to reflect the updated amount.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default PaymentGateway;

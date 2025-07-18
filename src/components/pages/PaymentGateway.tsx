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
    amount: number;
    creditCount: number;
  }) => void;
}

interface PaymentGatewayProps {
  productinfo: string;
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

    const [currentCredits, setCurrentCredits] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const orgId = sessionStorage.getItem("orgId");

    useImperativeHandle(ref, () => ({
      triggerPayment: ({ amount, creditCount }) => {
        handlePayment(amount, creditCount);
      },
    }));

    useEffect(() => {
      const detectCurrencyAndFetchCredits = async () => {
        try {
          const res = await fetch("https://zynth.ai/api/users/ip-info");
          const data = await res.json();
          const currency = data.country === "IN" ? "INR" : "USD";
          const email = localStorage.getItem("userEmail") || "";
          let amount = isDiscounted
            ? discountedAmount
            : getStaticPricing(currency).current;
          if (currency === "INR" && specialEmails.has(email)) amount = 5;

          setPaymentData((prev) => ({ ...prev, currency, amount, email }));
        } catch {
          const fallback = "USD";
          const amount = isDiscounted
            ? discountedAmount
            : getStaticPricing(fallback).current;
          setPaymentData((prev) => ({ ...prev, currency: fallback, amount }));
        }

        try {
          const orgRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const orgData = await orgRes.json();
          setCurrentCredits(orgData?.credits || 0);
        } catch (err) {
          console.error("Error fetching current credits:", err);
        }
      };

      detectCurrencyAndFetchCredits();
    }, [isDiscounted, discountedAmount]);

    const handlePayment = async (amount: number, credits: number) => {
      try {
        const finalAmount = Math.round(amount);
        const currency = paymentData.currency;
        const creditValue = currency === "INR" ? 19.9 : 0.25;

        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ amount: finalAmount, currency }),
          }
        );

        if (!res.ok) throw new Error("Order creation failed");
        const { id: order_id } = await res.json();

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: finalAmount * 100,
          currency,
          name: "Zynth",
          description: productinfo,
          order_id,
          handler: async function (response: any) {
            try {
              const verify = await fetch(
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

              if (!verify.ok) throw new Error("Verification failed");
              const result = await verify.json();

              // Update credits by adding to current
              const creditsPurchased = Math.floor(finalAmount / creditValue);
              const updatedCredits = currentCredits + creditsPurchased;

              await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                  },
                  body: JSON.stringify({ credits: updatedCredits }),
                }
              );

              setCurrentCredits(updatedCredits);
              onSuccess(result);
              setShowModal(true);
            } catch (err) {
              console.error("Verification error:", err);
              alert("Payment verification failed. Please try again.");
              onFailure?.();
            }
          },
          theme: { color: "#3399cc" },
        };

        new window.Razorpay(options).open();
      } catch (err) {
        console.error("Payment error:", err);
        alert(
          "Payment processing failed. Reason: " + (err as Error).message
        );
        onFailure?.();
      }
    };

    return (
      <div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>
                Payment successful! Please return to Google Slides and refresh
                your credits.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default PaymentGateway;

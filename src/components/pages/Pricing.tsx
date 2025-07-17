import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import PaymentGateway, { PaymentGatewayRef } from "./PaymentGateway";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getCreditPricing } from "../../utils/pricingConfig";

const PricingComparison = () => {
  const [credits, setCredits] = useState(100);
  const [billingCycle, setBillingCycle] = useState("annual");
  const [currency, setCurrency] = useState<"INR" | "USD">("USD");
  const [monthlyPlan, setMonthlyPlan] = useState<any>(null);
  const [yearlyPlan, setYearlyPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentGatewayRef = useRef<PaymentGatewayRef>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const authToken =
    queryParams.get("authToken") || sessionStorage.getItem("authToken");
  const userEmail =
    queryParams.get("userEmail") || sessionStorage.getItem("userEmail");
  let orgId = queryParams.get("orgId") || sessionStorage.getItem("orgId");

  if (queryParams.get("orgId")) {
    sessionStorage.setItem("orgId", queryParams.get("orgId")!);
  }

  const creditValue = getCreditPricing(currency);
  const totalAmount = (credits * creditValue).toFixed(2);

  const handleUpgrade = async () => {
    if (!monthlyPlan || !yearlyPlan) return;

    setIsLoading(true);
    const planID = billingCycle === "annual" ? yearlyPlan.id : monthlyPlan.id;
    const startAtUnix = Math.floor((Date.now() + 10 * 60 * 1000) / 1000);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/create-subscription`,
        {
          plan_id: planID,
          customer_id: orgId,
          total_count: 12,
          start_at: startAtUnix,
          quantity: 1,
          orgId,
          userId: userEmail,
          notes: { OrgId: orgId },
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const result = response.data;
      if (result.short_url) {
        window.open(result.short_url, "_blank");
      } else {
        alert("Something went wrong with the subscription. Please try again later.");
      }
    } catch (error: any) {
      console.error("Upgrade to Pro failed:", error);
      alert(
        `SORRY!\nWe were unable to process your payment\nError Reason: ${
          error?.message || error
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const ipRes = await fetch("https://zynth.ai/api/users/ip-info");
        const ipData = await ipRes.json();
        const country = ipData?.country?.toUpperCase();

        const planRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/appscripts/razorpay/plans`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const plans = planRes.data.items;
        if (country === "IN" || country === "INDIA") {
          setMonthlyPlan(plans[5]);
          setYearlyPlan(plans[3]);
          setCurrency("INR");
        } else {
          setMonthlyPlan(plans[4]);
          setYearlyPlan(plans[2]);
          setCurrency("USD");
        }
      } catch (err) {
        console.error("Pricing data fetch failed", err);
      }
    };

    fetchPricingData();
  }, [authToken]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Buy Credits */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Buy Credits</h2>
          <p className="text-gray-600 mb-4">Perfect for exploring Zynth.</p>

          <div className="flex items-center mb-3">
            <input
              type="number"
              value={credits}
              onChange={(e) => {
                const val = Math.max(10, Math.round(Number(e.target.value) / 10) * 10);
                setCredits(val);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-24 mr-2"
              min={10}
              step={10}
            />
              <p className="text-sm text-gray-600 mb-3">
           Total: {totalAmount} {currency}
          </p>
          </div>

     

          <button
            className="bg-blue-600 text-white py-2 px-6 rounded mb-2"
            onClick={() => {
              if (!authToken) {
                alert("Auth token is missing. Please log in again.");
                return;
              }
              paymentGatewayRef.current?.triggerPayment({
                amount: parseFloat(totalAmount),
                creditCount: credits,
              });
            }}
          >
            Buy Credits
          </button>

          <p className="text-sm text-gray-500">
            Top up your credits for text refinement, image generation and more.
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">AI Credits Features:</h3>
            <ul className="space-y-2 text-gray-800">
              {[
                "Generate Presentations",
                "Add New Slides",
                "Unlock Slide Types",
                "AI Text Tools",
                "AI Image Tools",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <p className="text-gray-600 mb-4">
            Ideal for professionals and businesses.
          </p>

          <div className="mb-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={billingCycle === "annual"}
                  onChange={() => setBillingCycle("annual")}
                />
                <span className="text-sm">
                  {yearlyPlan?.item.amount / 100} {currency} Billed annually
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={billingCycle === "monthly"}
                  onChange={() => setBillingCycle("monthly")}
                />
                <span className="text-sm">
                  {monthlyPlan?.item.amount / 100} {currency} Billed monthly
                </span>
              </label>
            </div>
          </div>

          <button
            className="bg-blue-600 text-white py-2 px-6 rounded mb-2"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Upgrade to Pro"}
          </button>

          <p className="text-sm text-gray-500">
            Get unlimited access to Zynth.ai Google Slides add-on and web application.
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Pro Plan Features:</h3>
            <ul className="space-y-2 text-gray-800">
              {[
                "Unlimited Presentations",
                "Unlimited Slides",
                "All Slide Types",
                "Free AI Text Tools",
                "Free AI Image Tools",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden PaymentGateway */}
      <PaymentGateway
        ref={paymentGatewayRef}
        authToken={authToken ?? ""}
        productinfo="Credits Purchase"
        isDiscounted={false}
        discountedAmount={0}
        onSuccess={(result) => {
          console.log("✅ Payment success", result);
        }}
        onFailure={() => {
          console.warn("❌ Payment failed or cancelled");
        }}
      />
    </div>
  );
};

export default PricingComparison;

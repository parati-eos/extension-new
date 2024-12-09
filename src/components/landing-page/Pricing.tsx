import React, { useState } from "react";

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="bg-gray-50 w-full h-full">
      <section className="py-16 min-h-[300px] ml-[250px]">
        <div>
          <p className="text-indigo-600 text-lg mb-2">Pricing</p>
          <h1 className="text-gray-900 text-3xl font-bold mb-6">
            AI slide maker for all your <br></br> presentation needs.
          </h1>
          <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 font-bold"
                  : "bg-transparent text-gray-500"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly billing
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                billingCycle === "annual"
                  ? "bg-white text-gray-900 font-bold"
                  : "bg-transparent text-gray-500"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual billing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;

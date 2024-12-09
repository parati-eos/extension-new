import React from "react";

const PricingPlan: React.FC = () => {
  const categories = [
    {
      title: "Access",
      features: ["Generate Presentations", "Presentation Uploads"],
    },
    {
      title: "Features",
      features: [
        "AI Presentation Creation",
        "Presentation History",
        "Slide Versioning",
        "Add Custom Slides",
        "Custom Slide Builder",
      ],
    },
    {
      title: "Sharing and Exports",
      features: [
        "Presentation Sharing Links",
        "PDF Exports",
        "Google Slides Exports",
      ],
    },
  ];

  const plans = [
    {
      name: "FREE",
      description: "Perfect for exploring Zynth.",
      buttonText: "Get Started for Free",
      price: null, // No price for the free plan
      features: [
        "Unlimited",
        "Unlimited",
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
      ],
    },
    {
      name: "PRO",
      description: "Ideal for professionals and businesses.",
      buttonText: "Upgrade to Pro",
      price: (
        <>
          $9 <br /> ₹999 <br /> <span className="text-sm text-gray-500">per month</span>
        </>
      ),
      features: [
        "Unlimited",
        "Unlimited",
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
  ];

  return (
    <div className="bg-white w-full py-16 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        {/* Side Component: Categories */}
        <div className="mt-72">
          {categories.map((category, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-[#3667B2] text-lg font-semibold mb-4">
                {category.title}
              </h2>
              <ul className="space-y-4 text-gray-700 ml-6">
                {category.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Plans */}
        {plans.map((plan, planIndex) => (
          <div
            key={planIndex}
            className={`bg-white border ${
              planIndex === 1 ? "border-indigo-600" : "border-gray-200"
            } rounded-lg shadow-lg p-6`}
          >
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-indigo-600 text-lg font-semibold mb-2">
                {plan.name}
              </h3>
              {plan.price && (
                <div className="text-gray-900 text-4xl font-bold text-center mb-2">
                  {plan.price}
                </div>
              )}
              <p className="text-gray-500 text-center">{plan.description}</p>
            </div>
            <button
              className={`w-full font-medium py-2 px-6 ${
                planIndex === 0 ? "mb-32" : ""
              } rounded-lg ${
                planIndex === 1
                  ? "bg-[#3667B2] text-white hover:bg-indigo-700"
                  : "border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50"
              }`}
            >
              {plan.buttonText}
            </button>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center justify-center bg-[#F5F7FA] mt-4 p-3 rounded-lg"
                >
                  {feature === true ? (
                    <span className="text-green-500 text-lg">✔</span>
                  ) : feature === false ? (
                    <span className="text-gray-400 text-lg">-</span>
                  ) : (
                    <span className="text-gray-700">{feature}</span>
                  )}
                </li>
              ))}
            </ul>
            <button
              className={`w-full font-medium py-2 px-6 rounded-lg ${
                planIndex === 1
                  ? "bg-[#3667B2] text-white hover:bg-indigo-700"
                  : "border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlan;

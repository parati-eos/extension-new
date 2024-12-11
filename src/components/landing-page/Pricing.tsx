import React, { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa' // Importing the check icon

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )

  const categories = [
    {
      title: 'Access',
      features: ['Generate Presentations', 'Presentation Uploads'],
    },
    {
      title: 'Features',
      features: [
        'AI Presentation Creation',
        'Presentation History',
        'Slide Versioning',
        'Add Custom Slides',
        'Custom Slide Builder',
      ],
    },
    {
      title: 'Sharing and Exports',
      features: [
        'Presentation Sharing Links',
        'PDF Exports',
        'Google Slides Exports',
      ],
    },
  ]

  const plans = [
    {
      name: 'FREE',
      buttonText: 'Get Started for Free',
      description: 'Perfect for exploring Zynth.',
      price: null, // No price for the free plan
      features: [
        { text: 'Unlimited', bgColor: '#F5F7FA', icon: null, spacing: 'py-6' },
        { text: '-', bgColor: 'white', icon: null, spacing: 'py-10 mb-9' },
        { text: '✔', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '-', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '-', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '-', bgColor: '#F5F7FA', icon: null, spacing: 'py-6' },
        { text: '-', bgColor: 'white', icon: null, spacing: 'py-6' },
        { text: '-', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '-', bgColor: 'white', icon: null, spacing: 'py-6' },
        {
          text: '$9 / ₹ 499 / Export',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-6',
        },
      ],
    },
    {
      name: 'PRO',
      buttonText: 'Upgrade to Pro',
      description: 'Ideal for professionals and businesses.',
      price:
        billingCycle === 'monthly' ? (
          <>
            $9 <br /> ₹999 <br />
            <span className="text-sm text-gray-500">per month</span>
          </>
        ) : (
          <>
            $90 <br /> ₹9999 <br />
            <span className="text-sm text-gray-500">per year</span>
          </>
        ),
      features: [
        { text: 'Unlimited', bgColor: '#F5F7FA', icon: null, spacing: 'py-6' },
        { text: 'Unlimited', bgColor: 'white', icon: null, spacing: 'py-10' },
        { text: '✔', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '✔', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '✔', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-6' },
        {
          text: 'Unlimited',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-6',
        },
        { text: '', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-10' },
        { text: '✔', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-6' },
        { text: '✔', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-6' },
        { text: 'Unlimited', bgColor: '#F5F7FA', icon: null, spacing: 'py-6' },
      ],
    },
  ]

  return (
    <div className="bg-gray-50 w-full h-full" id="pricing">
      <section className="py-16 lg:min-h-[300px] lg:ml-[250px] ml-2">
        <div>
          <p className="text-indigo-600 text-lg mb-2">Pricing</p>
          <h1 className="text-gray-900 text-3xl font-bold mb-6">
            AI slide maker for all your <br /> presentation needs.
          </h1>
          <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 font-bold'
                  : 'bg-transparent text-gray-500'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly billing
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 font-bold'
                  : 'bg-transparent text-gray-500'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual billing
            </button>
          </div>
        </div>
      </section>

      <div className="bg-white w-full py-16 px-8">
        <div className="max-w-6xl mx-auto lg:grid grid-cols-3 gap-8   ">
          {/* Side Component: Categories */}
          <div className="mt-72 hidden lg:block">
            {categories.map((category, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-[#3667B2] text-lg font-semibold mb-4">
                  {category.title}
                </h2>
                <ul className="space-y-10 text-gray-700 ml-6">
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
                planIndex === 1 ? 'border-indigo-600' : 'border-gray-200'
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
                  planIndex === 0 ? 'mb-32' : ''
                } rounded-lg ${
                  planIndex === 1
                    ? 'bg-[#3667B2] text-white hover:bg-indigo-700'
                    : 'border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50'
                }`}
              >
                {plan.buttonText}
              </button>
              <ul className="mb-8 mt-9 space-y-0">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`flex items-center justify-center w-full ${feature.spacing}`}
                    style={{
                      backgroundColor: feature.bgColor,
                      borderRadius: '0.375rem',
                    }}
                  >
                    {feature.icon ? (
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span
                        className={`${
                          feature.text === '-'
                            ? 'text-gray-400 text-lg'
                            : 'text-gray-900'
                        }`}
                      >
                        {feature.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full font-medium py-2 px-6 rounded-lg ${
                  planIndex === 1
                    ? 'bg-[#3667B2] text-white hover:bg-indigo-700'
                    : 'border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing

// export const PricingModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

//   const categories = [
//     {
//       title: "Access",
//       features: ["Generate Presentations", "Presentation Uploads"],
//     },
//     {
//       title: "Features",
//       features: [
//         "AI Presentation Creation",
//         "Presentation History",
//         "Slide Versioning",
//         "Add Custom Slides",
//         "Custom Slide Builder",
//       ],
//     },
//     {
//       title: "Sharing and Exports",
//       features: [
//         "Presentation Sharing Links",
//         "PDF Exports",
//         "Google Slides Exports",
//       ],
//     },
//   ];

//   const plans = [
//     {
//       name: "FREE",
//       buttonText: "Get Started for Free",
//       description: "Perfect for exploring Zynth.",
//       price: null, // No price for the free plan
//       features: [
//         { text: "Unlimited", bgColor: "#F5F7FA", icon: null, spacing: "py-6" },
//         { text: "-", bgColor: "white", icon: null, spacing: "py-10 mb-9" },
//         { text: "✔", bgColor: "#F5F7FA", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "-", bgColor: "white", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "-", bgColor: "white", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "-", bgColor: "#F5F7FA", icon: null, spacing: "py-6" },
//         { text: "-", bgColor: "white", icon: null, spacing: "py-6" },
//         { text: "-", bgColor: "#F5F7FA", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "-", bgColor: "white", icon: null, spacing: "py-6" },
//         { text: "$9 / ₹ 499 / Export", bgColor: "#F5F7FA", icon: null, spacing: "py-6" },
//       ],
//     },
//     {
//       name: "PRO",
//       buttonText: "Upgrade to Pro",
//       description: "Ideal for professionals and businesses.",
//       price: billingCycle === "monthly" ? (
//         <>
//           $9 <br /> ₹999 <br />
//           <span className="text-sm text-gray-500">per month</span>
//         </>
//       ) : (
//         <>
//           $90 <br /> ₹9999 <br />
//           <span className="text-sm text-gray-500">per year</span>
//         </>
//       ),
//       features: [
//         { text: "Unlimited", bgColor: "#F5F7FA", icon: null, spacing: "py-6" },
//         { text: "Unlimited", bgColor: "white", icon: null, spacing: "py-10" },
//         { text: "✔", bgColor: "#F5F7FA", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "✔", bgColor: "white", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "✔", bgColor: "#F5F7FA", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "Unlimited", bgColor: "white", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "", bgColor: "white", icon: FaCheckCircle, spacing: "py-10" },
//         { text: "✔", bgColor: "#F5F7FA", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "✔", bgColor: "white", icon: FaCheckCircle, spacing: "py-6" },
//         { text: "Unlimited", bgColor: "#F5F7FA", icon: null, spacing: "py-6" },
//       ],
//     },
//   ];

//   return (
//     <div className={`${PricingModal}fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center`}>
//       <div className="bg-white w-[85%] h-[85%] overflow-y-auto rounded-lg shadow-lg p-6 relative">
//         <button
//           onClick={closeModal}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
//         >
//           &times;
//         </button>
//         <div>
//           <p className="text-indigo-600 text-lg mb-2">Pricing</p>
//           <h1 className="text-gray-900 text-3xl font-bold mb-6">
//             AI slide maker for all your <br /> presentation needs.
//           </h1>
//           <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
//             <button
//               className={`px-4 py-2 rounded-full text-sm font-medium ${
//                 billingCycle === "monthly"
//                   ? "bg-white text-gray-900 font-bold"
//                   : "bg-transparent text-gray-500"
//               }`}
//               onClick={() => setBillingCycle("monthly")}
//             >
//               Monthly billing
//             </button>
//             <button
//               className={`px-4 py-2 rounded-full text-sm font-medium ${
//                 billingCycle === "annual"
//                   ? "bg-white text-gray-900 font-bold"
//                   : "bg-transparent text-gray-500"
//               }`}
//               onClick={() => setBillingCycle("annual")}
//             >
//               Annual billing
//             </button>
//           </div>
//         </div>

//         <div className="bg-white w-full py-16 px-8">
//           <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
//             {/* Side Component: Categories */}
//             <div>
//               {categories.map((category, index) => (
//                 <div key={index} className="mb-10">
//                   <h2 className="text-[#3667B2] text-lg font-semibold mb-4">
//                     {category.title}
//                   </h2>
//                   <ul className="space-y-10 text-gray-700 ml-6">
//                     {category.features.map((feature, featureIndex) => (
//                       <li key={featureIndex}>{feature}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>

//             {/* Plans */}
//             {plans.map((plan, planIndex) => (
//               <div
//                 key={planIndex}
//                 className={`bg-white border ${
//                   planIndex === 1 ? "border-indigo-600" : "border-gray-200"
//                 } rounded-lg shadow-lg p-6`}
//               >
//                 <div className="flex flex-col items-center mb-8">
//                   <h3 className="text-indigo-600 text-lg font-semibold mb-2">
//                     {plan.name}
//                   </h3>
//                   {plan.price && (
//                     <div className="text-gray-900 text-4xl font-bold text-center mb-2">
//                       {plan.price}
//                     </div>
//                   )}
//                   <p className="text-gray-500 text-center">{plan.description}</p>
//                 </div>
//                 <button
//                   className={`w-full font-medium py-2 px-6 ${
//                     planIndex === 0 ? "mb-32" : ""
//                   } rounded-lg ${
//                     planIndex === 1
//                       ? "bg-[#3667B2] text-white hover:bg-indigo-700"
//                       : "border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50"
//                   }`}
//                 >
//                   {plan.buttonText}
//                 </button>
//                 <ul className="mb-8 mt-9 space-y-0">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li
//                       key={featureIndex}
//                       className={`flex items-center justify-center w-full ${feature.spacing}`}
//                       style={{
//                         backgroundColor: feature.bgColor,
//                         borderRadius: "0.375rem",
//                       }}
//                     >
//                       {feature.icon ? (
//                         <img
//                           src={feature.icon}
//                           alt="Check icon"
//                           className="h-5 w-5"
//                         />
//                       ) : (
//                         <span
//                           className={`${
//                             feature.text === "-"
//                               ? "text-gray-400 text-lg"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {feature.text}
//                         </span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   className={`w-full font-medium py-2 px-6 rounded-lg ${
//                     planIndex === 1
//                       ? "bg-[#3667B2] text-white hover:bg-indigo-700"
//                       : "border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50"
//                   }`}
//                 >
//                   {plan.buttonText}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

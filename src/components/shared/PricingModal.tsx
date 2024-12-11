import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'

interface PricingModalProps {
  closeModal: () => void
  heading: string
  monthlyPlanAmount: number
  yearlyPlanAmount: number
  currency: string
}

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

export const PricingModal: React.FC<PricingModalProps> = ({
  closeModal,
  heading,
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )

  const plans = [
    {
      name: 'FREE',
      buttonText: 'Get Started for Free',
      description: 'Perfect for exploring Zynth.',
      price: null,
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
            {monthlyPlanAmount} {currency}
            <br />
            <span className="text-sm text-gray-500">per month</span>
          </>
        ) : (
          <>
            {yearlyPlanAmount} {currency}
            <br />
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[90%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-h-[90%] overflow-y-auto rounded-lg shadow-lg p-4 sm:p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-900 text-lg sm:text-xl"
        >
          &times;
        </button>
        <div>
          <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
            You are currently on FREE plan. To <br />
            use <span className="text-[#3667B2]">{heading} </span>
            feature, <br />
            please upgrade to <span className="text-[#3667B2]">Pro plan.</span>
          </h2>
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

        <div className="bg-white w-full py-8 px-4 sm:py-16 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-full">
            {/* Side Component: Categories */}
            <div>
              {categories.map((category, index) => (
                <div key={index} className="mb-6 sm:mb-10">
                  <h2 className="text-[#3667B2] text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                    {category.title}
                  </h2>
                  <ul className="space-y-4 sm:space-y-6 text-gray-700 ml-4 sm:ml-6">
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
                } rounded-lg shadow-lg p-4 sm:p-6`}
              >
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <h3 className="text-indigo-600 text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    {plan.name}
                  </h3>
                  {plan.price && (
                    <div className="text-gray-900 text-xl sm:text-3xl font-bold text-center mb-2">
                      {plan.price}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm sm:text-base text-center">
                    {plan.description}
                  </p>
                </div>
                <button
                  className={`w-full font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-lg ${
                    planIndex === 1
                      ? 'bg-[#3667B2] text-white hover:bg-indigo-700'
                      : 'border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50'
                  }`}
                >
                  {plan.buttonText}
                </button>
                <ul className="mb-6 sm:mb-8 mt-6 space-y-2 sm:space-y-4">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

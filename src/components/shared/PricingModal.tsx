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
      description: (
        <div className="mb-[5.5rem]">
          <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            Perfect for exploring Zynth.
          </span>
        </div>
      ),

      price: null,
      features: [
        {
          text: 'Unlimited',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4 ',
          margin: '',
        },

        {
          text: '-',
          bgColor: 'white',
          icon: null,
          spacing: 'py-3 ',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-7 ',
          margin: '',
        },

        {
          text: '✔',
          bgColor: '#F5F7FA',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-1 ',
          margin: '',
        },
        {
          text: '-',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '-',
          bgColor: '#F5F7FA',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '-',
          bgColor: 'white',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '-',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-5', margin: '' },
        {
          text: '-',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-1 ',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },

        {
          text: `${currency === 'IN' || 'India' ? '₹499' : '$9'} Export`,
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
      ],
    },
    {
      name: 'PRO',
      buttonText: 'Upgrade to Pro',
      description: (
        <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          Ideal for professionals and businesses.
        </span>
      ),
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
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-0.5 ',
          margin: '',
        },
        {
          text: 'Unlimited',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4 ',
          margin: '',
        },
        {
          text: '-',
          bgColor: 'white',
          icon: null,
          spacing: 'py-3 ',
          margin: '',
          textColor: 'text-black',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-7 ',
          margin: '',
        },

        {
          text: '✔',
          bgColor: '#F5F7FA',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-1 ',
          margin: '',
        },
        {
          text: '-',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '',
          bgColor: '#F5F7FA',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },

        {
          text: '-',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-1 ',
          margin: '',
        },
        {
          text: '-',
          bgColor: '#F5F7FA',
          icon: FaCheckCircle,
          spacing: 'py-5',
          margin: '',
        },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-5', margin: '' },
        {
          text: '-',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-1 ',
          margin: '',
        },
        {
          text: '',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },

        {
          text: 'Unlimited',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
      ],
    },
  ]

  return (
    <div
      className={`${
        window.location.pathname !== '/presentation-view'
          ? 'fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'
          : 'fixed top-0 left-0 w-screen h-screen z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center'
      }`}
    >
      <div className="bg-white w-[90%] max-h-[90%] overflow-y-auto rounded-lg shadow-lg p-4 sm:p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-900 hover:scale-110 active:scale-95 transform transition text-lg md:text-4xl"
        >
          &times;
        </button>
        <div>
          <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
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

        <div className="bg-white w-full p-4 hidden lg:block ">
          <div className="max-w-6xl mx-auto lg:grid grid-cols-3 gap-8   ">
            {/* Side Component: Categories */}
            <div className="mt-[15rem] ">
              {categories.map((category, index) => (
                <div key={index} className="mb-10">
                  <h2 className="text-[#3667B2] text-lg font-semibold mb-4">
                    {category.title}
                  </h2>
                  <ul className="space-y-8 text-gray-700 ml-6">
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
                } rounded-lg shadow-lg p-6 hidden lg:block`}
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
                  <p className="text-gray-500 text-center">
                    {plan.description}
                  </p>
                </div>
                <button
                  className={`w-full font-medium py-2 px-6 ${
                    planIndex === 0
                  } rounded-lg ${
                    planIndex === 1
                      ? 'bg-[#3667B2] text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 transition transform'
                      : 'border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50 hover:scale-105 active:scale-95 transition transform'
                  }`}
                >
                  <a href="/auth" target="_blank">
                    {plan.buttonText}
                  </a>
                </button>
                <ul className="mb-8 mt-4 space-y-0">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={`flex items-center justify-center w-full mt-6 ${feature.spacing} ${feature.margin}`}
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
                            feature.text === '-' ? 'black text-lg' : 'black'
                          }`}
                        >
                          {feature.text}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  // onClick={() => navigate('/auth')}
                  className={`w-full font-medium py-2 px-6 rounded-lg ${
                    planIndex === 1
                      ? 'bg-[#3667B2] text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 transition transform'
                      : 'border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50 hover:scale-105 active:scale-95 transition transform'
                  }`}
                >
                  <a href="/auth" target="_blank">
                    {plan.buttonText}
                  </a>
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile View */}
        <div className=" rounded-xl ml-4 py-12 mr-4  bg-white lg:hidden  ">
          <div className="px-4 ">
            <h2 className="text-2xl text-[#3667B2] font-bold mb-2">FREE</h2>
            <p className="text-sm text-gray-600 mb-4">
              Perfect for exploring Zynth.
            </p>
            <button className="bg-white text-[#3667B2] py-2 px-4 w-full mt-4 rounded-lg border border-[#3667B2]">
              Get Started for Free
            </button>
          </div>

          <div className="mt-4  ">
            <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
              Access
            </h2>
            <ul className="text-gray-700 ">
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full ">
                General Presentations
                <span className="font-medium">Unlimited</span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full ">
                Presentation Uploads
                <span className="font-medium mr-2 text-black">-</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
              Features
            </h2>
            <ul className="text-gray-700">
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full ">
                AI Presentation Creation
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full ">
                Presentation History
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full ">
                Slide Versioning
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full ">
                Add Custom Slides
                <span className="font-medium mr-2 text-black">-</span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full ">
                Custom Slide Builder
                <span className="font-medium mr-2 text-black">-</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
              Sharing and Exports
            </h2>
            <ul className="text-gray-700">
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full ">
                Presentation Sharing Links
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full">
                PDF Exports
                <span className="font-medium mr-2 text-black">-</span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full">
                Google Slides Exports
                <span className="font-medium  text-black">
                  $9 / ₹ 499 / Export
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className=" rounded-xl ml-4 py-12 mr-4  bg-white lg:hidden mt-8 border border-[#3667B2]   ">
          <div className="px-4 ">
            <h2 className="text-2xl text-[#3667B2] font-bold mb-2">PRO</h2>
            <p className="text-sm text-gray-600 mb-4">
              Ideal for professionals and businesses.
            </p>
            <button className="bg-[#3667B2] text-white py-2 px-4 w-full mt-4 rounded-lg border border-[#3667B2]">
              Upgrade to Pro
            </button>
          </div>

          <div className="mt-4  ">
            <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
              Access
            </h2>
            <ul className="text-gray-700 ">
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full ">
                General Presentations
                <span className="font-medium">Unlimited</span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full">
                Presentation Uploads
                <span className="font-medium ">Unlimited</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
              Features
            </h2>
            <ul className="text-gray-700">
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full">
                AI Presentation Creation
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full">
                Presentation History
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full">
                Slide Versioning
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full">
                Add Custom Slides
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full">
                Custom Slide Builder
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
              Sharing and Exports
            </h2>
            <ul className="text-gray-700">
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full">
                Presentation Sharing Links
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-white flex justify-between items-center px-2 py-6 w-full">
                PDF Exports
                <span className="font-medium">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between items-center px-2 py-6 w-full">
                Google Slides Exports
                <span className="font-medium  text-black">
                  $9 / ₹ 499 / Export
                </span>
              </li>
            </ul>
            <button className="bg-[#3667B2] text-white py-2 px-4 w-full mt-4 rounded-lg border border-[#3667B2]">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa' // Importing the check icon
import { Plan } from '../../types/pricingTypes'
import axios from 'axios'
import { IpInfoResponse } from '../../types/authTypes'
import { useNavigate } from 'react-router-dom'

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')
  const navigate = useNavigate()

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

  // API CALL TO GET PRICING DATA FOR MODAL
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/plans`,
          {
            headers: {
              // Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          if (ipInfoData.country === 'IN' || 'India') {
            setMonthlyPlan(response.data.items[5])
            setYearlyPlan(response.data.items[3])
            setCurrency('INR')
          } else {
            setMonthlyPlan(response.data.items[4])
            setYearlyPlan(response.data.items[2])
            setCurrency('USD')
          }
        })
    }

    const timer = setTimeout(() => {
      getPricingData()
    }, 2000) // delay

    // Cleanup the timer in case the component unmounts
    return () => clearTimeout(timer)
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100

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
          text: 'Unlimited',
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
      buttonText: 'Sign up for Pro',
      description: (
        <div className="mb-[2.5rem]">
          <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            Ideal for professionals and businesses.
          </span>
        </div>
      ),
      price:
        billingCycle === 'monthly' ? (
          <>
            {monthlyPlanAmount} {currency}
            <span className="text-2xl font-bold ml-2">per month</span>
          </>
        ) : (
          <>
            {yearlyPlanAmount} {currency}
            <span className="text-2xl font-bold ml-2">per year</span>
          </>
        ),
      features: [
        {
          text: 'Unlimited',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4 ',
          margin: '',
        },
        {
          text: 'Unlimited',
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
      className="bg-gray-50 w-full lg:p-12 p-1 h-full no-scrollbar no-scrollbar::-webkit-scrollbar"
      id="pricing"
    >
      <section className="py-16 lg:min-h-[300px] lg:p-4 lg:ml-36 ml-2">
        <div className="p-2">
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
              } rounded-lg shadow-lg hidden lg:block`}
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
                <p className="text-gray-500 font-medium text-center">
                  {plan.description}
                </p>
              </div>
              <div className="p-3">
                {' '}
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
              </div>

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
              <div className="p-3">
                <button
                  onClick={() => navigate('/auth')}
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
            </div>
          ))}
        </div>
      </div>
      {/* Mobile View */}
      <div className=" rounded-xl ml-4 py-12 mr-4 bg-white lg:hidden overflow-y-scroll scrollbar-none  ">
        <div className="px-4 ">
          <h2 className="text-2xl text-[#3667B2] font-bold mb-2">FREE</h2>
          <p className="text-sm font-medium  text-gray-600 mb-4">
            Perfect for exploring Zynth.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-[#3667B2] py-2 px-4 w-full mt-4 font-semibold rounded-lg border border-[#3667B2]"
          >
            Get Started for Free
          </button>
        </div>

        <div className="mt-4  ">
          <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
            Access
          </h2>
          <ul className="text-gray-700 ">
            <li className="bg-[#F5F7FA] flex font-medium justify-between items-center px-2 py-6 w-full ">
              General Presentations
              <span className="font-medium">Unlimited</span>
            </li>
            <li className="bg-white flex justify-between font-medium items-center px-2 py-6 w-full ">
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
            <li className="bg-[#F5F7FA] font-medium flex justify-between items-center px-2 py-6 w-full ">
              AI Presentation Creation
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-white font-medium flex justify-between items-center px-2 py-6 w-full ">
              Presentation History
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 font-medium text-green-500" />
              </span>
            </li>
            <li className="bg-[#F5F7FA] flex font-medium justify-between items-center px-2 py-6 w-full ">
              Slide Versioning
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-white flex justify-between font-medium items-center px-2 py-6 w-full ">
              Add Custom Slides
              <span className="font-medium mr-2 text-black">-</span>
            </li>
            <li className="bg-[#F5F7FA] flex justify-between font-medium items-center px-2 py-6 w-full ">
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
            <li className="bg-[#F5F7FA] font-medium flex justify-between items-center px-2 py-6 w-full ">
              Presentation Sharing Links
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-white flex font-medium justify-between items-center px-2 py-6 w-full">
              PDF Exports
              <span className="font-medium mr-2 text-black">-</span>
            </li>
          </ul>
        </div>
      </div>
      <div className=" rounded-xl ml-4 py-12 mr-4  bg-white lg:hidden mt-8 border border-[#3667B2]">
        <div className="px-4 ">
          <h2 className="text-2xl text-[#3667B2] font-bold mb-2">PRO</h2>
          <p className="text-sm text-gray-600 font-medium mb-4">
            Ideal for professionals and businesses.
          </p>
          <h3 className="text-2xl font-bold">
            {billingCycle === 'monthly' ? (
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
            )}
          </h3>
          <button
            onClick={() => navigate('/auth')}
            className="bg-[#3667B2] text-white py-2 px-4 w-full mt-4 rounded-lg border border-[#3667B2]"
          >
            Sign up for Pro
          </button>
        </div>

        <div className="mt-4  ">
          <h2 className="font-medium text-[#3667B2] text-xl mb-2 px-3">
            Access
          </h2>
          <ul className="text-gray-700 ">
            <li className="bg-[#F5F7FA] font-medium flex justify-between items-center px-2 py-6 w-full ">
              General Presentations
              <span className="font-medium">Unlimited</span>
            </li>
            <li className="bg-white font-medium flex justify-between items-center px-2 py-6 w-full">
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
            <li className="bg-[#F5F7FA] flex font-medium justify-between items-center px-2 py-6 w-full">
              AI Presentation Creation
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-white flex font-medium justify-between items-center px-2 py-6 w-full">
              Presentation History
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-[#F5F7FA] flex font-medium justify-between items-center px-2 py-6 w-full">
              Slide Versioning
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-white flex justify-between font-medium items-center px-2 py-6 w-full">
              Add Custom Slides
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-[#F5F7FA] flex justify-between font-medium items-center px-2 py-6 w-full">
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
            <li className="bg-[#F5F7FA] flex justify-between font-medium items-center px-2 py-6 w-full">
              Presentation Sharing Links
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-white flex justify-between font-medium items-center px-2 py-6 w-full">
              PDF Exports
              <span className="font-medium">
                <FaCheckCircle className="h-6 w-6 text-green-500" />
              </span>
            </li>
            <li className="bg-[#F5F7FA] flex justify-between font-medium items-center px-2 py-6 w-full">
              Google Slides Exports
              <span className="font-medium  text-black">
                {currency === 'IN' || 'India' ? '₹499' : '$9'} Export
              </span>
            </li>
          </ul>
          <div className="px-4 py-2 ">
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#3667B2] text-white py-2 font-medium w-full mt-4 rounded-lg border border-[#3667B2]"
            >
              Sign up for Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

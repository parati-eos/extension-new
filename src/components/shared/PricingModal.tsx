import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {
  connectWebSocket,
  listenToEvent,
  disconnectWebSocket,
} from '../payment/webSocketService'

interface PaymentData {
  // Define the shape of the payment data based on your backend response
  [key: string]: any
}

interface SubscriptionData {
  // Define the shape of the subscription data based on your backend response
  [key: string]: any
}

interface PricingModalProps {
  closeModal: () => void
  heading: string
  monthlyPlanAmount: number
  yearlyPlanAmount: number
  currency: string
  monthlyPlanId: string
  yearlyPlanId: string
  authToken: string
  orgId: string
  exportButtonText?: string
  exportHandler?: () => void
  isButtonDisabled?: boolean
  subscriptionId: string
}

const categories = [
  {
    title: 'Access',
    features: ['Generate or Refine Presentations'],
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
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
  yearlyPlanId,
  monthlyPlanId,
  authToken,
  orgId,
  exportButtonText,
  exportHandler,
  isButtonDisabled,
  subscriptionId,
}) => {
  const [isloading, setIsLoading] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )
  const userPlan = useSelector((state: any) => state.user.userPlan)
  const userEmail = sessionStorage.getItem('userEmail')

  const plans = [
    {
      name: 'FREE',
      buttonText:
        userPlan === 'free' && exportButtonText
          ? `${exportButtonText}`
          : 'Get Started for Free',
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
          text: '5 per month',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4 ',
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
        { text: '', bgColor: 'white', icon: null, spacing: 'py-8', margin: '' },
        {
          text: '-',
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
          text: '',
          bgColor: 'white',
          icon: FaCheckCircle,
          spacing: 'py-4',
          margin: '',
        },

        {
          text: `${currency === 'INR' ? '₹499' : '$9'} per Export`,
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: '',
        },
      ],
    },
    {
      name: 'PRO',
      buttonText:
        userPlan === 'free' ? 'Upgrade to Pro' : 'Cancel Subscription',

      description: (
        <div className="lg:mb-[2.5rem]">
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
          text: '',
          bgColor: 'white',
          icon: null,
          spacing: 'py-[1.8rem] ',
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
          spacing: 'py-3',
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
          spacing: 'py-4',
          margin: '',
        },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-8', margin: '' },
        {
          text: '-',
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

  const handleUpgrade = async () => {
    setIsLoading(true)
    const planID = billingCycle === 'annual' ? yearlyPlanId : monthlyPlanId
    const currentTime = Date.now()
    const startAtTime = currentTime + 10 * 60 * 1000 // 10 minutes in milliseconds
    const startAtUnix = Math.floor(startAtTime / 1000) // Convert to Unix timestamp in seconds

    if (userPlan === 'free') {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/create-subscription`,
          {
            plan_id: planID,
            customer_id: orgId,
            total_count: 12,
            start_at: startAtUnix,
            quantity: 1,
            orgId: orgId,
            userId: userEmail,
            notes: {
              OrgId: orgId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        const result = await response.data

        if (result.short_url) {
          window.open(result.short_url, '_blank')
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)

    console.log('Sub ID: ', subscriptionId)

    if (userPlan !== 'free') {
      try {
        await axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/cancel-subscription`,
            {
              subscription_id: subscriptionId,
              orgId: orgId,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              window.location.reload()
            }
            setIsLoading(false)
          })
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!orgId) {
      console.error('orgId is required to connect WebSocket')
      return
    }

    // Connect to WebSocket
    connectWebSocket(orgId)

    // Listen to payment authorization events
    listenToEvent('payment.authorized', (data: PaymentData) => {
      console.log('Payment authorized:', data)
    })

    // Listen to subscription events
    listenToEvent('subscription.authenticated', (data: SubscriptionData) => {
      console.log('Subscription authenticated:', data)

      window.location.reload()
    })

    // Cleanup WebSocket on unmount
    return () => {
      disconnectWebSocket()
    }
  }, [orgId])

  return (
    <div
    className={`${
      ![
        '/presentation-view',
        '/new-presentation',
        '/organization-profile',
        '/history',
        '/edit-organization-profile',
        '/refer'
      ].includes(window.location.pathname) &&
      !window.location.href.includes('/presentation-view?') &&
      !window.location.href.includes('#/history')&&!window.location.href.includes('#/refer')
      &&!window.location.href.includes('#/new-presentation') &&!window.location.href.includes('#/organization-profile') &&!window.location.href.includes('#/edit-organization-profile')
        ? 'fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'
        : 'fixed top-0 left-0 w-screen h-screen z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center'
    }`}
  >
  
  
      <div className="bg-white w-[87%] lg:w-[80%] max-h-[90%] overflow-y-auto scrollbar-none rounded-lg shadow-lg p-2 sm:p-6 relative ">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-900 hover:scale-110 active:scale-95 transform transition text-lg md:text-4xl"
        >
          &times;
        </button>
        <div className="lg:flex lg:justify-end lg:mr-12">
          <div className="inline-flex items-center bg-gray-200 rounded-full p-1 ">
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
                  userPlan === plan.name.toLowerCase()
                    ? 'border-[#3667B2] outline-2'
                    : planIndex === 1
                } `}
              >
                <div className="flex flex-col items-center mb-8 ">
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
                <div className="p-3 justify-center">
                  {' '}
                  {isloading && plan.name !== 'FREE' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (plan.name !== 'FREE' && userPlan === 'free') {
                          handleUpgrade()
                        } else if (
                          plan.name !== 'FREE' &&
                          userPlan !== 'free'
                        ) {
                          handleCancel()
                        } else {
                          exportHandler && exportHandler()
                        }
                      }}
                      className={`w-full font-medium py-2 px-6 rounded-lg ${
                        userPlan === plan.name.toLowerCase()
                          ? 'bg-[#3667B2] text-white  hover:scale-105 active:scale-95 transition transform'
                          : 'bg-[#3667B2] text-white  hover:scale-105 active:scale-95 transition transform'
                      } 
  ${
    userPlan === 'free' &&
    plan.name.toLowerCase() === 'free' &&
    !exportButtonText &&
    !isButtonDisabled
      ? 'cursor-not-allowed bg-gray-200 border-gray-200 text-gray-500'
      : 'bg-[#3667B2] text-white  hover:scale-105 active:scale-95 transition transform'
  } 
  ${
    userPlan !== 'free' && plan.name.toLowerCase() === 'free'
      ? 'cursor-not-allowed bg-gray-200 border-gray-200 text-gray-500'
      : ''
  }`}
                      disabled={plan.name === 'FREE' && !exportButtonText}
                    >
                      {plan.buttonText}
                    </button>
                  )}{' '}
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
                  {isloading && plan.name !== 'FREE' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (plan.name === 'PRO' && userPlan === 'free') {
                          handleUpgrade()
                        } else if (plan.name === 'PRO' && userPlan !== 'free') {
                          handleCancel()
                        } else {
                          exportHandler && exportHandler()
                        }
                      }}
                      className={`w-full font-medium py-2 px-6 rounded-lg ${
                        userPlan === plan.name.toLowerCase()
                          ? 'bg-[#3667B2] text-white  hover:scale-105 active:scale-95 transition transform'
                          : 'bg-[#3667B2] text-white  hover:scale-105 active:scale-95 transition transform'
                      } 
  ${
    userPlan === 'free' &&
    plan.name.toLowerCase() === 'free' &&
    !exportButtonText &&
    !isButtonDisabled
      ? 'cursor-not-allowed bg-gray-200 border-gray-200 text-gray-500'
      : ''
  } 
  ${
    userPlan !== 'free' && plan.name.toLowerCase() === 'free'
      ? 'cursor-not-allowed bg-gray-200 border-gray-200 text-gray-500'
      : ''
  }`}
                      disabled={plan.name === 'FREE' && !exportButtonText}
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile View */}
        <div
          className={`rounded-xl ml-4 py-12 mr-4 bg-white lg:hidden mt-8 border ${
            userPlan === 'free' ? 'border-[#3667B2]' : 'border-white'
          }`}
        >
          <div className="px-4 ">
            <h2 className="text-xl text-[#3667B2] font-bold mb-2">FREE</h2>
            <p className="text-sm font-medium  text-gray-600 mb-4">
              Perfect for exploring Zynth.
            </p>
            <button
              onClick={exportHandler}
              className={`py-2 px-4 w-full mt-4 font-semibold rounded-lg border ${
                userPlan === 'free' && !exportButtonText
                  ? 'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-[#3667B2] border-[#3667B2]'
              }`}
              disabled={!exportButtonText}
            >
              {exportButtonText
                ? `${exportButtonText}`
                : 'Get Started for Free'}
            </button>
          </div>

          <div className="mt-4  ">
            <h2 className="font-medium text-[#3667B2] text-lg mb-2 px-3">
              Access
            </h2>
            <ul className="text-gray-700 ">
              <li className="bg-[#F5F7FA] flex font-medium justify-between items-center px-2 py-6 w-full ">
                General Presentations
                <span className="font-medium">5 per month</span>
              </li>
              <li className="bg-white flex justify-between font-medium items-center px-2 py-6 w-full ">
                Presentation Uploads
                <span className="font-medium "> 5 per month</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="font-medium text-[#3667B2] text-lg mb-2 px-3">
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
                <span className="font-medium  text-black">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
              <li className="bg-[#F5F7FA] flex justify-between font-medium items-center px-2 py-6 w-full ">
                Custom Slide Builder
                <span className="font-medium ">
                  <FaCheckCircle className="h-6 w-6 text-green-500" />
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="font-medium text-[#3667B2] text-lg mb-2 px-3">
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
                <span className="font-medium  text-black">
                  {currency === 'INR' ? '₹499' : '$9'} per Export
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`rounded-xl ml-4  mr-4 bg-white lg:hidden mt-8 border ${
            userPlan !== 'free' ? 'border-[#3667B2]' : 'border-white'
          }`}
        >
          <div className="px-4 ">
            <h2 className="text-xl text-[#3667B2] font-bold mb-2">PRO</h2>
            <p className="text-sm text-gray-600 font-medium mb-3">
              Ideal for professionals and businesses.
            </p>
            <h3 className="text-2xl font-bold">
              {billingCycle === 'monthly' ? (
                <>
                  {monthlyPlanAmount} {currency}
                  <span className="text-xl md:font-thin lg:font-bold ml-2">
                    per month
                  </span>
                </>
              ) : (
                <>
                  {yearlyPlanAmount} {currency}
                  <span className="text-xl font-bold ml-2">per year</span>
                </>
              )}
            </h3>
            <button
              onClick={userPlan === 'free' ? handleUpgrade : handleCancel}
              className={`py-2 px-4 w-full mt-4 rounded-lg border ${
                userPlan === 'free' || userPlan !== 'free'
                  ? 'bg-[#3667B2] text-white border-[#3667B2]'
                  : ''
              }`}
            >
              {userPlan === 'free' ? 'Upgrade to Pro' : 'Cancel Subscription'}
            </button>
          </div>

          <div className="mt-4  ">
            <h2 className="font-medium text-[#3667B2] text-lg mb-2 px-3">
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
            <h2 className="font-medium text-[#3667B2] text-lg mb-2 px-3">
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
            <h2 className="font-medium text-[#3667B2] text-lg mb-2 px-3">
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
                <span className="font-medium  text-black">Unlimited</span>
              </li>
            </ul>
            <div className="px-4 py-2 mb-14">
              <button
                onClick={userPlan === 'free' ? handleUpgrade : handleCancel}
                className={`py-2 px-4 w-full mt-4 rounded-lg border ${
                  userPlan === 'free' || userPlan !== 'free'
                    ? 'bg-[#3667B2] text-white border-[#3667B2]'
                    : ''
                }`}
              >
                {userPlan === 'free' ? 'Upgrade to Pro' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

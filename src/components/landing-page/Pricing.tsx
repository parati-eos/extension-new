import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa' // Importing the check icon
import { Plan } from '../../types/pricingTypes'
import axios from 'axios'
import { IpInfoResponse } from '../../types/authTypes'

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  )
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')

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
            setMonthlyPlan(response.data.items[3])
            setYearlyPlan(response.data.items[1])
            setCurrency('INR')
          } else {
            setMonthlyPlan(response.data.items[2])
            setYearlyPlan(response.data.items[0])
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
        <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
         Perfect for exploring Zynth.
        </span>
      ),

      price: null,
      features: [
        { text: 'Unlimited', bgColor: '#F5F7FA', icon: null, spacing: 'py-4 ',margin: '' },
      
        { text: '-', bgColor: 'white', icon: null, spacing: 'py-3 ',margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-7 ',margin: '' },
       
        { text: '✔', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-4' ,margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-1 ',margin: '' },
        { text: '-', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-4' ,margin: ''},
        { text: '-', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-4' ,margin: ''},
        { text: '-', bgColor: 'white', icon: null, spacing: 'py-4',margin: '' },
        { text: '-', bgColor: '#F5F7FA', icon: null, spacing: 'py-4' ,margin: ''},
        { text: '', bgColor: 'white', icon: null, spacing: 'py-5' ,margin: ''},
        { text: '-', bgColor: '#F5F7FA', icon: null, spacing: 'py-4',margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-1 ',margin: '' },
        { text: '', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-4' ,margin: ''},
        
        {
          text: `${currency === 'IN' || 'India' ? '₹499' : '$9'} Export`,
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: ''
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
        { text: '', bgColor: 'white', icon: null, spacing: 'py-0.5 ',margin: '' },
        { text: 'Unlimited', bgColor: '#F5F7FA', icon: null, spacing: 'py-4 ',margin: '' },
        { text: '-', bgColor: 'white', icon: null, spacing: 'py-3 ',margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-7 ',margin: '' },
       
        { text: '✔', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-4' ,margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-1 ',margin: '' },
        { text: '-', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-4' ,margin: ''},
        { text: '', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-4' ,margin: ''},
        
        { text: '-', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-4',margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-1 ',margin: '' },
        { text: '-', bgColor: '#F5F7FA', icon: FaCheckCircle, spacing: 'py-5' ,margin: ''},
        { text: '', bgColor: 'white', icon: null, spacing: 'py-5' ,margin: ''},
        { text: '-', bgColor: '#F5F7FA', icon: null, spacing: 'py-4',margin: '' },
        { text: '', bgColor: 'white', icon: null, spacing: 'py-1 ',margin: '' },
        { text: '', bgColor: 'white', icon: FaCheckCircle, spacing: 'py-4' ,margin: ''},
        
        {
          text: 'Unlimited',
          bgColor: '#F5F7FA',
          icon: null,
          spacing: 'py-4',
          margin: ''
        },
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
          <div className="mt-[15rem] hidden lg:block">
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
                  planIndex === 0 ? 'mb-[5.5rem]' : ''
                } rounded-lg ${
                  planIndex === 1
                    ? 'bg-[#3667B2] text-white hover:bg-indigo-700'
                    : 'border border-[#3667B2] text-[#3667B2] hover:bg-indigo-50'
                }`}
              >
                {plan.buttonText}
              </button>
              <ul className="mb-8 mt-4 space-y-0">
  {plan.features.map((feature, featureIndex) => (
    <li
      key={featureIndex}
      className={`flex items-center justify-center w-full mt-6 ${feature.spacing} ${feature.margin }`}
      style={{
        backgroundColor: feature.bgColor,
        borderRadius: '0.375rem',
        // margin:feature.margin
      }}
    >
      {feature.icon ? (
        <FaCheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <span
          className={`${
            feature.text === '-' ? 'text-gray-400 text-lg' : 'text-gray-900'
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

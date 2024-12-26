import { FaClock, FaPlus, FaUser } from 'react-icons/fa'
import ZynthLogoText from '../../assets/zynth-text.png'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PricingModal } from './PricingModal'
import { Plan } from '../../types/pricingTypes'
import axios from 'axios'
import { IpInfoResponse } from '../../types/authTypes'

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const userProfileImage = sessionStorage.getItem('userDP')
  const [currency, setCurrency] = useState<string>()

  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  useEffect(() => {
    if (dropdownOpen) {
      const timer = setTimeout(() => setDropdownOpen(false), 5000)
      return () => clearTimeout(timer) // Cleanup the timeout
    }
  }, [dropdownOpen])

  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')

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
              Authorization: `Bearer ${authToken}`,
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
    }, 3000) // delay

    // Cleanup the timer in case the component unmounts
    return () => clearTimeout(timer)
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const monthlyPlanId = monthlyPlan?.id
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100
  const yearlyPlanId = yearlyPlan?.id

  return (
    <nav className="bg-white p-2 pt-8 lg:p-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          className="transition-all duration-300 transform hover:scale-110 active:scale-95 active:opacity-80"
          href="/"
          target="_blank"
        >
          <img src={ZynthLogoText} alt="Logo Text" className="h-8" />
        </a>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/new-presentation')}
            className="bg-[#3667B2] border border-[#3667B2] lg:h-[2.5rem] text-white hover:bg-white hover:text-[#3667B2] hover:border-[#3667B2] hover:border text-base font-medium px-4 py-4 lg:py-2 rounded-md active:scale-95 transition transform duration-300"
          >
            <span className="sm:hidden text-base">
              <FaPlus />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaPlus />
              <span>New Presentation</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-white lg:h-[2.5rem] border-[#3667B2] border text-[#3667B2] hover:bg-[#3667B2] hover:text-white hover:border-[#3667B2] hover:border text-base font-medium px-4 py-4 lg:py-2 rounded-md active:scale-95 transition transform duration-300"
          >
            <span className="sm:hidden text-base">
              <FaClock />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaClock />
              <span>History</span>
            </span>
          </button>
          {/* User Profile Icon */}
          {userProfileImage ? (
            <img
              src={userProfileImage}
              alt="User Profile"
              className="w-11 h-12 lg:w-11 lg:h-11 rounded-full hover:scale-105 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          ) : (
            <FaUser
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full hover:scale-105 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          )}
          {/* Dropdown */}
          {dropdownOpen && (
            <div className="fixed top-20 lg:top-17 right-2 lg:right-4 bg-white shadow-lg rounded-md p-2 z-50 w-48 h-32">
              <button
                onClick={() => navigate('/organization-profile')}
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Organization Profile
              </button>
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Subscription Plans
              </button>
              <button className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                Billing and Invoice
              </button>
              <button
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <PricingModal
          closeModal={() => setIsPricingModalOpen(false)}
          heading="Subscription Plans"
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency!}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
        />
      )}
    </nav>
  )
}

export default Navbar
